// Script pour mettre à jour automatiquement structure.json
// Utiliser avec: node update-structure.js

const fs = require('fs');
const path = require('path');

function scanDirectory(dir, basePath = '') {
    const structure = {};
    
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
            if (item.isDirectory()) {
                const dirPath = path.join(dir, item.name);
                const relativePath = path.join(basePath, item.name);
                
                // Scanner récursivement
                const subStructure = scanDirectory(dirPath, relativePath);
                
                // Organiser selon la hiérarchie semaine/domaine
                if (item.name.startsWith('semaine-') || item.name === 'test-final') {
                    structure[item.name] = scanSemaine(dirPath);
                }
            }
        }
    } catch (error) {
        console.error(`Erreur lors du scan de ${dir}:`, error);
    }
    
    return structure;
}

function scanSemaine(semaineDir) {
    const semaineStructure = {};
    
    try {
        const items = fs.readdirSync(semaineDir, { withFileTypes: true });
        
        for (const item of items) {
            if (item.isDirectory()) {
                // C'est un domaine (electronique, it, mecanique)
                const domainePath = path.join(semaineDir, item.name);
                semaineStructure[item.name] = scanDomain(domainePath, semaineDir, item.name);
            } else if (item.isFile() && item.name.endsWith('.md')) {
                // Fichier direct dans la semaine (pour test-final)
                if (!Array.isArray(semaineStructure)) {
                    // Convertir en array pour test-final
                    const files = [];
                    const mdFiles = items.filter(i => i.isFile() && i.name.endsWith('.md'));
                    
                    mdFiles.forEach(file => {
                        files.push({
                            name: file.name,
                            title: generateTitle(file.name),
                            path: `Documentation/${path.basename(semaineDir)}/${file.name}`
                        });
                    });
                    
                    return files;
                }
            }
        }
    } catch (error) {
        console.error(`Erreur lors du scan de ${semaineDir}:`, error);
    }
    
    return semaineStructure;
}

function scanDomain(domainDir, semaineDir, domainName) {
    const files = [];
    
    try {
        const items = fs.readdirSync(domainDir, { withFileTypes: true });
        
        items.forEach(item => {
            if (item.isFile() && item.name.endsWith('.md')) {
                files.push({
                    name: item.name,
                    title: generateTitle(item.name),
                    path: `Documentation/${path.basename(semaineDir)}/${domainName}/${item.name}`
                });
            }
        });
    } catch (error) {
        console.error(`Erreur lors du scan de ${domainDir}:`, error);
    }
    
    return files;
}

function generateTitle(filename) {
    return filename
        .replace('.md', '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Exécution principale
function updateStructureJson() {
    const documentationPath = path.join(__dirname, '..', 'Documentation');
    
    if (!fs.existsSync(documentationPath)) {
        console.error('Dossier Documentation non trouvé');
        return;
    }
    
    console.log('Scan du dossier Documentation...');
    const structure = scanDirectory(documentationPath);
    
    // Écrire le fichier structure.json
    const outputPath = path.join(__dirname, 'structure.json');
    fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2));
    
    console.log('structure.json mis à jour avec succès!');
    console.log('Structure détectée:', JSON.stringify(structure, null, 2));
}

// Exporter pour utilisation
if (require.main === module) {
    updateStructureJson();
}

module.exports = { updateStructureJson, scanDirectory };
