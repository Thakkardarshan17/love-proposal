import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, Gem } from 'lucide-react';
import gsap from 'gsap';
import { ProposalConfig } from '../../types';
import { audioEngine } from '../../utils/audioSynthesizer';

interface Scene08ProposalProps {
  config: ProposalConfig;
  onYesSelected: () => void;
  onOpenWhatsAppModal?: () => void;
}

export const Scene08Proposal: React.FC<Scene08ProposalProps> = ({
  config,
  onYesSelected
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ringContainerRef = useRef<HTMLDivElement | null>(null);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showRespectMessage, setShowRespectMessage] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();

    // Ring reveal animation
    if (ringContainerRef.current) {
      tl.fromTo(
        ringContainerRef.current,
        { scale: 0, opacity: 0, rotate: -45 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.4, ease: 'elastic.out(1, 0.4)' }
      );
    }

    tl.fromTo(
      '.proposal-text-block',
      { opacity: 0, y: 30, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo(
      '.proposal-main-question',
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.0, ease: 'back.out(1.6)' },
      '-=0.4'
    )
    .fromTo(
      '.proposal-btn-group',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleYes = () => {
    audioEngine.playSparkle();
    audioEngine.playCelebrationFanfare();
    onYesSelected();
  };

  const handleNoHoverOrTap = () => {
    if (noAttempts < 3) {
      const nextAttempt = noAttempts + 1;
      setNoAttempts(nextAttempt);
      // Playful slight position offset (stays easily clickable & respectful)
      const randomX = (Math.random() - 0.5) * 60;
      const randomY = (Math.random() - 0.5) * 40;
      setNoPosition({ x: randomX, y: randomY });
    } else {
      setShowRespectMessage(true);
    }
  };

  const getNoButtonText = () => {
    if (noAttempts === 0) return 'NO 😶';
    if (noAttempts === 1) return 'Are you sure? 🥺';
    if (noAttempts === 2) return 'Think again ❤️';
    return "It's okay...";
  };

  return (
    <section
      ref={containerRef}
      id="scene-08-proposal"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-10 bg-gradient-to-b from-[#12080D] via-[#1C0B13] to-[#2A101B] text-center overflow-hidden z-20"
    >
      {/* Intense Romantic Proposal Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[650px] h-[380px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#E8899D]/30 via-[#D8A06C]/20 to-[#F7B8C5]/25 blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D8A06C] font-semibold mb-2">
        <Sparkles className="w-4 h-4 text-[#D8A06C] animate-spin" />
        <span>The Forever Question</span>
        <Sparkles className="w-4 h-4 text-[#D8A06C] animate-spin" />
      </div>

      {/* Realistic Glowing Diamond Ring Visual & Proposal Question */}
      <div className="relative my-auto flex flex-col items-center max-w-sm sm:max-w-md w-full space-y-4 sm:space-y-6">
        {/* Diamond Ring Graphic */}
        <div ref={ringContainerRef} className="relative group my-1 sm:my-2">
          {/* Ring Light Aura */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#E8899D]/40 via-[#FFF3EF]/30 to-[#D8A06C]/40 blur-2xl animate-pulse pointer-events-none" />

          <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#2A101B] via-[#1C0B13] to-[#3A1422] border-2 border-[#D8A06C]/80 flex items-center justify-center glow-ring shadow-[0_0_60px_rgba(216,160,108,0.7)]">
            {/* Diamond Setting */}
            <div className="relative flex flex-col items-center">
              <div className="relative">
                <Gem className="w-14 h-14 sm:w-20 sm:h-20 text-[#FFF3EF] drop-shadow-[0_0_25px_rgba(255,243,239,0.95)] animate-bounce" />
                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 text-[#D8A06C] animate-spin" />
                <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 sm:w-5 sm:h-5 text-[#E8899D]" />
              </div>
              <div className="w-14 sm:w-16 h-3 rounded-full bg-[#D8A06C] blur-xs -mt-1 opacity-80" />
            </div>
          </div>
        </div>

        {/* Emotional Subtitle */}
        <div className="proposal-text-block space-y-1.5 px-2">
          <p className="text-sm sm:text-base text-[#F7B8C5]/90 font-cormorant italic text-base sm:text-xl">
            {config.subQuestion}
          </p>
        </div>

        {/* Main Proposal Heading */}
        <div className="proposal-main-question space-y-1">
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-gradient-rose tracking-wide drop-shadow-[0_0_35px_rgba(232,137,157,0.8)]">
            {config.question}
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#D8A06C] font-semibold">
            To {config.partnerName}
          </p>
        </div>

        {/* Respect Message if NO chosen */}
        {showRespectMessage && (
          <div className="p-4 rounded-2xl glass-panel border border-[#E8899D]/40 text-xs text-[#FFF3EF] max-w-xs animate-in fade-in">
            <p className="mb-2 font-serif text-sm text-[#F7B8C5]">
              I respect your answer with all my heart. ❤️
            </p>
            <p className="text-white/70">
              No matter what, every moment with you has been a blessing.
            </p>
            <button
              onClick={() => {
                setShowRespectMessage(false);
                setNoAttempts(0);
                setNoPosition({ x: 0, y: 0 });
              }}
              className="mt-3 px-3 py-1 rounded-full bg-white/10 text-[11px] text-[#F7B8C5] hover:bg-white/20"
            >
              Let me answer again ❤️
            </button>
          </div>
        )}

        {/* Buttons Group (YES / NO) */}
        {!showRespectMessage && (
          <div className="proposal-btn-group w-full max-w-xs space-y-3 pt-2">
            {/* Primary YES Button */}
            <button
              id="proposal-yes-btn"
              onClick={handleYes}
              className="group relative w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-bold text-base sm:text-lg tracking-wider uppercase shadow-[0_0_35px_rgba(232,137,157,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shine-effect"
            >
              <Heart className="w-5 h-5 text-[#12080D] fill-[#12080D] animate-pulse" />
              <span>YES, I WILL ❤️</span>
              <Heart className="w-5 h-5 text-[#12080D] fill-[#12080D] animate-pulse" />
            </button>

            {/* Playful non-trapping NO Button */}
            <div className="relative inline-block w-full">
              <button
                id="proposal-no-btn"
                onClick={handleNoHoverOrTap}
                onMouseEnter={handleNoHoverOrTap}
                style={{
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px)`
                }}
                className="w-full py-2.5 px-6 rounded-full bg-transparent border border-[#E8899D]/40 text-[#F7B8C5]/80 hover:text-white hover:border-[#E8899D] text-xs sm:text-sm font-medium tracking-wide transition-transform duration-200"
              >
                {getNoButtonText()}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="text-[11px] text-[#F7B8C5]/60 font-light pb-2">
        A moment written in the stars
      </div>
    </section>
  );
};
