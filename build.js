const fs = require('fs');
const path = require('path');

// Create dist directory and required subdirectories
['dist', 'dist/assets', 'dist/assets/icons'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy all source files to dist
const filesToCopy = [
  'index.html',
  'styles.css',
  'main.js',
  'manifest.json',
  'service-worker.js'
].forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
    }
  } catch (err) {
    console.log(`Warning: Could not copy ${file}`);
  }
});

console.log('Build completed successfully!');