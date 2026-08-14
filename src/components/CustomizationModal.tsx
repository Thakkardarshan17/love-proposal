import React, { useState, useRef } from 'react';
import {
  X,
  Heart,
  Sparkles,
  Check,
  RotateCcw,
  Camera,
  Plus,
  Trash2,
  Edit3,
  Music,
  Upload,
  Link,
  BookHeart,
  UserCheck,
  MessageCircleHeart,
  CheckCircle2,
  Play,
  Pause,
  Layers
} from 'lucide-react';
import { ProposalConfig, MemoryItem, TimelineEvent } from '../types';
import { initialProposalConfig, initialMemories, initialTimelineEvents } from '../config/proposalData';
import { audioEngine, AudioTrackInfo } from '../utils/audioSynthesizer';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { compressMultipleImages } from '../utils/imageUtils';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProposalConfig;
  onSaveConfig: (newConfig: ProposalConfig) => void;
  storyEvents?: TimelineEvent[];
  onUpdateStoryEvents?: (events: TimelineEvent[]) => void;
  onOpenStoryEditor?: (event?: TimelineEvent) => void;
  memories?: MemoryItem[];
  onUpdateMemories?: (memories: MemoryItem[]) => void;
  onOpenMemoryEditor?: (memory?: MemoryItem) => void;
  onAddMultipleMemories?: (newItems: MemoryItem[]) => void;
  syncStatus?: 'synced' | 'syncing' | 'offline';
  lastUpdatedBy?: string;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  storyEvents = [],
  onUpdateStoryEvents,
  onOpenStoryEditor,
  memories = [],
  onUpdateMemories,
  onOpenMemoryEditor,
  onAddMultipleMemories,
  syncStatus = 'synced',
  lastUpdatedBy
}) => {
  const [activeTab, setActiveTab] = useState<'names' | 'timeline' | 'photos' | 'music'>('names');
  const [formData, setFormData] = useState<ProposalConfig>(config);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio State in modal
  const [isPlaying, setIsPlaying] = useState(audioEngine.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<AudioTrackInfo>(audioEngine.getCurrentTrack());
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [audioSuccess, setAudioSuccess] = useState<string | null>(null);
  const modalAudioInputRef = useRef<HTMLInputElement | null>(null);

  // Sync formData when config prop changes
  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  React.useEffect(() => {
    const unsub = audioEngine.subscribe((playing, _idx, track) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleResetConfig = () => {
    setFormData(initialProposalConfig);
  };

  const handleResetStoryEvents = () => {
    if (confirm('Reset love story chapters to romantic default presets?') && onUpdateStoryEvents) {
      onUpdateStoryEvents(initialTimelineEvents);
    }
  };

  const handleDeleteStoryEvent = (id: string) => {
    if (onUpdateStoryEvents) {
      onUpdateStoryEvents(storyEvents.filter(e => e.id !== id));
    }
  };

  const handleResetMemories = () => {
    if (onUpdateMemories) {
      onUpdateMemories(initialMemories);
    }
  };

  const handleDeleteMemory = (id: string) => {
    if (onUpdateMemories) {
      onUpdateMemories(memories.filter(m => m.id !== id));
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      try {
        await audioEngine.setCustomAudioFile(file);
        setAudioSuccess(`Loaded: ${file.name}`);
        setTimeout(() => setAudioSuccess(null), 3000);
      } catch (err) {
        console.error('Audio upload failed:', err);
      }
    }
  };

  const handleAudioUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAudioUrl.trim()) {
      audioEngine.setCustomAudioUrl(customAudioUrl.trim(), 'Custom Background Music');
      setCustomAudioUrl('');
      setAudioSuccess('Custom audio stream connected!');
      setTimeout(() => setAudioSuccess(null), 3000);
    }
  };

  const tracks = audioEngine.getTracks();

  return (
    <div
      id="customization-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="customization-modal-container"
        className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-[#1C0B13] border border-[#E8899D]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#FFF3EF] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Hidden Audio File Input */}
        <input
          ref={modalAudioInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
          onChange={handleAudioUpload}
          className="hidden"
        />

        {/* Top Header */}
        <div className="flex items-start justify-between px-5 sm:px-6 pt-5 pb-3 border-b border-white/10 gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <Heart className="w-5 h-5 text-[#E8899D] fill-[#E8899D] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FFF3EF] leading-snug">
                  Personalize Your Love Story &amp; Proposal
                </h3>
                <CloudSyncIndicator compact status={syncStatus} lastUpdatedBy={lastUpdatedBy} />
              </div>
              <p className="text-xs text-[#F7B8C5] mt-0.5">
                Customize names, chapters, dreams &amp; photos, and music (live synced across devices)
              </p>
            </div>
          </div>

          <button
            id="close-customization-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-[#FFF3EF] hover:bg-[#E8899D] hover:text-[#12080D] transition-colors cursor-pointer shrink-0"
            aria-label="Close customization"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Tab Switcher (Clean, no-scrollbar, pill tabs) */}
        <div className="flex items-center px-4 sm:px-6 py-2.5 gap-2 bg-[#2A101B]/50 border-b border-white/10 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('names')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
              activeTab === 'names'
                ? 'bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] shadow-md font-bold'
                : 'bg-white/5 text-[#F7B8C5]/80 hover:bg-white/10 hover:text-[#FFF3EF]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Names &amp; Proposal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] shadow-md font-bold'
                : 'bg-white/5 text-[#F7B8C5]/80 hover:bg-white/10 hover:text-[#FFF3EF]'
            }`}
          >
            <BookHeart className="w-3.5 h-3.5" />
            <span>Love Story ({storyEvents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
              activeTab === 'photos'
                ? 'bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] shadow-md font-bold'
                : 'bg-white/5 text-[#F7B8C5]/80 hover:bg-white/10 hover:text-[#FFF3EF]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Dreams ({memories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('music')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
              activeTab === 'music'
                ? 'bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] shadow-md font-bold'
                : 'bg-white/5 text-[#F7B8C5]/80 hover:bg-white/10 hover:text-[#FFF3EF]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Soundtrack</span>
          </button>
        </div>

        {/* Tab 1: Names & Proposal Text */}
        {activeTab === 'names' && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                  Your Name / Nickname
                </label>
                <input
                  id="input-your-name"
                  type="text"
                  value={formData.yourName}
                  onChange={e => setFormData({ ...formData, yourName: e.target.value })}
                  className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D] focus:ring-1 focus:ring-[#E8899D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                  Partner&apos;s Name / Sweetheart
                </label>
                <input
                  id="input-partner-name"
                  type="text"
                  value={formData.partnerName}
                  onChange={e => setFormData({ ...formData, partnerName: e.target.value })}
                  className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D] focus:ring-1 focus:ring-[#E8899D]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                Proposal Question
              </label>
              <input
                id="input-proposal-question"
                type="text"
                value={formData.question}
                onChange={e => setFormData({ ...formData, question: e.target.value })}
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                Proposal Subtitle
              </label>
              <textarea
                id="input-proposal-subtitle"
                rows={2}
                value={formData.subQuestion}
                onChange={e => setFormData({ ...formData, subQuestion: e.target.value })}
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                Final Message (Screen 11)
              </label>
              <textarea
                id="input-final-message"
                rows={2}
                value={formData.finalMessage}
                onChange={e => setFormData({ ...formData, finalMessage: e.target.value })}
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Signature Prefix</span>
              </label>
              <input
                id="input-signature-text"
                type="text"
                value={formData.signatureText}
                onChange={e => setFormData({ ...formData, signatureText: e.target.value })}
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25D366] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>WhatsApp Number For Responses</span>
                <span className="text-[10px] text-[#25D366]/80 font-normal">Active: +91 7201030048</span>
              </label>
              <input
                id="input-whatsapp-number"
                type="text"
                value={formData.whatsappNumber || '+91 7201030048'}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+91 7201030048"
                className="w-full bg-[#12080D] border border-[#25D366]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#25D366]"
              />
              <p className="text-[10px] text-[#F7B8C5]/70 mt-1">
                When your sweetheart taps &quot;Send Answer on WhatsApp&quot;, their romantic response is sent directly to this number.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                id="reset-config-btn"
                type="button"
                onClick={handleResetConfig}
                className="flex items-center gap-1.5 text-xs text-[#F7B8C5]/70 hover:text-[#F7B8C5] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <div className="flex gap-2">
                <button
                  id="cancel-config-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  id="save-config-btn"
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] shadow-[0_0_15px_rgba(232,137,157,0.5)] hover:scale-105 transition-all cursor-pointer font-bold"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Love Story Chapters */}
        {activeTab === 'timeline' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <p className="text-xs text-[#F7B8C5] font-medium">
                  Personalize the storyline milestones and memories in Scene 4: Our Love Story.
                </p>
              </div>

              {onOpenStoryEditor && (
                <button
                  type="button"
                  onClick={() => onOpenStoryEditor()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] font-bold text-xs shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Chapter</span>
                </button>
              )}
            </div>

            {/* List of story events */}
            <div className="space-y-3">
              {storyEvents.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-2xl bg-[#12080D] border border-[#E8899D]/30 flex items-start justify-between gap-3 group hover:border-[#E8899D] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8A06C] bg-[#2A101B] px-2 py-0.5 rounded-full border border-[#D8A06C]/30">
                        {item.badge || `Chapter ${idx + 1}`}
                      </span>
                      <span className="text-[11px] text-[#F7B8C5]/80 font-mono">
                        {item.date}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-[#FFF3EF] flex items-center gap-1.5">
                      <span>{item.title}</span>
                    </h4>

                    {item.subtitle && (
                      <p className="text-xs text-[#F7B8C5] italic mb-1">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-[#FFF3EF]/75 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {onOpenStoryEditor && (
                      <button
                        type="button"
                        onClick={() => onOpenStoryEditor(item)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-[#E8899D] hover:text-[#12080D] text-[#FFF3EF] transition-colors cursor-pointer"
                        title="Edit chapter"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {storyEvents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteStoryEvent(item.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                        title="Delete chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetStoryEvents}
                className="flex items-center gap-1.5 text-xs text-[#F7B8C5]/70 hover:text-[#F7B8C5] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Story</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Dreams & Photos */}
        {activeTab === 'photos' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Hidden batch upload file input */}
            <input
              ref={modalFileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async e => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                try {
                  setIsUploadingBatch(true);
                  const dataUrls = await compressMultipleImages(files);
                  const newItems: MemoryItem[] = dataUrls.map((url, idx) => {
                    const originalFile = files[idx];
                    const cleanName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : `Dream ${idx + 1}`;
                    return {
                      id: `mem-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
                      title: cleanName.length > 2 ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : `Our Dream ${idx + 1}`,
                      description: 'A treasured dream and beautiful moment forever etched in our hearts.',
                      date: 'Our Sweet Journey',
                      location: 'With You Forever',
                      image: url,
                      rotationDeg: ((idx % 2 === 0 ? -1 : 1) * ((idx % 3) + 1.5)),
                      badge: 'Dream'
                    };
                  });

                  if (onAddMultipleMemories) {
                    onAddMultipleMemories(newItems);
                  } else if (onUpdateMemories) {
                    onUpdateMemories([...memories, ...newItems]);
                  }
                } catch (err) {
                  console.error('Batch upload error:', err);
                } finally {
                  setIsUploadingBatch(false);
                  if (modalFileInputRef.current) modalFileInputRef.current.value = '';
                }
              }}
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <p className="text-xs text-[#F7B8C5] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D8A06C]" />
                  <span>{memories.length} Dream Photos (No Limit)</span>
                </p>
                <p className="text-[11px] text-[#FFF3EF]/60 mt-0.5">
                  Add unlimited photos of your romantic memories and future dreams together.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => modalFileInputRef.current?.click()}
                  disabled={isUploadingBatch}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF3EF] font-semibold text-xs border border-white/20 transition-all cursor-pointer"
                  title="Upload multiple photos at once"
                >
                  <Upload className="w-3.5 h-3.5 text-[#D8A06C]" />
                  <span>{isUploadingBatch ? 'Processing...' : '+ Batch Upload'}</span>
                </button>

                {onOpenMemoryEditor && (
                  <button
                    type="button"
                    onClick={() => onOpenMemoryEditor()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] font-bold text-xs shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Dream</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drag & Drop Quick Area */}
            <div
              onClick={() => modalFileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={async e => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const files = e.dataTransfer.files;
                  try {
                    setIsUploadingBatch(true);
                    const dataUrls = await compressMultipleImages(files);
                    const newItems: MemoryItem[] = dataUrls.map((url, idx) => {
                      const originalFile = files[idx];
                      const cleanName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : `Dream ${idx + 1}`;
                      return {
                        id: `mem-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
                        title: cleanName.length > 2 ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : `Our Dream ${idx + 1}`,
                        description: 'A treasured dream and beautiful moment forever etched in our hearts.',
                        date: 'Our Sweet Journey',
                        location: 'With You Forever',
                        image: url,
                        rotationDeg: ((idx % 2 === 0 ? -1 : 1) * ((idx % 3) + 1.5)),
                        badge: 'Dream'
                      };
                    });

                    if (onAddMultipleMemories) {
                      onAddMultipleMemories(newItems);
                    } else if (onUpdateMemories) {
                      onUpdateMemories([...memories, ...newItems]);
                    }
                  } catch (err) {
                    console.error('Drop upload error:', err);
                  } finally {
                    setIsUploadingBatch(false);
                  }
                }
              }}
              className="p-3 border border-dashed border-[#E8899D]/40 hover:border-[#E8899D] rounded-2xl bg-[#12080D]/50 hover:bg-[#2A101B]/40 transition-colors flex items-center justify-center gap-2 text-center cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#E8899D]" />
              <span className="text-xs text-[#FFF3EF]/80">
                Drag &amp; drop photos here or click to batch upload from device
              </span>
            </div>

            {/* List of current memories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {memories.map((mem, idx) => (
                <div
                  key={mem.id || idx}
                  className="p-3 rounded-2xl bg-[#12080D] border border-[#E8899D]/30 flex gap-3 items-center group hover:border-[#E8899D] transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#2A101B] shrink-0 border border-white/10">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#FFF3EF] truncate">
                      {mem.title}
                    </h4>
                    <p className="text-[10px] text-[#F7B8C5]/80 truncate">
                      {mem.date}
                    </p>
                    <p className="text-[10px] text-[#FFF3EF]/60 line-clamp-1 mt-0.5">
                      {mem.description}
                    </p>
                  </div>

                  {/* Edit Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    {onOpenMemoryEditor && (
                      <button
                        type="button"
                        onClick={() => onOpenMemoryEditor(mem)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#E8899D] hover:text-[#12080D] text-[#FFF3EF] transition-colors cursor-pointer"
                        title="Edit photo and text"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {memories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMemory(mem.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reset photos button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetMemories}
                className="flex items-center gap-1.5 text-xs text-[#F7B8C5]/70 hover:text-[#F7B8C5] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Dreams</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Music & Audio */}
        {activeTab === 'music' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {audioSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{audioSuccess}</span>
              </div>
            )}

            {/* Active Track Banner */}
            <div className="p-4 rounded-2xl bg-[#2A101B]/80 border border-[#E8899D]/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#E8899D]/20 border border-[#E8899D]/40 flex items-center justify-center text-[#E8899D] shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#F7B8C5] uppercase font-semibold tracking-wider">
                    Current Playing Track
                  </p>
                  <h4 className="text-sm font-bold text-[#FFF3EF] truncate font-serif">
                    {currentTrack?.name || 'Romantic Song'}
                  </h4>
                  <p className="text-[10px] text-[#D8A06C] truncate">
                    {currentTrack?.artist || 'Proposal Romance'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => audioEngine.togglePlay()}
                className="p-3 rounded-full bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Upload Your Own Music Box */}
            <div className="p-4 rounded-2xl bg-[#12080D] border border-dashed border-[#E8899D]/50 flex flex-col items-center text-center gap-2.5">
              <div className="p-2.5 rounded-full bg-[#E8899D]/20 text-[#E8899D]">
                <Upload className="w-5 h-5 text-[#D8A06C]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FFF3EF]">
                  Upload Your Own Background Song (Saved Forever)
                </h4>
                <p className="text-[11px] text-[#F7B8C5]/70 max-w-sm mt-0.5">
                  Select your favorite romantic MP3, WAV, or M4A audio file. It is permanently saved in browser storage and stays ready across page reloads!
                </p>
              </div>
              <button
                type="button"
                onClick={() => modalAudioInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] font-bold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                Choose Audio File From Device
              </button>
            </div>

            {/* Custom URL Option */}
            <form onSubmit={handleAudioUrlSubmit} className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#F7B8C5] uppercase tracking-wider">
                Or Paste Online Audio Link (.mp3) (Synced to Partner)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/your-song.mp3"
                  value={customAudioUrl}
                  onChange={e => setCustomAudioUrl(e.target.value)}
                  className="flex-1 bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3 py-2 text-xs text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#E8899D] hover:text-[#12080D] text-xs font-semibold text-[#FFF3EF] transition-all cursor-pointer shrink-0"
                >
                  Save &amp; Play URL
                </button>
              </div>
            </form>

            {/* Built-in Tracks Library */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider">
                Soundtrack Library &amp; Saved Songs
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {tracks.map((t, idx) => (
                  <div
                    key={t.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                      currentTrack?.id === t.id
                        ? 'bg-[#E8899D]/20 border-[#E8899D] text-[#FFF3EF]'
                        : 'bg-white/5 border-transparent hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        audioEngine.selectTrack(idx);
                        setFormData(prev => ({
                          ...prev,
                          musicTitle: t.name,
                          musicArtist: t.artist,
                          selectedTrackId: t.id
                        }));
                      }}
                      className="min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold truncate">{t.name}</p>
                        {t.type === 'custom' && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-semibold">
                            Saved File
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#F7B8C5]/70 truncate">{t.artist}</p>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {currentTrack?.id === t.id && (
                        <Heart className="w-3.5 h-3.5 text-[#E8899D] fill-[#E8899D]" />
                      )}
                      {t.type === 'custom' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remove "${t.name}" from saved music?`)) {
                              audioEngine.deleteCustomTrack(t.id);
                            }
                          }}
                          className="p-1 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete saved song"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Done Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
