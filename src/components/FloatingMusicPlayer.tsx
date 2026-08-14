import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  Disc3,
  X,
  Upload,
  Link,
  ListMusic,
  Heart,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { audioEngine, AudioTrackInfo } from '../utils/audioSynthesizer';

interface FloatingMusicPlayerProps {
  variant?: 'floating' | 'navbar';
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  variant = 'floating'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [track, setTrack] = useState<AudioTrackInfo>(audioEngine.getCurrentTrack());
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTrackList, setShowTrackList] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((playing, idx, currentTrack, time, dur) => {
      setIsPlaying(playing);
      setTrackIndex(idx);
      setTrack(currentTrack);
      setCurrentTime(time);
      setDuration(dur);
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.togglePlay();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.nextTrack();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.prevTrack();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    audioEngine.setVolume(val);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume > 0 ? volume : 0.6);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioEngine.seek(val);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      try {
        await audioEngine.setCustomAudioFile(file);
        setUploadSuccess(`Uploaded: ${file.name}`);
        setTimeout(() => setUploadSuccess(null), 3000);
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      audioEngine.setCustomAudioUrl(customUrlInput.trim(), 'Custom Audio Stream');
      setShowUrlInput(false);
      setCustomUrlInput('');
      setUploadSuccess('Audio URL Loaded!');
      setTimeout(() => setUploadSuccess(null), 3000);
    }
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const allTracks = audioEngine.getTracks();

  // If in navbar mode, container is relative to sit in flex header flow
  const isNavbar = variant === 'navbar';

  return (
    <div
      ref={containerRef}
      aria-label="Music Player Controls"
      className={`relative ${
        isNavbar
          ? 'inline-flex items-center'
          : 'fixed top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 flex flex-col items-end pointer-events-auto'
      }`}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Button Trigger (Navbar sized or floating pill) */}
      <button
        id={isNavbar ? 'navbar-music-toggle-btn' : 'floating-music-toggle-btn'}
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group relative flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer select-none shrink-0 ${
          isNavbar
            ? `h-8 w-8 sm:w-auto sm:h-9 sm:px-2.5 rounded-full border text-xs gap-1.5 ${
                isPlaying
                  ? 'border-[#E8899D] bg-[#2A101B] text-[#FFF3EF] shadow-[0_0_12px_rgba(232,137,157,0.4)]'
                  : 'border-[#E8899D]/40 bg-[#2A101B]/80 hover:bg-[#2A101B] text-[#F7B8C5] hover:text-[#FFF3EF]'
              }`
            : `h-9 sm:h-10 px-3 sm:px-3.5 rounded-full border glass-panel-pill gap-2 ${
                isPlaying
                  ? 'border-[#E8899D] shadow-[0_0_18px_rgba(232,137,157,0.5)] bg-[#2A101B]/95 text-[#FFF3EF]'
                  : 'border-white/20 hover:border-[#E8899D]/60 bg-[#1C0B13]/90 text-[#F7B8C5]'
              }`
        }`}
        title={isPlaying ? 'Music is playing (Click to manage music)' : 'Music is paused (Click to open player)'}
        aria-label="Toggle romantic music player"
      >
        <div className="relative flex items-center justify-center">
          <Disc3
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F7B8C5] transition-transform duration-700 ${
              isPlaying ? 'animate-[spin_4s_linear_infinite] text-[#E8899D]' : ''
            }`}
          />
          {isPlaying && (
            <span className="absolute w-1 h-1 rounded-full bg-[#FFF3EF] glow-heart" />
          )}
        </div>

        <span className="hidden sm:inline text-[11px] sm:text-xs font-semibold tracking-wide">
          {isPlaying ? 'Music' : 'Music Off'}
        </span>

        {/* Pulsing indicator dot */}
        {isPlaying && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8899D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F7B8C5]"></span>
          </span>
        )}
      </button>

      {/* Backdrop for closing dropdown when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Expanded Luxury Music Player Dropdown Card */}
      {isExpanded && (
        <div
          id="floating-music-expanded-card"
          className="absolute top-full right-0 mt-2.5 w-[310px] sm:w-[350px] rounded-2xl glass-panel border border-[#E8899D]/40 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-[#FFF3EF] animate-in fade-in zoom-in-95 duration-200 z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8899D]/20 pb-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-[#F7B8C5] font-medium tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
              <span>Background Soundtrack</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="toggle-tracklist-btn"
                type="button"
                onClick={() => setShowTrackList(!showTrackList)}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  showTrackList ? 'bg-[#E8899D] text-[#12080D] font-bold' : 'text-white/70 hover:bg-white/10'
                }`}
                title="Choose song / track"
              >
                <ListMusic className="w-4 h-4" />
              </button>
              <button
                id="close-music-card-btn"
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close music player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Upload Notification Badge */}
          {uploadSuccess && (
            <div className="mb-3 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{uploadSuccess}</span>
            </div>
          )}

          {/* Track List Drawer */}
          {showTrackList ? (
            <div className="space-y-1.5 mb-3 max-h-56 overflow-y-auto pr-1">
              <p className="text-[11px] uppercase tracking-wider text-[#F7B8C5]/70 font-semibold mb-1">
                Select Soundtrack &amp; Saved Music
              </p>
              {allTracks.map((t, idx) => (
                <div
                  key={t.id}
                  className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2 border ${
                    trackIndex === idx
                      ? 'bg-[#E8899D]/25 border-[#E8899D] text-[#FFF3EF] shadow-[0_0_10px_rgba(232,137,157,0.3)]'
                      : 'bg-white/5 border-transparent hover:bg-white/10 text-white/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.selectTrack(idx);
                      setShowTrackList(false);
                    }}
                    className="min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold truncate">{t.name}</p>
                      {t.type === 'custom' && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 text-[9px] font-semibold">
                          Saved
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#F7B8C5]/70 truncate">{t.artist}</p>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {trackIndex === idx && (
                      <Heart className="w-3.5 h-3.5 text-[#E8899D] fill-[#E8899D]" />
                    )}
                    {t.type === 'custom' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove "${t.name}" from saved music?`)) {
                            audioEngine.deleteCustomTrack(t.id);
                          }
                        }}
                        className="p-1 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete saved song"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Vinyl Animation & Track Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#12080D] via-[#2A101B] to-[#3A1422] border-2 border-[#E8899D]/50 flex items-center justify-center shadow-inner flex-shrink-0">
                  <Disc3
                    className={`w-8 h-8 text-[#E8899D]/80 ${
                      isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''
                    }`}
                  />
                  <div className="absolute w-3.5 h-3.5 rounded-full bg-[#E8899D] flex items-center justify-center text-[7px] text-[#12080D] font-bold">
                    ❤️
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#FFF3EF] truncate font-serif">
                    {track?.name || 'Our Love Song'}
                  </p>
                  <p className="text-xs text-[#F7B8C5]/80 truncate">
                    {track?.artist || 'Proposal Symphony'}
                  </p>

                  {/* Equalizer Visualizer Bars */}
                  <div className="flex items-end gap-1 h-3 mt-1">
                    {[40, 75, 100, 60, 85, 45, 90].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-[#E8899D] rounded-full transition-all duration-300"
                        style={{
                          height: isPlaying ? `${h * (0.4 + (i % 3) * 0.3)}%` : '20%',
                          opacity: isPlaying ? 0.9 : 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Seek Bar */}
              {duration > 0 && (
                <div className="mb-3 space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.5"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E8899D]"
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#F7B8C5]/70 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Player Main Controls */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <button
              id="music-prev-btn"
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#FFF3EF] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous romantic track"
            >
              <SkipBack className="w-4 h-4 text-[#F7B8C5]" />
            </button>

            <button
              id="music-main-play-btn"
              type="button"
              onClick={handleTogglePlay}
              className="p-3 rounded-full bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] shadow-[0_0_20px_rgba(232,137,157,0.6)] transition-all hover:scale-110 active:scale-95 flex items-center justify-center font-bold cursor-pointer"
              aria-label={isPlaying ? 'Pause music' : 'Play romantic music'}
            >
              {isPlaying ? (
                <Pause className="w-4.5 h-4.5 fill-current" />
              ) : (
                <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
              )}
            </button>

            <button
              id="music-next-btn"
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#FFF3EF] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next romantic track"
            >
              <SkipForward className="w-4 h-4 text-[#F7B8C5]" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10 mb-3">
            <button
              id="music-mute-btn"
              type="button"
              onClick={handleToggleMute}
              className="text-[#F7B8C5] hover:text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              id="music-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E8899D]"
              aria-label="Adjust volume"
            />
            <span className="text-[10px] text-[#F7B8C5] font-mono w-6 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Custom Audio Upload & Link Section */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#E8899D]/20 hover:bg-[#E8899D]/30 border border-[#E8899D]/40 text-[#FFF3EF] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#D8A06C]" />
                <span>Upload Music</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#F7B8C5] flex items-center gap-1 transition-colors cursor-pointer"
                title="Paste Audio Link"
              >
                <Link className="w-3.5 h-3.5" />
                <span>Link URL</span>
              </button>
            </div>

            {showUrlInput && (
              <form onSubmit={handleApplyUrl} className="flex gap-1.5 mt-1 animate-in fade-in">
                <input
                  type="url"
                  placeholder="Paste direct .mp3 / audio URL..."
                  value={customUrlInput}
                  onChange={e => setCustomUrlInput(e.target.value)}
                  className="flex-1 bg-[#12080D] border border-[#E8899D]/40 rounded-xl px-2.5 py-1.5 text-xs text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] font-bold text-xs shrink-0 cursor-pointer"
                >
                  Play
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
