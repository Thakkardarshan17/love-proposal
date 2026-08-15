const fs = require('fs');
const synthFile = 'src/utils/audioSynthesizer.ts';
let synthCode = fs.readFileSync(synthFile, 'utf8');

// In setCustomAudioUrl
synthCode = synthCode.replace(
  `if (autoPlay) {
      this.stop();
      this.play();
    } else {
      this.notify();
    }`,
  `if (autoPlay || this.isPlaying) {
      this.stop();
      this.play();
    } else {
      this.notify();
    }`
);

fs.writeFileSync(synthFile, synthCode);
