
const fs = require('fs');
const { execSync } = require('child_process');

// Read manifest
const manifest = require('./manifest.json');
manifest.build_id = Date.now();
manifest.version = process.env.npm_package_version;

// Write updated manifest
fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));

// Update service worker cache version
const swContent = fs.readFileSync('service-worker.js', 'utf8');
const newSW = swContent.replace(
  /const CACHE_NAME = '.*?'/,
  `const CACHE_NAME = 'dreamshader-cache-${manifest.build_id}'`
);
fs.writeFileSync('dist/service-worker.js', newSW);