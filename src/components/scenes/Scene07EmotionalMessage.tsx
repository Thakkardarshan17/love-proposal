import React, { useEffect, useRef } from 'react';
import { Heart, Sparkles, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

interface Scene07EmotionalMessageProps {
  onNext: () => void;
  partnerName?: string;
  primaryPhoto?: string;
  onOpenPhotoPreview?: () => void;
}

export const Scene07EmotionalMessage: React.FC<Scene07EmotionalMessageProps> = ({
  onNext,
  partnerName = 'Labdhi',
  primaryPhoto,
  onOpenPhotoPreview
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.emotional-block-1',
      { opacity: 0, y: 30, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' }
    )
    .fromTo(
      '.emotional-divider',
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power1.inOut' },
      '+=0.2'
    )
    .fromTo(
      '.emotional-block-2',
      { opacity: 0, y: 20, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' },
      '+=0.3'
    )
    .fromTo(
      '.emotional-next-btn',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
      '+=0.4'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-07-emotional-message"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[var(--c-bg-dark)] via-[var(--c-bg-light)] to-[var(--c-bg-darker)] text-center overflow-hidden z-20"
    >
      {/* Light rose/gold backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-gradient-to-tr from-[var(--c-accent-main)]/25 to-[var(--c-accent-light)]/20 blur-[130px] pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-4 pb-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--c-accent-light)]/80 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
        <span>A Promise From My Soul</span>
        <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
      </div>

        {/* Emotional Content */}
        <div className="relative my-auto flex flex-col items-center max-w-sm sm:max-w-lg space-y-12 sm:space-y-16">
          {primaryPhoto && (
            <div 
              className={`relative group ${onOpenPhotoPreview ? 'cursor-pointer' : ''}`}
              onClick={onOpenPhotoPreview}
              title={onOpenPhotoPreview ? "Click to view full photo" : undefined}
            >
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[var(--c-accent-main)]/30 to-[var(--c-accent-gold)]/30 blur-md animate-pulse" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl p-2 bg-[var(--c-text-main)] border border-[var(--c-accent-main)]/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rotate-[2deg] group-hover:rotate-0 group-hover:scale-105 transition-all flex flex-col items-center">
                <div className="w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-black/10">
                  <img
                    src={primaryPhoto}
                    alt={partnerName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] text-[var(--c-bg-darkest)] font-script font-bold text-sm mt-1">
                  Forever Yours ❤️
                </span>
              </div>
            </div>
          )}

          <div className="emotional-block-1 space-y-4">
          <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-[var(--c-accent-gold)] font-bold">
            Dearest {partnerName},
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-[var(--c-text-main)] font-light leading-relaxed">
            You came into my life <br />
            and somehow made <br />
            <span className="font-serif-luxury font-bold text-gradient-rose italic text-3xl sm:text-4xl">
              everything more beautiful.
            </span>
          </h2>
        </div>

        {/* Glowing Decorative Divider with Heart */}
        <div className="emotional-divider flex items-center justify-center gap-3 w-full max-w-xs mx-auto py-2">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[var(--c-accent-main)]" />
          <div className="p-2 rounded-full bg-[var(--c-bg-dark)] border border-[var(--c-accent-main)]/50 shadow-[0_0_15px_rgba(232,137,157,0.6)]">
            <Heart className="w-5 h-5 text-[var(--c-accent-main)] fill-[var(--c-accent-main)] animate-pulse-heart" />
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[var(--c-accent-main)]" />
        </div>

        <div className="emotional-block-2 space-y-4 sm:space-y-6 mt-8 sm:mt-12">
          <p className="text-xl sm:text-2xl font-cormorant italic text-[var(--c-accent-light)] tracking-wide">
            And now...
          </p>
          <p className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--c-text-main)] leading-snug">
            I have one question <br />
            <span className="text-[var(--c-accent-main)] font-script text-5xl sm:text-6xl block mt-4 sm:mt-6">
              for you.
            </span>
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="emotional-next-btn w-full max-w-xs pb-24 sm:pb-28 mt-8 flex flex-col items-center relative z-30 pointer-events-auto">
        <button
          id="emotional-continue-btn"
          onClick={onNext}
          className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(232,137,157,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shine-effect"
        >
          <span>Ask The Question ❤️</span>
          <ChevronRight className="w-4 h-4 text-[var(--c-bg-darkest)] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
