const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hp\\wildrydes-site';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'psychologie-performance.html'); // Exclude new file as it already has it

let count = 0;
for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Add to Header Nav
    // We match both with and without class="active"
    content = content.replace(
        /<li><a href="coach-partners\.html"(.*?)>Coaching<\/a><\/li>/g,
        '<li><a href="coach-partners.html"$1>Coaching</a></li>\n                <li><a href="psychologie-performance.html">Performance</a></li>'
    );

    // Add to Footer Nav
    content = content.replace(
        /<a href="coach-partners\.html"(.*?)>Coaching<\/a>/g,
        '<a href="coach-partners.html"$1>Coaching</a>\n                    <a href="psychologie-performance.html" class="footer-link-large">Performance</a>'
    );

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated nav in: ${file}`);
        count++;
    } else {
        console.log(`No changes made to: ${file}`);
    }
}
console.log(`Done! ${count} files updated.`);
