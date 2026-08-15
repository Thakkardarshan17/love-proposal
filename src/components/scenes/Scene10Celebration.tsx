import React, { useEffect, useRef } from 'react';
import { Heart, Sparkles, ChevronRight, PartyPopper, Stars, MessageCircle, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ProposalConfig } from '../../types';

interface Scene10CelebrationProps {
  config: ProposalConfig;
  onNext: () => void;
  onOpenWhatsAppModal?: () => void;
  hasAnsweredYes: boolean;
  onMarkAnsweredYes: () => void;
  primaryPhoto?: string;
}

export const Scene10Celebration: React.FC<Scene10CelebrationProps> = ({
  config,
  onNext,
  onOpenWhatsAppModal,
  hasAnsweredYes,
  onMarkAnsweredYes,
  primaryPhoto
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Premium Confetti Cannon Sequence
    const duration = 4.5 * 1000;
    const end = Date.now() + duration;

    const colors = ['var(--c-accent-main)', 'var(--c-accent-light)', 'var(--c-accent-gold)', 'var(--c-text-main)', '#FF4D6D', '#FFB703'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Secondary Center Fireworks burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors
      });
    }, 400);

    // 2. GSAP Animations
    const tl = gsap.timeline();

    if (heartRef.current) {
      tl.fromTo(
        heartRef.current,
        { scale: 0, opacity: 0, rotate: -20 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.0, ease: 'elastic.out(1, 0.4)' }
      );
    }

    tl.fromTo(
      '.celebration-title',
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    )
    .fromTo(
      '.celebration-subtitle',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(
      '.celebration-next-btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '+=0.2'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleSendYesAction = () => {
    onMarkAnsweredYes();
    if (onOpenWhatsAppModal) {
      onOpenWhatsAppModal();
    } else {
      const cleanNum = (config.whatsappNumber || '+91 7201030048').replace(/[^0-9]/g, '');
      const text = encodeURIComponent(`YES! ❤️ I said YES to your proposal! Forever & Always yours! 💍✨`);
      window.open(`https://wa.me/${cleanNum || '917201030048'}?text=${text}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      ref={containerRef}
      id="scene-10-celebration"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[var(--c-bg-darker)] via-[var(--c-bg-dark)] to-[var(--c-bg-darkest)] text-center overflow-hidden z-20"
    >
      {/* Intense Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] rounded-full bg-gradient-to-tr from-[var(--c-accent-main)]/35 via-[var(--c-accent-light)]/25 to-[var(--c-accent-gold)]/30 blur-[140px] pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--c-accent-gold)] font-semibold">
        <PartyPopper className="w-4 h-4 text-[var(--c-accent-gold)]" />
        <span>A Dream Come True</span>
        <Stars className="w-4 h-4 text-[var(--c-accent-main)]" />
      </div>

      {/* Big Celebration Center */}
      <div className="relative my-auto flex flex-col items-center max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        <div ref={heartRef} className="relative group mt-4">
          <div className="absolute -inset-6 rounded-full bg-[var(--c-accent-main)]/20 blur-2xl animate-ping opacity-60 pointer-events-none" />
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[var(--c-bg-dark)] via-[var(--c-bg-darker)] to-[var(--c-bg-dark)] border-4 border-[var(--c-accent-main)]/80 flex items-center justify-center shadow-[0_0_50px_rgba(232,137,157,0.4)] animate-pulse-heart">
            <Heart className="w-14 h-14 sm:w-16 sm:h-16 text-[var(--c-accent-light)] fill-[var(--c-accent-light)] drop-shadow-[0_0_20px_rgba(247,184,197,0.7)]" />
          </div>
        </div>

        <div className="celebration-title space-y-4 flex flex-col items-center">
          {primaryPhoto && (
            <div className="relative mb-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[var(--c-accent-gold)] shadow-[0_0_30px_rgba(216,160,108,0.6)] rotate-[-2deg]">
                <img
                  src={primaryPhoto}
                  alt="Celebration couple moment"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#25D366] text-[var(--c-bg-darkest)] rounded-full p-1 border border-white font-bold">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          )}
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--c-bg-dark)] border border-[var(--c-accent-main)]/50 text-xs font-semibold uppercase tracking-widest text-[var(--c-accent-light)] shadow-md">
            Official Love Milestone
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-gradient-rose tracking-wider drop-shadow-[0_0_40px_rgba(232,137,157,0.9)] leading-tight">
            SHE SAID <br />
            <span className="text-[var(--c-accent-light)]">YES! ❤️</span>
          </h2>
        </div>

        <div className="celebration-subtitle space-y-3 mt-4 sm:mt-6">
          <p className="text-xl sm:text-2xl font-cormorant italic text-[var(--c-accent-gold)]">
            My Happiest Day Begins With You.
          </p>
          <p className="text-sm sm:text-base text-[var(--c-text-main)]/85 font-light max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            Together, we are writing the most beautiful love story ever told.
          </p>
        </div>
      </div>

      {/* Bottom Buttons: Flow Control (READ MY FINAL VOW is completely hidden until WhatsApp button is clicked) */}
      <div className="celebration-next-btn w-full max-w-sm pb-24 sm:pb-28 space-y-4 flex flex-col items-center relative z-30 pointer-events-auto mt-4">
        {!hasAnsweredYes ? (
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            {/* Step 1: Locked Notice */}
            <div className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[var(--c-bg-darker)]/95 border border-[var(--c-accent-main)]/40 text-xs sm:text-sm text-[var(--c-accent-light)] shadow-inner animate-pulse">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--c-accent-gold)] shrink-0" />
              <span className="text-left leading-relaxed">
                Send your <strong>YES</strong> answer on WhatsApp to unlock my personal Final Vow ❤️
              </span>
            </div>

            {/* Primary Action: Send YES on WhatsApp */}
            <button
              id="celebration-whatsapp-btn"
              type="button"
              onClick={handleSendYesAction}
              className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#25D366] via-[#2fe572] to-[#128C7E] text-white font-bold text-sm tracking-wide shadow-[0_0_35px_rgba(37,211,102,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Send &quot;YES!&quot; Answer on WhatsApp</span>
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
            {/* Step 2: Unlocked Banner */}
            <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/60 text-xs text-[var(--c-text-main)] mb-1 shadow-[0_0_15px_rgba(37,211,102,0.4)]">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
              <span className="font-semibold text-[#25D366]">YES Answer Sent!</span>
              <span className="text-[var(--c-accent-light)]">• Final Vow Unlocked</span>
              <Heart className="w-3.5 h-3.5 text-[#FF2A55] fill-[#FF2A55]" />
            </div>

            {/* Unlocked "Read My Final Vow" Main Button (Appears only after WhatsApp click) */}
            <button
              id="celebration-final-letter-btn"
              type="button"
              onClick={() => onNext()}
              className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-bold text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(232,137,157,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
            >
              <span>Read My Final Vow</span>
              <ChevronRight className="w-4 h-4 text-[var(--c-bg-darkest)] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary WhatsApp button */}
            <button
              type="button"
              onClick={handleSendYesAction}
              className="flex items-center justify-center gap-1.5 text-xs text-[#25D366] hover:text-white transition-colors py-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Resend WhatsApp message</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
