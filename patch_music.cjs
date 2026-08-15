const fs = require('fs');
const appFile = 'src/App.tsx';
const modalFile = 'src/components/CustomizationModal.tsx';

let appCode = fs.readFileSync(appFile, 'utf8');
let modalCode = fs.readFileSync(modalFile, 'utf8');

// Update CustomizationModal.tsx to call onSaveConfig when music changes
// Replace handleAudioUrlSubmit to update config
modalCode = modalCode.replace(
  /const handleAudioUrlSubmit = \(e: React\.FormEvent\) => {([\s\S]*?)};/g,
  `const handleAudioUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAudioUrl.trim()) {
      const url = customAudioUrl.trim();
      audioEngine.setCustomAudioUrl(url, 'Custom Background Music');
      setCustomAudioUrl('');
      setAudioSuccess('Custom audio stream connected!');
      
      const newConfig = { ...formData, bgMusicUrl: url, bgMusicName: 'Custom Background Music', selectedTrackId: 'custom-url-track' };
      setFormData(newConfig);
      onSaveConfig(newConfig);

      setTimeout(() => setAudioSuccess(null), 3000);
    }
  };`
);

// We need to also hook into selectTrack to update the config. Let's look at how track selection is done in the modal
fs.writeFileSync(modalFile, modalCode);
