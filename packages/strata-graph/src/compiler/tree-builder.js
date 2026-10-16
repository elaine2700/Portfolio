/**
 * Builds hierarchical levels and node-link structures for strata-graph.
 */

/**
 * Builds breadcrumb trail from root to the given path.
 * @param {string} currentPath
 * @param {Map<string, object>} levelMap
 * @returns {Array<{ title: string, path: string }>}
 */
function buildBreadcrumbs(currentPath, levelMap) {
  const crumbs = [];
  let p = currentPath;
  while (p) {
    const lvl = levelMap.get(p);
    if (lvl) {
      crumbs.unshift({
        title: p === '/' ? 'ROOT' : (lvl.title || 'FOLDER').toUpperCase(),
        path: p
      });
      p = lvl.parentPath;
    } else {
      break;
    }
  }
  return crumbs;
}

/**
 * Counts total items (articles + subfolders) recursively under a folder node.
 * @param {object} folderNode
 * @returns {number}
 */
function countTotalArticles(folderNode) {
  let count = folderNode.articles.length;
  for (const sub of folderNode.subfolders) {
    count += countTotalArticles(sub);
  }
  return count;
}

/**
 * Generates aesthetic links between nodes in a level for force simulation layout.
 * Creates an interconnected constellation (links between neighboring nodes + optional hub).
 * @param {Array<object>} nodes
 * @param {string} parentPath
 * @returns {Array<object>}
 */
function generateLevelLinks(nodes, parentPath) {
  const links = [];
  if (nodes.length <= 1) return links;

  // Create ring / constellation links between sequential nodes
  for (let i = 0; i < nodes.length; i++) {
    const targetIdx = (i + 1) % nodes.length;
    links.push({
      source: nodes[i].id,
      target: nodes[targetIdx].id,
      distance: 120,
      strength: 0.7
    });
  }

  // If there are 4 or more nodes, cross-link some nodes for structural stability
  if (nodes.length >= 4) {
    for (let i = 0; i < nodes.length; i += 2) {
      const crossIdx = (i + Math.floor(nodes.length / 2)) % nodes.length;
      if (crossIdx !== i && crossIdx !== (i + 1) % nodes.length) {
        links.push({
          source: nodes[i].id,
          target: nodes[crossIdx].id,
          distance: 180,
          strength: 0.3
        });
      }
    }
  }

  return links;
}

/**
 * Converts scanned directory tree into strata-graph JSON structure.
 * @param {object} scannedTree
 * @returns {object}
 */
function buildGraphData(scannedTree) {
  const levelMap = new Map();
  const articlesMap = {};
  let totalArticlesCount = 0;
  let totalFoldersCount = 0;

  // First pass: collect levels and index articles
  function processFolder(folder, parentPath = null) {
    totalFoldersCount++;

    const directItemCount = folder.subfolders.length + folder.articles.length;
    const recursiveArticleCount = countTotalArticles(folder);

    // Save articles into global map
    for (const article of folder.articles) {
      totalArticlesCount++;
      articlesMap[article.id] = {
        id: article.id,
        title: article.title,
        path: article.path,
        thumbnail: article.thumbnail,
        description: article.description,
        summary: article.summary,
        tags: article.tags,
        date: article.date,
        readingTime: article.readingTime,
        wordCount: article.wordCount,
        htmlContent: article.htmlContent,
        folderPath: folder.path
      };
    }

    const levelData = {
      path: folder.path,
      parentPath: parentPath,
      title: folder.title,
      description: folder.description,
      thumbnail: folder.thumbnail,
      order: folder.order,
      color: folder.color,
      directItemCount,
      totalArticlesCount: recursiveArticleCount,
      subfolderCount: folder.subfolders.length,
      articleCount: folder.articles.length,
      rawFolder: folder
    };

    levelMap.set(folder.path, levelData);

    for (const sub of folder.subfolders) {
      processFolder(sub, folder.path);
    }
  }

  processFolder(scannedTree, null);

  // Second pass: construct nodes and links for each level
  const levels = {};

  for (const [lvlPath, lvlData] of levelMap.entries()) {
    const folder = lvlData.rawFolder;
    const breadcrumbs = buildBreadcrumbs(lvlPath, levelMap);

    const nodes = [];

    // Add subfolders as folder nodes
    for (const sub of folder.subfolders) {
      const subItemCount = sub.subfolders.length + sub.articles.length;
      const subTotalArticles = countTotalArticles(sub);

      nodes.push({
        id: sub.id,
        type: 'folder',
        title: sub.title,
        targetPath: sub.path,
        thumbnail: sub.thumbnail,
        description: sub.description,
        itemCount: subItemCount,
        totalArticles: subTotalArticles,
        subfolderCount: sub.subfolders.length,
        articleCount: sub.articles.length,
        color: sub.color,
        order: sub.order || 999
      });
    }

    // Add direct articles as article nodes
    for (const art of folder.articles) {
      nodes.push({
        id: art.id,
        type: 'article',
        title: art.title,
        articleId: art.id,
        path: art.path,
        thumbnail: art.thumbnail,
        summary: art.summary,
        tags: art.tags,
        date: art.date,
        readingTime: art.readingTime,
        order: art.order || 999
      });
    }

    const links = generateLevelLinks(nodes, lvlData.parentPath);

    levels[lvlPath] = {
      path: lvlPath,
      parentPath: lvlData.parentPath,
      title: lvlData.title,
      description: lvlData.description,
      thumbnail: lvlData.thumbnail,
      breadcrumbs,
      itemCount: nodes.length,
      subfolderCount: lvlData.subfolderCount,
      articleCount: lvlData.articleCount,
      nodes,
      links
    };
  }

  return {
    meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      rootPath: '/',
      totalArticles: totalArticlesCount,
      totalFolders: totalFoldersCount
    },
    root: levels['/'] || null,
    levels,
    articles: articlesMap
  };
}

module.exports = {
  buildGraphData
};
