const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// Revert imports
code = code.replace("import { getAuth, signInAnonymously } from 'firebase/auth';\nimport { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';", 
  "import { getAuth, signInAnonymously } from 'firebase/auth';");

// Remove FCM Logic block
const fcmIndex = code.indexOf('// --- Firebase Cloud Messaging (Push Notifications) ---');
if (fcmIndex !== -1) {
  code = code.substring(0, fcmIndex).trimEnd() + '\n';
}

fs.writeFileSync('src/lib/firebase.ts', code);
