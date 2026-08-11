const fs = require('fs');
const content = fs.readFileSync('app/(authenticated)/lock-in/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('icon') || line.includes('Icon')) {
        console.log(`${i + 1}: ${line}`);
    }
});
