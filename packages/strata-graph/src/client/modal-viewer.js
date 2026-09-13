/**
 * Strata-Graph Reading Modal Viewer
 * Accessible editorial modal reader for markdown articles.
 */

export class ModalViewer {
  constructor(options = {}) {
    this.options = {
      onClose: null,
      ...options
    };

    this.isOpen = false;
    this.currentArticle = null;
    this.overlayEl = null;
    this.containerEl = null;
    this.bodyEl = null;

    this.buildDOM();
    this.bindEvents();
  }

  buildDOM() {
    const overlay = document.createElement('div');
    overlay.className = 'sg-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
      <div class="sg-modal-container">
        <div class="sg-modal-header-bar">
          <div class="sg-modal-breadcrumb" id="sg-modal-breadcrumb">
            READING / ARTICLE
          </div>
          <button type="button" class="sg-modal-close-btn" id="sg-modal-close-btn" aria-label="Close article">
            <span>CLOSE</span>
            <span class="sg-modal-close-key">ESC</span>
          </button>
        </div>
        <div class="sg-modal-body" id="sg-modal-body">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    this.overlayEl = overlay;
    this.containerEl = overlay.querySelector('.sg-modal-container');
    this.bodyEl = overlay.querySelector('#sg-modal-body');
    this.breadcrumbEl = overlay.querySelector('#sg-modal-breadcrumb');
    this.closeBtn = overlay.querySelector('#sg-modal-close-btn');
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', () => this.close());

    // Click outside window to dismiss
    this.overlayEl.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) {
        this.close();
      }
    });

    // Escape key listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Opens and renders an article.
   * @param {object} article
   */
  open(article) {
    if (!article) return;
    this.currentArticle = article;
    this.isOpen = true;

    // Update Header Breadcrumb
    const folderLabel = (article.folderPath || '/').toUpperCase();
    this.breadcrumbEl.textContent = `CATALOG: ${folderLabel} / ${article.title.toUpperCase()}`;

    // Format Tags
    const tagsHtml = (article.tags || [])
      .map(tag => `<span class="sg-article-tag">#${tag}</span>`)
      .join(' ');

    // Hero Image
    const heroImgHtml = article.thumbnail
      ? `<img src="${article.thumbnail}" alt="${article.title}" class="sg-article-hero-img" />`
      : '';

    // Meta line
    const metaParts = [];
    if (article.date) metaParts.push(`<span>DATE: ${article.date}</span>`);
    if (article.readingTime) metaParts.push(`<span>TIME: ${article.readingTime}</span>`);
    if (article.wordCount) metaParts.push(`<span>WORDS: ${article.wordCount}</span>`);

    this.bodyEl.innerHTML = `
      <header class="sg-article-hero">
        <div class="sg-article-meta-line">
          ${metaParts.join(' &bull; ')}
        </div>
        <h1 class="sg-article-title">${article.title}</h1>
        ${tagsHtml ? `<div class="sg-article-tags">${tagsHtml}</div>` : ''}
        ${heroImgHtml}
      </header>
      <article class="sg-article-content">
        ${article.htmlContent || `<p>${article.description || article.summary || 'No content provided.'}</p>`}
      </article>
    `;

    // Scroll body back to top
    this.bodyEl.scrollTop = 0;

    // Show overlay
    this.overlayEl.classList.add('is-active');
    this.overlayEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    setTimeout(() => {
      this.closeBtn.focus();
    }, 50);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.overlayEl.classList.remove('is-active');
    this.overlayEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (this.options.onClose) {
      this.options.onClose();
    }
  }

  destroy() {
    if (this.overlayEl && this.overlayEl.parentNode) {
      this.overlayEl.parentNode.removeChild(this.overlayEl);
    }
  }
}
