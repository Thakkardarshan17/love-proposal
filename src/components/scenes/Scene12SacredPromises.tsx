import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, ChevronRight, CheckCircle2, Shield, Moon, Rocket, Lock, Coffee, Infinity as InfinityIcon } from 'lucide-react';
import gsap from 'gsap';
import { ProposalConfig } from '../../types';
import { audioEngine } from '../../utils/audioSynthesizer';

interface Scene12SacredPromisesProps {
  config: ProposalConfig;
  onNext: () => void;
  primaryPhoto?: string;
}

interface SacredPromise {
  id: number;
  icon: React.ReactNode;
  title: string;
  hindiVow: string;
  englishMeaning: string;
}

export const Scene12SacredPromises: React.FC<Scene12SacredPromisesProps> = ({
  config,
  onNext,
  primaryPhoto
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pledged, setPledged] = useState<number[]>([1]);

  const promises: SacredPromise[] = [
    {
      id: 1,
      icon: <Heart className="w-4 h-4 text-[#FF2A55] fill-[#FF2A55]" />,
      title: "1. Sacred Respect & Honour (Izzat & Barabari)",
      hindiVow: "Har mod aur har faisle me tumhari izzat aur barabari sabse aage hogi.",
      englishMeaning: "I promise to respect your individuality, your mind, and your dignity above all."
    },
    {
      id: 2,
      icon: <Shield className="w-4 h-4 text-[#D8A06C]" />,
      title: "2. Shield in Every Storm (Dukh-Sukh Ka Saath)",
      hindiVow: "Zindagi me chahe dhoop ho ya chhaon, tumhara hath kabhi nahi chhodunga.",
      englishMeaning: "In your hardest days, I promise to be your strongest shelter and softest place to land."
    },
    {
      id: 3,
      icon: <Moon className="w-4 h-4 text-[#F7B8C5]" />,
      title: "3. Never Sleep in Anger (Shikwa Mita Kar Sona)",
      hindiVow: "Chahe din kitna bhi ladaayi bhara ho, raat dhalne se pehle gale lagkar sab theek karenge.",
      englishMeaning: "No misunderstanding or ego will ever be bigger than our love."
    },
    {
      id: 4,
      icon: <Rocket className="w-4 h-4 text-purple-300" />,
      title: "4. Champion of Your Dreams (Sapno Ko Pankh)",
      hindiVow: "Tumhare har sapne ko poora karne me tumhara sabse bada supporter banunga.",
      englishMeaning: "I will celebrate your victories and cheer louder than anyone for your ambitions."
    },
    {
      id: 5,
      icon: <Lock className="w-4 h-4 text-emerald-400" />,
      title: "5. Unshakeable Loyalty & Truth (Saccha Dil)",
      hindiVow: "Mera dil, meri niyat aur meri wafadari sirf aur sirf tumhare liye rahegi.",
      englishMeaning: "Total transparency, open honesty, and a heart dedicated exclusively to you."
    },
    {
      id: 6,
      icon: <Coffee className="w-4 h-4 text-amber-300" />,
      title: "6. Daily Little Joys (Chhoti Chhoti Khushiyan)",
      hindiVow: "Tumhe roz hasana, subah ki chai aur shaam ki baaton me zindagi sajaye rakhna.",
      englishMeaning: "Making everyday life feel special through laughter, warm hugs, and silly moments."
    },
    {
      id: 7,
      icon: <InfinityIcon className="w-4 h-4 text-[#FF2A55]" />,
      title: "7. Forever Till Last Breath (Saat Janam Ka Bandhan)",
      hindiVow: "Is janam me hi nahi, aane wale har janam me bas tera hi banke rahunga.",
      englishMeaning: "Growing old, holding your wrinkled hands, and loving you more with every heartbeat."
    }
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.promises-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    )
    .fromTo(
      '.promise-item-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleTogglePledge = (id: number) => {
    audioEngine.playSparkle();
    setPledged(prev => 
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const handlePledgeAll = () => {
    audioEngine.playSparkle();
    setPledged([1, 2, 3, 4, 5, 6, 7]);
  };

  return (
    <section
      ref={containerRef}
      id="scene-12-sacred-promises"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-to-b from-[#220B17] via-[#2F0F20] to-[#14060E] text-center overflow-y-auto z-20"
    >
      {/* Warm Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#FF2A55]/15 via-[#E8899D]/20 to-[#D8A06C]/15 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="promises-header pt-2 flex flex-col items-center space-y-1.5 shrink-0">
        {primaryPhoto && (
          <div className="mb-1 relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D8A06C] shadow-[0_0_20px_rgba(216,160,108,0.5)]">
              <img
                src={primaryPhoto}
                alt="Our Dream Promises"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#E8899D] rounded-full p-1 border border-[#12080D]">
              <Heart className="w-3 h-3 text-[#12080D] fill-[#12080D]" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D8A06C] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
          <span>Sacred Lifetime Vows</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gradient-rose tracking-wide">
          Saat Pheron Ke 7 Vade 💍
        </h2>
        <p className="text-xs text-[#F7B8C5]/80 italic max-w-xs">
          My eternal pledges to you, {config.partnerName}. Tap each to seal in our hearts.
        </p>

        {/* Progress pill */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#E8899D]/20 border border-[#E8899D]/40 text-[#FFF3EF]">
            {pledged.length} / 7 Vows Sealed ❤️
          </span>
          {pledged.length < 7 && (
            <button
              onClick={handlePledgeAll}
              className="text-[10px] text-[#D8A06C] underline hover:text-[#FFF3EF] cursor-pointer"
            >
              Seal All Vows ✨
            </button>
          )}
        </div>
      </div>

      {/* Promises List (Scrollable Cards) */}
      <div className="w-full max-w-sm sm:max-w-md py-4 space-y-3">
        {promises.map((p) => {
          const isSealed = pledged.includes(p.id);
          return (
            <div
              key={p.id}
              onClick={() => handleTogglePledge(p.id)}
              className={`promise-item-card p-4 rounded-2xl transition-all cursor-pointer text-left border ${
                isSealed
                  ? 'bg-gradient-to-r from-[#2F1020]/90 to-[#220B17]/95 border-[#E8899D]/50 shadow-[0_0_20px_rgba(232,137,157,0.25)]'
                  : 'bg-[#1C0B14]/80 border-white/10 opacity-70 hover:opacity-100 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                    {p.icon}
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#FFF3EF]">
                    {p.title}
                  </h3>
                </div>
                {isSealed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                ) : (
                  <span className="text-[10px] text-[#F7B8C5]/60">Tap to seal</span>
                )}
              </div>

              <p className="font-serif text-xs sm:text-sm text-[#F7B8C5] leading-relaxed pl-8">
                &ldquo;{p.hindiVow}&rdquo;
              </p>
              <p className="text-[11px] text-[#D8A06C]/90 italic pl-8 pt-1">
                {p.englishMeaning}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="w-full max-w-xs pb-4 pt-2 flex flex-col items-center shrink-0">
        <button
          id="promises-next-btn"
          onClick={() => {
            audioEngine.playSparkle();
            onNext();
          }}
          className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(232,137,157,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
        >
          <span>Read Next Love Shayari</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
