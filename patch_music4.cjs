const fs = require('fs');
const modalFile = 'src/components/CustomizationModal.tsx';
let modalCode = fs.readFileSync(modalFile, 'utf8');

modalCode = modalCode.replace(
  `onClick={() => {
                        audioEngine.selectTrack(idx);
                        setFormData(prev => ({
                          ...prev,
                          musicTitle: t.name,
                          musicArtist: t.artist,
                          selectedTrackId: t.id
                        }));
                      }}`,
  `onClick={() => {
                        audioEngine.selectTrack(idx);
                        const newConfig = {
                          ...formData,
                          musicTitle: t.name,
                          musicArtist: t.artist,
                          selectedTrackId: t.id
                        };
                        setFormData(newConfig);
                        onSaveConfig(newConfig);
                      }}`
);
fs.writeFileSync(modalFile, modalCode);
