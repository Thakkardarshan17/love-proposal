import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, ChevronRight, Eye, Camera, Plus, Upload, Video, Film, Play } from 'lucide-react';
import gsap from 'gsap';
import { MemoryItem } from '../../types';
import { processMultipleMediaFiles } from '../../utils/imageUtils';

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
      const newItems = await processMultipleMediaFiles(files);
      onAddMultipleMemories(newItems);
    } catch (err) {
      console.error('Batch media upload error:', err);
    } finally {
      setIsProcessingBatch(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section
      ref={containerRef}
      id="scene-05-memories"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-3 sm:px-6 pt-24 sm:pt-26 pb-6 sm:pb-10 bg-gradient-to-b from-[#12080D] via-[#2A101B] to-[#1C0B13] overflow-hidden z-20"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] rounded-full bg-[#E8899D]/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] rounded-full bg-[#D8A06C]/10 blur-[100px] pointer-events-none" />

      {/* Hidden batch upload file input for photos and videos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleBatchFileChange}
      />

      {/* Header */}
      <div className="memories-header text-center pt-1 mb-2 max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A101B] border border-[#E8899D]/30 text-xs text-[#F7B8C5] mb-2 font-medium">
          <Sparkles className="w-3 h-3 text-[#D8A06C]" />
          <span>{memories.length} Captured Dream Moments &amp; Videos ✨ (No Limit)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#FFF3EF] tracking-wide flex items-center justify-center gap-2">
          <span>Our Beautiful</span>
          <span className="text-gradient-rose">Dreams</span>
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#E8899D] fill-[#E8899D] animate-pulse-heart inline" />
        </h2>
        <p className="text-xs sm:text-sm text-[#F7B8C5]/80 mt-1 font-light">
          Tap any dream Polaroid to view uncropped photo, play videos &amp; read its story
        </p>

        {/* Quick Action Buttons */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
          {onAddNewMemory && (
            <button
              id="header-add-single-dream-btn"
              onClick={onAddNewMemory}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E8899D]/20 hover:bg-[#E8899D]/35 border border-[#E8899D]/40 text-xs text-[#F7B8C5] hover:text-[#FFF3EF] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D8A06C]" />
              <span>+ Add Photo / Video</span>
            </button>
          )}

          {onAddMultipleMemories && (
            <button
              id="header-batch-upload-dreams-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingBatch}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#E8899D]/30 to-[#D8A06C]/30 hover:from-[#E8899D]/50 hover:to-[#D8A06C]/50 border border-[#D8A06C]/40 text-xs text-[#FFF3EF] transition-all cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#D8A06C]" />
              <span>{isProcessingBatch ? 'Processing Media...' : '+ Batch Upload Media (Photos & Videos)'}</span>
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
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-3.5 sm:h-4 bg-[#FFF3EF]/85 border border-[#D8A06C]/40 rotate-[-3deg] shadow-xs z-10 opacity-90 rounded-xs" />

                  {/* Photo or Video Poster */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#2A101B] mb-2">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />

                    {/* Video Indicator Pill */}
                    {isVideo && (
                      <div className="absolute top-1.5 left-1.5 bg-black/75 text-[#F7B8C5] px-1.5 py-0.5 rounded-md text-[10px] font-mono flex items-center gap-1 border border-white/20 z-10">
                        <Video className="w-2.5 h-2.5 text-[#D8A06C]" />
                        <span>Video</span>
                      </div>
                    )}

                    {/* Hover & Center Play Overlay */}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <div className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-[#E8899D] hover:text-[#12080D] transition-colors">
                        {isVideo ? <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>
                      {onEditMemory && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onEditMemory(mem);
                          }}
                          className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-[#D8A06C] hover:text-[#12080D] transition-colors cursor-pointer"
                          title={isVideo ? 'Edit video details' : 'Change photo'}
                        >
                          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Handwritten style caption */}
                  <div className="text-center px-1 pb-1">
                    <p className="text-xs sm:text-sm font-script text-[#2A101B] font-bold truncate">
                      {mem.title}
                    </p>
                    <p className="text-[9px] text-[#2A101B]/70 font-sans tracking-tight truncate flex items-center justify-center gap-1">
                      {isVideo && <Film className="w-2.5 h-2.5 text-[#2A101B]" />}
                      <span>{mem.date}</span>
                    </p>
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
              <div className="polaroid-card rounded-xl border-2 border-dashed border-[#E8899D]/40 bg-[#FFF3EF]/70 hover:bg-[#FFF3EF] transform transition-all duration-300 group-hover:scale-105 flex flex-col items-center justify-center p-3 sm:p-4 min-h-[140px] sm:min-h-[160px] shadow-md">
                <div className="p-2.5 sm:p-3 rounded-full bg-[#E8899D]/20 text-[#2A101B] mb-1.5 sm:mb-2 group-hover:scale-110 group-hover:bg-[#E8899D] transition-all">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-xs font-script font-bold text-[#2A101B] text-center">
                  Add Dream #{memories.length + 1}
                </p>
                <p className="text-[9px] text-[#2A101B]/70 font-sans text-center">
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
          className="group w-full py-3 sm:py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(232,137,157,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Reasons I Love You</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

