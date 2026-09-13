#!/usr/bin/env node

const path = require('path');
const { compileGraph } = require('../src/index');

function printHelp() {
  console.log(`
Strata-Graph CLI: Hierarchical Force-Graph Markdown Compiler

Usage:
  strata-graph build [options]

Options:
  -i, --input <dir>      Content directory to scan (default: ./content)
  -o, --output <file>    Output JSON file path (default: ./dist/blog-graph.json)
  -h, --help             Show this help message
  -v, --version          Show version

Examples:
  strata-graph build -i src/content/blog -o src/assets/data/blog-graph.json
  npx strata-graph build --input content --output dist/graph.json
`);
}

function parseArgs(args) {
  const result = {
    command: 'build',
    input: './content',
    output: './dist/blog-graph.json'
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === 'build') {
      result.command = 'build';
      i++;
    } else if (arg === '-i' || arg === '--input') {
      result.input = args[i + 1];
      i += 2;
    } else if (arg === '-o' || arg === '--output') {
      result.output = args[i + 1];
      i += 2;
    } else if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (arg === '-v' || arg === '--version') {
      const pkg = require('../package.json');
      console.log(`strata-graph v${pkg.version}`);
      process.exit(0);
    } else {
      i++;
    }
  }

  return result;
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  printHelp();
  process.exit(0);
}

const config = parseArgs(args);

try {
  console.log(`[strata-graph] Scanning content in: ${config.input}`);
  const data = compileGraph({
    input: config.input,
    output: config.output
  });
  console.log(`[strata-graph] Successfully compiled ${data.meta.totalArticles} articles across ${data.meta.totalFolders} folders.`);
  console.log(`[strata-graph] Saved graph data to: ${config.output}`);
} catch (err) {
  console.error(`[strata-graph] Error during build:`, err.message);
  process.exit(1);
}
