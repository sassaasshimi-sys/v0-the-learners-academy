const fs = require('fs');
const path = require('path');

function findHookViolations(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findHookViolations(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for useMemo or useCallback
      const hookRegex = /(useMemo|useCallback)\s*\(\s*(?:async\s*)?\(\s*[^)]*\)\s*=>\s*\{([\s\S]*?)\n\s*\}\s*,\s*\[/g;
      let match;
      while ((match = hookRegex.exec(content)) !== null) {
        const hookType = match[1];
        const body = match[2];
        
        // Find any call to a hook inside the body
        // We look for patterns like 'useContext(', 'useData(', etc.
        const nestedHookRegex = /\buse[A-Z][a-zA-Z]*\s*\(/g;
        let nestedMatch;
        while ((nestedMatch = nestedHookRegex.exec(body)) !== null) {
          console.log(`VIOLATION FOUND: ${hookType} contains ${nestedMatch[0]} in ${fullPath}`);
          console.log(`Context: ${body.substring(Math.max(0, nestedMatch.index - 50), Math.min(body.length, nestedMatch.index + 50))}\n`);
        }
      }
    }
  }
}

console.log('--- SCANNING FOR HOOK VIOLATIONS ---');
findHookViolations('c:\\Desktop\\Web Protos\\v0-the-learners-academy\\app\\admin');
findHookViolations('c:\\Desktop\\Web Protos\\v0-the-learners-academy\\contexts');
console.log('--- SCAN COMPLETE ---');
