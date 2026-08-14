import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, ChevronRight, Moon, Star, Music, Flame } from 'lucide-react';
import gsap from 'gsap';
import { ProposalConfig } from '../../types';
import { audioEngine } from '../../utils/audioSynthesizer';

interface Scene13LoveShayari2Props {
  config: ProposalConfig;
  onNext: () => void;
}

export const Scene13LoveShayari2: React.FC<Scene13LoveShayari2Props> = ({
  config,
  onNext
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<number | null>(0);

  const miniQuotes = [
    {
      text: "Tum meri aadat nahi, meri ibaadat ho.",
      sub: "You are not just a habit, you are my sacred devotion."
    },
    {
      text: "Duniya ke liye tum ek insaan ho, mere liye poori duniya ho.",
      sub: "To the world you might be one person, to me you are the whole world."
    },
    {
      text: "Meri har dua ka sabse khubsurat jawab ho tum.",
      sub: "The sweetest answer to every prayer I ever whispered."
    }
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.shayari2-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo(
      '.shayari2-parchment',
      { opacity: 0, scale: 0.9, y: 25 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' },
      '-=0.4'
    )
    .fromTo(
      '.quote-pill-item',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleSelectQuote = (index: number) => {
    setSelectedQuote(index);
    audioEngine.playSparkle();
  };

  return (
    <section
      ref={containerRef}
      id="scene-13-love-shayari-2"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-to-b from-[#200A15] via-[#321021] to-[#12050D] text-center overflow-y-auto z-20"
    >
      {/* Galaxy Nebular Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#FF2A55]/20 via-[#E8899D]/20 to-[#9B51E0]/15 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="shayari2-header pt-2 flex flex-col items-center space-y-1.5 shrink-0">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#F7B8C5]/90 font-semibold">
          <Moon className="w-3.5 h-3.5 text-[#D8A06C]" />
          <span>Ruhani Ishq • Soulmates</span>
          <Moon className="w-3.5 h-3.5 text-[#D8A06C]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gradient-rose tracking-wide">
          Mohabbat Ki Gehrayi 💫
        </h2>
      </div>

      {/* Center Main Nazm Card */}
      <div className="relative my-auto py-4 flex flex-col items-center max-w-sm sm:max-w-md w-full space-y-5">
        <div className="shayari2-parchment relative w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#2C101F]/90 to-[#1A0813]/95 border-2 border-[#E8899D]/40 shadow-[0_0_45px_rgba(232,137,157,0.3)] text-center backdrop-blur-md">
          {/* Top Heart Emblem */}
          <div className="inline-flex p-3 rounded-full bg-[#E8899D]/20 border border-[#E8899D]/40 mb-4 shadow-inner">
            <Heart className="w-6 h-6 text-[#FF2A55] fill-[#FF2A55] animate-pulse-heart" />
          </div>

          <div className="space-y-4 text-[#FFF3EF]">
            <p className="font-serif text-lg sm:text-xl leading-relaxed text-[#FFF3EF]">
              &ldquo;Na chaand ki chahat, <br />
              Na taaron ki farmaish hai...&rdquo;
            </p>

            <p className="font-serif text-lg sm:text-xl leading-relaxed text-[#D8A06C] font-semibold">
              &ldquo;Har janam me sirf tu mile, <br />
              Bas yahi ek aakhri khwahish hai.&rdquo; ❤️
            </p>

            <div className="pt-2 border-t border-[#E8899D]/20">
              <p className="font-serif text-sm sm:text-base text-[#F7B8C5] leading-relaxed italic">
                &ldquo;Haath thaam kar chalna hai mujhe is zindagi ke safar me, <br />
                Kyunki mere har kal me ab bas tumhara hi saath hai.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Couple Quotes Pill Selection */}
        <div className="w-full space-y-2">
          <p className="text-[11px] text-[#D8A06C] uppercase tracking-wider font-semibold">
            Tap a message from my heart ✨
          </p>
          <div className="space-y-2">
            {miniQuotes.map((q, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectQuote(idx)}
                className={`quote-pill-item p-3 rounded-2xl transition-all cursor-pointer text-left border ${
                  selectedQuote === idx
                    ? 'bg-gradient-to-r from-[#E8899D]/30 to-[#D8A06C]/30 border-[#E8899D] shadow-[0_0_15px_rgba(232,137,157,0.3)] scale-[1.02]'
                    : 'bg-[#1C0B14]/70 border-white/10 opacity-75 hover:opacity-100 hover:border-white/20'
                }`}
              >
                <p className="text-xs sm:text-sm font-serif font-bold text-[#FFF3EF]">
                  &ldquo;{q.text}&rdquo;
                </p>
                <p className="text-[11px] text-[#F7B8C5]/80 italic pt-0.5">
                  {q.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="w-full max-w-xs pb-4 flex flex-col items-center shrink-0">
        <button
          id="shayari-2-next-btn"
          onClick={() => {
            audioEngine.playSparkle();
            onNext();
          }}
          className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(232,137,157,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
        >
          <span>See 5 Lifetime Pillars</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
