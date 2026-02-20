const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hp\\wildrydes-site';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Update nav links: text "Coachs" -> "Coaching"
    content = content
        .split('>Coachs<').join('>Coaching<')
        .split('"coach-partners.html" class="active">Coachs').join('"coach-partners.html" class="active">Coaching');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${file}`);
        count++;
    }
}
console.log(`Done! ${count} files updated.`);
