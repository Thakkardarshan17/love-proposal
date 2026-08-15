import React, { useRef, useState } from 'react';
import { Heart, Sparkles, Hand } from 'lucide-react';
import gsap from 'gsap';
import { audioEngine } from '../../utils/audioSynthesizer';

interface Scene02TapHeartProps {
  onHeartTapped: () => void;
}

export const Scene02TapHeart: React.FC<Scene02TapHeartProps> = ({ onHeartTapped }) => {
  const [isTapped, setIsTapped] = useState(false);
  const heartContainerRef = useRef<HTMLDivElement | null>(null);
  const mainHeartRef = useRef<HTMLDivElement | null>(null);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);
  const touchHintRef = useRef<HTMLDivElement | null>(null);

  const handleHeartClick = () => {
    if (isTapped) return;
    setIsTapped(true);

    // Play heartbeat audio + sparkle
    audioEngine.playHeartbeat();
    setTimeout(() => {
      audioEngine.playSparkle();
      audioEngine.play(); // start romantic song
    }, 200);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onHeartTapped, 300);
      }
    });

    // Screen flash burst
    if (flashOverlayRef.current) {
      tl.to(flashOverlayRef.current, {
        opacity: 0.85,
        duration: 0.15,
        ease: 'power2.out'
      }).to(flashOverlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      });
    }

    // Heart explosion and zoom
    if (mainHeartRef.current) {
      tl.to(
        mainHeartRef.current,
        {
          scale: 1.45,
          duration: 0.35,
          ease: 'power2.out'
        },
        '<=0.05'
      )
      .to(
        mainHeartRef.current,
        {
          scale: 2.2,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in'
        },
        '+=0.1'
      );
    }

    // Fade entire scene
    if (heartContainerRef.current) {
      tl.to(
        heartContainerRef.current,
        {
          scale: 1.15,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        },
        '-=0.3'
      );
    }
  };

  return (
    <section
      ref={heartContainerRef}
      id="scene-02-tap-heart"
      className="relative flex flex-col items-center justify-center min-h-svh w-full px-6 py-12 bg-gradient-to-b from-[var(--c-bg-darkest)] via-[var(--c-bg-darker)] to-[var(--c-bg-dark)] text-center overflow-hidden z-20 select-none cursor-pointer"
      onClick={handleHeartClick}
    >
      {/* Flash overlay on burst */}
      <div
        ref={flashOverlayRef}
        className="fixed inset-0 bg-[var(--c-accent-light)] opacity-0 pointer-events-none z-50 transition-opacity"
      />

      {/* Atmospheric ambient glow backdrop */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[var(--c-accent-main)]/20 blur-[90px] animate-pulse pointer-events-none" />

      {/* Top Subtle Guidance - lowered position */}
      <div className="absolute top-20 sm:top-24 flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[var(--c-accent-light)]/80 font-medium z-10">
        <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
        <span>Open Your Heart</span>
        <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
      </div>

      {/* Center Pulsing Big Heart Interactive Button */}
      <div className="relative flex flex-col items-center my-auto">
        <div
          ref={mainHeartRef}
          className="relative group p-8 sm:p-10 rounded-full transition-transform active:scale-95"
        >
          {/* Outer glowing ripple rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--c-accent-main)]/20 to-[var(--c-accent-gold)]/20 blur-xl animate-ping opacity-40 pointer-events-none" />
          <div className="absolute -inset-4 rounded-full border border-[var(--c-accent-main)]/30 animate-pulse pointer-events-none" />

          {/* Heart Container */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[var(--c-bg-dark)] via-[var(--c-bg-light)] to-[var(--c-bg-darker)] border-2 border-[var(--c-accent-main)] flex items-center justify-center glow-heart shadow-[0_0_50px_rgba(232,137,157,0.5)]">
            <Heart className="w-20 h-20 sm:w-28 sm:h-28 text-[var(--c-accent-main)] fill-[var(--c-accent-main)] drop-shadow-[0_0_25px_rgba(247,184,197,0.9)] animate-pulse-heart" />
            
            {/* Sparkle highlights on heart */}
            <Sparkles className="absolute top-6 right-6 w-5 h-5 text-[var(--c-text-main)] animate-bounce" />
          </div>
        </div>

        {/* Action Title */}
        <h2 className="text-3xl sm:text-4xl font-serif text-[var(--c-text-main)] font-bold tracking-wide mt-4 mb-2 drop-shadow-md">
          Tap My Heart <span className="text-[var(--c-accent-main)]">❤️</span>
        </h2>
        <p className="text-sm text-[var(--c-accent-light)]/80 font-light max-w-xs">
          A heartbeat waiting for your touch
        </p>

        {/* Hand Touch Indicator */}
        <div
          ref={touchHintRef}
          className="mt-6 flex flex-col items-center gap-1.5 text-xs text-[var(--c-accent-gold)] animate-bounce"
        >
          <div className="p-2.5 rounded-full bg-[var(--c-bg-dark)] border border-[var(--c-accent-gold)]/40 shadow-lg">
            <Hand className="w-5 h-5" />
          </div>
          <span className="tracking-wider uppercase text-[10px] text-[var(--c-accent-light)]/90">
            Tap anywhere to begin
          </span>
        </div>
      </div>
    </section>
  );
};
