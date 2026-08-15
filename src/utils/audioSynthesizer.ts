/**
 * Romantic Audio Engine with Audio Element streaming, custom uploaded audio files,
 * and Web Audio API synthesizer fallback
 */
import { getAudioFile, saveAudioFile, getAllAudioFiles, deleteAudioFile } from './audioStorage';

export interface AudioTrackInfo {
  id: string;
  name: string;
  artist: string;
  type: 'custom' | 'stream' | 'synth';
  url?: string;
  bpm?: number;
  progression?: {
    bass: number;
    chords: number[];
    melody?: number[];
  }[];
}

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentTrackIndex: number = 0;
  private volume: number = 0.65;
  private masterGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  
  // HTML5 Audio element for custom uploads / streams
  private audioElement: HTMLAudioElement | null = null;
  private objectUrls: Map<string, string> = new Map();
  private currentTime: number = 0;
  private duration: number = 0;

  // Track catalogue: includes high quality romantic instrumental streams + synth presets
  private tracks: AudioTrackInfo[] = [
    {
      id: 'romantic-piano-strings',
      name: 'Our Love Song (Piano & Strings)',
      artist: 'Proposal Romance Symphony',
      type: 'stream',
      // High-quality, warm copyright-free romantic piano & cello background music
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-love-story-piano-112191.mp3'
    },
    {
      id: 'sweet-memories-acoustic',
      name: 'Sweetest Moments (Acoustic Guitar & Piano)',
      artist: 'Acoustic Romance',
      type: 'stream',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=tender-love-10926.mp3'
    },
    {
      id: 'cinematic-love-waltz',
      name: 'Endless Horizon (Cinematic Orchestral)',
      artist: 'Forever Hearts',
      type: 'stream',
      url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_7314d3c332.mp3?filename=love-background-music-8424.mp3'
    },
    {
      id: 'synth-harp-piano',
      name: 'Celestial Harp & Piano (Ambient Synthesizer)',
      artist: 'Harmonic Dreamer',
      type: 'synth',
      bpm: 68,
      progression: [
        { bass: 110.0, chords: [220.0, 261.63, 329.63, 440.0, 523.25], melody: [523.25, 493.88, 440.0, 392.0, 440.0] },
        { bass: 87.31, chords: [174.61, 220.0, 261.63, 349.23, 440.0], melody: [349.23, 392.0, 440.0, 523.25, 659.25] },
        { bass: 130.81, chords: [261.63, 329.63, 392.0, 523.25, 659.25], melody: [659.25, 587.33, 523.25, 493.88, 523.25] },
        { bass: 98.0, chords: [196.0, 246.94, 293.66, 392.0, 493.88], melody: [493.88, 440.0, 392.0, 329.63, 392.0] },
        { bass: 87.31, chords: [174.61, 220.0, 261.63, 329.63, 440.0], melody: [440.0, 523.25, 659.25, 783.99, 659.25] },
        { bass: 98.0, chords: [196.0, 246.94, 293.66, 349.23, 392.0], melody: [587.33, 493.88, 392.0, 440.0, 493.88] },
        { bass: 82.41, chords: [164.81, 196.0, 246.94, 329.63, 392.0], melody: [493.88, 392.0, 329.63, 293.66, 329.63] },
        { bass: 110.0, chords: [220.0, 261.63, 329.63, 440.0, 523.25], melody: [523.25, 659.25, 587.33, 523.25, 440.0] }
      ]
    },
    {
      id: 'synth-eternity',
      name: 'Eternity With You (Music Box Bell)',
      artist: 'Starlight Synthesizer',
      type: 'synth',
      bpm: 60,
      progression: [
        { bass: 130.81, chords: [261.63, 392.0, 523.25, 659.25], melody: [659.25, 783.99, 880.0, 659.25] },
        { bass: 98.0, chords: [196.0, 293.66, 392.0, 493.88], melody: [587.33, 659.25, 783.99, 587.33] },
        { bass: 110.0, chords: [220.0, 329.63, 440.0, 523.25], melody: [523.25, 659.25, 783.99, 523.25] },
        { bass: 87.31, chords: [174.61, 261.63, 349.23, 440.0], melody: [440.0, 523.25, 659.25, 440.0] }
      ]
    }
  ];

  private listeners: ((playing: boolean, trackIdx: number, track: AudioTrackInfo, currentTime: number, duration: number) => void)[] = [];

  constructor() {
    // Restore saved volume if present
    try {
      const savedVol = localStorage.getItem('romantic_music_volume');
      if (savedVol !== null) {
        this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      }
    } catch {}

    // Attempt restoring saved custom audio from IndexedDB and custom URL from localStorage
    if (typeof window !== 'undefined') {
      this.loadSavedCustomAudio();
    }
  }

  private async loadSavedCustomAudio() {
    try {
      // 1. Restore any custom URL saved
      const savedUrl = localStorage.getItem('romantic_custom_audio_url');
      const savedUrlName = localStorage.getItem('romantic_custom_audio_name') || 'Custom Love Song';
      if (savedUrl && savedUrl.trim()) {
        const customTrack: AudioTrackInfo = {
          id: 'custom-url-track',
          name: savedUrlName,
          artist: 'Special Audio Stream ❤️',
          type: 'stream',
          url: savedUrl.trim()
        };
        const existIdx = this.tracks.findIndex(t => t.id === 'custom-url-track');
        if (existIdx >= 0) {
          this.tracks[existIdx] = customTrack;
        } else {
          this.tracks.unshift(customTrack);
        }
      }

      // 2. Restore all uploaded audio files from IndexedDB
      const allSaved = await getAllAudioFiles();
      if (allSaved && allSaved.length > 0) {
        for (const item of allSaved) {
          if (item.blob) {
            let objUrl = this.objectUrls.get(item.id);
            if (!objUrl) {
              objUrl = URL.createObjectURL(item.blob);
              this.objectUrls.set(item.id, objUrl);
            }
            const fileTrack: AudioTrackInfo = {
              id: item.id,
              name: item.name || 'My Uploaded Song',
              artist: 'My Custom Song ❤️',
              type: 'custom',
              url: objUrl
            };
            const existIdx = this.tracks.findIndex(t => t.id === item.id);
            if (existIdx >= 0) {
              this.tracks[existIdx] = fileTrack;
            } else {
              this.tracks.unshift(fileTrack);
            }
          }
        }
      }

      // 3. Restore chosen track selection
      const savedTrackId = localStorage.getItem('romantic_selected_track_id');
      if (savedTrackId) {
        const foundIdx = this.tracks.findIndex(t => t.id === savedTrackId);
        if (foundIdx >= 0) {
          this.currentTrackIndex = foundIdx;
        }
      }

      this.notify();
    } catch (e) {
      console.warn('Failed to restore custom audio tracks:', e);
    }
  }

  public init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (!this.audioElement && typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.loop = false;
      this.audioElement.volume = this.volume;
      this.audioElement.crossOrigin = 'anonymous';

      this.audioElement.ontimeupdate = () => {
        if (this.audioElement) {
          this.currentTime = this.audioElement.currentTime;
          this.duration = this.audioElement.duration || 0;
          this.notify();
        }
      };

      this.audioElement.onended = () => {
        if (this.isPlaying) {
          this.nextTrack();
        }
      };

      this.audioElement.onerror = () => {
        console.warn('Audio stream error, falling back to romantic synthesizer');
        if (this.isPlaying && this.getCurrentTrack().type === 'stream') {
          // Switch to synthesizer track gracefully
          this.currentTrackIndex = this.tracks.findIndex(t => t.type === 'synth');
          if (this.currentTrackIndex === -1) this.currentTrackIndex = 0;
          this.stopAudioElement();
          this.startSequencer();
        }
      };
    }
  }

  public subscribe(cb: (playing: boolean, trackIdx: number, track: AudioTrackInfo, currentTime: number, duration: number) => void) {
    this.listeners.push(cb);
    cb(this.isPlaying, this.currentTrackIndex, this.getCurrentTrack(), this.currentTime, this.duration);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    const current = this.getCurrentTrack();
    this.listeners.forEach(cb => cb(this.isPlaying, this.currentTrackIndex, current, this.currentTime, this.duration));
  }

  public getTracks(): AudioTrackInfo[] {
    return this.tracks;
  }

  public getCurrentTrack(): AudioTrackInfo {
    return this.tracks[this.currentTrackIndex] || this.tracks[0];
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('romantic_music_volume', this.volume.toString());
    } catch {}
    if (!this.audioElement) {
      this.init();
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public seek(seconds: number) {
    if (this.audioElement && this.getCurrentTrack().type !== 'synth') {
      this.audioElement.currentTime = Math.max(0, Math.min(this.duration, seconds));
      this.currentTime = this.audioElement.currentTime;
      this.notify();
    }
  }

  public async setCustomAudioFile(file: File): Promise<string> {
    const trackId = `custom-audio-${Date.now()}`;
    const trackName = file.name.replace(/\.[^/.]+$/, '');
    await saveAudioFile(trackId, trackName, file);

    const blobUrl = URL.createObjectURL(file);
    this.objectUrls.set(trackId, blobUrl);

    const customTrack: AudioTrackInfo = {
      id: trackId,
      name: trackName,
      artist: 'My Uploaded Song ❤️',
      type: 'custom',
      url: blobUrl
    };

    this.tracks.unshift(customTrack);
    this.currentTrackIndex = 0;

    try {
      localStorage.setItem('romantic_selected_track_id', trackId);
      localStorage.setItem('romantic_custom_audio_name', trackName);
    } catch {}

    this.stop();
    this.play();
    return trackId;
  }

  public setCustomAudioUrl(url: string, name: string = 'Custom Love Song', autoPlay: boolean = true) {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    const trackId = 'custom-url-track';
    const customTrack: AudioTrackInfo = {
      id: trackId,
      name: name,
      artist: 'My Special Online Song ❤️',
      type: 'stream',
      url: cleanUrl
    };

    const existingIdx = this.tracks.findIndex(t => t.id === trackId);
    if (existingIdx >= 0) {
      this.tracks[existingIdx] = customTrack;
      this.currentTrackIndex = existingIdx;
    } else {
      this.tracks.unshift(customTrack);
      this.currentTrackIndex = 0;
    }

    try {
      localStorage.setItem('romantic_custom_audio_url', cleanUrl);
      localStorage.setItem('romantic_custom_audio_name', name);
      localStorage.setItem('romantic_selected_track_id', trackId);
    } catch {}

    if (autoPlay) {
      this.stop();
      this.play();
    } else {
      this.notify();
    }
  }

  public async deleteCustomTrack(trackId: string): Promise<void> {
    await deleteAudioFile(trackId);
    const existingUrl = this.objectUrls.get(trackId);
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
      this.objectUrls.delete(trackId);
    }
    this.tracks = this.tracks.filter(t => t.id !== trackId);
    if (this.currentTrackIndex >= this.tracks.length) {
      this.currentTrackIndex = 0;
    }
    const current = this.getCurrentTrack();
    if (current) {
      try {
        localStorage.setItem('romantic_selected_track_id', current.id);
      } catch {}
    }
    if (this.isPlaying) {
      this.stop();
      this.play();
    } else {
      this.notify();
    }
  }

  public selectTrack(index: number) {
    if (index >= 0 && index < this.tracks.length) {
      this.currentTrackIndex = index;
      const track = this.getCurrentTrack();
      try {
        localStorage.setItem('romantic_selected_track_id', track.id);
      } catch {}

      if (this.isPlaying) {
        this.stop();
        this.play();
      } else {
        this.notify();
      }
    }
  }

  public selectTrackById(trackId: string, autoPlay?: boolean) {
    const idx = this.tracks.findIndex(t => t.id === trackId);
    if (idx >= 0) {
      this.currentTrackIndex = idx;
      try {
        localStorage.setItem('romantic_selected_track_id', trackId);
      } catch {}

      if (autoPlay || this.isPlaying) {
        this.stop();
        this.play();
      } else {
        this.notify();
      }
    }
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    this.init();
    const track = this.getCurrentTrack();
    this.isPlaying = true;

    if (track.type === 'stream' || track.type === 'custom') {
      this.stopSynthesizer();
      if (this.audioElement && track.url) {
        if (this.audioElement.src !== track.url) {
          this.audioElement.src = track.url;
        }
        this.audioElement.volume = this.volume;
        this.audioElement.play().catch(err => {
          console.warn('Audio element play blocked by browser policy or error:', err);
          // Fallback to synth if stream fails
          if (track.type === 'stream') {
            this.startSequencer();
          }
        });
      }
    } else {
      this.stopAudioElement();
      this.startSequencer();
    }

    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    this.stopAudioElement();
    this.stopSynthesizer();
    this.notify();
  }

  private stopAudioElement() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  private stopSynthesizer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.activeOscillators = [];
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (this.isPlaying) {
      this.stop();
      this.play();
    } else {
      this.notify();
    }
  }

  public prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    if (this.isPlaying) {
      this.stop();
      this.play();
    } else {
      this.notify();
    }
  }

  public getTrackName(): string {
    return this.getCurrentTrack().name;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Synthesizer logic for offline/ambient mode
  private playTone(freq: number, type: OscillatorType, startTime: number, duration: number, gainVal: number, isPad: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    if (isPad) {
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal * 0.4, startTime + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    } else {
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);

    this.activeOscillators.push(osc);
    setTimeout(() => {
      this.activeOscillators = this.activeOscillators.filter(o => o !== osc);
    }, duration * 1000 + 200);
  }

  private startSequencer() {
    if (!this.ctx) return;
    let step = 0;
    const track = this.getCurrentTrack();
    if (!track.progression || !track.bpm) return;

    const beatSec = 60 / track.bpm;
    const stepDuration = beatSec * 2;

    const scheduleBar = () => {
      if (!this.isPlaying || !this.ctx || this.getCurrentTrack().type !== 'synth') return;
      const progression = track.progression!;
      const currentChord = progression[step % progression.length];
      const now = this.ctx.currentTime + 0.05;

      // Bass pad
      this.playTone(currentChord.bass, 'triangle', now, stepDuration * 1.5, 0.35, true);
      this.playTone(currentChord.bass * 2, 'sine', now, stepDuration * 1.5, 0.2, true);

      // Chords
      currentChord.chords.forEach((freq, idx) => {
        const noteDelay = (idx * beatSec) / 2.5;
        this.playTone(freq, 'sine', now + noteDelay, 2.5, 0.22);
      });

      // Melody
      if (currentChord.melody) {
        currentChord.melody.forEach((freq, idx) => {
          const melodyDelay = (idx * stepDuration) / currentChord.melody!.length;
          this.playTone(freq, 'sine', now + melodyDelay, 1.8, 0.28);
          this.playTone(freq * 2, 'triangle', now + melodyDelay, 1.0, 0.08);
        });
      }

      step++;
    };

    scheduleBar();
    this.timerId = window.setInterval(scheduleBar, stepDuration * 1000);
  }

  // Sound Effects
  public playHeartbeat() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const lub = (t: number, freq: number, g: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);
      gain.gain.setValueAtTime(g, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.25);
    };

    lub(now, 85, 0.6);
    lub(now + 0.22, 65, 0.45);
  }

  public playSparkle() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.2, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.8);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.9);
    });
  }

  public playCelebrationFanfare() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 523.25, d: 0.18, t: 0 },
      { f: 659.25, d: 0.18, t: 0.18 },
      { f: 783.99, d: 0.25, t: 0.36 },
      { f: 1046.5, d: 0.7, t: 0.62 }
    ];

    fanfare.forEach(note => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);
      gain.gain.setValueAtTime(0.4, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.1);
    });
  }
}

export const audioEngine = new RomanticAudioEngine();
