const fs = require('fs');
const modalFile = 'src/components/CustomizationModal.tsx';
let modalCode = fs.readFileSync(modalFile, 'utf8');

console.log("Check audio url logic:");
console.log(modalCode.match(/const handleAudioUrlSubmit[\s\S]*?setTimeout/)[0]);

console.log("\nCheck audio upload file logic:");
console.log(modalCode.match(/const handleAudioUpload[\s\S]*?setTimeout/)[0]);

console.log("\nCheck select track logic:");
console.log(modalCode.match(/onClick=\{\(\) => \{\n\s*audioEngine.selectTrack\(idx\)[\s\S]*?\}\}/)[0]);

console.log("\nCheck delete logic:");
console.log(modalCode.match(/onClick=\{\(e\) => \{\n\s*e\.stopPropagation\(\);\n\s*if \(confirm\(`Remove "\${t\.name}" from saved music\?`\)\) \{[\s\S]*?\}\}/)[0]);
