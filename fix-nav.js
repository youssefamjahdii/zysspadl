const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hp\\wildrydes-site';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // The problematic code in the header looks like this:
    /*
    <li><a href="coach-partners.html">Coaching</a>
                    <a href="psychologie-performance.html" class="footer-link-large">Performance</a></li>
                <li><a href="psychologie-performance.html">Performance</a></li>
    Or with class="active":
    <li><a href="coach-partners.html" class="active">Coaching</a>
                    <a href="psychologie-performance.html" class="footer-link-large">Performance</a></li>
                <li><a href="psychologie-performance.html">Performance</a></li>
    */

    // Let's remove the extra footer-styled link that mistakenly got inside the <li> tag in the header.
    const badRegex = /\n\s+<a href=\"psychologie-performance\.html\" class=\"footer-link-large\">Performance<\/a><\/li>\n\s+<li><a href=\"psychologie-performance\.html\">Performance<\/a><\/li>/g;

    content = content.replace(badRegex, '</li>\n                <li><a href="psychologie-performance.html">Performance</a></li>');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed duplicate nav in: ${file}`);
        count++;
    }
}
console.log(`Done! ${count} files fixed.`);
