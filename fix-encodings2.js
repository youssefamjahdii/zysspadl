const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hp\\wildrydes-site';

const replacements = {
    'Ã ': 'à',
    'Ãˆ': 'È',
    'Ã¢': 'â',
    // just in case any were missed
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ãª': 'ê',
    'Ã§': 'ç',
    'Ã®': 'î',
    'Ã´': 'ô',
    'Ã‰': 'É',
    'Ã€': 'À',
    'â€™': '\'',
    'â€œ': '"',
    'â€ ': '"',
    'â€“': '-',
    'â€¢': '•',
    'Â©': '©'
};

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            continue;
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            for (const [bad, good] of Object.entries(replacements)) {
                content = content.split(bad).join(good);
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed: ${file}`);
            }
        }
    }
}

processDirectory(dir);
console.log('Done fixing encoding!');
