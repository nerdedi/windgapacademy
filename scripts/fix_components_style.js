const fs = require('fs');
const path = require('path');

const TARGET = path.join(__dirname, '..', 'components');

function fixFile(filePath) {
  let s = fs.readFileSync(filePath, 'utf8');
  // normalize single quotes to double quotes for imports and strings
  s = s.replace(/'/g, '"');
  // ensure third-party imports come before local imports by a simple heuristic
  const lines = s.split(/\r?\n/);
  const imports = [];
  const rest = [];
  for (const l of lines) {
    if (l.startsWith('import ')) imports.push(l);
    else rest.push(l);
  }
  // stable sort: third-party (from "react", "firebase", etc.) first
  imports.sort((a, b) => {
    const aLocal = a.includes('./') || a.includes('../');
    const bLocal = b.includes('./') || b.includes('../');
    if (aLocal === bLocal) return 0;
    return aLocal ? 1 : -1;
  });
  // ensure a single blank line between import block and rest
  const out = [...imports, '', ...rest].join('\n');
  fs.writeFileSync(filePath, out, 'utf8');
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(js|jsx|ts|tsx)$/.test(name)) fixFile(full);
  }
}

walk(TARGET);
console.log('style fix complete');
