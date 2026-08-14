import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, MapPin, Calendar, Sparkles, Camera } from 'lucide-react';
import { MemoryItem } from '../types';

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
  const currentIndex = memory ? allMemories.findIndex(m => m.id === memory.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectMemory(allMemories[currentIndex - 1]);
    } else {
      onSelectMemory(allMemories[allMemories.length - 1]);
    }
  }, [currentIndex, allMemories, onSelectMemory]);

  const handleNext = useCallback(() => {
    if (currentIndex < allMemories.length - 1) {
      onSelectMemory(allMemories[currentIndex + 1]);
    } else {
      onSelectMemory(allMemories[0]);
    }
  }, [currentIndex, allMemories, onSelectMemory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !memory) return null;

  return (
    <div
      id="memory-expanded-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="memory-modal-container"
        className="relative max-w-lg w-full bg-[#1C0B13] border border-[#E8899D]/40 rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#FFF3EF] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-memory-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-[#FFF3EF] hover:bg-[#E8899D] hover:text-[#12080D] transition-colors"
          aria-label="Close photo preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Polaroid Framed Image */}
        <div className="relative bg-white p-3 sm:p-4 rounded-2xl shadow-xl mb-4 group">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#2A101B]">
            <img
              src={memory.image}
              alt={memory.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {memory.badge && (
              <span className="absolute top-3 left-3 bg-[#E8899D] text-[#12080D] text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {memory.badge}
              </span>
            )}

            {onEditMemory && (
              <button
                id="edit-current-memory-photo-btn"
                onClick={() => onEditMemory(memory)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/75 hover:bg-[#E8899D] text-white hover:text-[#12080D] text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-all shadow-lg hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Memory Content */}
        <div className="px-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xl sm:text-2xl font-serif text-[#FFF3EF] flex items-center gap-2">
              <span>{memory.title}</span>
              <Heart className="w-4 h-4 text-[#E8899D] fill-[#E8899D]" />
            </h3>
            <span className="text-xs text-[#F7B8C5] bg-[#2A101B] px-3 py-1 rounded-full border border-[#E8899D]/30 font-medium">
              {currentIndex + 1} of {allMemories.length}
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#FFF3EF]/85 leading-relaxed mb-4">
            {memory.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#F7B8C5]/80 pt-3 border-t border-white/10">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D8A06C]" />
              {memory.date}
            </span>
            {memory.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E8899D]" />
                {memory.location}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Arrows & Actions */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/10 gap-2">
          <button
            id="prev-memory-btn"
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs font-medium text-[#F7B8C5] hover:text-[#FFF3EF] p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {onEditMemory && (
            <button
              id="footer-edit-memory-btn"
              onClick={() => onEditMemory(memory)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#12080D] bg-gradient-to-r from-[#E8899D] to-[#D8A06C] px-3.5 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Dream Photo &amp; Story</span>
            </button>
          )}

          <button
            id="next-memory-btn"
            onClick={handleNext}
            className="flex items-center gap-1 text-xs font-medium text-[#F7B8C5] hover:text-[#FFF3EF] p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
