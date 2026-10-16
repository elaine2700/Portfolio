/**
 * Strata-Graph Node Renderer
 * Handles Canvas 2D circular image clipping, badges, borders, and typography.
 */

export class NodeRenderer {
  constructor(options = {}) {
    this.options = {
      folderRadius: options.folderRadius || 42,
      articleRadius: options.articleRadius || 34,
      folderBorderColor: options.folderBorderColor || '#8EA8B5',
      articleBorderColor: options.articleBorderColor || '#1A1A1A',
      borderWidth: options.borderWidth || 2,
      hoverRingColor: options.hoverRingColor || 'rgba(140, 166, 142, 0.6)',
      badgeBg: options.badgeBg || '#8CA68E',
      badgeText: options.badgeText || '#FFFFFF',
      labelFont: options.labelFont || "11px 'JetBrains Mono', monospace, sans-serif",
      labelColor: options.labelColor || '#1A1A1A',
      labelBg: options.labelBg || 'rgba(234, 235, 215, 0.94)',
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
   * Calculates radius for a node based on type and importance.
   * @param {object} node
   * @returns {number}
   */
  getNodeRadius(node) {
    if (node.radius) return node.radius;
    return node.type === 'folder' ? this.options.folderRadius : this.options.articleRadius;
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
   * Draws a single node.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} node
   * @param {boolean} isHovered
   */
  drawNode(ctx, node, isHovered = false) {
    const x = node.x;
    const y = node.y;
    const r = this.getNodeRadius(node);
    const isFolder = node.type === 'folder';

    if (isNaN(x) || isNaN(y)) return;

    ctx.save();

    // 1. Hover Glow / Outer Ring
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(x, y, r + 7, 0, Math.PI * 2);
      ctx.strokeStyle = this.options.hoverRingColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, r + 12, 0, Math.PI * 2);
      ctx.strokeStyle = isFolder ? '#8EA8B5' : '#1A1A1A';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 2. Base Background Circle
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = isFolder ? '#D8D9C5' : '#EAEBD7';
    ctx.fill();

    // 3. Image clipping if thumbnail available
    const img = this.getImage(node.thumbnail);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r - 1, 0, Math.PI * 2);
      ctx.clip();

      // Cover scaling math
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
      // Stylized fallback graphic
      this.drawFallbackGraphic(ctx, x, y, r, node, isFolder);
    }

    // 4. Node Border
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = isFolder ? this.options.folderBorderColor : this.options.articleBorderColor;
    ctx.lineWidth = isFolder ? 3 : this.options.borderWidth;
    ctx.stroke();

    // If folder, draw concentric architectural inner line
    if (isFolder) {
      ctx.beginPath();
      ctx.arc(x, y, r - 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(26, 26, 26, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 5. Badge for Folders (Item count)
    if (isFolder && node.itemCount !== undefined) {
      this.drawBadge(ctx, x + r * 0.7, y - r * 0.7, String(node.itemCount));
    }

    // 6. Text Label
    this.drawLabel(ctx, x, y + r + 14, node.title || 'Untitled', isFolder, isHovered);

    ctx.restore();
  }

  /**
   * Draws a stylized retro-technical fallback inside node if no image is present.
   */
  drawFallbackGraphic(ctx, x, y, r, node, isFolder) {
    ctx.save();
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.4)';
    ctx.lineWidth = 1.2;

    if (isFolder) {
      // Folder architectural icon / glyph
      const fw = r * 0.9;
      const fh = r * 0.65;
      const fx = x - fw / 2;
      const fy = y - fh / 2 + 2;

      ctx.beginPath();
      ctx.rect(fx, fy, fw, fh);
      ctx.fillStyle = 'rgba(142, 168, 181, 0.2)';
      ctx.fill();
      ctx.stroke();

      // Tab
      ctx.beginPath();
      ctx.rect(fx, fy - 5, fw * 0.45, 5);
      ctx.stroke();

      ctx.fillStyle = '#1A1A1A';
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DIR', x, y + 4);
    } else {
      // Article page glyph / crosshair
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
        .map(w => w[0].toUpperCase())
        .join('');
      ctx.fillText(initials || 'DOC', x, y);
    }
    ctx.restore();
  }

  /**
   * Draws a badge pill with text.
   */
  drawBadge(ctx, x, y, text) {
    ctx.save();
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    const textWidth = ctx.measureText(text).width;
    const pillW = Math.max(18, textWidth + 8);
    const pillH = 14;

    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x - pillW / 2, y - pillH / 2, pillW, pillH, 7) : ctx.rect(x - pillW / 2, y - pillH / 2, pillW, pillH);
    ctx.fillStyle = this.options.badgeBg;
    ctx.fill();
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = this.options.badgeText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /**
   * Draws text label with a subtle background capsule for crisp readability.
   */
  drawLabel(ctx, x, y, text, isFolder, isHovered) {
    ctx.save();
    ctx.font = isHovered ? "bold 11px 'JetBrains Mono', monospace" : "10.5px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Truncate text if needed
    let display = text;
    if (display.length > 24) {
      display = display.substring(0, 22) + '...';
    }

    const paddingX = 6;
    const paddingY = 3;
    const metrics = ctx.measureText(display);
    const boxW = metrics.width + paddingX * 2;
    const boxH = 16;

    // Background pill
    ctx.fillStyle = this.options.labelBg;
    ctx.strokeStyle = isHovered ? (isFolder ? '#8EA8B5' : '#1A1A1A') : 'rgba(26, 26, 26, 0.25)';
    ctx.lineWidth = isHovered ? 1.5 : 1;

    ctx.beginPath();
    ctx.rect(x - boxW / 2, y - boxH / 2, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    // Text ink
    ctx.fillStyle = this.options.labelColor;
    ctx.fillText(display, x, y);

    ctx.restore();
  }
}
