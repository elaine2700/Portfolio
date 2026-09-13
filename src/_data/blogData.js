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

    const folderList = data.levels ? Object.keys(data.levels).map(pathKey => {
      const lvl = data.levels[pathKey];
      return {
        path: pathKey,
        title: lvl.title || pathKey,
        description: lvl.description || '',
        itemCount: lvl.itemCount || 0,
        articleCount: lvl.articleCount || 0,
        subfolderCount: lvl.subfolderCount || 0,
        breadcrumbs: lvl.breadcrumbs || []
      };
    }) : [];

    return {
      ...data,
      articleList,
      folderList
    };
  }

  return data || { articleList: [], folderList: [] };
};
