/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Heart, KeyRound, Sparkles, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RomanticLoginGateProps {
  onLoginSuccess: () => void;
  partnerName?: string;
  yourName?: string;
}

export const RomanticLoginGate: React.FC<RomanticLoginGateProps> = ({
  onLoginSuccess,
  partnerName = 'My Love',
  yourName = 'Darshan'
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim().toLowerCase();

    // Required Credentials:
    // Username: "I LOVE YOU" (case-insensitive check)
    // Password: "I LOVE YOU 2" (case-insensitive check)
    if (cleanUser === 'i love you' && cleanPass === 'i love you 2') {
      setError('');
      setIsSuccess(true);

      // Celebrate with romantic burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E8899D', '#F7B8C5', '#D8A06C', '#FFF3EF']
        });
      } catch {}

      setTimeout(() => {
        onLoginSuccess();
      }, 900);
    } else {
      setError('Secret love credentials do not match! Please check the spelling.');
      setShowHint(true);
    }
  };

  return (
    <div
      id="romantic-login-screen"
      className="relative flex flex-col items-center justify-center min-h-svh w-full px-4 sm:px-6 py-10 bg-gradient-to-b from-[#12080D]/80 via-[#2A101B]/70 to-[#1C0B13]/80 text-center overflow-hidden z-10"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] rounded-full bg-gradient-to-tr from-[#E8899D]/20 via-[#D8A06C]/15 to-[#F7B8C5]/20 blur-[130px] pointer-events-none" />

      {/* Main Glass Box */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#1C0B13]/85 backdrop-blur-xl border border-[#E8899D]/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-[#FFF3EF] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        {/* Animated Heart Lock Icon */}
        <div className="relative mb-5">
          <div className="absolute -inset-3 rounded-full bg-[#E8899D]/30 blur-xl animate-pulse" />
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#2A101B] to-[#3A1422] border-2 border-[#D8A06C]/70 flex items-center justify-center shadow-[0_0_30px_rgba(216,160,108,0.4)]">
            {isSuccess ? (
              <ShieldCheck className="w-9 h-9 text-[#25D366] animate-bounce" />
            ) : (
              <Lock className="w-8 h-8 text-[#E8899D] animate-pulse" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#D8A06C] rounded-full p-1 border border-[#12080D]">
            <Heart className="w-3.5 h-3.5 text-[#12080D] fill-[#12080D]" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5 mb-6 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#D8A06C] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Love Portal</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF3EF]">
            Unlock Our Story
          </h1>
          <p className="text-xs sm:text-sm text-[#F7B8C5]/80 max-w-xs mx-auto">
            Please enter the secret password to open this special romantic proposal experience.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-username"
              className="block text-xs font-semibold uppercase tracking-wider text-[#F7B8C5]"
            >
              Username
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[#E8899D]">
                <Heart className="w-4 h-4 fill-[#E8899D]/40" />
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
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#12080D]/70 border border-[#E8899D]/30 focus:border-[#D8A06C] focus:ring-2 focus:ring-[#D8A06C]/30 rounded-xl text-sm text-[#FFF3EF] placeholder-[#F7B8C5]/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#F7B8C5]"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[#D8A06C]">
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
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-[#12080D]/70 border border-[#E8899D]/30 focus:border-[#D8A06C] focus:ring-2 focus:ring-[#D8A06C]/30 rounded-xl text-sm text-[#FFF3EF] placeholder-[#F7B8C5]/40 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-[#F7B8C5]/70 hover:text-[#FFF3EF] transition-colors cursor-pointer"
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
            className="w-full mt-2 py-3 px-5 rounded-xl font-bold text-sm tracking-wider uppercase text-[#12080D] bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] hover:brightness-110 active:scale-98 transition-all shadow-[0_0_20px_rgba(232,137,157,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSuccess ? (
              <>
                <Sparkles className="w-4 h-4 text-[#12080D] animate-spin" />
                <span>Unlocked! Opening Story...</span>
              </>
            ) : (
              <>
                <span>Unlock &amp; Enter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Credentials Clue / Hint */}
        <div className="mt-5 pt-4 border-t border-white/10 w-full flex flex-col items-center gap-1.5 text-center">
          <div className="text-[11px] text-[#F7B8C5]/70">
            <span>Username: </span>
            <strong className="text-[#FFF3EF] font-mono">I LOVE YOU</strong>
            <span className="mx-1.5">•</span>
            <span>Password: </span>
            <strong className="text-[#D8A06C] font-mono">I LOVE YOU 2</strong>
          </div>
        </div>
      </div>

      {/* Sweet footer footnote */}
      <div className="mt-6 text-xs text-[#F7B8C5]/50 flex items-center gap-1.5">
        <Heart className="w-3 h-3 text-[#E8899D] fill-[#E8899D]" />
        <span>Made with eternal love for {partnerName}</span>
      </div>
    </div>
  );
};
