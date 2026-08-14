import React, { useEffect, useRef } from 'react';
import { Heart, Sparkles, ChevronRight, Sun, Eye, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ReasonItem } from '../../types';

interface Scene06ReasonsProps {
  reasons: ReasonItem[];
  onNext: () => void;
  primaryPhoto?: string;
}

export const Scene06Reasons: React.FC<Scene06ReasonsProps> = ({ reasons, onNext, primaryPhoto }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.reasons-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    ).fromTo(
      '.reason-card',
      { opacity: 0, y: 25, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
      '-=0.4'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const getReasonIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-4 h-4 text-[#E8899D] fill-[#E8899D]" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-[#D8A06C]" />;
      case 'Eye':
        return <Eye className="w-4 h-4 text-[#F7B8C5]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-[#E8899D]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#D8A06C]" />;
    }
  };

  return (
    <section
      ref={containerRef}
      id="scene-06-reasons"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[#1C0B13] via-[#2A101B] to-[#12080D] overflow-hidden z-20"
    >
      {/* Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-[#E8899D]/15 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="reasons-header text-center pt-2 mb-6 max-w-md flex flex-col items-center">
        {primaryPhoto && (
          <div className="mb-2 relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D8A06C] shadow-[0_0_20px_rgba(216,160,108,0.4)]">
              <img
                src={primaryPhoto}
                alt="Dream Moment"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#E8899D] rounded-full p-0.5 border border-[#12080D]">
              <Heart className="w-3 h-3 text-[#12080D] fill-[#12080D]" />
            </div>
          </div>
        )}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A101B] border border-[#E8899D]/30 text-xs text-[#F7B8C5] mb-2 font-medium">
          <Heart className="w-3 h-3 text-[#E8899D] fill-[#E8899D]" />
          <span>From My Heart</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFF3EF] tracking-wide">
          Reasons <span className="text-gradient-rose">I Love You</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#F7B8C5]/80 mt-1 font-light">
          A few of the thousand reasons why my heart chose you
        </p>
      </div>

      {/* Cards List */}
      <div className="w-full max-w-md mx-auto my-auto space-y-3 sm:space-y-4">
        {reasons.map((reason, idx) => (
          <div
            key={reason.id || idx}
            className="reason-card group p-4 sm:p-5 rounded-2xl glass-panel border border-[#E8899D]/30 hover:border-[#E8899D] hover:shadow-[0_0_25px_rgba(232,137,157,0.3)] transition-all duration-300 flex items-start gap-3.5"
          >
            {/* Number Badge */}
            <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#2A101B] to-[#3A1422] border border-[#E8899D]/40 flex items-center justify-center text-xs sm:text-sm font-serif font-bold text-[#F7B8C5] shadow-inner group-hover:scale-105 group-hover:border-[#E8899D] transition-transform">
              {reason.numberStr}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-sm sm:text-base font-serif font-semibold text-[#FFF3EF] flex items-center gap-1.5 truncate">
                  <span>{reason.title}</span>
                </h3>
                <div className="p-1 rounded-full bg-white/5 flex items-center justify-center">
                  {getReasonIcon(reason.icon)}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#FFF3EF]/80 leading-relaxed font-light">
                {reason.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Continue Action */}
      <div className="w-full max-w-xs mt-6 pb-4 flex flex-col items-center">
        <button
          id="reasons-continue-btn"
          onClick={onNext}
          className="group w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(232,137,157,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>One Important Question...</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
