import React from 'react';
import { Cloud, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

interface CloudSyncIndicatorProps {
  status: 'synced' | 'syncing' | 'offline';
  lastUpdatedBy?: string;
  className?: string;
  compact?: boolean;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  status,
  lastUpdatedBy,
  className = '',
  compact = false
}) => {
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium backdrop-blur-md border shrink-0 ${
          status === 'synced'
            ? 'bg-[#25D366]/15 border-[#25D366]/40 text-[#25D366]'
            : status === 'syncing'
            ? 'bg-[var(--c-accent-gold)]/15 border-[var(--c-accent-gold)]/40 text-[var(--c-accent-gold)]'
            : 'bg-white/10 border-white/20 text-[var(--c-text-main)]/70'
        } ${className}`}
        title={
          status === 'synced'
            ? `Real-time cloud synced${lastUpdatedBy ? ` (Latest by ${lastUpdatedBy})` : ''}`
            : status === 'syncing'
            ? 'Syncing with cloud...'
            : 'Connecting...'
        }
      >
        {status === 'synced' && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider">Live</span>
          </>
        )}
        {status === 'syncing' && (
          <>
            <RefreshCw className="w-2 h-2 animate-spin" />
            <span className="font-mono text-[8px]">Sync</span>
          </>
        )}
        {status === 'offline' && (
          <>
            <Cloud className="w-2 h-2 opacity-60" />
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--c-bg-dark)]/80 border border-[var(--c-accent-main)]/30 backdrop-blur-md shadow-sm ${className}`}
    >
      <div className="relative">
        <Cloud className="w-4 h-4 text-[var(--c-accent-gold)]" />
        {status === 'synced' && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#25D366] ring-2 ring-[var(--c-bg-darkest)]" />
        )}
      </div>
      <div className="text-left">
        <p className="text-[11px] font-semibold text-[var(--c-text-main)] flex items-center gap-1 leading-none">
          <span>Real-time Cloud Sync Active</span>
          <Sparkles className="w-3 h-3 text-[var(--c-accent-gold)]" />
        </p>
        <p className="text-[9px] text-[var(--c-accent-light)]/70 mt-0.5 leading-none">
          {status === 'synced'
            ? lastUpdatedBy
              ? `Connected • Last updated by ${lastUpdatedBy}`
              : 'Connected • Changes show instantly on boyfriend & girlfriend devices'
            : status === 'syncing'
            ? 'Updating cloud database...'
            : 'Connecting to real-time cloud...'}
        </p>
      </div>
    </div>
  );
};
