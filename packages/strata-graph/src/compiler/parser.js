const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

/**
 * Parses markdown file content, extracting frontmatter and compiling markdown to HTML.
 * @param {string} rawContent
 * @param {string} fallbackTitle
 * @returns {object}
 */
function parseMarkdown(rawContent, fallbackTitle = 'Untitled') {
  const parsed = matter(rawContent);
  const data = parsed.data || {};
  const content = parsed.content || '';
  const htmlContent = md.render(content);

  // Calculate word count & estimated reading time
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Determine title: frontmatter title -> first H1 -> fallback
  let title = data.title;
  if (!title) {
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      title = h1Match[1].trim();
    } else {
      title = fallbackTitle;
    }
  }

  return {
    title,
    thumbnail: data.thumbnail || data.image || data.heroImage || null,
    description: data.description || data.summary || '',
    summary: data.summary || data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
    date: data.date ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date)) : null,
    order: typeof data.order === 'number' ? data.order : 999,
    color: data.color || null,
    readingTime: `${readingTimeMinutes} min read`,
    wordCount: words,
    rawContent: content,
    htmlContent
  };
}

module.exports = {
  parseMarkdown
};
