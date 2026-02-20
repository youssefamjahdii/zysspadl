const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hp\\wildrydes-site';

const replacements = {
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ã ': 'à',
    'Ãª': 'ê',
    'Ã§': 'ç',
    'Ã®': 'î',
    'Ã´': 'ô',
    'Ã‰': 'É',
    'Ã€': 'À',
    'â€™': '\'',
    'â€œ': '"',
    'â€': '"',
    'â€“': '-',
    'â€¢': '•',
    'Â©': '©',
    'â†’': '→',
    'âœ‰': '✉',
    'â˜Ž': '☎',
    'âš²': '⚲',
    'â–¼': '▼',
    'Ã¯': 'ï'
};

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            continue; // Not recursive right now, or we can make it recursive
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            for (const [bad, good] of Object.entries(replacements)) {
                content = content.split(bad).join(good);
            }
            // Fix double encoding of à which might have a space: 'Ã ' -> 'à'
            // Wait, sometimes à is represented as Ã  (A-tilde followed by non-breaking space)
            // It's safer to use the exact byte sequences if possible, but let's try the common ones.

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed: ${file}`);
            }
        }
    }
}

processDirectory(dir);
console.log('Done fixing encoding!');
