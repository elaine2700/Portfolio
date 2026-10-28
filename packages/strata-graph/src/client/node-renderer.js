/**
 * Strata-Graph Node Renderer
 * Flexible, pluggable rendering engine supporting classic circles,
 * tactile polaroid cards, tabbed folder shapes, and custom user renderers.
 */

export class NodeRenderer {
  constructor(options = {}) {
    this.options = {
      // Shape strategy: 'circle', 'polaroid', 'folder', 'auto', or custom function
      nodeShape: options.nodeShape || null,
      folderShape: options.folderShape || 'circle',
      articleShape: options.articleShape || 'circle',

      // Dimensions
      folderRadius: options.folderRadius || 42,
      articleRadius: options.articleRadius || 34,
      polaroidWidth: options.polaroidWidth || 96,
      polaroidHeight: options.polaroidHeight || 124,
      folderWidth: options.folderWidth || 112,
      folderHeight: options.folderHeight || 94,
      folderTabWidth: options.folderTabWidth || 50,
      folderTabHeight: options.folderTabHeight || 14,

      // Styling & Palette
      folderColor: options.folderColor || '#3D7068',
      folderTabColor: options.folderTabColor || '#315C55',
      folderBorderColor: options.folderBorderColor || '#1E1E1C',
      folderShadowColor: options.folderShadowColor || '#1E1E1C',
      articleBorderColor: options.articleBorderColor || '#1E1E1C',
      polaroidBg: options.polaroidBg || '#FAF7F0',
      polaroidBorderColor: options.polaroidBorderColor || '#1E1E1C',
      polaroidShadowColor: options.polaroidShadowColor || '#1E1E1C',
      shadowColor: options.shadowColor || '#1E1E1C',
      borderWidth: options.borderWidth || 2,
      hoverRingColor: options.hoverRingColor || 'rgba(210, 90, 56, 0.45)',
      tapeEnabled: options.tapeEnabled !== undefined ? options.tapeEnabled : true,
      tapeColor: options.tapeColor || 'rgba(246, 235, 206, 0.94)',
      tapeBorderColor: options.tapeBorderColor || 'rgba(180, 160, 125, 0.7)',

      // Badges
      badgeBg: options.badgeBg || '#D25A38',
      badgeText: options.badgeText || '#FFFFFF',
      badgeBorderColor: options.badgeBorderColor || '#1E1E1C',

      // Labels
      labelFont: options.labelFont || "11px 'JetBrains Mono', monospace, sans-serif",
      labelColor: options.labelColor || '#1A1A1A',
      labelBg: options.labelBg || 'rgba(234, 235, 215, 0.94)',

      // Extensibility hooks
      renderNode: options.renderNode || null,
      renderPolaroid: options.renderPolaroid || null,
      renderFolder: options.renderFolder || null,
      renderCircle: options.renderCircle || null,

      ...options
    };

    this.imageCache = new Map();
    this.pendingImages = new Set();
    this.onImageLoadCallback = null;
  }

  setImageLoadCallback(cb) {
    this.onImageLoadCallback = cb;
  }

  /**
   * Preloads or retrieves cached image.
   * @param {string} url
   * @returns {HTMLImageElement|null}
   */
  getImage(url) {
    if (!url) return null;
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url);
    }

    if (!this.pendingImages.has(url)) {
      this.pendingImages.add(url);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(url, img);
        this.pendingImages.delete(url);
        if (this.onImageLoadCallback) {
          this.onImageLoadCallback();
        }
      };
      img.onerror = () => {
        this.pendingImages.delete(url);
        this.imageCache.set(url, null); // mark as failed
      };
      img.src = url;
    }

    return null;
  }

  /**
   * Determines the shape to use for a specific node.
   * @param {object} node
   * @returns {string}
   */
  getNodeShape(node) {
    if (node.shape) return node.shape;
    if (typeof this.options.nodeShape === 'function') {
      return this.options.nodeShape(node);
    }
    if (this.options.nodeShape && this.options.nodeShape !== 'auto') {
      return this.options.nodeShape;
    }
    return node.type === 'folder' ? this.options.folderShape : this.options.articleShape;
  }

  /**
   * Calculates effective bounding/collision radius for a node based on shape and dimensions.
   * @param {object} node
   * @returns {number}
   */
  getNodeRadius(node) {
    if (node.radius) return node.radius;
    const shape = this.getNodeShape(node);
    if (shape === 'polaroid') {
      const w = this.options.polaroidWidth;
      const h = this.options.polaroidHeight;
      return (Math.hypot(w, h) / 2) * 0.78;
    }
    if (shape === 'folder') {
      const w = this.options.folderWidth;
      const h = this.options.folderHeight;
      return (Math.hypot(w, h) / 2) * 0.76;
    }
    return node.type === 'folder' ? this.options.folderRadius : this.options.articleRadius;
  }

  /**
   * Precise hit-testing for interaction (supports circles, rectangles, and custom shapes).
   * @param {object} node
   * @param {number} px World coordinate X
   * @param {number} py World coordinate Y
   * @returns {boolean}
   */
  isPointInNode(node, px, py) {
    if (typeof node.hitTest === 'function') {
      return node.hitTest(px, py);
    }

    const shape = this.getNodeShape(node);
    if (shape === 'polaroid') {
      const w = this.options.polaroidWidth;
      const h = this.options.polaroidHeight;
      return (
        px >= node.x - w / 2 &&
        px <= node.x + w / 2 &&
        py >= node.y - h / 2 &&
        py <= node.y + h / 2
      );
    }

    if (shape === 'folder') {
      const w = this.options.folderWidth;
      const h = this.options.folderHeight;
      return (
        px >= node.x - w / 2 &&
        px <= node.x + w / 2 &&
        py >= node.y - h / 2 &&
        py <= node.y + h / 2
      );
    }

    // Default circular hit test
    const r = this.getNodeRadius(node);
    const dx = node.x - px;
    const dy = node.y - py;
    return dx * dx + dy * dy <= r * r;
  }

  /**
   * Draws a link line between two nodes.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} link
   */
  drawLink(ctx, link) {
    if (!link.source || !link.target) return;
    const sx = link.source.x;
    const sy = link.source.y;
    const tx = link.target.x;
    const ty = link.target.y;

    if (isNaN(sx) || isNaN(sy) || isNaN(tx) || isNaN(ty)) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Provides helper methods for custom or pluggable renderers.
   */
  getRenderHelpers() {
    return {
      getImage: (url) => this.getImage(url),
      getNodeRadius: (node) => this.getNodeRadius(node),
      getNodeShape: (node) => this.getNodeShape(node),
      isPointInNode: (node, px, py) => this.isPointInNode(node, px, py),
      drawBadge: (ctx, x, y, text, opts) => this.drawBadge(ctx, x, y, text, opts),
      drawLabel: (ctx, x, y, text, isFolder, isHovered, opts) => this.drawLabel(ctx, x, y, text, isFolder, isHovered, opts),
      drawCircleNode: (ctx, node, isHovered, opts) => this.drawCircleNode(ctx, node, isHovered, opts),
      drawPolaroidNode: (ctx, node, isHovered, opts) => this.drawPolaroidNode(ctx, node, isHovered, opts),
      drawFolderNode: (ctx, node, isHovered, opts) => this.drawFolderNode(ctx, node, isHovered, opts),
      drawFolderPerimeter: (ctx, x, y, w, h, tabW, tabH) => this.drawFolderPerimeter(ctx, x, y, w, h, tabW, tabH),
      options: this.options
    };
  }

  /**
   * Main node dispatcher.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} node
   * @param {boolean} isHovered
   */
  drawNode(ctx, node, isHovered = false) {
    const x = node.x;
    const y = node.y;
    if (isNaN(x) || isNaN(y)) return;

    // 1. Pluggable custom node rendering callback
    if (typeof this.options.renderNode === 'function') {
      const helpers = this.getRenderHelpers();
      const handled = this.options.renderNode(ctx, node, isHovered, helpers);
      if (handled !== false) return;
    }

    // 2. Delegate to built-in shape renderers
    const shape = this.getNodeShape(node);
    if (shape === 'polaroid') {
      if (typeof this.options.renderPolaroid === 'function') {
        const handled = this.options.renderPolaroid(ctx, node, isHovered, this.getRenderHelpers());
        if (handled !== false) return;
      }
      this.drawPolaroidNode(ctx, node, isHovered);
    } else if (shape === 'folder') {
      if (typeof this.options.renderFolder === 'function') {
        const handled = this.options.renderFolder(ctx, node, isHovered, this.getRenderHelpers());
        if (handled !== false) return;
      }
      this.drawFolderNode(ctx, node, isHovered);
    } else {
      if (typeof this.options.renderCircle === 'function') {
        const handled = this.options.renderCircle(ctx, node, isHovered, this.getRenderHelpers());
        if (handled !== false) return;
      }
      this.drawCircleNode(ctx, node, isHovered);
    }
  }

  // =========================================================================
  // BUILT-IN SHAPE RENDERERS
  // =========================================================================

  /**
   * 1. Polaroid Card Node Renderer (Tailored for leaf articles)
   */
  drawPolaroidNode(ctx, node, isHovered = false, overrideOpts = {}) {
    const opts = { ...this.options, ...overrideOpts };
    const w = opts.polaroidWidth || 96;
    const h = opts.polaroidHeight || 124;

    let cx = node.x - w / 2;
    let cy = node.y - h / 2;

    const shadowOffset = isHovered ? 5 : 3;
    if (isHovered) {
      cy -= 2;
      cx -= 1;
    }

    ctx.save();

    // Hover Halo Outline
    if (isHovered) {
      ctx.save();
      ctx.strokeStyle = opts.hoverRingColor || '#D25A38';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(cx - 3, cy - 3, w + 6, h + 6);
      ctx.restore();
    }

    // Solid Ink Retro Drop Shadow
    ctx.fillStyle = opts.shadowColor || '#1E1E1C';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(cx + shadowOffset, cy + shadowOffset, w, h, 2);
      ctx.fill();
    } else {
      ctx.fillRect(cx + shadowOffset, cy + shadowOffset, w, h);
    }

    // Polaroid Paper Base
    ctx.fillStyle = opts.polaroidBg || '#FAF7F0';
    ctx.strokeStyle = opts.polaroidBorderColor || '#1E1E1C';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cx, cy, w, h, 2);
    } else {
      ctx.rect(cx, cy, w, h);
    }
    ctx.fill();
    ctx.stroke();

    // Masking Tape Strip (Top Center)
    if (opts.tapeEnabled) {
      const tapeW = 34;
      const tapeH = 10;
      const tapeX = node.x - tapeW / 2;
      const tapeY = cy - 4.5;
      ctx.save();
      ctx.fillStyle = opts.tapeColor || 'rgba(246, 235, 206, 0.94)';
      ctx.strokeStyle = opts.tapeBorderColor || 'rgba(180, 160, 125, 0.7)';
      ctx.lineWidth = 0.6;
      ctx.fillRect(tapeX, tapeY, tapeW, tapeH);
      ctx.strokeRect(tapeX, tapeY, tapeW, tapeH);
      ctx.restore();
    }

    // Photo Window
    const padX = 7;
    const padTop = 8;
    const photoW = w - padX * 2; // 82px
    const photoH = 70;
    const photoX = cx + padX;
    const photoY = cy + padTop;

    ctx.fillStyle = '#E8E2D5'; // pulp photo backing
    ctx.fillRect(photoX, photoY, photoW, photoH);

    const img = this.getImage(node.thumbnail);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();

      const scale = Math.max(photoW / img.naturalWidth, photoH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const drawX = photoX + (photoW - drawW) / 2;
      const drawY = photoY + (photoH - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      this.drawPolaroidFallback(ctx, photoX, photoY, photoW, photoH, node);
    }

    // Photo Window Frame
    ctx.strokeStyle = '#1E1E1C';
    ctx.lineWidth = 1;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Perforated Divider
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = 'rgba(30, 30, 28, 0.35)';
    ctx.lineWidth = 1;
    ctx.moveTo(photoX, photoY + photoH + 5);
    ctx.lineTo(photoX + photoW, photoY + photoH + 5);
    ctx.stroke();
    ctx.restore();

    // Article Title (Chin) - Supports up to 2 wrapped lines
    ctx.save();
    ctx.font = "bold 8px 'JetBrains Mono', monospace";
    ctx.fillStyle = '#1E1E1C';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const rawTitle = (node.title || 'Untitled').toUpperCase();
    const words = rawTitle.split(/\s+/);
    let line1 = '';
    let line2 = '';

    for (const word of words) {
      const testLine1 = line1 ? line1 + ' ' + word : word;
      if (ctx.measureText(testLine1).width <= photoW) {
        line1 = testLine1;
      } else {
        const testLine2 = line2 ? line2 + ' ' + word : word;
        if (ctx.measureText(testLine2).width <= photoW) {
          line2 = testLine2;
        } else if (!line2) {
          let wTrunc = word;
          while (ctx.measureText(wTrunc + '...').width > photoW && wTrunc.length > 2) {
            wTrunc = wTrunc.slice(0, -1);
          }
          line2 = wTrunc + '...';
        }
      }
    }

    if (line2) {
      ctx.fillText(line1, photoX, photoY + photoH + 7);
      ctx.fillText(line2, photoX, photoY + photoH + 16.5);
      ctx.font = "7px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#5C5A55';
      const metaText = (node.readingTime || node.date || 'ARTICLE').toUpperCase();
      ctx.fillText(metaText, photoX, photoY + photoH + 26.5);
    } else {
      ctx.fillText(line1 || rawTitle, photoX, photoY + photoH + 9);
      ctx.font = "7.5px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#5C5A55';
      const metaText = (node.readingTime || node.date || 'ARTICLE').toUpperCase();
      ctx.fillText(metaText, photoX, photoY + photoH + 22);
    }
    ctx.restore();

    ctx.restore();
  }

  /**
   * Helper: Traces the tabbed physical folder silhouette.
   */
  drawFolderPerimeter(ctx, x, y, w, h, tabW, tabH) {
    const r = 3; // subtle corner curve
    ctx.beginPath();
    ctx.moveTo(x + 5, y + tabH);
    ctx.lineTo(x + 5, y + r);
    ctx.arcTo(x + 5, y, x + 5 + r, y, r);
    ctx.lineTo(x + 5 + tabW - 8, y);
    ctx.arcTo(x + 5 + tabW, y, x + 5 + tabW + 6, y + tabH, r);
    ctx.lineTo(x + 5 + tabW + 6, y + tabH);
    ctx.lineTo(x + w - r, y + tabH);
    ctx.arcTo(x + w, y + tabH, x + w, y + tabH + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + tabH + r);
    ctx.arcTo(x, y + tabH, x + 5, y + tabH, r);
    ctx.closePath();
  }

  /**
   * 2. Tabbed Teal Folder Node Renderer
   */
  drawFolderNode(ctx, node, isHovered = false, overrideOpts = {}) {
    const opts = { ...this.options, ...overrideOpts };
    const w = opts.folderWidth || 112;
    const h = opts.folderHeight || 94;
    const tabW = opts.folderTabWidth || 50;
    const tabH = opts.folderTabHeight || 14;

    let cx = node.x - w / 2;
    let cy = node.y - h / 2;

    const shadowOffset = isHovered ? 5 : 3;
    if (isHovered) {
      cy -= 2;
      cx -= 1;
    }

    ctx.save();

    // Hover Halo Outline
    if (isHovered) {
      ctx.save();
      ctx.strokeStyle = opts.hoverRingColor || '#E5A93C';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      this.drawFolderPerimeter(ctx, cx - 3, cy - 3, w + 6, h + 6, tabW, tabH);
      ctx.stroke();
      ctx.restore();
    }

    // Solid Ink Retro Drop Shadow
    this.drawFolderPerimeter(ctx, cx + shadowOffset, cy + shadowOffset, w, h, tabW, tabH);
    ctx.fillStyle = opts.shadowColor || '#1E1E1C';
    ctx.fill();

    // Main Folder Body & Tab (Distinctively Teal)
    this.drawFolderPerimeter(ctx, cx, cy, w, h, tabW, tabH);
    ctx.fillStyle = opts.folderColor || '#3D7068';
    ctx.fill();
    ctx.strokeStyle = opts.folderBorderColor || '#1E1E1C';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Crease / Back-Flap Highlight Line
    ctx.beginPath();
    ctx.moveTo(cx + 5 + tabW + 6, cy + tabH);
    ctx.lineTo(cx + w - 3, cy + tabH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tab Prompt Label
    ctx.font = "bold 7px 'JetBrains Mono', monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('DIR //', cx + 10, cy + tabH / 2);

    // Center Image Frame ("similar to the polaroid, centered in the folder")
    const frameW = 76;
    const frameH = 50;
    const frameX = cx + (w - frameW) / 2;
    const frameY = cy + tabH + 6;

    ctx.fillStyle = '#FAF7F0'; // paper photo plate
    ctx.fillRect(frameX, frameY, frameW, frameH);

    const img = this.getImage(node.thumbnail);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(frameX, frameY, frameW, frameH);
      ctx.clip();

      const scale = Math.max(frameW / img.naturalWidth, frameH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const drawX = frameX + (frameW - drawW) / 2;
      const drawY = frameY + (frameH - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      this.drawFolderFallback(ctx, frameX, frameY, frameW, frameH, node);
    }

    ctx.strokeStyle = '#1E1E1C';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(frameX, frameY, frameW, frameH);

    // Manila Title Strip (Below center image)
    const labelW = w - 20; // 92px
    const labelH = 14;
    const labelX = cx + 10;
    const labelY = cy + h - labelH - 5;

    ctx.fillStyle = '#FAF7F0';
    ctx.strokeStyle = '#1E1E1C';
    ctx.lineWidth = 1;
    ctx.fillRect(labelX, labelY, labelW, labelH);
    ctx.strokeRect(labelX, labelY, labelW, labelH);

    ctx.font = "bold 8.5px 'JetBrains Mono', monospace";
    ctx.fillStyle = '#1E1E1C';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let folderTitle = (node.title || 'FOLDER').toUpperCase();
    if (!folderTitle.endsWith('/')) folderTitle += '/';
    while (ctx.measureText(folderTitle).width > labelW - 6 && folderTitle.length > 3) {
      folderTitle = folderTitle.slice(0, -4) + '...';
    }
    ctx.fillText(folderTitle, labelX + labelW / 2, labelY + labelH / 2);

    // Count Badge (Pill on Top-Right Corner)
    const countVal = node.itemCount !== undefined ? node.itemCount : (node.totalArticles || 0);
    this.drawBadge(ctx, cx + w - 10, cy + tabH - 1, String(countVal));

    ctx.restore();
  }

  /**
   * 3. Classic Circle Node Renderer (For backwards compatibility or default package mode)
   */
  drawCircleNode(ctx, node, isHovered = false, overrideOpts = {}) {
    const opts = { ...this.options, ...overrideOpts };
    const x = node.x;
    const y = node.y;
    const r = this.getNodeRadius(node);
    const isFolder = node.type === 'folder';

    ctx.save();

    // 1. Hover Outer Ring
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(x, y, r + 7, 0, Math.PI * 2);
      ctx.strokeStyle = opts.hoverRingColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, r + 12, 0, Math.PI * 2);
      ctx.strokeStyle = isFolder ? opts.folderBorderColor : opts.articleBorderColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 2. Base Circle
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = isFolder ? '#D8D9C5' : '#EAEBD7';
    ctx.fill();

    // 3. Image
    const img = this.getImage(node.thumbnail);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r - 1, 0, Math.PI * 2);
      ctx.clip();

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const diameter = (r - 1) * 2;
      const scale = Math.max(diameter / imgW, diameter / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = x - drawW / 2;
      const drawY = y - drawH / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      this.drawFallbackGraphic(ctx, x, y, r, node, isFolder);
    }

    // 4. Node Border
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = isFolder ? opts.folderBorderColor : opts.articleBorderColor;
    ctx.lineWidth = isFolder ? 3 : opts.borderWidth;
    ctx.stroke();

    // Concentric inner line if folder
    if (isFolder) {
      ctx.beginPath();
      ctx.arc(x, y, r - 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(26, 26, 26, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 5. Badge
    if (isFolder && node.itemCount !== undefined) {
      this.drawBadge(ctx, x + r * 0.7, y - r * 0.7, String(node.itemCount));
    }

    // 6. Label
    this.drawLabel(ctx, x, y + r + 14, node.title || 'Untitled', isFolder, isHovered);

    ctx.restore();
  }

  // =========================================================================
  // FALLBACK GRAPHICS & UTILITIES
  // =========================================================================

  drawPolaroidFallback(ctx, px, py, pw, ph, node) {
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 30, 28, 0.3)';
    ctx.lineWidth = 1;

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(px + pw / 2, py + 8);
    ctx.lineTo(px + pw / 2, py + ph - 8);
    ctx.moveTo(px + 8, py + ph / 2);
    ctx.lineTo(px + pw - 8, py + ph / 2);
    ctx.stroke();

    ctx.fillStyle = '#1E1E1C';
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initials = (node.title || 'DOC')
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
    ctx.fillText(initials || 'DOC', px + pw / 2, py + ph / 2);
    ctx.restore();
  }

  drawFolderFallback(ctx, fx, fy, fw, fh, node) {
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 30, 28, 0.35)';
    ctx.lineWidth = 1.2;

    // Geometric folder icon in frame
    const iconW = fw * 0.65;
    const iconH = fh * 0.55;
    const ix = fx + (fw - iconW) / 2;
    const iy = fy + (fh - iconH) / 2 + 2;

    ctx.fillStyle = 'rgba(61, 112, 104, 0.15)';
    ctx.fillRect(ix, iy, iconW, iconH);
    ctx.strokeRect(ix, iy, iconW, iconH);

    ctx.strokeRect(ix, iy - 4, iconW * 0.45, 4);

    ctx.fillStyle = '#1E1E1C';
    ctx.font = "bold 8.5px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DIR', fx + fw / 2, fy + fh / 2 + 3);
    ctx.restore();
  }

  drawFallbackGraphic(ctx, x, y, r, node, isFolder) {
    ctx.save();
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.4)';
    ctx.lineWidth = 1.2;

    if (isFolder) {
      const fw = r * 0.9;
      const fh = r * 0.65;
      const fx = x - fw / 2;
      const fy = y - fh / 2 + 2;

      ctx.beginPath();
      ctx.rect(fx, fy, fw, fh);
      ctx.fillStyle = 'rgba(142, 168, 181, 0.2)';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(fx, fy - 5, fw * 0.45, 5);
      ctx.stroke();

      ctx.fillStyle = '#1A1A1A';
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DIR', x, y + 4);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#1A1A1A';
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initials = (node.title || 'DOC')
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('');
      ctx.fillText(initials || 'DOC', x, y);
    }
    ctx.restore();
  }

  /**
   * Draws a badge pill with text.
   */
  drawBadge(ctx, x, y, text, opts = {}) {
    ctx.save();
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    const textWidth = ctx.measureText(text).width;
    const pillW = Math.max(18, textWidth + 8);
    const pillH = 14;
    const bg = opts.bg || this.options.badgeBg || '#D25A38';
    const textColor = opts.color || this.options.badgeText || '#FFFFFF';
    const borderColor = opts.border || this.options.badgeBorderColor || '#1E1E1C';

    // Drop shadow
    ctx.fillStyle = '#1E1E1C';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - pillW / 2 + 1, y - pillH / 2 + 1, pillW, pillH, 7);
      ctx.fill();
    } else {
      ctx.fillRect(x - pillW / 2 + 1, y - pillH / 2 + 1, pillW, pillH);
    }

    // Body
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x - pillW / 2, y - pillH / 2, pillW, pillH, 7);
    } else {
      ctx.rect(x - pillW / 2, y - pillH / 2, pillW, pillH);
    }
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /**
   * Draws text label with a subtle background capsule for crisp readability.
   */
  drawLabel(ctx, x, y, text, isFolder, isHovered, opts = {}) {
    ctx.save();
    ctx.font = isHovered
      ? "bold 11px 'JetBrains Mono', monospace"
      : "10.5px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let display = text;
    if (display.length > 24) {
      display = display.substring(0, 22) + '...';
    }

    const paddingX = 6;
    const metrics = ctx.measureText(display);
    const boxW = metrics.width + paddingX * 2;
    const boxH = 16;

    ctx.fillStyle = opts.labelBg || this.options.labelBg;
    ctx.strokeStyle = isHovered
      ? (isFolder ? '#8EA8B5' : '#1A1A1A')
      : 'rgba(26, 26, 26, 0.25)';
    ctx.lineWidth = isHovered ? 1.5 : 1;

    ctx.beginPath();
    ctx.rect(x - boxW / 2, y - boxH / 2, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = opts.labelColor || this.options.labelColor;
    ctx.fillText(display, x, y);

    ctx.restore();
  }
}
