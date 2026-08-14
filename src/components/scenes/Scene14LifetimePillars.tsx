import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, ChevronRight, Home, Compass, Sun, HeartHandshake, Smile, Check } from 'lucide-react';
import gsap from 'gsap';
import { ProposalConfig } from '../../types';
import { audioEngine } from '../../utils/audioSynthesizer';

interface Scene14LifetimePillarsProps {
  config: ProposalConfig;
  onNext: () => void;
  primaryPhoto?: string;
}

interface Pillar {
  id: number;
  icon: React.ReactNode;
  title: string;
  hindiSummary: string;
  detail: string;
}

export const Scene14LifetimePillars: React.FC<Scene14LifetimePillarsProps> = ({
  config,
  onNext,
  primaryPhoto
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars: Pillar[] = [
    {
      id: 0,
      icon: <Home className="w-5 h-5 text-[#FF2A55]" />,
      title: "1. Safe Harbor (Surakshit Panaah)",
      hindiSummary: "Duniya chahe kitni bhi thaka de, meri baahein tumhara sabse mehfooz ghar hongi.",
      detail: "Whenever life gets overwhelming, you will never have to face anything alone. I will be your sanctuary, your peaceful haven, and your comforting embrace."
    },
    {
      id: 1,
      icon: <Compass className="w-5 h-5 text-[#D8A06C]" />,
      title: "2. Endless Patience (Beintehaa Samajh)",
      hindiSummary: "Tumhari khamoshi ko samajhna aur bina bole tumhara dard mehsoos karna.",
      detail: "I promise to listen with an open heart, to embrace your flaws just as deeply as your beauty, and to hold your hand through every emotional tide."
    },
    {
      id: 2,
      icon: <Sun className="w-5 h-5 text-amber-300" />,
      title: "3. Daily Choice (Har Subah Tumhe Chunna)",
      hindiSummary: "Pyaar sirf ek ehsaas nahi, ek wada hai jo main har roz naye jazbe se nibhaunga.",
      detail: "I promise to choose YOU every single morning—in good moods and bad moods, in triumphs and struggles, with intentional, unwavering devotion."
    },
    {
      id: 3,
      icon: <Smile className="w-5 h-5 text-pink-300" />,
      title: "4. Joy in the Mundane (Chhoti Khushiyan)",
      hindiSummary: "Kitchen me silly dance, raat ki chai aur zindagi ke har aam lamhe ko khaas banana.",
      detail: "We won't just celebrate big milestones; we will turn grocery runs, rainy evenings, and goofy conversations into our favourite memories."
    },
    {
      id: 4,
      icon: <HeartHandshake className="w-5 h-5 text-purple-300" />,
      title: "5. Wrinkles & 80s Together (Budhape Ka Saath)",
      hindiSummary: "Jab baal safed honge aur hath kanpenge, tab bhi meri aankhon me wahi pehla sa pyaar hoga.",
      detail: "Growing old with you is my greatest dream. Holding your wrinkled hand at 80 and smiling, knowing we loved with all our souls."
    }
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.pillars-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo(
      '.pillar-tab-btn',
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)' },
      '-=0.3'
    )
    .fromTo(
      '.pillar-active-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleSelectPillar = (id: number) => {
    setActivePillar(id);
    audioEngine.playSparkle();
  };

  return (
    <section
      ref={containerRef}
      id="scene-14-lifetime-pillars"
      className="relative flex flex-col items-center justify-between min-h-svh w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-to-b from-[#240C1A] via-[#331122] to-[#150610] text-center overflow-y-auto z-20"
    >
      {/* Warm Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#FF2A55]/15 via-[#E8899D]/20 to-[#D8A06C]/20 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="pillars-header pt-2 flex flex-col items-center space-y-1.5 shrink-0">
        {primaryPhoto && (
          <div className="mb-1 relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D8A06C] shadow-[0_0_20px_rgba(216,160,108,0.5)]">
              <img
                src={primaryPhoto}
                alt="Our Lifetime Foundation"
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
          <span>5 Pillars of Forever</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gradient-rose tracking-wide">
          Hamara Lifetime Promise 🌟
        </h2>
        <p className="text-xs text-[#F7B8C5]/80 italic max-w-xs">
          The unshakeable foundations of our love story
        </p>
      </div>

      {/* Pillars Tab Selector (Horizontal Pills) */}
      <div className="w-full max-w-sm sm:max-w-md py-3 shrink-0">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {pillars.map((p) => {
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPillar(p.id)}
                className={`pillar-tab-btn px-3 py-2 rounded-2xl flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] border-[#FFF3EF] shadow-[0_0_20px_rgba(232,137,157,0.5)] scale-105'
                    : 'bg-[#1C0B14]/80 border-white/10 text-[#F7B8C5] hover:border-white/30'
                }`}
              >
                {p.icon}
                <span>#{p.id + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Pillar Card */}
      <div className="relative my-auto py-2 flex flex-col items-center max-w-sm sm:max-w-md w-full">
        <div className="pillar-active-card w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#2E1021]/95 to-[#1A0813]/98 border-2 border-[#E8899D]/40 shadow-[0_0_40px_rgba(232,137,157,0.3)] text-left backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3 border-b border-[#E8899D]/20 pb-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              {pillars[activePillar].icon}
            </div>
            <div>
              <span className="text-[10px] text-[#D8A06C] uppercase tracking-wider font-bold block">
                Pillar {activePillar + 1} of 5
              </span>
              <h3 className="font-serif font-black text-base sm:text-lg text-[#FFF3EF]">
                {pillars[activePillar].title}
              </h3>
            </div>
          </div>

          {/* Hindi Pledge */}
          <div className="p-3 rounded-2xl bg-[#E8899D]/10 border border-[#E8899D]/30">
            <p className="font-serif text-xs sm:text-sm text-[#F7B8C5] leading-relaxed font-semibold">
              &ldquo;{pillars[activePillar].hindiSummary}&rdquo;
            </p>
          </div>

          {/* English Detail */}
          <p className="text-xs sm:text-sm text-[#FFF3EF]/90 leading-relaxed">
            {pillars[activePillar].detail}
          </p>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#D8A06C]">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#25D366]" />
              Promised to {config.partnerName}
            </span>
            <span className="font-script text-base text-[#FFF3EF]">
              — {config.yourName}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="w-full max-w-xs pb-4 flex flex-col items-center shrink-0">
        <button
          id="pillars-next-btn"
          onClick={() => {
            audioEngine.playSparkle();
            onNext();
          }}
          className="group w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(232,137,157,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shine-effect"
        >
          <span>Seal Our Eternal Love</span>
          <ChevronRight className="w-4 h-4 text-[#12080D] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
