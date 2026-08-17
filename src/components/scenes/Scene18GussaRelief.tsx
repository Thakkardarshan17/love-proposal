import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trash2, ShieldAlert, Heart, Hammer, Send, Smile, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProposalConfig } from '../../types';
import { saveSharedProposalData, GussaSignalState } from '../../lib/firebase';

interface Scene18GussaReliefProps {
  config: ProposalConfig;
  currentUserName: string;
  onNext: () => void;
}

export function Scene18GussaRelief({
  config,
  currentUserName,
  onNext
}: Scene18GussaReliefProps) {
  const [activeTab, setActiveTab] = useState<'bottle' | 'punch' | 'slap'>('bottle');
  
  // Game states
  const [bottleCrackCount, setBottleCrackCount] = useState(0);
  const [bottleBroken, setBottleBroken] = useState(false);
  const [bottleParticles, setBottleParticles] = useState<{ id: number; x: number; y: number; vx: number; vy: number; rot: number; color: string }[]>([]);
  
  const [punchBagAngle, setPunchBagAngle] = useState(0);
  const [punchImpact, setPunchImpact] = useState(false);
  const [punchCount, setPunchCount] = useState(0);
  
  const [slapWobble, setSlapWobble] = useState(false);
  const [slapCount, setSlapCount] = useState(0);
  const [lastSlapSide, setLastSlapSide] = useState<'left' | 'right'>('left');

  // Broadcast state
  const [recentVentMessage, setRecentVentMessage] = useState("");
  const [broadcastStatus, setBroadcastStatus] = useState<string>("");

  // Play satisfying custom Synthesized Sound Effects (No external assets required!)
  const playSynthesizedSound = (type: 'break' | 'crack' | 'punch' | 'slap' | 'squeak') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'crack') {
        // High pitched click / glass fracture
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'break') {
        // Multi-frequency metallic glass shatter
        const freqs = [800, 1500, 2200, 3100];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.01);
          osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2 + idx * 0.02);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        });
      } else if (type === 'punch') {
        // Deep low frequency physical impact
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'slap') {
        // High-mid crisp physical snap sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'squeak') {
        // Playful toy squeak
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.07);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch {}

    // Trigger phone/device vibration
    if (navigator.vibrate) {
      navigator.vibrate(type === 'break' ? 80 : 35);
    }
  };

  // 🍾 GLASS BOTTLE BREAK MECHANICS
  const handleBottleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (bottleBroken) return;
    
    const newCrack = bottleCrackCount + 1;
    if (newCrack >= 5) {
      setBottleBroken(true);
      playSynthesizedSound('break');
      setRecentVentMessage(`${currentUserName} just shattered a bottle in the Gussa Zone! 🍾💥`);
      
      // Spawn explosion shards
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      const shards = Array.from({ length: 24 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 8;
        return {
          id: i,
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // skew upward
          rot: Math.random() * 360,
          color: idxToGlassColor(i)
        };
      });
      setBottleParticles(shards);
    } else {
      setBottleCrackCount(newCrack);
      playSynthesizedSound('crack');
    }
  };

  const idxToGlassColor = (i: number) => {
    const colors = ['#059669', '#34d399', '#a7f3d0', '#fb7185', '#ffe4e6'];
    return colors[i % colors.length];
  };

  const resetBottle = () => {
    setBottleCrackCount(0);
    setBottleBroken(false);
    setBottleParticles([]);
    playSynthesizedSound('squeak');
  };

  // 🥊 PUNCHING BAG MECHANICS
  const handlePunch = () => {
    setPunchBagAngle(35);
    setPunchImpact(true);
    setPunchCount(prev => prev + 1);
    playSynthesizedSound('punch');
    
    setRecentVentMessage(`${currentUserName} sent a punch to the punching bag in the Gussa Zone! 🥊💥`);

    setTimeout(() => {
      setPunchImpact(false);
    }, 150);

    setTimeout(() => {
      setPunchBagAngle(0);
    }, 300);
  };

  // 👋 SLAP MECHANICS
  const handleSlap = (side: 'left' | 'right') => {
    setSlapWobble(true);
    setLastSlapSide(side);
    setSlapCount(prev => prev + 1);
    playSynthesizedSound('slap');
    
    setRecentVentMessage(`${currentUserName} slapped the funny anger-cushion cushion! 👋🤪`);

    setTimeout(() => {
      setSlapWobble(false);
    }, 250);
  };

  // Broadcast Gussa state real-time to partner
  const broadcastFrustration = async (msg: string) => {
    setBroadcastStatus("sending");
    const signal: GussaSignalState = {
      senderName: currentUserName,
      timestamp: Date.now(),
      type: activeTab,
      count: activeTab === 'bottle' ? bottleCrackCount : activeTab === 'punch' ? punchCount : slapCount,
      message: msg || `Blowing off some sweet frustration! 😡`
    };

    const success = await saveSharedProposalData({
      gussaSignal: signal
    }, currentUserName);

    if (success) {
      setBroadcastStatus("sent");
      setTimeout(() => setBroadcastStatus(""), 2000);
    } else {
      setBroadcastStatus("error");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto p-4 sm:p-5 flex flex-col justify-center items-center text-center">
      {/* Upper Badge */}
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="px-3.5 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-[10px] sm:text-xs font-bold text-red-400 tracking-wider uppercase mb-3 flex items-center gap-1.5"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
        <span>Gussa Relief Zone (गुस्सा शांत करने की जगह)</span>
      </motion.div>

      {/* Main Title card */}
      <div className="space-y-1.5 mb-5">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--c-text-main)] tracking-tight">
          Release Your Anger Playfully!
        </h2>
        <p className="text-xs text-[var(--c-accent-light)]/70 max-w-xs mx-auto leading-relaxed">
          Jab gussa aaye toh humein batane ke bajaye yahan apna gussa nikaalein! 🍾 Punch karein ya bottle todein.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm mb-6 bg-black/45 p-1 rounded-xl border border-[var(--c-accent-main)]/15">
        {[
          { id: 'bottle', label: '🍾 Break Bottle', desc: 'Tap to crack' },
          { id: 'punch', label: '🥊 Punching', desc: 'Punch hard' },
          { id: 'slap', label: '👋 Squeaky Slap', desc: 'Slap left/right' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-red-500/20 text-red-300 border border-red-500/35 shadow-sm'
                : 'text-[var(--c-accent-light)]/60 hover:text-[var(--c-text-main)] hover:bg-white/5'
            }`}
          >
            <div className="text-xs font-bold whitespace-nowrap">{tab.label}</div>
            <div className="text-[8px] opacity-50 mt-0.5">{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Interactive Playground Sandbox Canvas */}
      <div className="w-full aspect-[1.1/1] sm:aspect-[1.2/1] bg-gradient-to-b from-black/40 to-black/60 rounded-2xl border border-[var(--c-accent-main)]/15 relative overflow-hidden flex flex-col items-center justify-center p-4">
        
        {/* Subtle Background Target Circles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <div className="w-72 h-72 rounded-full border-4 border-dashed border-red-500" />
          <div className="w-48 h-48 rounded-full border-4 border-dashed border-red-500 absolute" />
          <div className="w-24 h-24 rounded-full border-4 border-dashed border-red-500 absolute" />
        </div>

        {/* 1. BOTTLE BREAKER WORKSPACE */}
        {activeTab === 'bottle' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
            <AnimatePresence mode="popLayout">
              {!bottleBroken ? (
                <motion.div
                  key="active-bottle"
                  onClick={handleBottleTap}
                  className="cursor-pointer active:scale-95 transition-transform flex flex-col items-center relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ rotate: [-2, 2, -2, 0] }}
                >
                  {/* Styled SVG Glass Bottle */}
                  <div className="relative w-20 h-48 flex items-center justify-center">
                    <svg viewBox="0 0 100 240" className="w-16 h-40 drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)]">
                      {/* Glass Body */}
                      <path 
                        d="M 35 20 Q 50 15 65 20 L 65 60 Q 65 75 75 90 L 85 110 L 85 220 Q 85 230 75 230 L 25 230 Q 15 230 15 220 L 15 110 L 25 90 Q 35 75 35 60 Z" 
                        fill="#065f46" 
                        stroke="#10b981" 
                        strokeWidth="3"
                        opacity="0.85"
                      />
                      {/* Bottle Label */}
                      <rect x="25" y="125" width="50" height="50" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
                      <text x="50" y="155" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle">GUSSA</text>

                      {/* Crack vectors overlay dynamically based on crack count */}
                      {bottleCrackCount >= 1 && (
                        <path d="M 50 120 L 30 100 M 50 120 L 70 95" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                      )}
                      {bottleCrackCount >= 2 && (
                        <path d="M 40 160 L 20 185 M 40 160 L 55 190" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                      )}
                      {bottleCrackCount >= 3 && (
                        <path d="M 65 140 L 80 165 L 75 180" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                      )}
                      {bottleCrackCount >= 4 && (
                        <path d="M 50 60 L 50 200 M 15 110 L 85 110" stroke="#ff3b30" strokeWidth="3" strokeLinecap="round" />
                      )}
                    </svg>

                    {/* Crack count display inside bottle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono pointer-events-none">
                      Tap {5 - bottleCrackCount}x More
                    </div>
                  </div>
                  <p className="text-[10px] text-[var(--c-accent-light)]/40 mt-1">Tap hard on the glass bottle to smash it!</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="broken-bottle" 
                  className="w-full h-full flex flex-col items-center justify-center relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Particle fragment explosion rendering */}
                  <div className="absolute inset-0 pointer-events-none">
                    {bottleParticles.map((pt) => (
                      <motion.div
                        key={pt.id}
                        className="absolute w-3.5 h-3.5 rounded-sm"
                        style={{
                          left: pt.x,
                          top: pt.y,
                          backgroundColor: pt.color,
                        }}
                        initial={{ scale: 1, rotate: pt.rot }}
                        animate={{
                          x: pt.vx * 35,
                          y: [0, pt.vy * 20, 250],
                          rotate: pt.rot + 360,
                          opacity: [1, 1, 0]
                        }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    ))}
                  </div>

                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="flex flex-col items-center gap-2 z-10 bg-black/70 p-4 rounded-xl border border-red-500/20"
                  >
                    <Trash2 className="w-10 h-10 text-red-500 animate-bounce" />
                    <h5 className="text-sm font-bold text-red-400">BOOM! SHATTERED! 🍾💥</h5>
                    <p className="text-[10px] text-[var(--c-accent-light)]/60 text-center">That felt satisfying, didn't it?</p>
                    
                    <button
                      onClick={resetBottle}
                      className="mt-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-lg cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Hammer className="w-3.5 h-3.5" />
                      <span>Place New Bottle</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 2. PUNCHING BAG WORKSPACE */}
        {activeTab === 'punch' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            
            {/* Top Anchor Ring & Chain */}
            <div className="w-1.5 h-16 bg-gray-600 rounded-b absolute top-0 z-0" />

            {/* Dynamic swinging punching bag */}
            <motion.div
              onClick={handlePunch}
              className="cursor-pointer select-none relative z-10 origin-top flex flex-col items-center"
              style={{ height: '140px', transformOrigin: 'top center' }}
              animate={{ 
                rotate: [0, punchBagAngle, -punchBagAngle * 0.7, punchBagAngle * 0.4, 0],
                scale: punchImpact ? 0.93 : 1
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Vertical Leather Punching Bag */}
              <div className="w-16 h-36 bg-gradient-to-r from-red-800 to-red-600 rounded-3xl border-2 border-red-500 shadow-lg relative flex flex-col items-center justify-center">
                <div className="absolute top-4 left-0 right-0 h-1 bg-black/40" />
                <div className="absolute bottom-4 left-0 right-0 h-1 bg-black/40" />
                <div className="text-center font-black text-2xl text-white opacity-40 select-none">🥊</div>
                <div className="absolute bottom-6 bg-black/40 px-1.5 rounded text-[8px] font-mono text-yellow-300">
                  Hits: {punchCount}
                </div>
              </div>
            </motion.div>

            {/* Impact Flash effect overlay */}
            <AnimatePresence>
              {punchImpact && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: 0.8, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  className="absolute w-24 h-24 rounded-full bg-yellow-400/20 border border-yellow-400 pointer-events-none flex items-center justify-center"
                >
                  <span className="text-xs font-black text-yellow-300 drop-shadow-md">WHACK!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[10px] text-[var(--c-accent-light)]/40 mt-3">Click or tap directly on the bag to punch it hard!</p>
          </div>
        )}

        {/* 3. SQUEAKY SLAP WORKSPACE */}
        {activeTab === 'slap' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
            
            {/* The Slappable target: A cute silly squeaking anger cushion/avatar */}
            <motion.div
              className="relative cursor-pointer flex flex-col items-center"
              animate={slapWobble ? {
                scale: [1, 0.82, 1.15, 0.95, 1],
                rotate: lastSlapSide === 'left' ? [-15, 10, -5, 0] : [15, -10, 5, 0],
                x: lastSlapSide === 'left' ? [0, 15, -8, 0] : [0, -15, 8, 0],
              } : {}}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {/* silly face helper cushion */}
              <div className="w-24 h-24 bg-gradient-to-r from-pink-600 to-pink-500 rounded-full border-4 border-pink-400 shadow-[0_4px_16px_rgba(236,72,153,0.3)] relative flex flex-col items-center justify-center">
                
                {/* goofy eyes */}
                <div className="flex gap-4 mb-1">
                  <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                  <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                </div>
                {/* spiral cheeks */}
                <div className="absolute left-3 w-3.5 h-2 bg-red-400/50 rounded-full" />
                <div className="absolute right-3 w-3.5 h-2 bg-red-400/50 rounded-full" />
                {/* funny mouth */}
                <div className="w-7 h-3.5 border-b-2 border-black rounded-b-xl" />
                
                {/* Squeaky squeaker badge */}
                <div className="absolute -top-1.5 bg-yellow-400 text-black font-black text-[7px] px-1 rounded shadow-sm">
                  SQUEAKY
                </div>
              </div>

              {/* Dynamic slap hands clickable zones */}
              <div className="flex justify-between w-40 mt-4 absolute inset-x-[-32px] top-[24px]">
                <button
                  onClick={() => handleSlap('left')}
                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 border border-rose-500/20 text-[9px] font-bold rounded-lg cursor-pointer transition-all hover:scale-110"
                >
                  👋 Slap Left
                </button>
                <button
                  onClick={() => handleSlap('right')}
                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 border border-rose-500/20 text-[9px] font-bold rounded-lg cursor-pointer transition-all hover:scale-110"
                >
                  Slap Right 👋
                </button>
              </div>
            </motion.div>

            {/* Slap Score */}
            <div className="bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono text-yellow-300 absolute bottom-12">
              Squeaky Slaps: {slapCount}
            </div>

            <p className="text-[10px] text-[var(--c-accent-light)]/40 mt-14">Slap the goofy cushion left or right to squeak away stress!</p>
          </div>
        )}
      </div>

      {/* Broadcaster control & live status feed */}
      <div className="w-full max-w-sm mt-4.5 bg-gradient-to-b from-[var(--c-bg-darkest)] to-[var(--c-bg-dark)] border border-red-500/15 p-3.5 rounded-xl">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-400 font-serif mb-1 flex items-center justify-center gap-1">
          <Send className="w-3.5 h-3.5" />
          <span>Alert Your Partner! (gussa send karein)</span>
        </h4>
        <p className="text-[10px] text-[var(--c-accent-light)]/60 mb-2 leading-relaxed">
          Aap chaho toh ek fun anger status update send karke apne partner ko playful alert de sakte hain!
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={recentVentMessage}
            onChange={(e) => setRecentVentMessage(e.target.value)}
            placeholder="E.g. Aaj mera dimaag kharab hai! 😡"
            className="flex-1 bg-black/40 border border-[var(--c-accent-main)]/20 rounded-lg px-2.5 py-1.5 text-xs text-[var(--c-text-main)] focus:outline-none focus:border-red-500/40"
            maxLength={60}
          />
          <button
            onClick={() => broadcastFrustration(recentVentMessage.trim())}
            disabled={broadcastStatus === "sending"}
            className="px-3 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1 whitespace-nowrap"
          >
            {broadcastStatus === "sending" ? (
              <span>Sending...</span>
            ) : broadcastStatus === "sent" ? (
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            ) : (
              <span>Send Gussa</span>
            )}
          </button>
        </div>

        {broadcastStatus === "sent" && (
          <p className="text-[9px] text-emerald-400 font-mono mt-1 animate-pulse">
            Partner notified! They will see your gussa alert real-time! 😡💖
          </p>
        )}
      </div>

      {/* Done / Continue button */}
      <button
        onClick={onNext}
        className="mt-6 px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-500 text-white text-xs font-bold tracking-wider rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_4px_16px_rgba(239,68,68,0.25)] flex items-center gap-1.5 cursor-pointer"
      >
        <span>I Feel Calmer Now! 😊</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
