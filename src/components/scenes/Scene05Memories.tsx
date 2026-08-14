import React, { useEffect, useRef } from 'react';
import { Heart, Sparkles, ChevronRight, Eye, Camera, Plus } from 'lucide-react';
import gsap from 'gsap';
import { MemoryItem } from '../../types';

interface Scene05MemoriesProps {
  memories: MemoryItem[];
  onSelectMemory: (memory: MemoryItem) => void;
  onEditMemory?: (memory: MemoryItem) => void;
  onAddNewMemory?: () => void;
  onNext: () => void;
}

export const Scene05Memories: React.FC<Scene05MemoriesProps> = ({
  memories,
  onSelectMemory,
  onEditMemory,
  onAddNewMemory,
  onNext
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.memories-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    ).fromTo(
      '.polaroid-item',
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.4)' },
      '-=0.4'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-05-memories"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[#12080D] via-[#2A101B] to-[#1C0B13] overflow-hidden z-20"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] rounded-full bg-[#E8899D]/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] rounded-full bg-[#D8A06C]/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="memories-header text-center pt-2 mb-4 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A101B] border border-[#E8899D]/30 text-xs text-[#F7B8C5] mb-2 font-medium">
          <Sparkles className="w-3 h-3 text-[#D8A06C]" />
          <span>Captured Moments &amp; Dreams</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFF3EF] tracking-wide flex items-center justify-center gap-2">
          <span>Our Beautiful</span>
          <span className="text-gradient-rose">Dreams</span>
          <Heart className="w-6 h-6 text-[#E8899D] fill-[#E8899D] animate-pulse-heart inline" />
        </h2>
        <p className="text-xs sm:text-sm text-[#F7B8C5]/80 mt-1 font-light">
          Tap any dream Polaroid photo to open and read its story
        </p>

        {/* Quick Change Photos Button */}
        {onAddNewMemory && (
          <div className="mt-2.5 flex items-center justify-center gap-2">
            <button
              id="header-change-photos-btn"
              onClick={onAddNewMemory}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8899D]/20 hover:bg-[#E8899D]/30 border border-[#E8899D]/40 text-xs text-[#F7B8C5] hover:text-[#FFF3EF] transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-[#D8A06C]" />
              <span>Change / Add Your Dreams</span>
            </button>
          </div>
        )}
      </div>

      {/* Overlapping Polaroid Collage Grid */}
      <div className="w-full max-w-lg mx-auto my-auto grid grid-cols-2 gap-4 sm:gap-6 py-2 px-1">
        {memories.map((mem, idx) => (
          <div
            key={mem.id || idx}
            onClick={() => onSelectMemory(mem)}
            className="polaroid-item relative group cursor-pointer"
            style={{
              transform: `rotate(${mem.rotationDeg}deg)`
            }}
          >
            {/* Polaroid Framed Card */}
            <div className="polaroid-card rounded-xl border border-black/10 transform transition-all duration-300 group-hover:scale-105 group-hover:z-30 group-hover:rotate-0">
              {/* Tape Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#FFF3EF]/85 border border-[#D8A06C]/40 rotate-[-3deg] shadow-xs z-10 opacity-90 rounded-xs" />

              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#2A101B] mb-2.5">
                <img
                  src={mem.image}
                  alt={mem.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <div className="p-2 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-[#E8899D] hover:text-[#12080D] transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                  {onEditMemory && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onEditMemory(mem);
                      }}
                      className="p-2 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-[#D8A06C] hover:text-[#12080D] transition-colors"
                      title="Change photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Handwritten style caption */}
              <div className="text-center px-1">
                <p className="text-xs sm:text-sm font-script text-[#2A101B] font-bold truncate">
                  {mem.title}
                </p>
                <p className="text-[9px] text-[#2A101B]/70 font-sans tracking-tight">
                  {mem.date}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Optional Add Memory Tile if fewer than 8 */}
        {onAddNewMemory && memories.length < 8 && (
          <div
            onClick={onAddNewMemory}
            className="polaroid-item relative group cursor-pointer"
            style={{ transform: 'rotate(2deg)' }}
          >
            <div className="polaroid-card rounded-xl border-2 border-dashed border-[#E8899D]/40 bg-[#FFF3EF]/70 hover:bg-[#FFF3EF] transform transition-all duration-300 group-hover:scale-105 flex flex-col items-center justify-center p-4 min-h-[160px]">
              <div className="p-3 rounded-full bg-[#E8899D]/20 text-[#2A101B] mb-2 group-hover:scale-110 group-hover:bg-[#E8899D] transition-all">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-xs font-script font-bold text-[#2A101B] text-center">
                Add New Dream
              </p>
              <p className="text-[9px] text-[#2A101B]/70 font-sans text-center">
                Your special dream
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-xs mt-6 pb-4 flex flex-col items-center gap-2">
        <button
          id="memories-continue-btn"
          onClick={onNext}
          className="group w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(232,137,157,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Reasons I Love You</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
