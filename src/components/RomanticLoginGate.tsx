/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Heart, KeyRound, Sparkles, Eye, EyeOff, ShieldCheck, ArrowRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RomanticLoginGateProps {
  onLoginSuccess: (userName: string) => void;
  partnerName?: string;
  yourName?: string;
  primaryPhoto?: string;
}

export const RomanticLoginGate: React.FC<RomanticLoginGateProps> = ({
  onLoginSuccess,
  partnerName = 'Labdhi',
  yourName = 'Deep',
  primaryPhoto
}) => {
  // Select which persona is logging in on THIS device
  const [selectedPersona, setSelectedPersona] = useState<'partner' | 'creator' | 'custom'>(() => {
    try {
      const saved = localStorage.getItem('romantic_chat_user_name');
      if (saved && saved.toLowerCase().includes(yourName.toLowerCase())) return 'creator';
      return 'partner';
    } catch {
      return 'partner';
    }
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const activeDisplayName =
    selectedPersona === 'partner' ? partnerName : selectedPersona === 'creator' ? yourName : customName.trim() || 'My Love';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim().toLowerCase();

    // Passcode check:
    // Username: "i love you" (case-insensitive)
    // Password: "i love you 2" (case-insensitive)
    // Also support quick single word pass "love" or "deep" or "labdhi" for smooth access if needed
    const isValidCreds =
      (cleanUser === 'i love you' && cleanPass === 'i love you 2') ||
      (cleanUser === 'love' && cleanPass === 'love') ||
      (cleanUser.includes('love') && cleanPass.includes('love'));

    if (isValidCreds) {
      setError('');
      setIsSuccess(true);

      try {
        localStorage.setItem('romantic_chat_user_name', activeDisplayName);
        sessionStorage.setItem('romantic_chat_user_name', activeDisplayName);
        localStorage.setItem('romantic_user_role', selectedPersona === 'creator' ? 'boyfriend' : 'girlfriend');
      } catch {}

      // Celebrate with romantic burst
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['var(--c-accent-main)', 'var(--c-accent-light)', 'var(--c-accent-gold)', 'var(--c-text-main)']
        });
      } catch {}

      setTimeout(() => {
        onLoginSuccess(activeDisplayName);
      }, 800);
    } else {
      setError('Secret love credentials do not match! (Hint: Username: "I LOVE YOU", Password: "I LOVE YOU 2")');
    }
  };

  return (
    <div
      id="romantic-login-screen"
      className="relative flex flex-col items-center justify-center min-h-svh w-full px-4 sm:px-6 py-10 bg-gradient-to-b from-[var(--c-bg-darkest)]/90 via-[var(--c-bg-dark)]/80 to-[var(--c-bg-darker)]/90 text-center overflow-hidden z-10"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] rounded-full bg-gradient-to-tr from-[var(--c-accent-main)]/20 via-[var(--c-accent-gold)]/15 to-[var(--c-accent-light)]/20 blur-[130px] pointer-events-none" />

      {/* Main Glass Box */}
      <div className="relative w-full max-w-md rounded-3xl bg-[var(--c-bg-darker)]/90 backdrop-blur-xl border border-[var(--c-accent-main)]/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-[var(--c-text-main)] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Heart Lock Icon or Dream Photo Avatar */}
        <div className="relative mb-4">
          <div className="absolute -inset-3 rounded-full bg-[var(--c-accent-main)]/30 blur-xl animate-pulse" />
          {primaryPhoto ? (
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-[var(--c-accent-gold)] shadow-[0_0_30px_rgba(216,160,108,0.5)] rotate-[-2deg]">
              <img
                src={primaryPhoto}
                alt="Our Dream Moment"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-1">
                {isSuccess ? (
                  <ShieldCheck className="w-5 h-5 text-[#25D366]" />
                ) : (
                  <Heart className="w-4 h-4 text-[var(--c-accent-main)] fill-[var(--c-accent-main)]" />
                )}
              </div>
            </div>
          ) : (
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[var(--c-bg-dark)] to-[var(--c-bg-light)] border-2 border-[var(--c-accent-gold)]/70 flex items-center justify-center shadow-[0_0_30px_rgba(216,160,108,0.4)]">
              {isSuccess ? (
                <ShieldCheck className="w-9 h-9 text-[#25D366] animate-bounce" />
              ) : (
                <Lock className="w-8 h-8 text-[var(--c-accent-main)] animate-pulse" />
              )}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-[var(--c-accent-gold)] rounded-full p-1 border border-[var(--c-bg-darkest)] shadow-md">
            <Heart className="w-3.5 h-3.5 text-[var(--c-bg-darkest)] fill-[var(--c-bg-darkest)]" />
          </div>
        </div>

        {/* Portal Persona Switcher (Clean Single Device Selector) */}
        <div className="w-full mb-5">
          <p className="text-[11px] font-semibold text-[var(--c-accent-gold)] uppercase tracking-widest mb-2">
            Select Your Login Profile
          </p>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/40 border border-[var(--c-accent-main)]/20">
            {/* Labdhi Profile Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedPersona('partner');
                setError('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedPersona === 'partner'
                  ? 'bg-gradient-to-r from-[var(--c-accent-main)] to-[var(--c-accent-light)] text-[var(--c-bg-darkest)] shadow-md scale-[1.02]'
                  : 'text-[var(--c-accent-light)]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>👸 {partnerName}</span>
            </button>

            {/* Deep Profile Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedPersona('creator');
                setError('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedPersona === 'creator'
                  ? 'bg-gradient-to-r from-[var(--c-accent-gold)] to-[var(--c-accent-light)] text-[var(--c-bg-darkest)] shadow-md scale-[1.02]'
                  : 'text-[var(--c-accent-light)]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🤴 {yourName}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Title for Selected Persona */}
        <div className="space-y-1 mb-5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[var(--c-accent-gold)] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {selectedPersona === 'partner' ? `${partnerName}'s Private Portal` : `${yourName}'s Portal`}
            </span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--c-text-main)]">
            {selectedPersona === 'partner'
              ? `Welcome, My Love ${partnerName} 💖`
              : `Welcome Back, ${yourName} ❤️`}
          </h1>
          <p className="text-xs text-[var(--c-accent-light)]/80 max-w-xs mx-auto">
            {selectedPersona === 'partner'
              ? `Enter the secret passcode to unlock ${yourName}'s interactive proposal.`
              : `Enter the secret passcode to unlock and chat live with ${partnerName}.`}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
          
          {/* Username Field */}
          <div className="space-y-1">
            <label
              htmlFor="login-username"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--c-accent-light)]"
            >
              Username
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[var(--c-accent-main)]">
                <Heart className="w-4 h-4 fill-[var(--c-accent-main)]/40" />
              </div>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter Username"
                required
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[var(--c-bg-darkest)]/70 border border-[var(--c-accent-main)]/30 focus:border-[var(--c-accent-gold)] focus:ring-2 focus:ring-[var(--c-accent-gold)]/30 rounded-xl text-sm text-[var(--c-text-main)] placeholder-[var(--c-accent-light)]/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--c-accent-light)]"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[var(--c-accent-gold)]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter Password"
                required
                autoComplete="off"
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-[var(--c-bg-darkest)]/70 border border-[var(--c-accent-main)]/30 focus:border-[var(--c-accent-gold)] focus:ring-2 focus:ring-[var(--c-accent-gold)]/30 rounded-xl text-sm text-[var(--c-text-main)] placeholder-[var(--c-accent-light)]/40 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-[var(--c-accent-light)]/70 hover:text-[var(--c-text-main)] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-shake">
              <Heart className="w-3.5 h-3.5 text-red-400 shrink-0 fill-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={isSuccess}
            className="w-full mt-2 py-3 px-5 rounded-xl font-bold text-sm tracking-wider uppercase text-[var(--c-bg-darkest)] bg-gradient-to-r from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] hover:brightness-110 active:scale-98 transition-all shadow-[0_0_20px_rgba(232,137,157,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSuccess ? (
              <>
                <Sparkles className="w-4 h-4 text-[var(--c-bg-darkest)] animate-spin" />
                <span>Entering as {activeDisplayName}...</span>
              </>
            ) : (
              <>
                <span>Enter as {activeDisplayName}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs text-[var(--c-accent-light)]/50 flex items-center gap-1.5">
        <Heart className="w-3 h-3 text-[var(--c-accent-main)] fill-[var(--c-accent-main)]" />
        <span>Made with eternal love for {partnerName} &amp; {yourName}</span>
      </div>
    </div>
  );
};

