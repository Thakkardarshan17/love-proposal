import React, { useEffect, useRef } from 'react';
import { Heart, Sparkles, RotateCcw, SlidersHorizontal, Share2, Check, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { ProposalConfig } from '../../types';

interface Scene12ForeverProps {
  config: ProposalConfig;
  onReplay: () => void;
  onOpenCustomizer: () => void;
  onOpenWhatsAppModal?: () => void;
  primaryPhoto?: string;
}

export const Scene12Forever: React.FC<Scene12ForeverProps> = ({
  config,
  onReplay,
  onOpenCustomizer,
  onOpenWhatsAppModal,
  primaryPhoto
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heartGlowRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const tl = gsap.timeline();

    if (heartGlowRef.current) {
      tl.fromTo(
        heartGlowRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.4)' }
      );
    }

    tl.fromTo(
      '.forever-silhouette',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo(
      '.forever-actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Our Love Story ❤️ — ${config.partnerName}`,
          text: `A romantic love journey for ${config.partnerName} and ${config.yourName}.`,
          url: window.location.href
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard?.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      ref={containerRef}
      id="scene-12-forever"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[#12080D] via-[#1C0B13] to-[#0A0407] text-center overflow-hidden z-20"
    >
      {/* Deep Celestial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[750px] h-[400px] sm:h-[750px] rounded-full bg-gradient-to-tr from-[#E8899D]/25 via-[#2A101B]/40 to-[#D8A06C]/20 blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#F7B8C5]/80 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
        <span>Our Infinite Journey</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
      </div>

      {/* Center Cinematic Giant Pulsing Heart & Text */}
      <div className="relative my-auto flex flex-col items-center max-w-sm sm:max-w-md w-full">
        <div ref={heartGlowRef} className="relative group my-4">
          {/* Heart Radiant Halo */}
          <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-[#E8899D]/30 to-[#D8A06C]/30 blur-3xl animate-pulse pointer-events-none" />

          {/* Giant Heart */}
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-[#2A101B] via-[#3A1422] to-[#1C0B13] border-2 border-[#E8899D] flex flex-col items-center justify-center glow-heart-intense shadow-[0_0_60px_rgba(232,137,157,0.7)] animate-pulse-heart">
            <Heart className="absolute inset-0 w-full h-full text-[#E8899D]/20 fill-[#E8899D]/10 p-4 pointer-events-none" />

            <div className="relative z-10 text-center space-y-1">
              <span className="block text-3xl sm:text-4xl font-serif font-black text-gradient-rose tracking-wider">
                Forever
              </span>
              <span className="block text-2xl sm:text-3xl font-script text-[#D8A06C]">
                &amp;
              </span>
              <span className="block text-3xl sm:text-4xl font-serif font-black text-[#FFF3EF] tracking-wider">
                Always
              </span>
            </div>
          </div>
        </div>

        {/* Couple Names & Dream Snapshot */}
        <div className="text-center mt-2 flex flex-col items-center">
          {primaryPhoto && (
            <div className="mb-2 relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#D8A06C] shadow-[0_0_25px_rgba(216,160,108,0.5)]">
                <img
                  src={primaryPhoto}
                  alt="Our Forever Love"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#E8899D] rounded-full p-1 border border-[#12080D]">
                <Heart className="w-3 h-3 text-[#12080D] fill-[#12080D]" />
              </div>
            </div>
          )}

          <p className="text-sm sm:text-base font-serif text-[#FFF3EF] flex items-center justify-center gap-2">
            <span>{config.partnerName}</span>
            <Heart className="w-4 h-4 text-[#E8899D] fill-[#E8899D]" />
            <span>{config.yourName}</span>
          </p>
          <p className="text-xs text-[#F7B8C5]/70 font-light mt-0.5">
            Two souls, one timeless journey
          </p>
        </div>

        {/* Silhouette of Couple Sitting Together Under Starlight */}
        <div className="forever-silhouette relative w-full max-w-xs mt-6 mb-2 flex justify-center">
          <svg
            viewBox="0 0 280 90"
            className="w-56 sm:w-64 h-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] opacity-95"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Romantic hill base */}
            <path
              d="M0 90 C 70 65, 210 65, 280 90 L 280 90 L 0 90 Z"
              fill="#0A0407"
            />
            {/* Couple Silhouette sitting close */}
            {/* Bench / ground */}
            <ellipse cx="140" cy="74" rx="45" ry="5" fill="#1C0B13" />
            {/* Person Left (Leaning Head) */}
            <circle cx="132" cy="50" r="7" fill="#050204" />
            <path d="M124 57 C124 57, 126 76, 133 76 C136 76, 137 60, 137 57 Z" fill="#050204" />
            {/* Person Right (Arm around) */}
            <circle cx="148" cy="48" r="7.5" fill="#050204" />
            <path d="M140 56 C140 56, 142 76, 150 76 C155 76, 156 59, 156 56 Z" fill="#050204" />
            {/* Connected arm / hand holding */}
            <path d="M130 63 Q140 68 150 63" stroke="#050204" strokeWidth="4" strokeLinecap="round" />
            {/* Tiny glowing heart floating above couple */}
            <circle cx="140" cy="38" r="2.5" fill="#E8899D" filter="drop-shadow(0 0 6px #E8899D)" />
          </svg>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="forever-actions w-full max-w-xs space-y-2.5 pb-2">
        {/* WhatsApp Send Love Message Button */}
        {onOpenWhatsAppModal ? (
          <button
            id="forever-whatsapp-btn"
            onClick={onOpenWhatsAppModal}
            className="w-full py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#12080D] font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Send Love on WhatsApp ({config.whatsappNumber || '+91 7201030048'})</span>
          </button>
        ) : (
          <a
            id="forever-whatsapp-direct-link"
            href={`https://wa.me/${(config.whatsappNumber || '+91 7201030048').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Forever & Always with you! ❤️💍`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#12080D] font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Send Love on WhatsApp ({config.whatsappNumber || '+91 7201030048'})</span>
          </a>
        )}

        <button
          id="forever-replay-btn"
          onClick={onReplay}
          className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(232,137,157,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shine-effect"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay Our Love Story</span>
        </button>

        <div className="flex gap-2">
          <button
            id="forever-customize-btn"
            onClick={onOpenCustomizer}
            className="flex-1 py-2.5 px-3 rounded-xl glass-panel border border-[#E8899D]/40 text-[#F7B8C5] hover:text-[#FFF3EF] text-xs font-medium hover:border-[#E8899D] transition-colors flex items-center justify-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D8A06C]" />
            <span>Customize Names</span>
          </button>

          <button
            id="forever-share-btn"
            onClick={handleShare}
            className="flex-1 py-2.5 px-3 rounded-xl glass-panel border border-[#E8899D]/40 text-[#F7B8C5] hover:text-[#FFF3EF] text-xs font-medium hover:border-[#E8899D] transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#E8899D]" />
                <span>Share Story</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
