const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('./parser');

const METADATA_FILENAMES = ['index.md', 'folder.md', 'node.md'];

/**
 * Capitalizes and cleans a directory name for fallback title
 * @param {string} dirName
 * @returns {string}
 */
function formatTitleFromDir(dirName) {
  return dirName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Recursively scans a content directory to extract folders and articles.
 * @param {string} dirPath - Directory to scan
 * @param {string} baseDir - Base root directory
 * @returns {object} folder node tree
 */
function scanDirectory(dirPath, baseDir = dirPath) {
  const relativePath = path.relative(baseDir, dirPath);
  const normalizedPath = '/' + relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const folderName = path.basename(dirPath);

  // Check for folder metadata file: index.md -> folder.md -> node.md
  let metaFile = null;
  for (const filename of METADATA_FILENAMES) {
    const candidate = path.join(dirPath, filename);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      metaFile = candidate;
      break;
    }
  }

  let folderMeta = {
    title: relativePath === '' ? 'Blog' : formatTitleFromDir(folderName),
    thumbnail: null,
    description: '',
    tags: [],
    order: 999,
    color: null
  };

  if (metaFile) {
    const content = fs.readFileSync(metaFile, 'utf8');
    const parsed = parseMarkdown(content, folderMeta.title);
    folderMeta = {
      ...folderMeta,
      ...parsed
    };
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const subfolders = [];
  const articles = [];

  for (const entry of entries) {
    // Ignore hidden files / directories
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subTree = scanDirectory(fullPath, baseDir);
      subfolders.push(subTree);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Ignore metadata files as articles
      if (METADATA_FILENAMES.includes(entry.name.toLowerCase())) {
        continue;
      }

      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const slug = entry.name.replace(/\.md$/, '');
      const articleRelPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const fallbackTitle = formatTitleFromDir(slug);
      const articleData = parseMarkdown(fileContent, fallbackTitle);

      articles.push({
        id: `article:${articleRelPath.replace(/\.md$/, '')}`,
        slug,
        path: `/${articleRelPath.replace(/\.md$/, '')}`,
        folderPath: normalizedPath,
        ...articleData
      });
    }
  }

  // Sort subfolders and articles by order / date
  subfolders.sort((a, b) => (a.order || 999) - (b.order || 999));
  articles.sort((a, b) => {
    if (a.order !== 999 || b.order !== 999) {
      return a.order - b.order;
    }
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return a.title.localeCompare(b.title);
  });

  return {
    id: `folder:${normalizedPath === '/' ? 'root' : normalizedPath.replace(/^\//, '').replace(/\//g, ':')}`,
    name: folderName,
    path: normalizedPath,
    relativePath,
    ...folderMeta,
    subfolders,
    articles
  };
}

module.exports = {
  scanDirectory
};
