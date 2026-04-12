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
let violationsFound = false;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const guardIndex = content.indexOf('if (!isInitialized) return <DashboardSkeleton />');
    
    if (guardIndex !== -1) {
        const contentAfterGuard = content.substring(guardIndex);
        
        // Find any hooks in contentAfterGuard
        const hookPattern = /\b(useState|useEffect|useContext|useReducer|useCallback|useMemo|useRef|useImperativeHandle|useLayoutEffect|useDebugValue|useId|useData|useAuth|useHasMounted)\s*\(/g;
        
        let match;
        while ((match = hookPattern.exec(contentAfterGuard)) !== null) {
            console.log(`VIOLATION in ${file}: Found hook '${match[1]}' after the guard!`);
            
            // Let's rewrite it if it's useMemo
            if (match[1] === 'useMemo') {
                console.log("   Attempting to auto-convert useMemo to IIFE...");
                // Not safe to blind-regex multiline useMemo, but we can flag it.
                violationsFound = true;
            } else {
                violationsFound = true;
            }
        }
    }
});

if (!violationsFound) {
    console.log("SUCCESS: No hooks found after guards.");
}
