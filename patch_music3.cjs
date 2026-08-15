const fs = require('fs');
const modalFile = 'src/components/CustomizationModal.tsx';
let modalCode = fs.readFileSync(modalFile, 'utf8');

// The regex might have failed due to spacing/indentation. Let's do a simple string replacement.
modalCode = modalCode.replace(
  'onClick={() => audioEngine.selectTrack(idx)}',
  `onClick={() => {
                          audioEngine.selectTrack(idx);
                          const newConfig = { ...formData, selectedTrackId: tracks[idx].id };
                          setFormData(newConfig);
                          onSaveConfig(newConfig);
                        }}`
);

modalCode = modalCode.replace(
  `onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Remove this custom track?')) {
                                  audioEngine.deleteCustomTrack(t.id);
                                }
                              }}`,
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

fs.writeFileSync(modalFile, modalCode);
