const fs = require('fs');
const path = require('path');

function replaceFileContent(filePath, replacer) {
    let content = fs.readFileSync(filePath, 'utf8');
    const ori = content;
    content = replacer(content);
    if (content !== ori) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

// 1. app/admin/page.tsx
replaceFileContent(path.join(__dirname, 'app/admin/page.tsx'), (content) => {
    // Add imports
    if (!content.includes('import { PageShell }')) {
        content = content.replace("import { StabilityBoundary } from '@/components/stability/stability-boundary'", 
            "import { StabilityBoundary } from '@/components/stability/stability-boundary'\nimport { PageShell } from '@/components/shared/page-shell'\nimport { PageHeader } from '@/components/shared/page-header'");
    }

    // Replace useMemo
    content = content.replace(/const enrollmentTrendData = useMemo\(\(\) => \{/, "const enrollmentTrendData = (() => {");
    content = content.replace(/\}, \[students, hasMounted\]\)/, "})();");
    
    content = content.replace(/const coursePopularityData = useMemo\(\(\) => \{/, "const coursePopularityData = (() => {");
    content = content.replace(/\}, \[courses, hasMounted\]\)/, "})();");

    // Add guards at top
    if (!content.includes('if (!hasMounted) return null')) {
        content = content.replace("const hasMounted = useHasMounted()\n", 
            "const hasMounted = useHasMounted()\n\n  if (!hasMounted) return null\n  if (!isInitialized) return <DashboardSkeleton />\n");
    }

    // Remove old guards
    content = content.replace(/if \(!isInitialized \|\| !hasMounted\) \{\s*return <DashboardSkeleton \/>\s*\}/, "");

    // Arrays
    content = content.replace(/students\?\.filter/g, "(students || []).filter");
    content = content.replace(/courses\?\.filter/g, "(courses || []).filter");
    content = content.replace(/trend\?\.map/g, "(trend || []).map");

    // Layout Root
    const layoutRegex = /return \(\s*<div className="space-y-6">\s*\{\/\* Page Header \*\/\}\s*<motion\.div[\s\S]*?<\/motion\.div>\s*<\/motion\.div>\s*/m;
    content = content.replace(layoutRegex, 
        `return (
    <PageShell>
      <PageHeader 
        title={\`Welcome, \${(String(user?.name || 'Admin')).split(' ').filter(Boolean)[0] || 'Admin'}\`}
        description="System Control Overview"
      />
      `);

    // End of layout
    content = content.replace(/      <\/div>\n    <\/div>\n  \)\n\}/, "      </div>\n    </PageShell>\n  )\n}");

    return content;
});

// 2. app/admin/attendance/page.tsx
replaceFileContent(path.join(__dirname, 'app/admin/attendance/page.tsx'), (content) => {
    // Top guards
    if (!content.includes('if (!hasMounted) return null')) {
        content = content.replace("const hasMounted = useHasMounted()\n",
            "const hasMounted = useHasMounted()\n\n  if (!hasMounted) return null\n  if (!isInitialized) return <DashboardSkeleton />\n");
    }

    // Convert useMemos
    content = content.replace(/const currentRange = useMemo\(\(\) => \{/, "const currentRange = (() => {");
    content = content.replace(/\}, \[currentDate, viewMode\]\)/, "})();");

    // useEffect is not a useMemo! Wait, useEffect cannot be moved below guards? Wait, wait.
    // The user said: "Moving ALL derived logic BELOW guard checks".
    // Does that mean we move `useEffect` below `if (!hasMounted)`? NO. React will throw Error #310!
    // But we ALREADY PUT THE GUARDS AT THE TOP!
    // If the guards are BELOW `hasMounted = useHasMounted()`, and ABOVE `useEffect`, it CRASHES React!
});
