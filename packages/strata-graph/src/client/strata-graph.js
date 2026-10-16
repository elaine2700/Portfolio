/**
 * Strata-Graph Client Engine
 * Main coordinator class connecting CanvasEngine, ZoomManager, NodeRenderer, and ModalViewer.
 */

import { CanvasEngine } from './canvas-engine';
import { NodeRenderer } from './node-renderer';
import { ZoomManager } from './zoom-manager';
import { ModalViewer } from './modal-viewer';

export class StrataGraph {
  /**
   * @param {object} config
   * @param {string|HTMLElement} config.container - Target element or selector
   * @param {string|object} [config.data] - Data object or URL to JSON
   * @param {string} [config.dataUrl] - URL to JSON
   * @param {object} [config.options] - Customization options
   */
  constructor(config = {}) {
    this.container = typeof config.container === 'string'
      ? document.querySelector(config.container)
      : config.container;

    if (!this.container) {
      throw new Error(`[strata-graph] Container element not found: ${config.container}`);
    }

    this.dataUrl = config.dataUrl || (typeof config.data === 'string' ? config.data : null);
    this.data = typeof config.data === 'object' ? config.data : null;
    this.options = config.options || {};

    this.renderer = null;
    this.canvasEngine = null;
    this.zoomManager = null;
    this.modalViewer = null;

    this.wrapperEl = null;
    this.viewportEl = null;
    this.canvasEl = null;

    this.init();
  }

  async init() {
    this.buildDOM();

    // Fetch data if URL provided
    if (this.dataUrl && !this.data) {
      try {
        const response = await fetch(this.dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.data = await response.json();
      } catch (err) {
        console.error('[strata-graph] Failed to load data:', err);
        this.renderErrorState(`Failed to load graph data from ${this.dataUrl}`);
        return;
      }
    }

    if (!this.data) {
      this.renderErrorState('No graph data provided to strata-graph.');
      return;
    }

    // Instantiate Subsystems
    this.renderer = new NodeRenderer(this.options.nodeOptions);
    this.canvasEngine = new CanvasEngine(this.canvasEl, this.renderer, this.options.canvasOptions);
    this.zoomManager = new ZoomManager(this.wrapperEl, this.data, this.options.zoomOptions);
    this.modalViewer = new ModalViewer(this.options.modalOptions);

    // Wire up events
    this.wireSubsystems();

    // Mount initial level
    const initialLevel = this.data.root || this.data.levels['/'];
    if (initialLevel) {
      this.canvasEngine.setData(initialLevel.nodes, initialLevel.links);
    }
  }

  buildDOM() {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'strata-graph-wrapper';

    const viewport = document.createElement('div');
    viewport.className = 'strata-graph-viewport';

    const canvas = document.createElement('canvas');
    canvas.className = 'strata-graph-canvas';

    // Controls (+, -, Reset)
    const controls = document.createElement('div');
    controls.className = 'strata-graph-controls';
    controls.innerHTML = `
      <button type="button" class="strata-graph-btn" id="sg-zoom-in" title="Zoom In">+</button>
      <button type="button" class="strata-graph-btn" id="sg-zoom-out" title="Zoom Out">&minus;</button>
      <button type="button" class="strata-graph-btn" id="sg-zoom-reset" title="Reset View">&#x2316;</button>
    `;

    // Legend / Hint
    const hint = document.createElement('div');
    hint.className = 'strata-graph-hint';
    hint.innerHTML = `
      <div class="strata-graph-hint-item">
        <span class="strata-graph-hint-dot folder"></span>
        <span>FOLDER / DIRECTORY</span>
      </div>
      <div class="strata-graph-hint-item">
        <span class="strata-graph-hint-dot article"></span>
        <span>ARTICLE / READ</span>
      </div>
    `;

    viewport.appendChild(canvas);
    viewport.appendChild(controls);
    viewport.appendChild(hint);
    wrapper.appendChild(viewport);
    this.container.appendChild(wrapper);

    this.wrapperEl = wrapper;
    this.viewportEl = viewport;
    this.canvasEl = canvas;

    // Control buttons listeners
    controls.querySelector('#sg-zoom-in').addEventListener('click', () => {
      if (this.canvasEngine) this.canvasEngine.zoomIn();
    });
    controls.querySelector('#sg-zoom-out').addEventListener('click', () => {
      if (this.canvasEngine) this.canvasEngine.zoomOut();
    });
    controls.querySelector('#sg-zoom-reset').addEventListener('click', () => {
      if (this.canvasEngine) this.canvasEngine.resetView(true);
    });
  }

  wireSubsystems() {
    // Canvas -> Folder Click (Drill down)
    this.canvasEngine.onFolderClick = async (folderNode) => {
      await this.canvasEngine.zoomToNode(folderNode, 400);
      await this.zoomManager.drillDown(folderNode);
    };

    // Canvas -> Article Click (Open Modal)
    this.canvasEngine.onArticleClick = (articleNode) => {
      const articleData = this.data.articles[articleNode.articleId || articleNode.id];
      if (articleData) {
        this.modalViewer.open(articleData);
      } else {
        this.modalViewer.open(articleNode);
      }
    };

    // ZoomManager -> Level Change
    this.zoomManager.setOnLevelChange((targetLevel, sourceNode) => {
      this.canvasEngine.setData(targetLevel.nodes, targetLevel.links, sourceNode);
    });
  }

  renderErrorState(message) {
    if (this.viewportEl) {
      this.viewportEl.innerHTML = `
        <div style="padding: 2rem; color: #1a1a1a; font-family: monospace;">
          <h3 style="color: #c00;">[STRATA-GRAPH ERROR]</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }

  /**
   * Directly opens an article by ID.
   * @param {string} articleId
   */
  openArticle(articleId) {
    const article = this.data && this.data.articles ? this.data.articles[articleId] : null;
    if (article && this.modalViewer) {
      this.modalViewer.open(article);
    }
  }

  /**
   * Directly navigates to a level.
   * @param {string} path
   */
  setLevel(path) {
    if (this.zoomManager) {
      this.zoomManager.navigateTo(path);
    }
  }

  destroy() {
    if (this.canvasEngine) this.canvasEngine.destroy();
    if (this.modalViewer) this.modalViewer.destroy();
    if (this.container) this.container.innerHTML = '';
  }
}

// Auto-register to window for browser script inclusion
if (typeof window !== 'undefined') {
  window.StrataGraph = StrataGraph;
}
