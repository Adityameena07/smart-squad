const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
let tags = [];
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // basic naive matching for divs
    let openMatch = line.match(/<div[^>]*>/g);
    let closeMatch = line.match(/<\/div>/g);
    if (openMatch) {
        openMatch.forEach(() => tags.push({line: i+1, type: 'div'}));
    }
    if (closeMatch) {
        closeMatch.forEach(() => {
            if (tags.length > 0) {
                tags.pop();
            } else {
                console.log("Unmatched </div found at line", i+1);
            }
        });
    }
}
console.log("Unclosed tags remaining:", tags.length);
if (tags.length > 0) {
    console.log(tags.slice(-10));
}
