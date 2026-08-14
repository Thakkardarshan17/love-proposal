import React, { useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  ChevronRight,
  MessageCircleHeart,
  Smile,
  Camera,
  HeartHandshake,
  Edit3,
  Plus,
  Coffee,
  Compass,
  Star,
  MapPin,
  Gift,
  Sun,
  Moon
} from 'lucide-react';
import gsap from 'gsap';
import { TimelineEvent, MemoryItem } from '../../types';

interface Scene04OurStoryProps {
  events: TimelineEvent[];
  onNext: () => void;
  onEditEvent?: (event: TimelineEvent) => void;
  onAddNewEvent?: () => void;
  memories?: MemoryItem[];
}

export const Scene04OurStory: React.FC<Scene04OurStoryProps> = ({
  events,
  onNext,
  onEditEvent,
  onAddNewEvent,
  memories = []
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.story-title-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    if (lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 1.2, ease: 'power1.inOut', transformOrigin: 'top center' },
        '-=0.4'
      );
    }

    tl.fromTo(
      '.timeline-card-item',
      { opacity: 0, x: -25, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 0.7, stagger: 0.2, ease: 'power2.out' },
      '-=0.8'
    );

    return () => {
      tl.kill();
    };
  }, [events]);

  const getTimelineIcon = (iconName?: string) => {
    switch (iconName) {
      case 'MessageCircleHeart':
        return <MessageCircleHeart className="w-4 h-4 text-[#FFF3EF]" />;
      case 'Smile':
        return <Smile className="w-4 h-4 text-[#FFF3EF]" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-[#FFF3EF]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-[#FFF3EF]" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-[#FFF3EF]" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-[#FFF3EF]" />;
      case 'Star':
        return <Star className="w-4 h-4 text-[#FFF3EF]" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-[#FFF3EF]" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-[#FFF3EF]" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-[#FFF3EF]" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-[#FFF3EF]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#FFF3EF]" />;
    }
  };

  return (
    <section
      ref={containerRef}
      id="scene-04-our-story"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[#1C0B13] via-[#2A101B] to-[#12080D] overflow-hidden z-20"
    >
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-[#E8899D]/15 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="story-title-header text-center pt-2 mb-6 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A101B] border border-[#E8899D]/30 text-xs text-[#F7B8C5] mb-2 font-medium">
          <Heart className="w-3 h-3 text-[#E8899D] fill-[#E8899D]" />
          <span>Timeline Of Us</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFF3EF] tracking-wide">
          Our Love Story
        </h2>
        <p className="text-xs sm:text-sm text-[#F7B8C5]/80 mt-1 font-light">
          Every moment that brought my soul to you
        </p>

        {/* Change / Add Story Chapter Action Header Button */}
        {onAddNewEvent && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              id="header-add-story-chapter-btn"
              type="button"
              onClick={onAddNewEvent}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8899D]/20 hover:bg-[#E8899D]/30 border border-[#E8899D]/40 text-xs text-[#F7B8C5] hover:text-[#FFF3EF] transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#D8A06C]" />
              <span>Change / Add Story Chapters</span>
            </button>
          </div>
        )}
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative w-full max-w-md mx-auto my-auto pl-6 sm:pl-8 pr-2">
        {/* Continuous Glowing Vertical Line */}
        <div
          ref={lineRef}
          className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] shadow-[0_0_12px_rgba(232,137,157,0.8)]"
        />

        <div className="space-y-5 sm:space-y-6">
          {events.map((event, idx) => (
            <div
              key={event.id || idx}
              className="timeline-card-item relative group"
            >
              {/* Glowing Heart Node on the Line */}
              <div className="absolute -left-[27px] sm:-left-[31px] top-3.5 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#E8899D] to-[#D8A06C] border-2 border-[#12080D] shadow-[0_0_15px_rgba(232,137,157,0.7)] group-hover:scale-110 transition-transform">
                {getTimelineIcon(event.iconName)}
              </div>

              {/* Event Card */}
              <div className="relative p-4 sm:p-5 rounded-2xl glass-panel border border-[#E8899D]/30 shadow-lg hover:border-[#E8899D] transition-all duration-300">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8A06C] bg-[#12080D]/60 px-2 py-0.5 rounded-full border border-[#D8A06C]/30">
                    {event.badge || `Chapter 0${idx + 1}`}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#F7B8C5]/80 font-mono">
                      {event.date}
                    </span>

                    {/* Edit this chapter button */}
                    {onEditEvent && (
                      <button
                        type="button"
                        onClick={() => onEditEvent(event)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-[#E8899D] hover:text-[#12080D] text-[#FFF3EF] transition-colors cursor-pointer"
                        title="Edit this chapter"
                        aria-label={`Edit ${event.title}`}
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-semibold text-[#FFF3EF] flex items-center gap-1.5">
                  <span>{event.title}</span>
                  <Heart className="w-3.5 h-3.5 text-[#E8899D] fill-[#E8899D]/60 inline" />
                </h3>

                {event.subtitle && (
                  <p className="text-xs text-[#F7B8C5] italic mb-2">
                    {event.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#FFF3EF]/85 leading-relaxed">
                  {event.description}
                </p>

                {/* Dream photo thumbnail attached to this chapter */}
                {memories[idx % memories.length] && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D8A06C]/60 shrink-0 shadow-sm">
                      <img
                        src={memories[idx % memories.length].image}
                        alt={memories[idx % memories.length].title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#D8A06C] font-semibold truncate">
                        {memories[idx % memories.length].title}
                      </p>
                      <p className="text-[9px] text-[#F7B8C5]/70 truncate font-mono">
                        {memories[idx % memories.length].date}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add New Chapter Tile if fewer than 8 chapters */}
          {onAddNewEvent && events.length < 8 && (
            <div className="timeline-card-item relative group">
              <div className="absolute -left-[27px] sm:-left-[31px] top-3 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2A101B] border-2 border-[#E8899D]/50 text-[#E8899D]">
                <Plus className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={onAddNewEvent}
                className="w-full p-3.5 rounded-2xl border border-dashed border-[#E8899D]/40 bg-white/5 hover:bg-[#E8899D]/15 text-left transition-all flex items-center justify-between text-xs text-[#F7B8C5] hover:text-[#FFF3EF] cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#D8A06C] group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Add Another Chapter To Our Story</span>
                </div>
                <span className="text-[10px] text-[#D8A06C] uppercase font-mono tracking-wider">
                  + Add
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Continue Action */}
      <div className="w-full max-w-xs mt-8 pb-4 flex flex-col items-center">
        <button
          id="story-continue-btn"
          onClick={onNext}
          className="group w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(232,137,157,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>See Our Beautiful Dreams</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
