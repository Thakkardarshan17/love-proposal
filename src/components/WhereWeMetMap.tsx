import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Heart, Sparkles, Navigation, Check, Edit2 } from 'lucide-react';
import { ProposalConfig } from '../types';

interface WhereWeMetMapProps {
  config: ProposalConfig;
  onSaveConfig: (updatedConfig: ProposalConfig) => void;
  syncStatus?: 'synced' | 'syncing' | 'offline';
}

export function WhereWeMetMap({
  config,
  onSaveConfig,
  syncStatus
}: WhereWeMetMapProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(config.whereWeMetName || "Our Magical Place");
  const [markerX, setMarkerX] = useState(config.whereWeMetX !== undefined ? config.whereWeMetX : 58.5);
  const [markerY, setMarkerY] = useState(config.whereWeMetY !== undefined ? config.whereWeMetY : 46.2);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Synchronize local state with props when database updates
  useEffect(() => {
    if (config.whereWeMetName) setLocalName(config.whereWeMetName);
    if (config.whereWeMetX !== undefined) setMarkerX(config.whereWeMetX);
    if (config.whereWeMetY !== undefined) setMarkerY(config.whereWeMetY);
  }, [config.whereWeMetName, config.whereWeMetX, config.whereWeMetY]);

  // Handle map click to reposition marker
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const xPercent = parseFloat(((e.clientX - rect.left) / rect.width * 100).toFixed(1));
    const yPercent = parseFloat(((e.clientY - rect.top) / rect.height * 100).toFixed(1));
    
    // Bounds check
    const boundedX = Math.max(2, Math.min(98, xPercent));
    const boundedY = Math.max(2, Math.min(98, yPercent));
    
    setMarkerX(boundedX);
    setMarkerY(boundedY);
  };

  const handleSave = () => {
    onSaveConfig({
      ...config,
      whereWeMetName: localName.trim() || "Our Magical Spot",
      whereWeMetX: markerX,
      whereWeMetY: markerY
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-gradient-to-b from-[var(--c-bg-darkest)] to-[var(--c-bg-dark)] border border-[var(--c-accent-main)]/30 rounded-2xl p-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] text-center relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-[var(--c-accent-main)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[var(--c-accent-gold)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--c-accent-main)]/10">
        <div className="flex items-center gap-1.5 text-left">
          <Navigation className="w-4 h-4 text-[var(--c-accent-gold)] animate-pulse" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--c-accent-gold)] font-serif">Where We Met</h4>
            <p className="text-[10px] text-[var(--c-accent-light)]/60">Tap to place our heart on the map</p>
          </div>
        </div>

        {/* Edit Toggle */}
        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
            isEditing 
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
              : "bg-[var(--c-accent-main)]/10 text-[var(--c-accent-light)] hover:text-white border border-[var(--c-accent-main)]/20"
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-3 h-3" />
              <span>Save Spot</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3 h-3 text-[var(--c-accent-gold)]" />
              <span>Move Heart</span>
            </>
          )}
        </button>
      </div>

      {/* SVG Map Container */}
      <div 
        ref={mapRef}
        onClick={handleMapClick}
        className={`relative w-full aspect-[1.8/1] rounded-xl overflow-hidden bg-black/40 border border-[var(--c-accent-main)]/15 select-none ${
          isEditing ? "cursor-crosshair border-[var(--c-accent-main)]/40 ring-1 ring-[var(--c-accent-main)]/20" : ""
        }`}
      >
        {/* Beautiful Grid Layout Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(244,63,94,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,63,94,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Minimalist World Map Outlines (Highly stylized, beautiful custom rose vectors) */}
        <svg 
          viewBox="0 0 600 330" 
          className="absolute inset-0 w-full h-full text-[var(--c-accent-main)]/15 fill-current opacity-85 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* North America */}
          <path d="M40 50 Q 80 40 120 45 T 160 30 T 200 40 T 220 70 Q 200 100 180 120 T 140 160 T 100 180 T 80 140 Z" />
          {/* Greenland */}
          <path d="M210 20 Q 230 15 250 25 T 240 50 Z" />
          {/* South America */}
          <path d="M140 170 Q 160 170 180 190 T 200 230 T 190 270 T 150 310 T 130 260 T 130 200 Z" />
          {/* Eurasia + Europe */}
          <path d="M270 40 Q 320 20 370 25 T 440 20 T 520 30 T 560 60 T 540 100 T 480 110 T 420 120 T 360 100 T 300 70 T 260 60 Z" />
          {/* Africa */}
          <path d="M280 100 Q 330 90 350 110 T 380 150 T 360 200 T 340 240 T 320 210 T 300 170 T 270 120 Z" />
          {/* India Peninsula (The focal romantic touch point) */}
          <path d="M390 100 Q 410 110 420 125 T 425 150 T 415 165 T 400 150 T 390 120 Z" className="text-[var(--c-accent-gold)]/25" />
          {/* East Asia & Japan */}
          <path d="M480 80 Q 510 90 530 110 T 550 150 T 510 180 T 470 150 Z" />
          {/* Australia */}
          <path d="M480 200 Q 520 200 540 220 T 530 260 T 480 250 T 460 220 Z" />
        </svg>

        {/* Elegant Latitude Equator and Meridian Lines */}
        <div className="absolute left-0 right-0 top-1/2 border-t border-[var(--c-accent-main)]/10 border-dashed pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-1/2 border-l border-[var(--c-accent-main)]/10 border-dashed pointer-events-none" />

        {/* Pulse Ripple Effect behind marker */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${markerX}%`, top: `${markerY}%` }}
        >
          <div className="w-10 h-10 bg-[var(--c-accent-main)]/20 rounded-full animate-ping absolute -left-5 -top-5" />
          <div className="w-6 h-6 bg-[var(--c-accent-gold)]/10 rounded-full animate-ping absolute -left-3 -top-3" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Styled Pulsing Heart Marker */}
        <motion.div 
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{ left: `${markerX}%`, top: `${markerY}%` }}
          animate={{ scale: isEditing ? [1, 1.2, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="relative">
            <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
            <Sparkles className="w-2.5 h-2.5 text-[var(--c-accent-gold)] absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </motion.div>

        {/* Coordinate Display */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm border border-white/5 rounded px-1.5 py-0.5 text-[8px] text-[var(--c-accent-light)]/70 font-mono pointer-events-none">
          LAT: {((50 - markerY) * 1.8).toFixed(1)}° N, LON: {((markerX - 50) * 3.6).toFixed(1)}° E
        </div>

        {/* Help Banner during editing */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-2 left-2 right-2 bg-[var(--c-accent-main)] text-[var(--c-bg-darkest)] text-[9px] font-bold uppercase tracking-wider py-1 rounded shadow-md pointer-events-none flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Tap anywhere on the map to place the heart!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Place Description Input */}
      <div className="mt-3 text-center">
        {isEditing ? (
          <div className="flex gap-1.5 max-w-sm mx-auto">
            <input
              id="where-we-met-input"
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Where did you meet?"
              className="flex-1 bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 rounded-xl px-3 py-1.5 text-xs text-[var(--c-text-main)] placeholder-[var(--c-accent-light)]/40 focus:outline-none focus:border-[var(--c-accent-main)]/60"
              maxLength={40}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-3 bg-[var(--c-accent-main)] hover:bg-[var(--c-accent-light)] text-[var(--c-bg-darkest)] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center"
            >
              OK
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="text-xs font-serif font-bold text-[var(--c-text-main)] flex items-center justify-center gap-1.5">
              <span>{localName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-[var(--c-accent-light)]/60">
              The spot where our forever first aligned
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
