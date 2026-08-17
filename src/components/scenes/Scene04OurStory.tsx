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
import { TimelineEvent, MemoryItem, ProposalConfig } from '../../types';
import { WhereWeMetMap } from '../WhereWeMetMap';

interface Scene04OurStoryProps {
  events: TimelineEvent[];
  config: ProposalConfig;
  onSaveConfig: (updatedConfig: ProposalConfig) => void;
  onNext: () => void;
  onEditEvent?: (event: TimelineEvent) => void;
  onAddNewEvent?: () => void;
  memories?: MemoryItem[];
}

export const Scene04OurStory: React.FC<Scene04OurStoryProps> = ({
  events,
  config,
  onSaveConfig,
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
        return <MessageCircleHeart className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'Smile':
        return <Smile className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'Star':
        return <Star className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-[var(--c-text-main)]" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-[var(--c-text-main)]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[var(--c-text-main)]" />;
    }
  };

  return (
    <section
      ref={containerRef}
      id="scene-04-our-story"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[var(--c-bg-darker)] via-[var(--c-bg-dark)] to-[var(--c-bg-darkest)] overflow-hidden z-20"
    >
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-[var(--c-accent-main)]/15 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="story-title-header text-center pt-2 mb-6 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--c-bg-dark)] border border-[var(--c-accent-main)]/30 text-xs text-[var(--c-accent-light)] mb-2 font-medium">
          <Heart className="w-3 h-3 text-[var(--c-accent-main)] fill-[var(--c-accent-main)]" />
          <span>Timeline Of Us</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--c-text-main)] tracking-wide">
          Our Love Story
        </h2>
        <p className="text-xs sm:text-sm text-[var(--c-accent-light)]/80 mt-1 font-light">
          Every moment that brought my soul to you
        </p>

        {/* Change / Add Story Chapter Action Header Button */}
        {onAddNewEvent && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              id="header-add-story-chapter-btn"
              type="button"
              onClick={onAddNewEvent}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--c-accent-main)]/20 hover:bg-[var(--c-accent-main)]/30 border border-[var(--c-accent-main)]/40 text-xs text-[var(--c-accent-light)] hover:text-[var(--c-text-main)] transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
              <span>Change / Add Story Chapters</span>
            </button>
          </div>
        )}
      </div>

      {/* Where We Met Interactive Map Feature */}
      <div className="w-full max-w-md px-1 py-1 z-10">
        <WhereWeMetMap 
          config={config} 
          onSaveConfig={onSaveConfig} 
        />
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative w-full max-w-md mx-auto my-auto pl-6 sm:pl-8 pr-2">
        {/* Continuous Glowing Vertical Line */}
        <div
          ref={lineRef}
          className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-[2px] bg-gradient-to-b from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] shadow-[0_0_12px_rgba(232,137,157,0.8)]"
        />

        <div className="space-y-5 sm:space-y-6">
          {events.map((event, idx) => (
            <div
              key={event.id || idx}
              className="timeline-card-item relative group"
            >
              {/* Glowing Heart Node on the Line */}
              <div className="absolute -left-[27px] sm:-left-[31px] top-3.5 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[var(--c-accent-main)] to-[var(--c-accent-gold)] border-2 border-[var(--c-bg-darkest)] shadow-[0_0_15px_rgba(232,137,157,0.7)] group-hover:scale-110 transition-transform">
                {getTimelineIcon(event.iconName)}
              </div>

              {/* Event Card */}
              <div className="relative p-4 sm:p-5 rounded-2xl glass-panel border border-[var(--c-accent-main)]/30 shadow-lg hover:border-[var(--c-accent-main)] transition-all duration-300">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--c-accent-gold)] bg-[var(--c-bg-darkest)]/60 px-2 py-0.5 rounded-full border border-[var(--c-accent-gold)]/30">
                    {event.badge || `Chapter 0${idx + 1}`}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--c-accent-light)]/80 font-mono">
                      {event.date}
                    </span>

                    {/* Edit this chapter button */}
                    {onEditEvent && (
                      <button
                        type="button"
                        onClick={() => onEditEvent(event)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-[var(--c-accent-main)] hover:text-[var(--c-bg-darkest)] text-[var(--c-text-main)] transition-colors cursor-pointer"
                        title="Edit this chapter"
                        aria-label={`Edit ${event.title}`}
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-semibold text-[var(--c-text-main)] flex items-center gap-1.5">
                  <span>{event.title}</span>
                  <Heart className="w-3.5 h-3.5 text-[var(--c-accent-main)] fill-[var(--c-accent-main)]/60 inline" />
                </h3>

                {event.subtitle && (
                  <p className="text-xs text-[var(--c-accent-light)] italic mb-2">
                    {event.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[var(--c-text-main)]/85 leading-relaxed">
                  {event.description}
                </p>

                {/* Dream photo thumbnail attached to this chapter */}
                {memories[idx % memories.length] && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--c-accent-gold)]/60 shrink-0 shadow-sm">
                      <img
                        src={memories[idx % memories.length].image}
                        alt={memories[idx % memories.length].title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[var(--c-accent-gold)] font-semibold truncate">
                        {memories[idx % memories.length].title}
                      </p>
                      <p className="text-[9px] text-[var(--c-accent-light)]/70 truncate font-mono">
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
              <div className="absolute -left-[27px] sm:-left-[31px] top-3 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--c-bg-dark)] border-2 border-[var(--c-accent-main)]/50 text-[var(--c-accent-main)]">
                <Plus className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={onAddNewEvent}
                className="w-full p-3.5 rounded-2xl border border-dashed border-[var(--c-accent-main)]/40 bg-white/5 hover:bg-[var(--c-accent-main)]/15 text-left transition-all flex items-center justify-between text-xs text-[var(--c-accent-light)] hover:text-[var(--c-text-main)] cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[var(--c-accent-gold)] group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Add Another Chapter To Our Story</span>
                </div>
                <span className="text-[10px] text-[var(--c-accent-gold)] uppercase font-mono tracking-wider">
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
          className="group w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(232,137,157,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>See Our Beautiful Dreams</span>
          <ChevronRight className="w-4 h-4 text-[var(--c-bg-darkest)] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
