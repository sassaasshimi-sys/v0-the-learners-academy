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
    let changed = false;

    // 1. Enforce "use client"
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
        content = "'use client'\n\n" + content;
        changed = true;
    }

    // 2. Add necessary imports if missing
    const importsToAdd = [
        "import { DashboardSkeleton } from '@/components/dashboard-skeleton'",
        "import { useData } from '@/contexts/data-context'",
        "import { useHasMounted } from '@/hooks/use-has-mounted'",
        "import { PageShell } from '@/components/shared/page-shell'",
        "import { PageHeader } from '@/components/shared/page-header'"
    ];
    
    importsToAdd.forEach(imp => {
        const match = imp.match(/import \{ (.*?) \} from/)[1];
        if (!content.includes(match)) {
            // naive insert after last import
            const lastImportIndex = content.lastIndexOf("import ");
            if (lastImportIndex !== -1) {
                const endOfLine = content.indexOf("\n", lastImportIndex);
                content = content.slice(0, endOfLine + 1) + imp + "\n" + content.slice(endOfLine + 1);
            } else {
                content = imp + "\n" + content;
            }
            changed = true;
        }
    });

    // 3. Remove old guards anywhere lower down
    const oldGuardRegex = /if\s*\(\!isInitialized\s*\|\|\s*\!hasMounted\)\s*\{\s*return\s*<DashboardSkeleton\s*\/>\s*\}/g;
    if (oldGuardRegex.test(content)) {
        content = content.replace(oldGuardRegex, "");
        changed = true;
    }
    const oldGuardRegexInline = /if\s*\(\!isInitialized\)\s*return\s*<DashboardSkeleton\s*\/>/g;
    if (oldGuardRegexInline.test(content)) {
        content = content.replace(oldGuardRegexInline, "");
        changed = true;
    }

    // 4. Inject STRICT guard right after the hooks logic inside the default export component
    // We try to find the return statement of the main component and inject above it if possible, 
    // or better: right after the last `useX` line in the main function.
    // Naive way: identify `export default function ...() {`, find the first return, and inject right before it if we couldn't find a better hook.
    // Actually, just find the `export default function` block, and insert guards immediately after the first chunk of const { ... } = useX() lines.
    const strictGuard = `
  const hasMounted = useHasMounted()
  if (!hasMounted) return null
  if (!isInitialized) return <DashboardSkeleton />
`;
    // If it doesn't already have the strict guard:
    if (!content.includes("if (!hasMounted) return null") || !content.includes("if (!isInitialized) return <DashboardSkeleton />")) {
        // Let's find the last occurrence of `use` inside the default export before a blank line or return
        const lines = content.split('\n');
        let insideMain = false;
        let lastHookIndex = -1;
        let mainStartIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("export default function")) {
                insideMain = true;
                mainStartIndex = i;
            }
            if (insideMain) {
                if (lines[i].trim().startsWith("return ")) {
                    if (lastHookIndex === -1) lastHookIndex = i - 1; // fallback
                    break;
                }
                // Look for hook calls at top level (indentation 2 usually)
                if (lines[i].includes("= use") || lines[i].trim().startsWith("use")) {
                    // Let's assume all hooks are placed consecutively. Let's find the closing of useMemo, useEffect, etc.
                    // Counting braces is painful in regex, so we'll just find the first "return (" and insert above it.
                }
            }
        }
        
        // Simpler approach: find the first `return (` or `if (!` or `return <` after `export default function`.
        insideMain = false;
        let insertAt = -1;
        for (let i = 0; i < lines.length; i++) {
             if (lines[i].includes('export default function')) {
                 insideMain = true;
             }
             if (insideMain) {
                 if (lines[i].trim().startsWith('return') || (lines[i].match(/^\s*if\s*\(/) && !lines[i].includes('hasMounted'))) {
                     // Check if an earlier hook like useEffect ended
                     insertAt = i;
                     break;
                 }
             }
        }
        if (insertAt !== -1) {
            // Ensure we don't inject inside a useMemo
            // Let's just do a manual pass with the AST script later if this is too hard.
            // But wait! We can just put it right before the first return of the main component!
            // Wait, what if the first return is inside a useMemo?
        }
    }

    // 5. Array safety & property access
    const safeArrayReplacements = [
        { regex: /(\w+)\?\.\s*map\(/g, rep: '($1 || []).map(' },
        { regex: /(\w+)\?\.\s*filter\(/g, rep: '($1 || []).filter(' },
        { regex: /(\w+)\?\.\s*reduce\(/g, rep: '($1 || []).reduce(' },
        { regex: /(\w+)\?\.\s*find\(/g, rep: '($1 || []).find(' },
        { regex: /(\w+)\?\.\s*some\(/g, rep: '($1 || []).some(' },
        { regex: /(\w+)\?\.\s*every\(/g, rep: '($1 || []).every(' },
        { regex: /(\w+)\.classTitle\.toLowerCase\(\)/g, rep: "($1.classTitle || '').toLowerCase()" },
        { regex: /(\w+)\.teacherName\.toLowerCase\(\)/g, rep: "($1.teacherName || '').toLowerCase()" },
        { regex: /(\w+)\.roomNumber\.toLowerCase\(\)/g, rep: "($1.roomNumber || '').toLowerCase()" }
    ];

    safeArrayReplacements.forEach(rep => {
        if (rep.regex.test(content)) {
            content = content.replace(rep.regex, rep.rep);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(file, content);
        console.log("Updated:", file);
    }
});
