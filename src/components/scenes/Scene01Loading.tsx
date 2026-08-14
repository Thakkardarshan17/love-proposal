import React, { useEffect, useState, useRef } from 'react';
import { Heart, Sparkles, Stars, ArrowRight, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { audioEngine } from '../../utils/audioSynthesizer';

interface Scene01LoadingProps {
  partnerName?: string;
  yourName?: string;
  onComplete: () => void;
}

export const Scene01Loading: React.FC<Scene01LoadingProps> = ({
  partnerName = 'My Love',
  yourName = 'Darshan',
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heartIconRef = useRef<HTMLDivElement | null>(null);
  const specialOneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // GSAP Cinematic Splash Sequence
    const tl = gsap.timeline();

    tl.fromTo(
      '.splash-badge',
      { opacity: 0, scale: 0.8, y: -15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' }
    )
    .fromTo(
      heartIconRef.current,
      { scale: 0, opacity: 0, rotate: -25 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' },
      '-=0.3'
    )
    .fromTo(
      specialOneRef.current,
      { opacity: 0, y: 25, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(
      '.splash-subtitle-line',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(
      '.splash-progress-container',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );

    // Progress bar ticker
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleProceed();
          }, 450);
          return 100;
        }
        return prev + Math.floor(Math.random() * 14 + 8);
      });
    }, 110);

    return () => {
      clearInterval(interval);
      tl.kill();
    };
  }, []);

  const handleProceed = () => {
    try {
      if (!audioEngine.getIsPlaying()) {
        audioEngine.play();
      }
    } catch {}

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.04,
        duration: 0.65,
        ease: 'power2.inOut',
        onComplete
      });
    } else {
      onComplete();
    }
  };

  return (
    <section
      ref={containerRef}
      id="scene-01-splash-screen"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-6 py-10 bg-gradient-to-b from-[#12080D]/80 via-[#240D18]/70 to-[#12080D]/80 text-center overflow-hidden z-20"
    >
      {/* Radiant Celestial Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[650px] h-[380px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#E8899D]/25 via-[#F7B8C5]/20 to-[#D8A06C]/25 blur-[130px] pointer-events-none" />

      {/* Top Floating Badge */}
      <div className="splash-badge pt-4 flex items-center gap-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A101B]/80 border border-[#E8899D]/40 backdrop-blur-md shadow-[0_0_20px_rgba(232,137,157,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-[#D8A06C] animate-spin-slow" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#F7B8C5]">
            A Heartfelt Love Story
          </span>
          <Stars className="w-3.5 h-3.5 text-[#E8899D]" />
        </div>
      </div>

      {/* Main Center Splash Presentation */}
      <div className="relative my-auto flex flex-col items-center max-w-sm sm:max-w-md w-full space-y-5">
        {/* Glowing Heart Icon */}
        <div ref={heartIconRef} className="relative group my-2">
          {/* Intense Background Ping */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#E8899D]/40 to-[#D8A06C]/40 blur-xl animate-pulse pointer-events-none" />

          {/* Heart Emblem */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#E8899D] flex items-center justify-center bg-gradient-to-tr from-[#2A101B] via-[#3A1422] to-[#1C0B13] shadow-[0_0_40px_rgba(232,137,157,0.7)] animate-pulse-heart">
            <Heart className="w-12 h-12 sm:w-14 sm:h-14 text-[#E8899D] fill-[#E8899D]/30" />
            <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-30" />
          </div>

          {/* Sparkle Badges */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7B8C5] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#E8899D] items-center justify-center text-[8px] text-[#12080D] font-bold">
              ✦
            </span>
          </span>
        </div>

        {/* Dedicated "MY SPECIAL ONE" Title Block */}
        <div ref={specialOneRef} className="space-y-2">
          <p className="splash-subtitle-line text-xs sm:text-sm uppercase tracking-[0.35em] text-[#D8A06C] font-semibold">
            Dedicated Exclusively To
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-wide text-gradient-rose drop-shadow-[0_0_35px_rgba(232,137,157,0.75)] leading-tight">
            MY SPECIAL <br />
            <span className="text-[#FFF3EF] font-serif-luxury tracking-wider">ONE</span>
          </h1>

          <div className="splash-subtitle-line pt-1 flex items-center justify-center gap-2">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#E8899D]/60" />
            <p className="text-base sm:text-lg font-script text-[#F7B8C5] tracking-wide">
              For {partnerName} ❤️
            </p>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#E8899D]/60" />
          </div>
        </div>

        {/* Emotional Subtext */}
        <div className="space-y-1 max-w-xs mx-auto">
          <p className="splash-subtitle-line text-xs sm:text-sm text-[#FFF3EF]/85 font-light leading-relaxed">
            Something wonderful is waiting for you...
          </p>
          <p className="splash-subtitle-line text-[11px] font-cormorant italic text-[#D8A06C]">
            Crafted with all my love, by {yourName}
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress & Interactive Start */}
      <div className="splash-progress-container w-full max-w-xs pb-4 flex flex-col items-center space-y-3">
        <div className="flex items-center justify-between w-full text-xs text-[#F7B8C5] px-1 font-mono">
          <span className="tracking-widest uppercase text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D8A06C]" />
            Opening Our Love Story
          </span>
          <span className="font-bold text-[#FFF3EF]">{Math.min(100, progress)}%</span>
        </div>

        {/* Progress Glow Bar */}
        <div className="w-full h-2 bg-[#2A101B] rounded-full overflow-hidden border border-[#E8899D]/40 p-[1.5px] shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(232,137,157,0.9)]"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        {/* Interactive Instant Start Action */}
        <button
          id="splash-enter-immediately-btn"
          onClick={handleProceed}
          className="group w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#E8899D]/20 via-[#F7B8C5]/20 to-[#D8A06C]/20 hover:from-[#E8899D] hover:via-[#F7B8C5] hover:to-[#D8A06C] border border-[#E8899D]/50 text-[#FFF3EF] hover:text-[#12080D] text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(232,137,157,0.3)] hover:shadow-[0_0_25px_rgba(232,137,157,0.7)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>Tap To Begin Our Journey</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D8A06C] group-hover:text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

