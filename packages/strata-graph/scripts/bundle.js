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

  // 3. Bundle & Concatenate CSS
  const coreCss = fs.readFileSync(path.resolve(__dirname, '../src/client/styles/strata-graph.css'), 'utf8');
  const modalCss = fs.readFileSync(path.resolve(__dirname, '../src/client/styles/modal.css'), 'utf8');
  fs.writeFileSync(path.resolve(distDir, 'strata-graph.css'), `${coreCss}\n\n${modalCss}`, 'utf8');

  // Copy to host app src/assets/strata-graph
  const hostAssetsDir = path.resolve(__dirname, '../../../src/assets/strata-graph');
  if (!fs.existsSync(hostAssetsDir)) {
    fs.mkdirSync(hostAssetsDir, { recursive: true });
  }
  fs.copyFileSync(path.resolve(distDir, 'strata-graph.js'), path.resolve(hostAssetsDir, 'strata-graph.js'));
  fs.copyFileSync(path.resolve(distDir, 'strata-graph.css'), path.resolve(hostAssetsDir, 'strata-graph.css'));

  // Also copy to src/assets/js/strata-graph and src/assets/css
  const hostJsDir = path.resolve(__dirname, '../../../src/assets/js/strata-graph');
  if (!fs.existsSync(hostJsDir)) {
    fs.mkdirSync(hostJsDir, { recursive: true });
  }
  fs.copyFileSync(path.resolve(distDir, 'strata-graph.esm.js'), path.resolve(hostJsDir, 'strata-graph.js'));

  const hostCssDir = path.resolve(__dirname, '../../../src/assets/css');
  if (!fs.existsSync(hostCssDir)) {
    fs.mkdirSync(hostCssDir, { recursive: true });
  }
  fs.copyFileSync(path.resolve(distDir, 'strata-graph.css'), path.resolve(hostCssDir, 'strata-graph.css'));

  console.log('✔ strata-graph client bundled successfully to dist/, src/assets/strata-graph/, and src/assets/{js,css}/');
}

bundle().catch(err => {
  console.error(err);
  process.exit(1);
});
