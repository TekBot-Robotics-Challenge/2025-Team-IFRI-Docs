// Script pour mettre à jour automatiquement la structure de navigation
// basée sur les fichiers dans le dossier Documentation

const fs = require('fs');
const path = require('path');

function scanDocumentationFolder() {
    const docPath = path.join(__dirname, 'Documentation');
    const structure = {};
    
    // Scan the Documentation folder recursively
    function scanDir(dir, relativePath = '') {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');
            
            if (fs.statSync(fullPath).isDirectory()) {
                structure[itemRelativePath] = {
                    type: 'folder',
                    children: {}
                };
                scanDir(fullPath, itemRelativePath);
            } else if (item.endsWith('.md')) {
                const parentDir = relativePath || 'root';
                if (!structure[parentDir]) {
                    structure[parentDir] = { type: 'folder', children: {} };
                }
                structure[parentDir].children[item] = {
                    type: 'file',
                    path: `Documentation/${itemRelativePath}`
                };
            }
        });
    }
    
    if (fs.existsSync(docPath)) {
        scanDir(docPath);
    }
    
    return structure;
}

function generateNavigationHTML(structure) {
    // Generate HTML based on the folder structure
    // This would be used to update the sidebar navigation
    console.log('Documentation structure:');
    console.log(JSON.stringify(structure, null, 2));
}

// Run the scan
if (require.main === module) {
    const structure = scanDocumentationFolder();
    generateNavigationHTML(structure);
}

module.exports = { scanDocumentationFolder, generateNavigationHTML };
