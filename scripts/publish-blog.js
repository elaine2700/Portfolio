const { execSync } = require('child_process');
const path = require('path');

function run() {
  console.log('\n=== [Obsidian One-Click Publisher] ===\n');

  // 1. Run synchronization
  console.log('1. Syncing Obsidian notes and assets...');
  try {
    execSync('node scripts/sync-obsidian.js', {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit'
    });
  } catch (err) {
    console.error('\nSync failed. Aborting publish.');
    process.exit(1);
  }

  // 2. Check for git changes in blog content and blog assets
  const repoRoot = path.resolve(__dirname, '..');
  let status = '';
  try {
    status = execSync('git status --porcelain src/content/blog src/assets/images/blog', {
      cwd: repoRoot,
      encoding: 'utf8'
    }).trim();
  } catch (err) {
    console.error('\nCould not inspect git status:', err.message);
    process.exit(1);
  }

  if (!status) {
    console.log('\n✓ Up to date! No blog changes to commit.');
    return;
  }

  // 3. Stage, commit, and push
  console.log('\n2. Staging and committing changes...');
  try {
    execSync('git add src/content/blog src/assets/images/blog', {
      cwd: repoRoot,
      stdio: 'inherit'
    });

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const commitMsg = `Update blog content from Obsidian (${timestamp})`;
    execSync(`git commit -m "${commitMsg}"`, {
      cwd: repoRoot,
      stdio: 'inherit'
    });

    console.log('\n3. Pushing to GitHub (main)...');
    execSync('git push origin main', {
      cwd: repoRoot,
      stdio: 'inherit'
    });

    console.log('\n' + '='.repeat(52));
    console.log('✓ SUCCESS: Blog updates pushed to GitHub!');
    console.log('GitHub Actions is deploying your changes live.');
    console.log('='.repeat(52) + '\n');
  } catch (err) {
    console.error('\nGit commit/push encountered an error:', err.message);
    process.exit(1);
  }
}

run();
