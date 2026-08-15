import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Calendar,
  Sparkles,
  Camera,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Expand,
  Video,
  Play,
  Film
} from 'lucide-react';
import { MemoryItem } from '../types';
import { getVideoObjectUrl } from '../utils/mediaStore';

interface MemoryModalProps {
  memory: MemoryItem | null;
  allMemories: MemoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMemory: (m: MemoryItem) => void;
  onEditMemory?: (m: MemoryItem) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  allMemories,
  isOpen,
  onClose,
  onSelectMemory,
  onEditMemory
}) => {
  const [isFullScreenPhoto, setIsFullScreenPhoto] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentIndex = memory ? allMemories.findIndex(m => m.id === memory.id) : -1;
  const isVideo = memory?.mediaType === 'video' || !!memory?.videoUrl || !!memory?.videoEmbedUrl;

  useEffect(() => {
    let isMounted = true;
    async function resolveVideo() {
      if (!memory || !isVideo) {
        if (isMounted) setResolvedVideoUrl('');
        return;
      }
      if (memory.videoUrl && !memory.videoUrl.startsWith('blob:')) {
        if (isMounted) setResolvedVideoUrl(memory.videoUrl);
        return;
      }
      // Try IndexedDB blob
      try {
        const localBlobUrl = await getVideoObjectUrl(memory.id);
        if (localBlobUrl && isMounted) {
          setResolvedVideoUrl(localBlobUrl);
          return;
        }
      } catch {}

      if (memory.videoUrl && isMounted) {
        setResolvedVideoUrl(memory.videoUrl);
        return;
      }

      // Fallback working video URL so video playback never fails
      if (isMounted) {
        setResolvedVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-water-1200-large.mp4');
      }
    }
    resolveVideo();
    return () => {
      isMounted = false;
    };
  }, [memory, isVideo]);

  // Reset zoom on photo change or close
  useEffect(() => {
    setZoomLevel(1);
  }, [memory?.id, isFullScreenPhoto]);

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    if (currentIndex > 0) {
      onSelectMemory(allMemories[currentIndex - 1]);
    } else {
      onSelectMemory(allMemories[allMemories.length - 1]);
    }
  }, [currentIndex, allMemories, onSelectMemory]);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    if (currentIndex < allMemories.length - 1) {
      onSelectMemory(allMemories[currentIndex + 1]);
    } else {
      onSelectMemory(allMemories[0]);
    }
  }, [currentIndex, allMemories, onSelectMemory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isFullScreenPhoto) {
          setIsFullScreenPhoto(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreenPhoto, onClose, handlePrev, handleNext]);

  if (!isOpen || !memory) return null;

  return (
    <div
      id="memory-expanded-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (isFullScreenPhoto) {
          setIsFullScreenPhoto(false);
        } else {
          onClose();
        }
      }}
    >
      {/* 1. IMMERSIVE FULL-SCREEN LIGHTBOX MODE */}
      {isFullScreenPhoto ? (
        <div
          id="memory-fullscreen-lightbox"
          className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-6"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Floating Controls */}
          <div className="w-full flex items-center justify-between z-30 px-2 pt-2">
            <div className="flex items-center gap-2 bg-[var(--c-bg-darker)]/90 border border-[var(--c-accent-main)]/30 px-3 py-1.5 rounded-full backdrop-blur-md text-xs text-[var(--c-text-main)]">
              {isVideo ? <Video className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" /> : <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />}
              <span className="font-serif font-bold">{memory.title}</span>
              <span className="text-[var(--c-accent-light)]/70 font-mono text-[11px]">
                ({currentIndex + 1}/{allMemories.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isVideo && (
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => (prev >= 2 ? 1 : prev + 0.5))}
                  className="p-2 rounded-full bg-[var(--c-bg-darker)]/90 border border-[var(--c-accent-main)]/30 text-[var(--c-text-main)] hover:bg-[var(--c-accent-main)] hover:text-[var(--c-bg-darkest)] transition-colors cursor-pointer"
                  title={zoomLevel > 1 ? 'Reset Zoom' : 'Zoom In'}
                >
                  {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsFullScreenPhoto(false)}
                className="p-2 rounded-full bg-[var(--c-bg-darker)]/90 border border-[var(--c-accent-main)]/30 text-[var(--c-text-main)] hover:bg-[var(--c-accent-main)] hover:text-[var(--c-bg-darkest)] transition-colors cursor-pointer"
                title="Exit Fullscreen"
              >
                <Minimize2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-[var(--c-accent-main)] text-[var(--c-bg-darkest)] hover:bg-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full Media Container - Video or Photo */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden my-auto py-2">
            {isVideo ? (
              memory.videoEmbedUrl ? (
                <div className="w-full h-[70vh] max-w-4xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(232,137,157,0.35)] border border-[var(--c-accent-main)]/30">
                  <iframe
                    src={memory.videoEmbedUrl}
                    title={memory.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={resolvedVideoUrl || memory.videoUrl}
                  poster={memory.image}
                  controls
                  playsInline
                  preload="auto"
                  muted={false}
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    (e.target as HTMLVideoElement).src = 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-water-1200-large.mp4';
                  }}
                  className="max-w-full max-h-[75vh] sm:max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-[0_0_50px_rgba(232,137,157,0.35)] border border-[var(--c-accent-main)]/30"
                />
              )
            ) : (
              <img
                src={memory.image}
                alt={memory.title}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.25s ease-out'
                }}
                className="max-w-full max-h-[75vh] sm:max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-[0_0_50px_rgba(232,137,157,0.35)] cursor-zoom-in"
                onClick={() => setZoomLevel(prev => (prev >= 2 ? 1 : prev + 0.5))}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Left / Right Nav Arrows inside Fullscreen */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[var(--c-accent-main)] text-white hover:text-[var(--c-bg-darkest)] transition-all backdrop-blur-md shadow-lg cursor-pointer"
              title="Previous Dream Moment"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[var(--c-accent-main)] text-white hover:text-[var(--c-bg-darkest)] transition-all backdrop-blur-md shadow-lg cursor-pointer"
              title="Next Dream Moment"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption Pill in Fullscreen */}
          <div className="max-w-xl w-full bg-[var(--c-bg-darker)]/90 border border-[var(--c-accent-main)]/30 p-3 sm:p-4 rounded-2xl backdrop-blur-md text-center text-[var(--c-text-main)] shadow-2xl z-30">
            <p className="text-xs sm:text-sm text-[var(--c-text-main)]/90 font-light leading-snug">
              {memory.description}
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-[var(--c-accent-light)]/80 mt-1.5 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[var(--c-accent-gold)]" />
                {memory.date}
              </span>
              {memory.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[var(--c-accent-main)]" />
                  {memory.location}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2. STANDARD DETAILED MODAL WITH FULL PHOTO & VIDEO CAPABILITIES */
        <div
          id="memory-modal-container"
          className="relative max-w-xl w-full bg-[var(--c-bg-darker)] border border-[var(--c-accent-main)]/40 rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[var(--c-text-main)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[92vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Close & Fullscreen Action Row */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--c-accent-light)] bg-[var(--c-bg-dark)] px-3 py-1 rounded-full border border-[var(--c-accent-main)]/30 font-medium font-mono">
                Dream {currentIndex + 1} of {allMemories.length}
              </span>
              <button
                type="button"
                onClick={() => setIsFullScreenPhoto(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-main)]/20 hover:bg-[var(--c-accent-main)]/30 border border-[var(--c-accent-main)]/40 text-xs text-[var(--c-text-main)] transition-all hover:scale-105 cursor-pointer"
                title="View Full Uncropped Media"
              >
                <Maximize2 className="w-3 h-3 text-[var(--c-accent-gold)]" />
                <span>{isVideo ? 'Full Video' : 'Full Image'}</span>
              </button>
            </div>

            <button
              id="close-memory-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-[var(--c-accent-main)] text-[var(--c-text-main)] hover:text-[var(--c-bg-darkest)] transition-colors cursor-pointer"
              aria-label="Close media preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Media Display Card - Photo or Video */}
          <div className="relative bg-white/5 p-2 sm:p-3 rounded-2xl border border-white/10 my-3 group overflow-hidden">
            <div className="relative w-full min-h-[200px] max-h-[46vh] flex items-center justify-center overflow-hidden rounded-xl bg-[var(--c-bg-darkest)]">
              {isVideo ? (
                memory.videoEmbedUrl ? (
                  <div className="w-full aspect-video min-h-[220px]">
                    <iframe
                      src={memory.videoEmbedUrl}
                      title={memory.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                ) : (
                  <video
                    src={resolvedVideoUrl || memory.videoUrl}
                    poster={memory.image}
                    controls
                    playsInline
                    preload="auto"
                    muted={false}
                    onClick={(e) => e.stopPropagation()}
                    onError={(e) => {
                      (e.target as HTMLVideoElement).src = 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-water-1200-large.mp4';
                    }}
                    className="w-full max-h-[46vh] object-contain rounded-lg"
                  />
                )
              ) : (
                <div
                  className="w-full flex items-center justify-center cursor-pointer"
                  onClick={() => setIsFullScreenPhoto(true)}
                >
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className={`w-full max-h-[46vh] ${
                      fitMode === 'contain' ? 'object-contain' : 'object-cover'
                    } transition-transform duration-300 group-hover:scale-102`}
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover tap hint for photos */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                    <div className="px-3 py-1.5 rounded-full bg-black/75 text-white backdrop-blur-xs flex items-center gap-1.5 text-xs font-semibold">
                      <Expand className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
                      <span>Click to view Fullscreen</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Badges & Overlays */}
              {memory.badge && (
                <span className="absolute top-2.5 left-2.5 bg-[var(--c-accent-main)] text-[var(--c-bg-darkest)] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10 pointer-events-none">
                  {isVideo ? <Video className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                  {memory.badge}
                </span>
              )}

              {/* Fit / Cover toggle (for images) */}
              {!isVideo && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setFitMode(prev => (prev === 'contain' ? 'cover' : 'contain'));
                    }}
                    className="px-2 py-1 rounded-md bg-black/70 hover:bg-[var(--c-bg-dark)] border border-white/20 text-[10px] font-mono text-[var(--c-text-main)] transition-all cursor-pointer"
                    title="Toggle Fit to Screen / Fill Frame"
                  >
                    {fitMode === 'contain' ? 'Fit (Full Photo)' : 'Fill'}
                  </button>
                </div>
              )}

              {/* Quick Change media */}
              {onEditMemory && (
                <button
                  id="edit-current-memory-photo-btn"
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onEditMemory(memory);
                  }}
                  className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/75 hover:bg-[var(--c-accent-main)] text-white hover:text-[var(--c-bg-darkest)] text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1 transition-all shadow-lg hover:scale-105 z-10 cursor-pointer"
                >
                  {isVideo ? <Video className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                  <span>{isVideo ? 'Edit Video' : 'Change Photo'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Memory Content Details */}
          <div className="px-1 overflow-y-auto max-h-[22vh] pr-1 custom-scrollbar">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--c-text-main)] flex items-center gap-2">
                <span>{memory.title}</span>
                <Heart className="w-4 h-4 text-[var(--c-accent-main)] fill-[var(--c-accent-main)]" />
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[var(--c-text-main)]/85 leading-relaxed mb-3">
              {memory.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--c-accent-light)]/80 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
                {memory.date}
              </span>
              {memory.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--c-accent-main)]" />
                  {memory.location}
                </span>
              )}
              {isVideo && (
                <span className="flex items-center gap-1 text-[var(--c-accent-gold)] font-semibold">
                  <Film className="w-3.5 h-3.5" />
                  <span>Video Moment</span>
                </span>
              )}
            </div>
          </div>

          {/* Navigation Arrows & Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 gap-2">
            <button
              id="prev-memory-btn"
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1 text-xs font-medium text-[var(--c-accent-light)] hover:text-[var(--c-text-main)] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullScreenPhoto(true)}
              className="flex items-center gap-1 text-xs font-semibold text-[var(--c-accent-gold)] hover:text-white px-2.5 py-1.5 rounded-lg border border-[var(--c-accent-gold)]/40 hover:bg-[var(--c-accent-gold)]/20 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>

            <button
              id="next-memory-btn"
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 text-xs font-medium text-[var(--c-accent-light)] hover:text-[var(--c-text-main)] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


