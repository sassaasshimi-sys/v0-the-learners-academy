const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (filePath.endsWith('page.tsx')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = getFiles(path.join(__dirname, 'app', 'admin'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove old hasMounted calls to avoid duplicates
    content = content.replace(/const hasMounted = useHasMounted\(\)\s?\n?/g, "");

    // 2. Identify the insertion point: Right after the last hook in the `export default function` block.
    // Hooks usually begin with `use` (e.g. `useEffect`, `useState`, `useMemo`, `useCallback`)
    // They usually are at the root level of the component body.
    
    // We'll read line by line.
    const lines = content.split('\n');
    let insideMain = false;
    let mainDepth = 0;
    let lastHookLineIdx = -1;
    let mainStartLineIdx = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('export default function')) {
            insideMain = true;
            mainStartLineIdx = i;
        }

        if (insideMain) {
            // track braces to know if we are at root of component
            mainDepth += (line.match(/\{/g) || []).length;
            mainDepth -= (line.match(/\}/g) || []).length;

            // If we are back to depth 0, we've left the component
            if (mainDepth === 0 && i !== mainStartLineIdx) {
                // Should not happen abruptly, but just in case
            }

            // At component root depth (which is 1 inside function body)
            if (mainDepth === 1 || mainDepth === 2) {
                // If it's a hook call
                if (line.trim().startsWith('const [') && line.includes('useState')) {
                    lastHookLineIdx = i;
                } else if (line.trim().startsWith('useEffect(')) {
                    // find where useEffect ends
                    let hookDepth = 0;
                    for (let j = i; j < lines.length; j++) {
                        hookDepth += (lines[j].match(/\{/g) || []).length;
                        hookDepth -= (lines[j].match(/\}/g) || []).length;
                        if (hookDepth === 0 && lines[j].includes('}')) { // simplistic
                            lastHookLineIdx = Math.max(j, lastHookLineIdx);
                            break;
                        }
                    }
                } else if (line.trim().startsWith('const ') && line.includes('= use')) {
                    // Check if it's useMemo or useCallback
                    if (line.includes('useMemo(') || line.includes('useCallback(')) {
                        let hookDepth = 0;
                        for (let j = i; j < lines.length; j++) {
                            hookDepth += (lines[j].match(/\{/g) || []).length;
                            hookDepth -= (lines[j].match(/\}/g) || []).length;
                            if (hookDepth === 0 && lines[j].match(/\}\s*\,\s*\[.*?\]/)) {
                                lastHookLineIdx = Math.max(j, lastHookLineIdx);
                                break;
                            }
                        }
                    } else {
                        // simple single line hook
                        lastHookLineIdx = i;
                    }
                }
            }

            // Stop looking when we hit a return statement at root or first logical block
            if (mainDepth === 1 && line.trim().startsWith('return ')) {
                break;
            }
        }
    }

    if (insideMain) {
       // Insert strict guards
       const guard = `\n  const hasMounted = useHasMounted()\n  if (!hasMounted) return null\n  if (!isInitialized) return <DashboardSkeleton />\n`;
       
       let insertAt = lastHookLineIdx !== -1 ? lastHookLineIdx + 1 : mainStartLineIdx + 1;
       
       // check if guards already exist
       if (!content.includes('if (!hasMounted) return null')) {
           lines.splice(insertAt, 0, guard);
           fs.writeFileSync(file, lines.join('\n'));
           console.log("Injected guards into:", file);
       }
    }
});
