import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Heart, Sparkles, Hourglass } from 'lucide-react';

interface LoveAnniversaryCountdownProps {
  anniversaryDate?: string; // Format: YYYY-MM-DD
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isAnniversaryDay: boolean;
  yearsCompleted: number;
}

export const LoveAnniversaryCountdown: React.FC<LoveAnniversaryCountdownProps> = ({
  anniversaryDate = '2025-08-16'
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isAnniversaryDay: false,
    yearsCompleted: 0
  });

  useEffect(() => {
    const calculateCountdown = () => {
      try {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Parse user anniversary date
        const parts = anniversaryDate.split('-');
        if (parts.length !== 3) {
          throw new Error('Invalid date format');
        }

        const startYear = parseInt(parts[0], 10);
        const startMonth = parseInt(parts[1], 10) - 1; // 0-indexed
        const startDay = parseInt(parts[2], 10);

        // Target date in current year
        let targetDate = new Date(currentYear, startMonth, startDay, 0, 0, 0, 0);

        // Check if today is exactly the anniversary
        const isTodayAnniversary =
          now.getMonth() === startMonth && now.getDate() === startDay;

        // Calculate completed years
        let yearsCompleted = currentYear - startYear;

        // If anniversary in current year is in the future, yearsCompleted should be based on previous year
        if (targetDate.getTime() > now.getTime() && !isTodayAnniversary) {
          yearsCompleted = Math.max(0, yearsCompleted - 1);
        }

        // If targetDate has already passed this year, the next anniversary is next year
        if (targetDate.getTime() < now.getTime() && !isTodayAnniversary) {
          targetDate = new Date(currentYear + 1, startMonth, startDay, 0, 0, 0, 0);
        }

        const diffMs = targetDate.getTime() - now.getTime();

        if (isTodayAnniversary) {
          setTimeRemaining({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isAnniversaryDay: true,
            yearsCompleted: Math.max(1, currentYear - startYear)
          });
        } else {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

          setTimeRemaining({
            days,
            hours,
            minutes,
            seconds,
            isAnniversaryDay: false,
            yearsCompleted
          });
        }
      } catch (err) {
        console.error('Error calculating anniversary countdown:', err);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  // Formatting helper to add leading zero
  const formatNum = (num: number) => String(num).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto p-5 sm:p-6 rounded-2xl bg-[var(--c-bg-darker)]/80 border border-[var(--c-accent-main)]/35 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden text-center my-6"
    >
      {/* Decorative absolute corner glows */}
      <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-[var(--c-accent-main)]/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-[var(--c-accent-gold)]/10 blur-xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {timeRemaining.isAnniversaryDay ? (
          <motion.div
            key="celebration"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-4 space-y-3"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[var(--c-accent-main)]/30 to-[var(--c-accent-gold)]/30 blur-md animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--c-accent-main)] to-[var(--c-accent-gold)] flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-[var(--c-bg-darkest)] fill-[var(--c-bg-darkest)] animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-gradient-rose">
                Happy Anniversary! ❤️
              </h4>
              <p className="text-sm text-[var(--c-accent-gold)] font-medium">
                Celebrating {timeRemaining.yearsCompleted} {timeRemaining.yearsCompleted === 1 ? 'Year' : 'Years'} of Endless Love
              </p>
              <p className="text-xs text-[var(--c-text-main)]/80 italic px-4 pt-1 max-w-xs mx-auto">
                &ldquo;Every day with you is a beautiful chapter of my favorite love story.&rdquo;
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header/Title */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--c-accent-light)]/95">
              <Hourglass className="w-3.5 h-3.5 text-[var(--c-accent-gold)] animate-spin-slow" />
              <span>Countdown to Our Next Anniversary</span>
            </div>

            {/* Timer Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 px-1">
              {/* Days */}
              <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                <span className="text-xl sm:text-2xl font-black font-mono text-[var(--c-text-main)]">
                  {formatNum(timeRemaining.days)}
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent-light)]/70 mt-1">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                <span className="text-xl sm:text-2xl font-black font-mono text-[var(--c-text-main)]">
                  {formatNum(timeRemaining.hours)}
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent-light)]/70 mt-1">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                <span className="text-xl sm:text-2xl font-black font-mono text-[var(--c-text-main)]">
                  {formatNum(timeRemaining.minutes)}
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent-light)]/70 mt-1">
                  Min
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                <span className="text-xl sm:text-2xl font-black font-mono text-[var(--c-accent-gold)]">
                  {formatNum(timeRemaining.seconds)}
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent-gold)]/80 mt-1">
                  Sec
                </span>
              </div>
            </div>

            {/* Anniversary milestone badge */}
            <div className="pt-1 flex items-center justify-center gap-1 text-[11px] text-[var(--c-accent-light)]/75">
              <Calendar className="w-3.5 h-3.5 text-[var(--c-accent-main)]" />
              <span>
                Anniversary Date: <strong className="text-[var(--c-text-main)]">{new Date(anniversaryDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</strong>
              </span>
              <span className="text-[var(--c-accent-gold)]">
                ({timeRemaining.yearsCompleted} {timeRemaining.yearsCompleted === 1 ? 'Year' : 'Years'} Done)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
