import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, ChevronRight, BookOpen, Quote, Star, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { ProposalConfig } from '../../types';
import { audioEngine } from '../../utils/audioSynthesizer';

interface Scene11LoveShayari1Props {
  config: ProposalConfig;
  onNext: () => void;
}

export const Scene11LoveShayari1: React.FC<Scene11LoveShayari1Props> = ({
  config,
  onNext
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.shayari-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo(
      '.shayari-card',
      { opacity: 0, scale: 0.92, y: 25 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' },
      '-=0.4'
    )
    .fromTo(
      '.shayari-line',
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, stagger: 0.2, duration: 0.7, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(
      '.shayari-action-btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleTapLine = (index: number) => {
    setActiveVerse(index);
    audioEngine.playSparkle();
  };

  return (
    <section
      ref={containerRef}
      id="scene-11-love-shayari-1"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-to-b from-[#250D19] via-[#351222] to-[#17070F] text-center overflow-y-auto z-20"
    >
      {/* Ambient Celestial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-gradient-to-tr from-[#E8899D]/20 via-[#FF2A55]/15 to-[#D8A06C]/20 blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <div className="shayari-header pt-2 flex flex-col items-center space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#F7B8C5]/90 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
          <span>Dil Ki Awaaz • Love Poetry</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gradient-rose tracking-wide">
          Pehli Nazar Aur Ishq ❤️
        </h2>
      </div>

      {/* Main Shayari Scroll Card */}
      <div className="relative my-auto py-4 flex flex-col items-center max-w-sm sm:max-w-md w-full space-y-5">
        <div className="shayari-card relative w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#2A101D]/90 to-[#1C0B14]/95 border-2 border-[#E8899D]/40 shadow-[0_0_40px_rgba(232,137,157,0.25)] text-left backdrop-blur-md">
          {/* Decorative Corner Stars */}
          <div className="absolute top-3 left-3 text-[#D8A06C]/40 flex gap-1">
            <Star className="w-3 h-3 fill-current" />
          </div>
          <div className="absolute top-3 right-3 text-[#D8A06C]/40 flex gap-1">
            <Star className="w-3 h-3 fill-current" />
          </div>
          
          <div className="flex items-center justify-between border-b border-[#E8899D]/20 pb-3 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D8A06C] uppercase tracking-wider">
              <Quote className="w-4 h-4 rotate-180 text-[#E8899D]" />
              <span>For {config.partnerName}</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8899D]/15 text-[#F7B8C5] border border-[#E8899D]/30">
              Tap lines to feel ✨
            </span>
          </div>

          {/* Hindi / Hinglish Shayari Verses */}
          <div className="space-y-3.5 text-[#FFF3EF]">
            <div
              onClick={() => handleTapLine(0)}
              className={`shayari-line p-2.5 rounded-xl transition-all cursor-pointer ${
                activeVerse === 0 ? 'bg-[#E8899D]/25 border border-[#E8899D]/50 scale-[1.02]' : 'hover:bg-white/5'
              }`}
            >
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[#FFF3EF]">
                &ldquo;Tere chehre ki noor se meri har subah roshan hoti hai,
              </p>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[#F7B8C5]">
                Teri hansi ki aahat se dil ki har dhadkan khush hoti hai...&rdquo;
              </p>
            </div>

            <div
              onClick={() => handleTapLine(1)}
              className={`shayari-line p-2.5 rounded-xl transition-all cursor-pointer ${
                activeVerse === 1 ? 'bg-[#E8899D]/25 border border-[#E8899D]/50 scale-[1.02]' : 'hover:bg-white/5'
              }`}
            >
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[#FFF3EF]">
                &ldquo;Manga tha rab se ek saccha humsafar zindagi bhar ke liye,
              </p>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[#D8A06C] font-semibold">
                Khuda ne tujhe de kar meri kismat hi muqammal kar di.&rdquo; ❤️
              </p>
            </div>
          </div>

          {/* English Reflection Card */}
          <div className="mt-5 pt-3 border-t border-[#E8899D]/20 flex items-start gap-2.5 text-xs text-[#F7B8C5]/80 italic">
            <Heart className="w-4 h-4 text-[#FF2A55] fill-[#FF2A55] shrink-0 mt-0.5" />
            <p>
              &ldquo;In a world of eight billion souls, my heart beat only for you from the very first moment.&rdquo;
            </p>
          </div>
        </div>

        {/* Small Bottom Signature */}
        <div className="flex items-center gap-2 text-xs text-[#F7B8C5]/70 font-script text-base">
          <span>Forever Yours,</span>
          <span className="text-[#FFF3EF] font-bold">{config.yourName}</span>
        </div>
      </div>

      {/* Bottom Continue Action */}
      <div className="shayari-action-btn w-full max-w-xs pb-4 flex flex-col items-center">
        <button
          id="shayari-1-next-btn"
          onClick={() => {
            audioEngine.playSparkle();
            onNext();
          }}
          className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(232,137,157,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
        >
          <span>Read 7 Sacred Promises</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
