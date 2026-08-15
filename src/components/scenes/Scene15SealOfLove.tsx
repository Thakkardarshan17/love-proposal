import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, ChevronRight, Stamp, Flame, CheckCircle2, Lock, Star } from 'lucide-react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { ProposalConfig } from '../../types';
import { audioEngine } from '../../utils/audioSynthesizer';

interface Scene15SealOfLoveProps {
  config: ProposalConfig;
  onNext: () => void;
  primaryPhoto?: string;
}

export const Scene15SealOfLove: React.FC<Scene15SealOfLoveProps> = ({
  config,
  onNext,
  primaryPhoto
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSealed, setIsSealed] = useState<boolean>(false);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.seal-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo(
      '.seal-shayari-card',
      { opacity: 0, scale: 0.9, y: 25 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' },
      '-=0.4'
    )
    .fromTo(
      '.seal-button-box',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleSealPledge = () => {
    setIsSealed(true);
    audioEngine.playCelebrationFanfare();
    audioEngine.playHeartbeat();

    // Confetti and rose petals burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2A55', 'var(--c-accent-main)', 'var(--c-accent-light)', 'var(--c-accent-gold)', '#FFFFFF']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF2A55', 'var(--c-accent-main)', 'var(--c-accent-gold)']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF2A55', 'var(--c-accent-main)', 'var(--c-accent-gold)']
      });
    }, 250);
  };

  return (
    <section
      ref={containerRef}
      id="scene-15-seal-of-love"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-to-b from-[#2B0E1D] via-[#3B1327] to-[#16060F] text-center overflow-y-auto z-20"
    >
      {/* Radiant Atmosphere Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#FF2A55]/25 via-[var(--c-accent-main)]/25 to-[var(--c-accent-gold)]/25 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="seal-header pt-2 flex flex-col items-center space-y-1.5 shrink-0">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[var(--c-accent-gold)] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
          <span>Wada-E-Ishq • Forever Pledged</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gradient-rose tracking-wide">
          Hamari Kasam, Hamara Wada ❤️
        </h2>
      </div>

      {/* Center Shayari & Seal Mechanism */}
      <div className="relative my-auto py-3 flex flex-col items-center max-w-sm sm:max-w-md w-full space-y-5">
        {/* Culmination Shayari Card */}
        <div className="seal-shayari-card relative w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#2E1021]/95 to-[#1A0813]/98 border-2 border-[var(--c-accent-main)]/40 shadow-[0_0_45px_rgba(232,137,157,0.35)] text-center backdrop-blur-md">
          {primaryPhoto && (
            <div className="mx-auto mb-3 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[var(--c-accent-gold)] shadow-[0_0_25px_rgba(216,160,108,0.5)]">
              <img
                src={primaryPhoto}
                alt="Our Eternal Love"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Top Star Ornaments */}
          <div className="flex justify-center gap-2 mb-3 text-[var(--c-accent-gold)]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>

          <div className="space-y-3.5 text-[var(--c-text-main)]">
            <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--c-text-main)]">
              &ldquo;Duniya ki bheed me bas ek tujhe hi chuna hai,
            </p>
            <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--c-accent-light)]">
              Humne apne har khwaab ko tere naam se buna hai...&rdquo;
            </p>

            <div className="pt-2 border-t border-[var(--c-accent-main)]/20">
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--c-accent-gold)] font-bold">
                &ldquo;Kasam hai is dil ki dhadkano ki aur in sitaron ki, <br />
                Mera har aane wala janam sirf tera hona hai.&rdquo; ❤️
              </p>
            </div>
          </div>

          {/* Sealed Stamp Badge */}
          {isSealed && (
            <div className="mt-5 p-3 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/60 text-xs text-[var(--c-text-main)] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.4)] animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
              <span className="font-bold text-[#25D366]">SEALED ETERNALLY IN THE STARS</span>
            </div>
          )}
        </div>

        {/* Interactive Wax Seal / Heart Button */}
        <div className="seal-button-box w-full flex flex-col items-center space-y-2">
          {!isSealed ? (
            <button
              id="seal-promises-action-btn"
              type="button"
              onClick={handleSealPledge}
              className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#FF2A55] via-[var(--c-accent-main)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-extrabold text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(255,42,85,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
            >
              <Stamp className="w-5 h-5 text-[var(--c-bg-darkest)]" />
              <span>Tap to Seal Our Love Promises ❤️</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[var(--c-accent-light)] italic">
              <span>Promises Locked in Love by {config.yourName} &amp; {config.partnerName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Final Navigation */}
      <div className="w-full max-w-xs pb-4 flex flex-col items-center shrink-0">
        <button
          id="seal-of-love-next-btn"
          onClick={() => {
            audioEngine.playSparkle();
            onNext();
          }}
          className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(232,137,157,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
        >
          <span>Enter Our Forever World</span>
          <ChevronRight className="w-4 h-4 text-[var(--c-bg-darkest)] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
