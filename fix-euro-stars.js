const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hp\\wildrydes-site';

const replacements = {
    'â‚¬': '€',
    'â˜…': '★'
};

const files = ['stage-padel.html', 'reviews.html'];

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [bad, good] of Object.entries(replacements)) {
        content = content.split(bad).join(good);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${file}`);
    }
}
console.log('Done!');
