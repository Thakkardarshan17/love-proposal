const fs = require('fs');
const appFile = 'src/App.tsx';
let appCode = fs.readFileSync(appFile, 'utf8');

const targetBlock = `// Sync background music URL and track selection across devices
              if (cloudData.config.bgMusicUrl) {
                audioEngine.setCustomAudioUrl(
                  cloudData.config.bgMusicUrl,
                  cloudData.config.bgMusicName || cloudData.config.musicTitle || 'Custom Love Song',
                  false
                );
              }
              if (cloudData.config.selectedTrackId) {
                audioEngine.selectTrackById(cloudData.config.selectedTrackId, false);
              }`;

const replacementBlock = `// Sync background music URL and track selection across devices
              let musicChangedRemotely = false;
              if (cloudData.config.bgMusicUrl) {
                const localUrl = localStorage.getItem('romantic_custom_audio_url');
                if (localUrl !== cloudData.config.bgMusicUrl) {
                  musicChangedRemotely = true;
                }
                audioEngine.setCustomAudioUrl(
                  cloudData.config.bgMusicUrl,
                  cloudData.config.bgMusicName || cloudData.config.musicTitle || 'Custom Love Song',
                  false
                );
              }
              if (cloudData.config.selectedTrackId) {
                const localTrackId = localStorage.getItem('romantic_selected_track_id');
                if (localTrackId !== cloudData.config.selectedTrackId) {
                  musicChangedRemotely = true;
                }
                audioEngine.selectTrackById(cloudData.config.selectedTrackId, false);
              }
              
              if (musicChangedRemotely) {
                 // The user wants an "I love you" message when music changes!
                 showSyncToast("I Love You! ❤️ (Partner played a new song for you)");
              }`;

if (appCode.includes(targetBlock)) {
  appCode = appCode.replace(targetBlock, replacementBlock);
  fs.writeFileSync(appFile, appCode);
  console.log("Patched App.tsx successfully.");
} else {
  console.log("Could not find the target block in App.tsx!");
}
