import React, { useEffect, useRef } from 'react';
import { Heart, Sparkles, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ProposalConfig } from '../../types';

interface Scene11FinalMessageProps {
  config: ProposalConfig;
  onNext: () => void;
  primaryPhoto?: string;
}

export const Scene11FinalMessage: React.FC<Scene11FinalMessageProps> = ({
  config,
  onNext,
  primaryPhoto
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.final-message-line',
      { opacity: 0, y: 25, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.25, ease: 'power2.out' }
    )
    .fromTo(
      '.final-signature-block',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' },
      '+=0.2'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-11-final-message"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[#2A101B] via-[#3A1422] to-[#1C0B13] text-center overflow-hidden z-20"
    >
      {/* Warm Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-gradient-to-tr from-[#E8899D]/20 via-[#F7B8C5]/20 to-[#D8A06C]/20 blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F7B8C5]/80 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
        <span>A Lifelong Vow</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
      </div>

      {/* Letter Vow Content */}
      <div className="relative my-auto flex flex-col items-center max-w-sm sm:max-w-md space-y-6">
        <div className="space-y-4">
          <p className="final-message-line text-sm sm:text-base uppercase tracking-widest text-[#D8A06C] font-semibold">
            From This Moment...
          </p>

          <h2 className="final-message-line text-2xl sm:text-3xl font-serif text-[#FFF3EF] leading-relaxed font-light">
            Every Smile, <br />
            Every Dream, <br />
            Every Adventure...
          </h2>

          <p className="final-message-line text-xl sm:text-2xl font-cormorant italic text-[#F7B8C5]">
            I Want To Share It With You.
          </p>

          <p className="final-message-line text-3xl sm:text-4xl font-serif font-bold text-gradient-rose">
            Forever & Always <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#E8899D] fill-[#E8899D] inline animate-pulse-heart" />
          </p>
        </div>

        {/* Signature & Memory Seal */}
        <div className="final-signature-block p-5 rounded-2xl glass-panel border border-[#E8899D]/30 w-full shadow-lg flex items-center justify-between gap-4">
          <div className="text-left flex-1">
            <p className="text-xs text-[#F7B8C5] italic mb-1">
              {config.signatureText}
            </p>
            <p className="text-2xl sm:text-3xl font-script text-[#FFF3EF] tracking-wider font-bold">
              {config.yourName}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#D8A06C] uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>Written In The Stars</span>
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          {primaryPhoto && (
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#D8A06C] shadow-[0_0_20px_rgba(216,160,108,0.5)] rotate-[3deg]">
                <img
                  src={primaryPhoto}
                  alt="Couple Dream Seal"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#E8899D] rounded-full p-1 border border-[#12080D]">
                <Heart className="w-3 h-3 text-[#12080D] fill-[#12080D]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Continue Action */}
      <div className="w-full max-w-xs pb-4 flex flex-col items-center">
        <button
          id="final-message-continue-btn"
          onClick={onNext}
          className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(232,137,157,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
        >
          <span>Read Our Love Shayari</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
