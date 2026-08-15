import React, { useEffect, useRef } from 'react';
import { Heart, ChevronDown, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface Scene03RomanticIntroProps {
  onNext: () => void;
  partnerName?: string;
}

export const Scene03RomanticIntro: React.FC<Scene03RomanticIntroProps> = ({
  onNext,
  partnerName = 'YOU'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.intro-phrase-1',
      { opacity: 0, y: 25, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' }
    )
    .fromTo(
      '.intro-phrase-2',
      { opacity: 0, y: 20, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
      '+=0.2'
    )
    .fromTo(
      '.intro-phrase-3',
      { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'back.out(1.5)' },
      '+=0.2'
    )
    .fromTo(
      '.intro-phrase-4',
      { opacity: 0, scale: 0.6, y: 15 },
      { opacity: 1, scale: 1.15, y: 0, duration: 1.0, ease: 'elastic.out(1, 0.4)' },
      '+=0.3'
    )
    .fromTo(
      '.intro-next-btn',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '+=0.2'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-03-romantic-intro"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[var(--c-bg-dark)] via-[var(--c-bg-light)] to-[var(--c-bg-darker)] text-center overflow-hidden z-20"
    >
      {/* Soft warm pink glow backing */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[550px] h-[340px] sm:h-[550px] rounded-full bg-gradient-to-tr from-[var(--c-accent-main)]/25 to-[var(--c-accent-light)]/20 blur-[110px] pointer-events-none" />

      {/* Top chapter tag */}
      <div className="pt-4 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--c-accent-light)]/70 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
        <span>A Serendipitous Destiny</span>
        <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
      </div>

      {/* Cinematic Text Reveal Center */}
      <div className="relative my-auto flex flex-col items-center max-w-sm sm:max-w-lg space-y-6">
        <p className="intro-phrase-1 text-xl sm:text-2xl font-light text-[var(--c-text-main)]/90 font-serif leading-relaxed">
          There are millions of people <br />
          <span className="text-[var(--c-accent-light)] italic">in this vast world...</span>
        </p>

        <p className="intro-phrase-2 text-lg sm:text-xl font-cormorant italic text-[var(--c-accent-gold)] tracking-wide">
          But somehow, through all of time and space...
        </p>

        <p className="intro-phrase-3 text-2xl sm:text-3xl font-serif text-[var(--c-text-main)] font-light">
          I found
        </p>

        <div className="intro-phrase-4 relative flex flex-col items-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-gradient-rose tracking-wider drop-shadow-[0_0_35px_rgba(232,137,157,0.7)]">
              {partnerName.toUpperCase()}
            </span>
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[var(--c-accent-main)] fill-[var(--c-accent-main)] animate-pulse-heart inline-block ml-1" />
          </div>
          <span className="text-sm sm:text-base md:text-lg text-[var(--c-accent-light)] font-script text-2xl sm:text-3xl mt-3 tracking-wide">
            My one in eight billion
          </span>
        </div>
      </div>

      {/* Next/Down Circular Indicator Button */}
      <div className="intro-next-btn pb-4 flex flex-col items-center">
        <button
          id="intro-next-scene-btn"
          onClick={onNext}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full glass-panel border border-[var(--c-accent-main)]/40 text-[var(--c-text-main)] shadow-[0_0_25px_rgba(232,137,157,0.3)] hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Continue to our love story"
        >
          <div className="absolute inset-0 rounded-full bg-[var(--c-accent-main)]/10 group-hover:bg-[var(--c-accent-main)]/25 transition-colors" />
          <ChevronDown className="w-6 h-6 text-[var(--c-accent-light)] group-hover:translate-y-0.5 transition-transform" />
        </button>
        <span className="text-[11px] uppercase tracking-widest text-[var(--c-accent-light)]/70 mt-2 font-medium">
          Our Love Story
        </span>
      </div>
    </section>
  );
};
