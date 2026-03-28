const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file uses alert
    if (!content.includes('alert(')) return;

    // Replace alert string match with toast
    content = content.replace(/alert\((['"`].*(?:success|Success|Generated|saved|created).*['"`])\)/g, 'toast.success($1)');
    content = content.replace(/alert\((.*)\)/g, 'toast.error($1)');

    // Add import if not exists
    if (!content.includes("import toast")) {
        // Find last import
        const lines = content.split('\n');
        let lastImportIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lastImportIndex = i;
            }
        }
        lines.splice(lastImportIndex + 1, 0, "import toast from 'react-hot-toast';");
        content = lines.join('\n');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${path.basename(filePath)}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            processFile(fullPath);
        }
    }
}

walkDir(pagesDir);
console.log("Done replacing alerts!");
