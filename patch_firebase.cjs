const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// Add imports
code = code.replace("import { getAuth, signInAnonymously } from 'firebase/auth';", 
  "import { getAuth, signInAnonymously } from 'firebase/auth';\nimport { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';");

// Add FCM logic
const fcmLogic = `
// --- Firebase Cloud Messaging (Push Notifications) ---
export const initMessaging = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Messaging is not supported in this browser.');
      return null;
    }
    const messaging = getMessaging(app);
    return messaging;
  } catch (err) {
    console.error('Failed to init messaging:', err);
    return null;
  }
};

export const requestNotificationPermission = async (userName: string = 'Partner'): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = await initMessaging();
      if (!messaging) return null;
      
      const vapidKey = (import.meta as any).env?.VITE_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY_HERE';
      
      try {
        const currentToken = await getToken(messaging, { vapidKey });
        if (currentToken) {
          console.log('FCM Token retrieved successfully.');
          // Save token to Firestore
          const tokenDocRef = doc(db, 'fcm_tokens', currentToken);
          await setDoc(tokenDocRef, {
            token: currentToken,
            userName,
            updatedAt: Date.now()
          }, { merge: true });
          return currentToken;
        } else {
          console.warn('No registration token available. Request permission to generate one.');
        }
      } catch (tokenErr) {
        console.error('Error getting FCM token:', tokenErr);
        // Fallback for AI Studio without VAPID key setup
        if (String(tokenErr).includes('VAPID') || String(tokenErr).includes('YOUR_VAPID_KEY_HERE')) {
          console.warn('VAPID key not configured. FCM requires a VAPID key.');
        }
      }
    } else {
      console.warn('Notification permission not granted.');
    }
    return null;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return null;
  }
};

export const onMessageListener = async () => {
  const messaging = await initMessaging();
  if (!messaging) return new Promise((resolve) => resolve(null));
  return onMessage(messaging, (payload) => {
    console.log('Received foreground message:', payload);
    // Could show a local toast here
    return payload;
  });
};
`;

code += "\n" + fcmLogic;

fs.writeFileSync('src/lib/firebase.ts', code);
