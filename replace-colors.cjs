const fs = require('fs');
const path = require('path');

const colors = {
  '#12080D': 'var(--c-bg-darkest)',
  '#1C0B13': 'var(--c-bg-darker)',
  '#2A101B': 'var(--c-bg-dark)',
  '#3A1422': 'var(--c-bg-light)',
  '#E8899D': 'var(--c-accent-main)',
  '#F7B8C5': 'var(--c-accent-light)',
  '#D8A06C': 'var(--c-accent-gold)',
  '#FFF3EF': 'var(--c-text-main)'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [hex, cssVar] of Object.entries(colors)) {
    // We want to replace case-insensitive hex codes in tailwind classes
    // Format is like bg-[hex] or border-[hex]/50
    // Regex to match the hex code EXACTLY when wrapped in brackets or inside rgba/hex literals
    // But since they are mostly uppercase in the codebase, we'll do global replace with case-insensitivity
    const regex = new RegExp(hex, 'gi');
    if (regex.test(content)) {
      content = content.replace(regex, cssVar);
      changed = true;
    }
    
    // Also handle hex without # if it's used somewhere, but let's stick to the # ones
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
