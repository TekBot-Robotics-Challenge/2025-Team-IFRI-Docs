const fs = require('fs');
const path = require('path');

// Fonction pour scanner récursivement les fichiers markdown
function scanMarkdownFiles(dir, baseDir = '') {
    const files = {};
    
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
            const itemPath = path.join(dir, item.name);
            const relativePath = path.join(baseDir, item.name).replace(/\\/g, '/');
            
            if (item.isDirectory()) {
                // Récursion pour les sous-dossiers
                const subFiles = scanMarkdownFiles(itemPath, relativePath);
                Object.assign(files, subFiles);
            } else if (item.isFile() && item.name.endsWith('.md')) {
                // Ajouter le fichier markdown
                const dirKey = baseDir || 'root';
                if (!files[dirKey]) {
                    files[dirKey] = [];
                }
                files[dirKey].push(item.name);
            }
        }
    } catch (error) {
        console.error(`Erreur lors du scan du dossier ${dir}:`, error);
    }
    
    return files;
}

// Fonction pour générer le fichier d'index JavaScript
function generateFileIndex() {
    const documentationPath = path.join(__dirname, 'Documentation');
    
    if (!fs.existsSync(documentationPath)) {
        console.error('Le dossier Documentation n\'existe pas');
        return;
    }
    
    const fileStructure = scanMarkdownFiles(documentationPath);
    
    // Générer le contenu JavaScript
    const jsContent = `
// Fichier généré automatiquement - Ne pas modifier manuellement
// Dernière mise à jour: ${new Date().toISOString()}

window.DOCUMENT_STRUCTURE = ${JSON.stringify(fileStructure, null, 2)};

// Fonction pour obtenir la structure des fichiers
window.getDocumentStructure = function() {
    return window.DOCUMENT_STRUCTURE;
};
`;
    
    // Écrire le fichier
    const outputPath = path.join(__dirname, 'file-index.js');
    fs.writeFileSync(outputPath, jsContent);
    
    console.log('Index des fichiers généré avec succès:', outputPath);
    console.log('Structure détectée:', fileStructure);
}

// Exécuter la génération
generateFileIndex();

// Exporter pour utilisation en module
module.exports = { scanMarkdownFiles, generateFileIndex };
