/**
 * Strata-Graph Zoom & Hierarchy Manager
 * Coordinates drill-down animations, zoom-out transitions, and breadcrumb navigation.
 */

export class ZoomManager {
  constructor(containerElement, graphData, options = {}) {
    this.container = containerElement;
    this.data = graphData;
    this.options = {
      enableUrlSync: options.enableUrlSync !== false,
      ...options
    };

    this.currentPath = '/';
    this.historyStack = ['/'];
    this.onLevelChangeCallback = null;

    this.breadcrumbsEl = null;
    this.metaEl = null;

    this.buildHeaderDOM();
  }

  buildHeaderDOM() {
    const header = document.createElement('div');
    header.className = 'strata-graph-header';

    const breadcrumbs = document.createElement('div');
    breadcrumbs.className = 'strata-graph-breadcrumbs';
    this.breadcrumbsEl = breadcrumbs;

    const meta = document.createElement('div');
    meta.className = 'strata-graph-level-meta';
    this.metaEl = meta;

    header.appendChild(breadcrumbs);
    header.appendChild(meta);

    this.container.insertBefore(header, this.container.firstChild);
    this.render();
  }

  setOnLevelChange(callback) {
    this.onLevelChangeCallback = callback;
  }

  getCurrentLevel() {
    return this.data.levels[this.currentPath] || this.data.root;
  }

  /**
   * Navigates to a specific folder path.
   * @param {string} path
   * @param {object} [sourceNode] - Node clicked to trigger this drill-down
   */
  async navigateTo(path, sourceNode = null) {
    const targetLevel = this.data.levels[path];
    if (!targetLevel) {
      console.warn(`[strata-graph] Level not found for path: ${path}`);
      return;
    }

    const previousPath = this.currentPath;
    this.currentPath = path;

    if (!this.historyStack.includes(path)) {
      this.historyStack.push(path);
    }

    this.render();

    if (this.onLevelChangeCallback) {
      await this.onLevelChangeCallback(targetLevel, sourceNode, previousPath);
    }
  }

  /**
   * Drills down into a folder node.
   * @param {object} folderNode
   */
  async drillDown(folderNode) {
    if (!folderNode || !folderNode.targetPath) return;
    await this.navigateTo(folderNode.targetPath, folderNode);
  }

  /**
   * Navigates one level up.
   */
  async navigateUp() {
    const current = this.getCurrentLevel();
    if (current && current.parentPath) {
      await this.navigateTo(current.parentPath);
    }
  }

  render() {
    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) return;

    // Render breadcrumbs
    this.breadcrumbsEl.innerHTML = '';
    const crumbs = currentLevel.breadcrumbs || [{ title: 'ROOT', path: '/' }];

    crumbs.forEach((crumb, idx) => {
      if (idx > 0) {
        const sep = document.createElement('span');
        sep.className = 'strata-graph-separator';
        sep.textContent = '>';
        this.breadcrumbsEl.appendChild(sep);
      }

      const btn = document.createElement('button');
      btn.className = 'strata-graph-crumb' + (idx === crumbs.length - 1 ? ' active' : '');
      btn.textContent = crumb.title;
      btn.type = 'button';

      if (idx !== crumbs.length - 1) {
        btn.addEventListener('click', () => {
          this.navigateTo(crumb.path);
        });
      }

      this.breadcrumbsEl.appendChild(btn);
    });

    // Render level meta (counts)
    const totalItems = (currentLevel.subfolderCount || 0) + (currentLevel.articleCount || 0);
    this.metaEl.innerHTML = `
      <span>[ DIRECTORY: <strong>${currentLevel.path.toUpperCase()}</strong> ]</span>
      <span class="strata-graph-count-pill">${totalItems} ${totalItems === 1 ? 'NODE' : 'NODES'}</span>
    `;
  }
}
