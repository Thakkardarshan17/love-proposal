const fs = require('fs');
const modalFile = 'src/components/CustomizationModal.tsx';
let modalCode = fs.readFileSync(modalFile, 'utf8');

// Hook into deleteCustomTrack
modalCode = modalCode.replace(
  /onClick=\{\(\) => \{\n\s*e\.stopPropagation\(\);\n\s*if \(confirm\('Remove this custom track\?'\)\) \{\n\s*audioEngine\.deleteCustomTrack\(t\.id\);\n\s*\}\n\s*\}\}/g,
  `onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Remove this custom track?')) {
                                  audioEngine.deleteCustomTrack(t.id).then(() => {
                                      const newConfig = { ...formData, selectedTrackId: audioEngine.getCurrentTrack().id };
                                      setFormData(newConfig);
                                      onSaveConfig(newConfig);
                                  });
                                }
                              }}`
);

// Hook into handleAudioUpload (for files)
modalCode = modalCode.replace(
  /await audioEngine\.setCustomAudioFile\(file\);\s*setAudioSuccess\(`Loaded: \$\{file\.name\}`\);\s*setTimeout\(\(\) => setAudioSuccess\(null\), 3000\);/g,
  `const trackId = await audioEngine.setCustomAudioFile(file);
        setAudioSuccess(\`Loaded: \${file.name}\`);
        const newConfig = { ...formData, selectedTrackId: trackId };
        setFormData(newConfig);
        onSaveConfig(newConfig);
        setTimeout(() => setAudioSuccess(null), 3000);`
);

// Hook into selectTrack (for clicking on tracks list)
modalCode = modalCode.replace(
  /onClick=\{\(\) => audioEngine\.selectTrack\(idx\)\}/g,
  `onClick={() => {
                          audioEngine.selectTrack(idx);
                          const newConfig = { ...formData, selectedTrackId: tracks[idx].id };
                          setFormData(newConfig);
                          onSaveConfig(newConfig);
                        }}`
);


fs.writeFileSync(modalFile, modalCode);
