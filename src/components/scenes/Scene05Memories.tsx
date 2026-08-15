import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, ChevronRight, Eye, Camera, Plus, Upload, Video, Film, Play } from 'lucide-react';
import gsap from 'gsap';
import { MemoryItem } from '../../types';
import { compressMultipleImages } from '../../utils/imageUtils';
import { getRealtimeDateTimeString, getRealtimeLocation } from '../../utils/dateTimeLocation';

interface Scene05MemoriesProps {
  memories: MemoryItem[];
  onSelectMemory: (memory: MemoryItem) => void;
  onEditMemory?: (memory: MemoryItem) => void;
  onAddNewMemory?: () => void;
  onAddMultipleMemories?: (items: MemoryItem[]) => void;
  onNext: () => void;
}

export const Scene05Memories: React.FC<Scene05MemoriesProps> = ({
  memories,
  onSelectMemory,
  onEditMemory,
  onAddNewMemory,
  onAddMultipleMemories,
  onNext
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.memories-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    ).fromTo(
      '.polaroid-item',
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'back.out(1.4)' },
      '-=0.4'
    );

    return () => {
      tl.kill();
    };
  }, [memories.length]);

  const handleBatchFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onAddMultipleMemories) return;

    try {
      setIsProcessingBatch(true);
      const compressedUrls = await compressMultipleImages(files);
      const realTimeDate = getRealtimeDateTimeString();
      const realTimeLocation = await getRealtimeLocation();
      const newItems: MemoryItem[] = compressedUrls.map((url, idx) => {
        const file = files[idx];
        const cleanName = file ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : `Dream ${idx + 1}`;
        const title = cleanName.length > 2 ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : `Dream Moment ${idx + 1}`;
        return {
          id: `mem-${Date.now()}-${idx}`,
          title,
          description: 'Every moment spent with you is a memory I treasure forever.',
          date: realTimeDate,
          location: realTimeLocation,
          image: url,
          mediaType: 'image',
          rotationDeg: (idx % 2 === 0 ? -1 : 1) * ((idx % 3) + 1.5),
          badge: 'Dream'
        };
      });
      onAddMultipleMemories(newItems);
    } catch (err) {
      console.error('Batch image upload error:', err);
    } finally {
      setIsProcessingBatch(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section
      ref={containerRef}
      id="scene-05-memories"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-3 sm:px-6 pt-24 sm:pt-26 pb-6 sm:pb-10 bg-gradient-to-b from-[var(--c-bg-darkest)] via-[var(--c-bg-dark)] to-[var(--c-bg-darker)] overflow-hidden z-20"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] rounded-full bg-[var(--c-accent-main)]/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] rounded-full bg-[var(--c-accent-gold)]/10 blur-[100px] pointer-events-none" />

      {/* Hidden batch upload file input for photos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleBatchFileChange}
      />

      {/* Header */}
      <div className="memories-header text-center pt-1 mb-2 max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--c-bg-dark)] border border-[var(--c-accent-main)]/30 text-xs text-[var(--c-accent-light)] mb-2 font-medium">
          <Sparkles className="w-3 h-3 text-[var(--c-accent-gold)]" />
          <span>{memories.length} Captured Dream Photos ✨ (No Limit)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--c-text-main)] tracking-wide flex items-center justify-center gap-2">
          <span>Our Beautiful</span>
          <span className="text-gradient-rose">Dreams</span>
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--c-accent-main)] fill-[var(--c-accent-main)] animate-pulse-heart inline" />
        </h2>
        <p className="text-xs sm:text-sm text-[var(--c-accent-light)]/80 mt-1 font-light">
          Tap any dream Polaroid to view uncropped photo &amp; read its story
        </p>

        {/* Quick Action Buttons */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
          {onAddNewMemory && (
            <button
              id="header-add-single-dream-btn"
              onClick={onAddNewMemory}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--c-accent-main)]/20 hover:bg-[var(--c-accent-main)]/35 border border-[var(--c-accent-main)]/40 text-xs text-[var(--c-accent-light)] hover:text-[var(--c-text-main)] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
              <span>+ Add Photo Dream</span>
            </button>
          )}

          {onAddMultipleMemories && (
            <button
              id="header-batch-upload-dreams-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingBatch}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--c-accent-main)]/30 to-[var(--c-accent-gold)]/30 hover:from-[var(--c-accent-main)]/50 hover:to-[var(--c-accent-gold)]/50 border border-[var(--c-accent-gold)]/40 text-xs text-[var(--c-text-main)] transition-all cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
              <span>{isProcessingBatch ? 'Processing Photos...' : '+ Batch Upload Photos'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive & Scrollable Polaroid Collage Grid for Unlimited Photos & Videos */}
      <div className="w-full max-w-4xl mx-auto my-auto max-h-[58vh] sm:max-h-[64vh] overflow-y-auto pr-1 pl-1 py-2 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 py-2 px-1">
          {memories.map((mem, idx) => {
            const isVideo = mem.mediaType === 'video' || !!mem.videoUrl || !!mem.videoEmbedUrl;
            return (
              <div
                key={mem.id || idx}
                onClick={() => onSelectMemory(mem)}
                className="polaroid-item relative group cursor-pointer"
                style={{
                  transform: `rotate(${mem.rotationDeg || 0}deg)`
                }}
              >
                {/* Polaroid Framed Card */}
                <div className="polaroid-card rounded-xl border border-black/10 transform transition-all duration-300 group-hover:scale-105 group-hover:z-30 group-hover:rotate-0 shadow-lg">
                  {/* Tape Badge */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-3.5 sm:h-4 bg-[var(--c-text-main)]/85 border border-[var(--c-accent-gold)]/40 rotate-[-3deg] shadow-xs z-10 opacity-90 rounded-xs" />

                  {/* Photo or Video Poster */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[var(--c-bg-dark)] mb-2">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />

                    {/* Video Indicator Pill */}
                    {isVideo && (
                      <div className="absolute top-1.5 left-1.5 bg-black/75 text-[var(--c-accent-light)] px-1.5 py-0.5 rounded-md text-[10px] font-mono flex items-center gap-1 border border-white/20 z-10">
                        <Video className="w-2.5 h-2.5 text-[var(--c-accent-gold)]" />
                        <span>Video</span>
                      </div>
                    )}

                    {/* Hover & Center Play Overlay */}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <div className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-[var(--c-accent-main)] hover:text-[var(--c-bg-darkest)] transition-colors">
                        {isVideo ? <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>
                      {onEditMemory && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onEditMemory(mem);
                          }}
                          className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-[var(--c-accent-gold)] hover:text-[var(--c-bg-darkest)] transition-colors cursor-pointer"
                          title={isVideo ? 'Edit video details' : 'Change photo'}
                        >
                          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Handwritten style caption */}
                  <div className="text-center px-1 pb-1">
                    <p className="text-xs sm:text-sm font-script text-[var(--c-bg-dark)] font-bold truncate">
                      {mem.title}
                    </p>
                    <p className="text-[9px] text-[var(--c-bg-dark)]/70 font-sans tracking-tight truncate flex items-center justify-center gap-1">
                      {isVideo && <Film className="w-2.5 h-2.5 text-[var(--c-bg-dark)]" />}
                      <span>{mem.date}</span>
                    </p>
                    {mem.location && (
                      <p className="text-[8px] text-[var(--c-bg-dark)]/60 font-sans tracking-tight truncate flex items-center justify-center gap-0.5 mt-0.5">
                        <span>📍</span>
                        <span>{mem.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Persistent "Add New Dream" Polaroid Tile (Always available - No Limit) */}
          {onAddNewMemory && (
            <div
              onClick={onAddNewMemory}
              className="polaroid-item relative group cursor-pointer"
              style={{ transform: 'rotate(2deg)' }}
            >
              <div className="polaroid-card rounded-xl border-2 border-dashed border-[var(--c-accent-main)]/40 bg-[var(--c-text-main)]/70 hover:bg-[var(--c-text-main)] transform transition-all duration-300 group-hover:scale-105 flex flex-col items-center justify-center p-3 sm:p-4 min-h-[140px] sm:min-h-[160px] shadow-md">
                <div className="p-2.5 sm:p-3 rounded-full bg-[var(--c-accent-main)]/20 text-[var(--c-bg-dark)] mb-1.5 sm:mb-2 group-hover:scale-110 group-hover:bg-[var(--c-accent-main)] transition-all">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-xs font-script font-bold text-[var(--c-bg-dark)] text-center">
                  Add Dream #{memories.length + 1}
                </p>
                <p className="text-[9px] text-[var(--c-bg-dark)]/70 font-sans text-center">
                  Add Photo or Video
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-xs mt-3 pb-2 flex flex-col items-center gap-2">
        <button
          id="memories-continue-btn"
          onClick={onNext}
          className="group w-full py-3 sm:py-3.5 px-6 rounded-full bg-gradient-to-r from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(232,137,157,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Reasons I Love You</span>
          <ChevronRight className="w-4 h-4 text-[var(--c-bg-darkest)] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

