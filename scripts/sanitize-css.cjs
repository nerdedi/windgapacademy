const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'styles', 'output.css');
let css = fs.readFileSync(file, 'utf8');

// Replace occurrences like `--tw-pan-x: ;` with `--tw-pan-x: initial;`
css = css.replace(/(--tw-[a-z0-9-]+)\s*:\s*;/gi, '$1: initial;');

fs.writeFileSync(file, css, 'utf8');
console.log('Sanitized', file);
