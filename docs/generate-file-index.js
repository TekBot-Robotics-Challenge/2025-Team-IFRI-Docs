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
        // Créer une structure basée sur ce qui existe vraiment
        const fallbackStructure = {
            'root': fs.existsSync(path.join(__dirname, 'Documentation/index.md')) ? ['index.md'] : [],
            'semaine-1': {}
        };
        
        // Vérifier semaine-1/electronique
        const elecPath = path.join(__dirname, 'Documentation/semaine-1/electronique');
        if (fs.existsSync(elecPath)) {
            fallbackStructure['semaine-1']['electronique'] = fs.readdirSync(elecPath).filter(f => f.endsWith('.md'));
        }
        
        // Générer avec la structure fallback
        generateIndexFile(fallbackStructure);
        return;
    }
    
    const fileStructure = scanMarkdownFiles(documentationPath);
    generateIndexFile(fileStructure);
}

function generateIndexFile(structure) {
    const jsContent = `
// Fichier généré automatiquement - Ne pas modifier manuellement
// Dernière mise à jour: ${new Date().toISOString()}

window.DOCUMENT_STRUCTURE = ${JSON.stringify(structure, null, 2)};

// Fonction pour obtenir la structure des fichiers
window.getDocumentStructure = function() {
    console.log('Structure chargée:', window.DOCUMENT_STRUCTURE);
    return window.DOCUMENT_STRUCTURE;
};
`;
    
    const outputPath = path.join(__dirname, 'file-index.js');
    fs.writeFileSync(outputPath, jsContent);
    
    console.log('Index des fichiers généré avec succès:', outputPath);
    console.log('Structure détectée:', structure);
}

// Exécuter la génération
generateFileIndex();

// Exporter pour utilisation en module
module.exports = { scanMarkdownFiles, generateFileIndex };
