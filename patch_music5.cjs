const fs = require('fs');
const modalFile = 'src/components/CustomizationModal.tsx';
let modalCode = fs.readFileSync(modalFile, 'utf8');

modalCode = modalCode.replace(
  `onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(\`Remove "\${t.name}" from saved music?\`)) {
                              audioEngine.deleteCustomTrack(t.id);
                            }
                          }}`,
  `onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(\`Remove "\${t.name}" from saved music?\`)) {
                              audioEngine.deleteCustomTrack(t.id).then(() => {
                                      const newConfig = { ...formData, selectedTrackId: audioEngine.getCurrentTrack().id };
                                      setFormData(newConfig);
                                      onSaveConfig(newConfig);
                                  });
                            }
                          }}`
);
fs.writeFileSync(modalFile, modalCode);
