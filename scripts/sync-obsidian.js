const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const matter = require('gray-matter');

// Load environment variables from .env
dotenv.config();

/**
 * CLI Options
 */
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isVerbose = args.includes('--verbose') || args.includes('-v');
const shouldPrune = args.includes('--prune');

// Configuration
const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH ? path.resolve(process.env.OBSIDIAN_VAULT_PATH) : null;
const BLOG_DIR_NAME = process.env.OBSIDIAN_BLOG_DIR || 'Site_Blog';
const DIRECT_BLOG_PATH = process.env.OBSIDIAN_BLOG_PATH ? path.resolve(process.env.OBSIDIAN_BLOG_PATH) : null;

// Determine source directory
let sourceDir = null;
if (DIRECT_BLOG_PATH && fs.existsSync(DIRECT_BLOG_PATH)) {
  sourceDir = DIRECT_BLOG_PATH;
} else if (VAULT_PATH) {
  const candidate = path.join(VAULT_PATH, BLOG_DIR_NAME);
  if (fs.existsSync(candidate)) {
    sourceDir = candidate;
  }
}

// Project destination directories
const TARGET_CONTENT_DIR = path.resolve(__dirname, '../src/content/blog');
const TARGET_ASSETS_DIR = path.resolve(__dirname, '../src/assets/images/blog');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif']);
const METADATA_FILENAMES = new Set(['index.md', 'folder.md', 'node.md']);

/**
 * Formats a slug from a filename or title
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Capitalizes and cleans a directory name for title fallback
 */
function formatTitleFromDir(dirName) {
  return dirName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Validates environment setup and prints guide if missing
 */
function checkEnvironment() {
  if (!sourceDir) {
    console.error('\n' + '='.repeat(68));
    console.error('[sync:blog] ERROR: Obsidian blog source directory not found!');
    console.error('='.repeat(68));
    console.error('\nPlease configure your Obsidian path in your .env file:');
    console.error('\nOption 1 (Vault Root + Folder):');
    console.error('  OBSIDIAN_VAULT_PATH="C:/Users/Elaine/Documents/Obsidian/MyVault"');
    console.error(`  OBSIDIAN_BLOG_DIR="${BLOG_DIR_NAME}"`);
    console.error('\nOption 2 (Direct Folder Path):');
    console.error('  OBSIDIAN_BLOG_PATH="C:/Users/Elaine/Documents/Obsidian/MyVault/Site_Blog"');
    console.error('\nEnsure the "Site_Blog" folder exists in your vault and run again.\n');
    process.exit(1);
  }
}

/**
 * Recursively find all files in a directory
 */
function walkDirectory(dir, fileList = [], baseDir = dir) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden files and obsidian system folders (.obsidian, .trash, etc.)
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      walkDirectory(fullPath, fileList, baseDir);
    } else if (entry.isFile()) {
      fileList.push({
        fullPath,
        relativePath: relativePath.replace(/\\/g, '/'),
        name: entry.name,
        ext: path.extname(entry.name).toLowerCase()
      });
    }
  }

  return fileList;
}

/**
 * Searches for an asset file in candidate locations
 */
function findAssetFile(imageFileName, noteDir, allSourceFiles, vaultPath) {
  if (!imageFileName) return null;

  // Clean raw reference (strip quotes, wikilink brackets, query strings, hashes)
  let clean = imageFileName.trim().replace(/^['"]|['"]$/g, '');
  clean = clean.replace(/^\[\[/, '').replace(/\]\]$/, '').trim();
  clean = clean.split('#')[0].split('?')[0];

  const cleanName = path.basename(clean).toLowerCase();
  const noLeadingSlash = clean.replace(/^[\\\/]+/, '');

  // 1. Direct path relative to sourceDir (e.g. sourceDir + "assets/thumb-root.svg")
  const directInSource = path.join(sourceDir, noLeadingSlash);
  if (fs.existsSync(directInSource) && fs.statSync(directInSource).isFile()) {
    return directInSource;
  }

  // 2. Direct path relative to note's immediate directory
  const directInNote = path.join(noteDir, noLeadingSlash);
  if (fs.existsSync(directInNote) && fs.statSync(directInNote).isFile()) {
    return directInNote;
  }

  // 3. In sourceDir's common subfolders (assets/, attachments/, images/, etc.)
  for (const sub of ['assets', 'attachments', 'images', '_attachments']) {
    const candidate = path.join(sourceDir, sub, cleanName);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  // 4. In note's common subfolders (assets/, attachments/, images/, etc.)
  for (const sub of ['assets', 'attachments', 'images', '_attachments']) {
    const candidate = path.join(noteDir, sub, cleanName);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  // 5. In sourceDir root by base name
  const inSourceRoot = path.join(sourceDir, cleanName);
  if (fs.existsSync(inSourceRoot) && fs.statSync(inSourceRoot).isFile()) {
    return inSourceRoot;
  }

  // 6. Search across allSourceFiles scanned in sourceDir
  const matched = allSourceFiles.find(f => f.name.toLowerCase() === cleanName);
  if (matched) {
    return matched.fullPath;
  }

  // 7. Check in vault root attachments if vaultPath is set
  if (vaultPath) {
    for (const sub of ['assets', 'attachments', 'images', 'Attachments', 'Assets', '']) {
      const candidate = path.join(vaultPath, sub, cleanName);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }

  // 8. Fallback: check if the asset already exists in TARGET_ASSETS_DIR
  const inTargetAssets = path.join(TARGET_ASSETS_DIR, cleanName);
  if (fs.existsSync(inTargetAssets) && fs.statSync(inTargetAssets).isFile()) {
    return inTargetAssets;
  }

  return null;
}

/**
 * Copy file only if changed or destination missing
 */
function copyFileIfChanged(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(dest)) {
    const srcBuf = fs.readFileSync(src);
    const destBuf = fs.readFileSync(dest);
    if (srcBuf.equals(destBuf)) {
      return false; // Unchanged
    }
  }

  fs.copyFileSync(src, dest);
  return true;
}

/**
 * Write file only if changed or destination missing
 */
function writeFileIfChanged(dest, content) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(dest)) {
    const current = fs.readFileSync(dest, 'utf8');
    if (current === content) {
      return false; // Unchanged
    }
  }

  fs.writeFileSync(dest, content, 'utf8');
  return true;
}

/**
 * Main Sync Pipeline
 */
async function syncObsidianBlog() {
  console.log('\n--- [Obsidian Blog Sync Engine] ---');
  checkEnvironment();

  console.log(`Source Folder:     ${sourceDir}`);
  console.log(`Target Content:    ${TARGET_CONTENT_DIR}`);
  console.log(`Target Assets:     ${TARGET_ASSETS_DIR}`);
  if (isDryRun) {
    console.log(`Mode:              DRY RUN (no files will be written)`);
  }
  console.log('-'.repeat(45));

  // Ensure target directories exist
  if (!fs.existsSync(TARGET_CONTENT_DIR)) {
    fs.mkdirSync(TARGET_CONTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(TARGET_ASSETS_DIR)) {
    fs.mkdirSync(TARGET_ASSETS_DIR, { recursive: true });
  }

  // Ensure blog.json exists in target content
  const blogJsonPath = path.join(TARGET_CONTENT_DIR, 'blog.json');
  if (!fs.existsSync(blogJsonPath)) {
    fs.writeFileSync(blogJsonPath, JSON.stringify({ permalink: false }, null, 2) + '\n', 'utf8');
    console.log('✓ Created src/content/blog/blog.json (permalink: false)');
  }

  // 1. Scan source directory
  const ASSET_FOLDER_NAMES = new Set(['assets', 'attachments', 'images', '_attachments']);
  const allSourceFiles = walkDirectory(sourceDir);
  const markdownFiles = allSourceFiles.filter(f => {
    if (f.ext !== '.md') return false;
    const parts = f.relativePath.split('/');
    for (let i = 0; i < parts.length - 1; i++) {
      if (ASSET_FOLDER_NAMES.has(parts[i].toLowerCase())) return false;
    }
    return true;
  });

  console.log(`Found ${markdownFiles.length} markdown file(s) in source.`);

  // 2. Parse and index publishable notes
  const noteIndex = new Map(); // key -> { articleId, title, path, relPath, folderRelPath, isMeta }
  const parsedNotes = [];
  const copiedAssets = new Set();
  const warnings = [];

  for (const file of markdownFiles) {
    const rawContent = fs.readFileSync(file.fullPath, 'utf8');
    let parsed;
    try {
      parsed = matter(rawContent);
    } catch (err) {
      warnings.push(`Could not parse frontmatter in ${file.relativePath}: ${err.message}`);
      continue;
    }

    const data = parsed.data || {};

    // Check for draft status: if explicitly draft: true or publish: false, skip
    if (data.draft === true || data.publish === false) {
      if (isVerbose) console.log(`[Draft] Skipping ${file.relativePath}`);
      continue;
    }

    const fileNameNoExt = path.basename(file.name, '.md');
    const folderRelPath = path.dirname(file.relativePath).replace(/\\/g, '/');
    const normalizedFolder = folderRelPath === '.' ? '/' : '/' + folderRelPath;
    const isMeta = METADATA_FILENAMES.has(file.name.toLowerCase());

    // Also check if filename matches parent folder name (Obsidian folder-note pattern)
    const parentDirName = path.basename(path.dirname(file.fullPath));
    const isFolderNote = !isMeta && folderRelPath !== '.' && fileNameNoExt.toLowerCase() === parentDirName.toLowerCase();

    // Determine target relative filename
    let targetRelPath = file.relativePath;
    if (isFolderNote) {
      // Convert Obsidian folder note (e.g. MyFolder/MyFolder.md) to MyFolder/folder.md
      targetRelPath = path.join(folderRelPath, 'folder.md').replace(/\\/g, '/');
    }

    // Determine Article ID & Path
    const cleanSlug = slugify(fileNameNoExt);
    const articleRelPath = folderRelPath === '.' ? cleanSlug : `${folderRelPath}/${cleanSlug}`;
    const articleId = `article:${articleRelPath}`;
    const articlePath = `/${articleRelPath}`;

    // Extract title: frontmatter title -> first H1 -> filename
    let title = data.title;
    if (!title) {
      const h1Match = parsed.content.match(/^#\s+(.+)$/m);
      if (h1Match) {
        title = h1Match[1].trim();
      } else {
        title = formatTitleFromDir(fileNameNoExt);
      }
    }

    const noteRecord = {
      file,
      rawContent,
      data,
      content: parsed.content,
      isMeta: isMeta || isFolderNote,
      targetRelPath,
      folderRelPath,
      normalizedFolder,
      articleId,
      articlePath,
      title,
      fileNameNoExt
    };

    parsedNotes.push(noteRecord);

    // Index for wikilink resolution
    if (!noteRecord.isMeta) {
      noteIndex.set(fileNameNoExt.toLowerCase(), noteRecord);
      noteIndex.set(cleanSlug.toLowerCase(), noteRecord);
      if (data.title) {
        noteIndex.set(data.title.toLowerCase().trim(), noteRecord);
      }
    }
  }

  // 3. Transform notes (rewriting wikilinks, image embeds, callouts, and copying assets)
  let notesWritten = 0;
  let notesUnchanged = 0;
  let assetsCopied = 0;
  const processedTargetFiles = new Set(['blog.json']);

  for (const note of parsedNotes) {
    let transformedContent = note.content;
    const noteDir = path.dirname(note.file.fullPath);

    // Helper: process and copy an image reference
    function processImageRef(imageRef, altText = '') {
      let cleanRef = imageRef.split('|')[0].trim();
      cleanRef = cleanRef.replace(/^['"]|['"]$/g, '').replace(/^\[\[/, '').replace(/\]\]$/, '').trim();

      const assetPath = findAssetFile(cleanRef, noteDir, allSourceFiles, VAULT_PATH);

      if (!assetPath) {
        warnings.push(`Missing image: "${cleanRef}" referenced in ${note.file.relativePath}`);
        return null;
      }

      const assetFileName = path.basename(assetPath);
      const targetAssetPath = path.join(TARGET_ASSETS_DIR, assetFileName);
      const publicWebPath = `/assets/images/blog/${assetFileName}`;

      if (!isDryRun && path.resolve(assetPath) !== path.resolve(targetAssetPath)) {
        const changed = copyFileIfChanged(assetPath, targetAssetPath);
        if (changed) assetsCopied++;
      }
      copiedAssets.add(assetFileName);

      return {
        publicWebPath,
        altText: altText || path.basename(assetFileName, path.extname(assetFileName))
      };
    }

    // A. Transform Obsidian Image Embeds: ![[image.png]] or ![[assets/image.png|alt text]] or ![[image.png|300]]
    transformedContent = transformedContent.replace(/!\[\[([^\]]+)\]\]/g, (match, inner) => {
      const parts = inner.split('|');
      const imageName = parts[0].trim();
      const altOrSize = parts[1] ? parts[1].trim() : '';

      const ext = path.extname(imageName).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        const res = processImageRef(imageName, altOrSize);
        if (res) {
          return `![${res.altText}](${res.publicWebPath})`;
        }
      }
      return match;
    });

    // B. Transform Standard Markdown Images: ![alt](assets/image.png) or ![alt](/assets/image.png)
    transformedContent = transformedContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
      const cleanUrl = url.trim().split('#')[0].split('?')[0];
      // Skip external URLs or images already mapped to /assets/images/blog/
      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('/assets/images/blog/')) {
        return match;
      }
      const ext = path.extname(cleanUrl).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        const res = processImageRef(cleanUrl, alt);
        if (res) {
          return `![${res.altText}](${res.publicWebPath})`;
        }
      }
      return match;
    });

    // C. Transform Obsidian Wikilinks: [[Note Name]] or [[Note Name|Alias]] or [[Note Name#Header|Alias]]
    transformedContent = transformedContent.replace(/\[\[([^\]]+)\]\]/g, (match, inner) => {
      const parts = inner.split('|');
      const targetNoteRaw = parts[0].trim();
      const alias = parts[1] ? parts[1].trim() : null;

      // Handle header fragments if any
      const [targetNoteName, header] = targetNoteRaw.split('#');
      const lookupKey = (targetNoteName || '').toLowerCase().trim();

      const target = noteIndex.get(lookupKey);
      if (target) {
        const displayText = alias || target.title || targetNoteName;
        const targetHref = `#${target.articleId}`;
        return `[${displayText}](${targetHref})`;
      } else {
        // Target note not in published blog
        if (targetNoteName) {
          warnings.push(`Unresolved wikilink: "[[${inner}]]" in ${note.file.relativePath}`);
        }
        return alias || targetNoteName || match;
      }
    });

    // D. Transform Frontmatter Thumbnail / Image fields if present
    const updatedData = { ...note.data };
    for (const field of ['thumbnail', 'image', 'heroImage']) {
      if (updatedData[field] && typeof updatedData[field] === 'string') {
        let rawThumb = updatedData[field].trim();
        rawThumb = rawThumb.replace(/^['"]|['"]$/g, '').replace(/^\[\[/, '').replace(/\]\]$/, '').trim();

        // Skip external URLs or paths already formatted as /assets/images/blog/
        if (rawThumb.startsWith('http://') || rawThumb.startsWith('https://') || rawThumb.startsWith('/assets/images/blog/')) {
          continue;
        }

        const res = processImageRef(rawThumb, note.title);
        if (res) {
          updatedData[field] = res.publicWebPath;
        }
      }
    }

    // Reconstruct frontmatter and content
    const finalFileContent = matter.stringify(transformedContent, updatedData);
    const targetFilePath = path.join(TARGET_CONTENT_DIR, note.targetRelPath);
    processedTargetFiles.add(note.targetRelPath.replace(/\\/g, '/'));

    if (!isDryRun) {
      const written = writeFileIfChanged(targetFilePath, finalFileContent);
      if (written) {
        notesWritten++;
      } else {
        notesUnchanged++;
      }
    } else {
      notesWritten++;
    }
  }

  // 4. Prune removed markdown files in src/content/blog/ (safe prune)
  let filesPruned = 0;
  let unmanagedFiles = 0;
  const currentTargetFiles = walkDirectory(TARGET_CONTENT_DIR);
  for (const tf of currentTargetFiles) {
    if (tf.ext !== '.md') continue;
    const rel = tf.relativePath.replace(/\\/g, '/');

    // Protect root index.md if no root index.md was provided in Obsidian
    if (rel === 'index.md' && !processedTargetFiles.has('index.md')) {
      continue;
    }

    if (!processedTargetFiles.has(rel)) {
      if (shouldPrune) {
        if (!isDryRun) {
          fs.unlinkSync(tf.fullPath);
          // Remove parent directory if now empty
          const dir = path.dirname(tf.fullPath);
          if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0 && dir !== TARGET_CONTENT_DIR) {
            fs.rmdirSync(dir);
          }
        }
        filesPruned++;
        console.log(`- Pruned removed file: ${rel}`);
      } else {
        unmanagedFiles++;
      }
    }
  }

  // 5. Final Summary Output
  console.log('\n' + '='.repeat(45));
  console.log('SYNC COMPLETE:');
  console.log(`  Notes Processed:      ${parsedNotes.length}`);
  console.log(`  Notes Updated/Added:  ${notesWritten}`);
  console.log(`  Notes Unchanged:      ${notesUnchanged}`);
  console.log(`  Assets Copied:        ${assetsCopied} (referenced: ${copiedAssets.size})`);
  if (shouldPrune) {
    console.log(`  Stale Files Pruned:   ${filesPruned}`);
  } else if (unmanagedFiles > 0) {
    console.log(`  Other Local Files:    ${unmanagedFiles} kept (pass --prune to clean deleted posts)`);
  }

  if (warnings.length > 0) {
    console.log('\nWARNINGS & NOTICES:');
    warnings.forEach(w => console.warn(`  ! ${w}`));
  }
  console.log('='.repeat(45) + '\n');
}

// Run script
syncObsidianBlog().catch(err => {
  console.error('\n[sync:blog] Fatal Error during sync:', err);
  process.exit(1);
});
