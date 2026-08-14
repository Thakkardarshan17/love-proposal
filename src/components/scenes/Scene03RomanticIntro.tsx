import React, { useEffect, useRef } from 'react';
import { Heart, ChevronDown, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface Scene03RomanticIntroProps {
  onNext: () => void;
  partnerName?: string;
  primaryPhoto?: string;
}

export const Scene03RomanticIntro: React.FC<Scene03RomanticIntroProps> = ({
  onNext,
  partnerName = 'YOU',
  primaryPhoto
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
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[#2A101B] via-[#3A1422] to-[#1C0B13] text-center overflow-hidden z-20"
    >
      {/* Soft warm pink glow backing */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[550px] h-[340px] sm:h-[550px] rounded-full bg-gradient-to-tr from-[#E8899D]/25 to-[#F7B8C5]/20 blur-[110px] pointer-events-none" />

      {/* Top chapter tag */}
      <div className="pt-4 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F7B8C5]/70 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
        <span>A Serendipitous Destiny</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
      </div>

      {/* Cinematic Text Reveal Center */}
      <div className="relative my-auto flex flex-col items-center max-w-sm sm:max-w-lg space-y-6">
        <p className="intro-phrase-1 text-xl sm:text-2xl font-light text-[#FFF3EF]/90 font-serif leading-relaxed">
          There are millions of people <br />
          <span className="text-[#F7B8C5] italic">in this vast world...</span>
        </p>

        <p className="intro-phrase-2 text-lg sm:text-xl font-cormorant italic text-[#D8A06C] tracking-wide">
          But somehow, through all of time and space...
        </p>

        <p className="intro-phrase-3 text-2xl sm:text-3xl font-serif text-[#FFF3EF] font-light">
          I found
        </p>

        <div className="intro-phrase-4 relative flex flex-col items-center">
          {primaryPhoto && (
            <div className="mb-4 relative group">
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-[#E8899D]/40 to-[#D8A06C]/40 blur-lg animate-pulse" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#FFF3EF]/80 shadow-[0_0_30px_rgba(232,137,157,0.6)] rotate-[-3deg] group-hover:rotate-0 transition-transform">
                <img
                  src={primaryPhoto}
                  alt={partnerName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12080D]/60 via-transparent to-transparent flex items-end justify-center pb-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFF3EF] font-bold">
                    Our Dream ✨
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl sm:text-6xl font-serif font-black text-gradient-rose tracking-wider drop-shadow-[0_0_35px_rgba(232,137,157,0.7)]">
              {partnerName.toUpperCase()}
            </span>
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-[#E8899D] fill-[#E8899D] animate-pulse-heart inline-block ml-1" />
          </div>
          <span className="text-xs sm:text-sm text-[#F7B8C5]/80 font-script text-2xl mt-1">
            My one in eight billion
          </span>
        </div>
      </div>

      {/* Next/Down Circular Indicator Button */}
      <div className="intro-next-btn pb-4 flex flex-col items-center">
        <button
          id="intro-next-scene-btn"
          onClick={onNext}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full glass-panel border border-[#E8899D]/40 text-[#FFF3EF] shadow-[0_0_25px_rgba(232,137,157,0.3)] hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Continue to our love story"
        >
          <div className="absolute inset-0 rounded-full bg-[#E8899D]/10 group-hover:bg-[#E8899D]/25 transition-colors" />
          <ChevronDown className="w-6 h-6 text-[#F7B8C5] group-hover:translate-y-0.5 transition-transform" />
        </button>
        <span className="text-[11px] uppercase tracking-widest text-[#F7B8C5]/70 mt-2 font-medium">
          Our Love Story
        </span>
      </div>
    </section>
  );
};
