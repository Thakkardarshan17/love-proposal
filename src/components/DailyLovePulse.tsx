import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Flame, Sparkles, Send, Bell, History } from 'lucide-react';
import { LoveSignalState, saveSharedProposalData } from '../lib/firebase';

interface DailyLovePulseProps {
  currentUserName: string;
  partnerName: string;
  loveSignal: LoveSignalState | null;
  onSendFeedback?: (msg: string) => void;
}

export function DailyLovePulse({
  currentUserName,
  partnerName,
  loveSignal,
  onSendFeedback
}: DailyLovePulseProps) {
  const [isSending, setIsSending] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [localHearts, setLocalHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Calculate current date strings
  const getLocalDateStr = () => new Date().toISOString().split('T')[0];
  const todayStr = getLocalDateStr();

  // Determine status
  const lastSender = loveSignal?.senderName || '';
  const lastTimestamp = loveSignal?.timestamp || 0;
  const lastDateStr = loveSignal?.streakLastDateStr || '';
  const streak = loveSignal?.streak || 0;
  const totalCount = loveSignal?.count || 0;

  const isSentByMeToday = lastSender === currentUserName && lastDateStr === todayStr;
  const isSentByPartnerToday = lastSender === partnerName && lastDateStr === todayStr;

  // Render last sent time
  const formatTime = (ts: number) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Trigger local heart burst animation
  const triggerHeartBurst = () => {
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: -50 - Math.random() * 100
    }));
    setLocalHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setLocalHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 1500);
  };

  // Send "I Love You" pulse to Firestore
  const handleSendLove = async (messageText?: string) => {
    if (isSending) return;
    setIsSending(true);
    triggerHeartBurst();

    try {
      const text = (messageText || customMsg || 'I Love You! ❤️').trim();
      let newStreak = streak;

      // Handle streak calculation
      if (lastDateStr === todayStr) {
        // Already interacted today, streak doesn't change
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDateStr === yesterdayStr) {
          newStreak = streak + 1; // Streak continues!
        } else {
          newStreak = 1; // Streak resets or starts fresh
        }
      }

      // Add to history
      const currentHistory = loveSignal?.history || [];
      const newHistoryItem = {
        senderName: currentUserName,
        timestamp: Date.now()
      };
      const updatedHistory = [newHistoryItem, ...currentHistory].slice(0, 10);

      const success = await saveSharedProposalData({
        loveSignal: {
          senderName: currentUserName,
          timestamp: Date.now(),
          message: text,
          count: totalCount + 1,
          streak: newStreak,
          streakLastDateStr: todayStr,
          history: updatedHistory
        }
      }, currentUserName);

      if (success) {
        setCustomMsg('');
        if (onSendFeedback) {
          onSendFeedback(`Love Signal sent to ${partnerName}! 💖`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto bg-gradient-to-b from-[var(--c-bg-dark)] to-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
      {/* Decorative floating lights */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--c-accent-main)]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[var(--c-accent-gold)]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--c-accent-main)]/10 border border-[var(--c-accent-main)]/30 flex items-center justify-center">
            <Heart className="w-4.5 h-4.5 text-[var(--c-accent-main)] animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--c-text-main)] font-serif">Daily Love Spark</h3>
            <p className="text-[10px] text-[var(--c-accent-light)]/70">Connect instantly in real-time</p>
          </div>
        </div>

        {/* Streak Counter */}
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-[var(--c-accent-gold)]/10 border border-[var(--c-accent-gold)]/30 px-2 py-0.5 rounded-full">
            <Flame className="w-3.5 h-3.5 text-[var(--c-accent-gold)] fill-current animate-bounce" />
            <span className="text-[10px] font-bold text-[var(--c-accent-gold)] font-mono">{streak} Day Streak</span>
          </div>
        )}
      </div>

      {/* Main Signal Display */}
      <div className="bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/15 rounded-xl p-3.5 text-center mb-4 relative min-h-[90px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {loveSignal ? (
            <motion.div
              key={lastTimestamp}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-1.5"
            >
              {isSentByMeToday ? (
                <div className="text-xs text-[var(--c-accent-light)]">
                  You sent a Love Signal to <span className="text-[var(--c-text-main)] font-bold">{partnerName}</span> today!
                </div>
              ) : isSentByPartnerToday ? (
                <div className="text-xs text-[var(--c-accent-gold)] font-medium">
                  {partnerName} sent you a Love Signal! ❤️
                </div>
              ) : lastSender ? (
                <div className="text-xs text-[var(--c-accent-light)]/80">
                  Last signal was from <span className="text-[var(--c-text-main)]">{lastSender}</span>
                </div>
              ) : null}

              <div className="text-sm font-bold text-[var(--c-text-main)] font-serif italic flex items-center justify-center gap-1 px-2">
                &ldquo;{loveSignal.message}&rdquo;
              </div>

              {lastTimestamp > 0 && (
                <div className="text-[9px] text-[var(--c-accent-light)]/50 flex items-center justify-center gap-1">
                  <span>Today at {formatTime(lastTimestamp)}</span>
                  <span>•</span>
                  <span>Total Pulses: {totalCount}</span>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-xs text-[var(--c-accent-light)] italic">
              No love signals exchanged yet today. Be the first to say I Love You!
            </div>
          )}
        </AnimatePresence>

        {/* Local Floating Hearts Burst */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <AnimatePresence>
            {localHearts.map(heart => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 30 }}
                animate={{
                  opacity: 0,
                  scale: [0.8, 1.4, 0.6],
                  x: heart.x,
                  y: heart.y,
                  rotate: (Math.random() - 0.5) * 60
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute left-1/2 bottom-4 text-rose-500 text-lg"
              >
                ❤️
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Send Buttons Layout */}
      <div className="space-y-2">
        {!isSentByMeToday ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleSendLove('I Love You! ❤️')}
              disabled={isSending}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-[var(--c-accent-main)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] text-xs font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-[var(--c-bg-darkest)] animate-pulse" />
              <span>Say I Love You</span>
            </button>

            <button
              onClick={() => handleSendLove('Miss You So Much! 🥺')}
              disabled={isSending}
              className="py-2 px-3 bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 text-[var(--c-accent-light)] hover:text-[var(--c-text-main)] text-xs font-semibold rounded-xl transition-all cursor-pointer hover:border-[var(--c-accent-main)] disabled:opacity-50"
            >
              Miss You 🥺
            </button>
          </div>
        ) : (
          <div className="text-center py-1.5 bg-[var(--c-accent-main)]/5 border border-[var(--c-accent-main)]/10 rounded-xl text-[11px] text-[var(--c-accent-light)] font-medium">
            ✨ You both are beautifully connected today!
          </div>
        )}

        {/* Custom message row */}
        <div className="flex gap-1.5">
          <input
            id="custom-love-message-input"
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Type a sweet love message..."
            className="flex-1 bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/20 rounded-xl px-3 py-1.5 text-xs text-[var(--c-text-main)] placeholder-[var(--c-accent-light)]/40 focus:outline-none focus:border-[var(--c-accent-main)]/60"
            maxLength={60}
          />
          <button
            onClick={() => handleSendLove()}
            disabled={isSending || !customMsg.trim()}
            className="p-1.5 bg-[var(--c-accent-main)] text-[var(--c-bg-darkest)] rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center w-8 h-8"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* History and Quick Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--c-accent-main)]/10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-[10px] text-[var(--c-accent-light)]/70 hover:text-[var(--c-text-main)] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <History className="w-3 h-3" />
            <span>{showHistory ? 'Hide History' : 'View Exchanged History'}</span>
          </button>

          <span className="text-[9px] text-[var(--c-accent-light)]/40 font-mono">
            Synced Real-Time
          </span>
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-[var(--c-bg-darkest)]/60 rounded-xl px-2.5 max-h-32 overflow-y-auto custom-scrollbar border border-[var(--c-accent-main)]/5"
            >
              <div className="py-2 space-y-1.5 text-[10px]">
                {loveSignal?.history && loveSignal.history.length > 0 ? (
                  loveSignal.history.map((h, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[var(--c-accent-light)]/80">
                      <span className="font-semibold text-[var(--c-text-main)]">{h.senderName}</span>
                      <span>sent a pulse</span>
                      <span className="text-[9px] text-[var(--c-accent-light)]/40">{new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {formatTime(h.timestamp)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-[9px] text-[var(--c-accent-light)]/50 py-1">
                    No history recorded yet
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
