const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function bundle() {
  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 1. Bundle Client JS (Global/Browser bundle)
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, '../src/client/strata-graph.js')],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: 'iife',
    globalName: 'StrataGraphBundle',
    outfile: path.resolve(distDir, 'strata-graph.js')
  });

  // 2. Bundle Client JS (ESM format)
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, '../src/client/strata-graph.js')],
    bundle: true,
    minify: false,
    format: 'esm',
    outfile: path.resolve(distDir, 'strata-graph.esm.js')
  });

  // 3. Bundle Graph CSS (graph visualization styles only)
  const coreCss = fs.readFileSync(path.resolve(__dirname, '../src/client/styles/strata-graph.css'), 'utf8');
  fs.writeFileSync(path.resolve(distDir, 'strata-graph.css'), coreCss, 'utf8');

  console.log('✔ strata-graph client bundled successfully to dist/');
}

bundle().catch(err => {
  console.error(err);
  process.exit(1);
});
