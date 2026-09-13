const fs = require('fs');
const path = require('path');
const { compileGraph } = require('../../packages/strata-graph/src/index');

module.exports = function() {
  const jsonPath = path.resolve(__dirname, '../assets/data/blog-graph.json');
  let data = null;

  if (fs.existsSync(jsonPath)) {
    try {
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {
      console.warn('[blogData] Could not parse existing blog-graph.json:', e);
    }
  }

  if (!data) {
    try {
      data = compileGraph({
        input: path.resolve(__dirname, '../content/blog'),
        output: null
      });
    } catch (err) {
      console.error('[blogData] compileGraph error:', err);
    }
  }

  if (data && data.articles) {
    const articleList = Object.values(data.articles).sort((a, b) => {
      const dateA = new Date(a.date || '1970-01-01');
      const dateB = new Date(b.date || '1970-01-01');
      return dateB - dateA;
    });

    // Build a map of level data
    const levelMap = data.levels || {};

    // Helper to count recursive articles
    function getRecursiveArticleCount(folderPath) {
      return articleList.filter(art => {
        if (folderPath === '/') return true;
        return art.folderPath === folderPath || art.folderPath.startsWith(folderPath + '/');
      }).length;
    }

    // Helper to get direct articles
    function getDirectArticleCount(folderPath) {
      return articleList.filter(art => art.folderPath === folderPath).length;
    }

    // Helper to find direct child folders
    function getChildFolderPaths(parentP) {
      return Object.keys(levelMap).filter(p => {
        if (p === parentP) return false;
        return levelMap[p].parentPath === parentP;
      });
    }

    // Pre-order depth-first traversal to produce an ordered treeList
    const treeList = [];
    function traverseFolder(currentPath, depth = 0, isLast = false) {
      const lvl = levelMap[currentPath];
      if (!lvl) return;

      const segments = currentPath === '/' ? ['root'] : currentPath.split('/').filter(Boolean);
      const name = segments[segments.length - 1] || 'root';
      const childPaths = getChildFolderPaths(currentPath);
      const directCount = getDirectArticleCount(currentPath);
      const totalCount = getRecursiveArticleCount(currentPath);

      const childFolders = childPaths.map(cp => {
        const cLvl = levelMap[cp] || {};
        const cSegments = cp.split('/').filter(Boolean);
        return {
          path: cp,
          name: cSegments[cSegments.length - 1] || cp,
          title: cLvl.title || cSegments[cSegments.length - 1] || cp,
          directCount: getDirectArticleCount(cp),
          totalCount: getRecursiveArticleCount(cp),
          subfolderCount: getChildFolderPaths(cp).length
        };
      });

      treeList.push({
        path: currentPath,
        name,
        title: lvl.title || name,
        description: lvl.description || '',
        depth,
        parentPath: lvl.parentPath || null,
        isLast,
        hasChildren: childPaths.length > 0,
        childPaths,
        childFolders,
        directCount,
        totalCount,
        subfolderCount: childPaths.length,
        breadcrumbs: lvl.breadcrumbs || []
      });

      childPaths.forEach((cp, idx) => {
        traverseFolder(cp, depth + 1, idx === childPaths.length - 1);
      });
    }

    if (levelMap['/']) {
      traverseFolder('/', 0, true);
    } else {
      // Fallback if root key is different
      Object.keys(levelMap).forEach((p, idx) => {
        traverseFolder(p, 0, idx === Object.keys(levelMap).length - 1);
      });
    }

    const folderList = Object.keys(levelMap).map(pathKey => {
      const lvl = levelMap[pathKey];
      return {
        path: pathKey,
        title: lvl.title || pathKey,
        description: lvl.description || '',
        itemCount: lvl.itemCount || 0,
        articleCount: getDirectArticleCount(pathKey),
        totalCount: getRecursiveArticleCount(pathKey),
        subfolderCount: getChildFolderPaths(pathKey).length,
        breadcrumbs: lvl.breadcrumbs || []
      };
    });

    return {
      ...data,
      articleList,
      folderList,
      treeList
    };
  }

  return data || { articleList: [], folderList: [] };
};
