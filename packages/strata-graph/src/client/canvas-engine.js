/**
 * Strata-Graph Canvas Engine
 * High-DPI Canvas 2D Force Simulation with D3-Force and smooth camera navigation.
 */

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide
} from 'd3-force';

export class CanvasEngine {
  constructor(canvasElement, nodeRenderer, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.renderer = nodeRenderer;
    this.options = {
      enableZoom: true,
      enablePan: true,
      minZoom: 0.3,
      maxZoom: 3.5,
      ...options
    };

    // Logical dimensions
    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    // Camera state (world coordinates at screen center)
    this.camera = { x: 0, y: 0, k: 1 };
    this.targetCamera = { x: 0, y: 0, k: 1 };
    this.isCameraAnimating = false;
    this.cameraAnimationProgress = 1;
    this.cameraStart = { x: 0, y: 0, k: 1 };
    this.cameraAnimDuration = 500;
    this.cameraAnimStartTime = 0;

    // Simulation & Data
    this.nodes = [];
    this.links = [];
    this.simulation = null;

    // Interaction state
    this.hoveredNode = null;
    this.draggedNode = null;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.dragStartPos = { x: 0, y: 0 };
    this.dragDistance = 0;

    // Callbacks
    this.onFolderClick = null;
    this.onArticleClick = null;
    this.onBackgroundClick = null;

    this.rafId = null;

    this.init();
  }

  init() {
    this.handleResize();
    this.bindEvents();

    // Hook image load redraw
    this.renderer.setImageLoadCallback(() => {
      this.requestRender();
    });

    this.startRenderLoop();
  }

  handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = rect.height || 600;
    this.dpr = window.devicePixelRatio || 1;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    if (this.camera.x === 0 && this.camera.y === 0) {
      this.camera.x = this.width / 2;
      this.camera.y = this.height / 2;
      this.targetCamera.x = this.camera.x;
      this.targetCamera.y = this.camera.y;
    }
  }

  /**
   * Converts screen (mouse) coordinates to world (simulation) coordinates.
   */
  screenToWorld(screenX, screenY) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = screenX - rect.left;
    const clientY = screenY - rect.top;

    const worldX = (clientX - this.camera.x) / this.camera.k;
    const worldY = (clientY - this.camera.y) / this.camera.k;

    return { x: worldX, y: worldY };
  }

  /**
   * Converts world coordinates to screen canvas coordinates.
   */
  worldToScreen(worldX, worldY) {
    return {
      x: worldX * this.camera.k + this.camera.x,
      y: worldY * this.camera.k + this.camera.y
    };
  }

  /**
   * Find node under cursor.
   */
  findNodeAt(screenX, screenY) {
    const { x, y } = this.screenToWorld(screenX, screenY);
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      const radius = this.renderer.getNodeRadius(node);
      const dx = node.x - x;
      const dy = node.y - y;
      if (dx * dx + dy * dy <= radius * radius) {
        return node;
      }
    }
    return null;
  }

  setData(nodesData, linksData, origin = null) {
    // Clone nodes and links
    this.nodes = nodesData.map((d, i) => {
      const angle = (i / nodesData.length) * Math.PI * 2;
      const spread = 120 + Math.random() * 40;
      const startX = origin ? origin.x + Math.cos(angle) * 30 : Math.cos(angle) * spread;
      const startY = origin ? origin.y + Math.sin(angle) * 30 : Math.sin(angle) * spread;

      return {
        ...d,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: this.renderer.getNodeRadius(d)
      };
    });

    this.links = linksData.map(l => ({ ...l }));

    this.hoveredNode = null;
    this.draggedNode = null;

    this.initSimulation();
    this.resetView(true);
  }

  initSimulation() {
    if (this.simulation) {
      this.simulation.stop();
    }

    this.simulation = forceSimulation(this.nodes)
      .force('center', forceCenter(0, 0).strength(0.08))
      .force('charge', forceManyBody().strength(-380))
      .force(
        'collide',
        forceCollide()
          .radius(d => (d.radius || 40) + 26)
          .iterations(2)
      )
      .alpha(1)
      .alphaDecay(0.035)
      .velocityDecay(0.35);

    if (this.links.length > 0) {
      this.simulation.force(
        'link',
        forceLink(this.links)
          .id(d => d.id)
          .distance(d => d.distance || 140)
          .strength(d => d.strength || 0.5)
      );
    }

    this.simulation.on('tick', () => {
      this.requestRender();
    });
  }

  bindEvents() {
    const c = this.canvas;

    // Resize observer
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
        this.requestRender();
      });
      this.resizeObserver.observe(c);
    }

    // Pointer events
    c.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    c.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
  }

  onPointerDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;

    this.dragStartPos = { x: sx, y: sy };
    this.dragDistance = 0;

    const hit = this.findNodeAt(sx, sy);

    if (hit) {
      this.draggedNode = hit;
      hit.fx = hit.x;
      hit.fy = hit.y;
      if (this.simulation) {
        this.simulation.alphaTarget(0.3).restart();
      }
      this.canvas.classList.add('is-dragging');
    } else {
      this.isPanning = true;
      this.panStart = { x: sx - this.camera.x, y: sy - this.camera.y };
      this.canvas.classList.add('is-dragging');
    }
  }

  onPointerMove(e) {
    const sx = e.clientX;
    const sy = e.clientY;

    if (this.draggedNode) {
      const dx = sx - this.dragStartPos.x;
      const dy = sy - this.dragStartPos.y;
      this.dragDistance += Math.hypot(dx, dy);

      const { x, y } = this.screenToWorld(sx, sy);
      this.draggedNode.fx = x;
      this.draggedNode.fy = y;
      this.requestRender();
      return;
    }

    if (this.isPanning) {
      const dx = sx - this.dragStartPos.x;
      const dy = sy - this.dragStartPos.y;
      this.dragDistance += Math.hypot(dx, dy);

      this.camera.x = sx - this.panStart.x;
      this.camera.y = sy - this.panStart.y;
      this.targetCamera.x = this.camera.x;
      this.targetCamera.y = this.camera.y;
      this.requestRender();
      return;
    }

    // Hover detection
    const prevHovered = this.hoveredNode;
    this.hoveredNode = this.findNodeAt(sx, sy);

    if (this.hoveredNode !== prevHovered) {
      if (this.hoveredNode) {
        this.canvas.classList.add('is-hovering');
      } else {
        this.canvas.classList.remove('is-hovering');
      }
      this.requestRender();
    }
  }

  onPointerUp(e) {
    const sx = e.clientX;
    const sy = e.clientY;
    const clickThreshold = 6;

    if (this.draggedNode) {
      const node = this.draggedNode;
      this.draggedNode.fx = null;
      this.draggedNode.fy = null;
      this.draggedNode = null;
      if (this.simulation) {
        this.simulation.alphaTarget(0);
      }
      this.canvas.classList.remove('is-dragging');

      if (this.dragDistance < clickThreshold) {
        this.handleNodeClick(node);
      }
      this.requestRender();
      return;
    }

    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.classList.remove('is-dragging');

      if (this.dragDistance < clickThreshold) {
        if (this.onBackgroundClick) {
          this.onBackgroundClick();
        }
      }
      this.requestRender();
    }
  }

  handleNodeClick(node) {
    if (node.type === 'folder') {
      if (this.onFolderClick) {
        this.onFolderClick(node);
      }
    } else if (node.type === 'article') {
      if (this.onArticleClick) {
        this.onArticleClick(node);
      }
    }
  }

  onWheel(e) {
    e.preventDefault();
    if (!this.options.enableZoom) return;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, this.camera.k * zoomFactor));

    // Zoom towards cursor
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - this.camera.x) / this.camera.k;
    const worldY = (mouseY - this.camera.y) / this.camera.k;

    this.camera.k = newScale;
    this.camera.x = mouseX - worldX * newScale;
    this.camera.y = mouseY - worldY * newScale;

    this.targetCamera.k = this.camera.k;
    this.targetCamera.x = this.camera.x;
    this.targetCamera.y = this.camera.y;

    this.requestRender();
  }

  zoomIn() {
    const newK = Math.min(this.options.maxZoom, this.camera.k * 1.3);
    this.animateCameraTo(this.camera.x, this.camera.y, newK, 250);
  }

  zoomOut() {
    const newK = Math.max(this.options.minZoom, this.camera.k / 1.3);
    this.animateCameraTo(this.camera.x, this.camera.y, newK, 250);
  }

  resetView(animated = true) {
    const targetX = this.width / 2;
    const targetY = this.height / 2;
    const targetK = 1;

    if (animated) {
      this.animateCameraTo(targetX, targetY, targetK, 450);
    } else {
      this.camera.x = targetX;
      this.camera.y = targetY;
      this.camera.k = targetK;
      this.targetCamera.x = targetX;
      this.targetCamera.y = targetY;
      this.targetCamera.k = targetK;
      this.requestRender();
    }
  }

  animateCameraTo(targetX, targetY, targetK, duration = 400) {
    this.cameraStart = { ...this.camera };
    this.targetCamera = { x: targetX, y: targetY, k: targetK };
    this.cameraAnimDuration = duration;
    this.cameraAnimStartTime = performance.now();
    this.isCameraAnimating = true;
    this.requestRender();
  }

  /**
   * Smoothly transitions camera to focus onto a node before drilling down.
   */
  zoomToNode(node, duration = 450) {
    return new Promise(resolve => {
      const targetK = 2.2;
      const targetX = this.width / 2 - node.x * targetK;
      const targetY = this.height / 2 - node.y * targetK;

      this.animateCameraTo(targetX, targetY, targetK, duration);
      setTimeout(resolve, duration);
    });
  }

  updateCameraAnimation(now) {
    if (!this.isCameraAnimating) return;

    const elapsed = now - this.cameraAnimStartTime;
    const progress = Math.min(1, elapsed / this.cameraAnimDuration);

    // Cubic ease out
    const ease = 1 - Math.pow(1 - progress, 3);

    this.camera.x = this.cameraStart.x + (this.targetCamera.x - this.cameraStart.x) * ease;
    this.camera.y = this.cameraStart.y + (this.targetCamera.y - this.cameraStart.y) * ease;
    this.camera.k = this.cameraStart.k + (this.targetCamera.k - this.cameraStart.k) * ease;

    if (progress >= 1) {
      this.isCameraAnimating = false;
      this.camera = { ...this.targetCamera };
    }
  }

  startRenderLoop() {
    const loop = (timestamp) => {
      this.updateCameraAnimation(timestamp);
      this.render();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  requestRender() {
    // Loop is continuous with requestAnimationFrame, but helper method for clarity
  }

  render() {
    const ctx = this.ctx;
    const dpr = this.dpr;

    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // HiDPI scale
    ctx.scale(dpr, dpr);

    // Camera Transform
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.k, this.camera.k);

    // 1. Draw Links
    for (const link of this.links) {
      this.renderer.drawLink(ctx, link);
    }

    // 2. Draw Nodes (Hovered node drawn last so it sits on top)
    let hoveredToDraw = null;
    for (const node of this.nodes) {
      if (node === this.hoveredNode) {
        hoveredToDraw = node;
      } else {
        this.renderer.drawNode(ctx, node, false);
      }
    }

    if (hoveredToDraw) {
      this.renderer.drawNode(ctx, hoveredToDraw, true);
    }

    ctx.restore();
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.simulation) this.simulation.stop();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
