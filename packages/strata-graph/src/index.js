const fs = require('fs');
const path = require('path');
const { scanDirectory } = require('./compiler/scanner');
const { buildGraphData } = require('./compiler/tree-builder');

/**
 * Compiles a directory of markdown files into strata-graph JSON data.
 * @param {object} options
 * @param {string} options.input - Directory to scan
 * @param {string} [options.output] - File path to save output JSON
 * @returns {object} Compiled graph data
 */
function compileGraph({ input, output }) {
  const resolvedInput = path.resolve(input);
  if (!fs.existsSync(resolvedInput)) {
    throw new Error(`Input directory not found: ${resolvedInput}`);
  }

  const scannedTree = scanDirectory(resolvedInput);
  const graphData = buildGraphData(scannedTree);

  if (output) {
    const resolvedOutput = path.resolve(output);
    const outDir = path.dirname(resolvedOutput);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const newContent = JSON.stringify(graphData, null, 2);
    if (!fs.existsSync(resolvedOutput) || fs.readFileSync(resolvedOutput, 'utf8') !== newContent) {
      fs.writeFileSync(resolvedOutput, newContent, 'utf8');
    }
  }

  return graphData;
}

module.exports = {
  compileGraph,
  scanDirectory,
  buildGraphData
};
