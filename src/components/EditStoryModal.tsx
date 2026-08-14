import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Sparkles,
  Check,
  Trash2,
  MessageCircleHeart,
  Smile,
  Camera,
  HeartHandshake,
  Coffee,
  Compass,
  Star,
  MapPin,
  Gift,
  Sun,
  Moon,
  Lightbulb
} from 'lucide-react';
import { TimelineEvent } from '../types';

interface EditStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TimelineEvent | null;
  onSave: (savedEvent: TimelineEvent) => void;
  onDelete?: (id: string) => void;
}

const AVAILABLE_ICONS = [
  { id: 'Sparkles', name: 'Sparkles', icon: Sparkles },
  { id: 'MessageCircleHeart', name: 'Love Chat', icon: MessageCircleHeart },
  { id: 'Smile', name: 'First Smile', icon: Smile },
  { id: 'Camera', name: 'Photo Memory', icon: Camera },
  { id: 'HeartHandshake', name: 'Promise', icon: HeartHandshake },
  { id: 'Coffee', name: 'Coffee Date', icon: Coffee },
  { id: 'Compass', name: 'Adventure', icon: Compass },
  { id: 'Star', name: 'Starlit Night', icon: Star },
  { id: 'MapPin', name: 'Special Place', icon: MapPin },
  { id: 'Gift', name: 'Surprise', icon: Gift },
  { id: 'Sun', name: 'Sunshine', icon: Sun },
  { id: 'Moon', name: 'Late Night', icon: Moon },
];

const STORY_PRESET_IDEAS = [
  {
    title: 'The First Date',
    subtitle: 'Butterflies and nervous smiles',
    date: 'Our First Evening',
    badge: 'Chapter 01',
    iconName: 'Coffee',
    description: 'We sat across from each other, our coffees turning cold as hours flew by. That was the night I knew you were truly special.'
  },
  {
    title: 'Our First Road Trip',
    subtitle: 'Singing along with the windows down',
    date: 'On The Open Road',
    badge: 'Adventure',
    iconName: 'Compass',
    description: 'Miles vanished beneath our wheels and every song on the radio felt like it was written just for us.'
  },
  {
    title: 'The Moment I Realized',
    subtitle: 'When my heart whispered your name',
    date: 'A Quiet Epiphany',
    badge: 'True Love',
    iconName: 'Sparkles',
    description: 'It wasn’t just a feeling; it was the realization that wherever you are, that is where I belong.'
  },
  {
    title: 'Late Night Talks',
    subtitle: 'Sharing secrets under the stars',
    date: '3:00 AM Whispers',
    badge: 'Soul Connection',
    iconName: 'Moon',
    description: 'Talking about everything from childhood dreams to our deepest fears. With you, every secret felt safe.'
  }
];

export const EditStoryModal: React.FC<EditStoryModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<TimelineEvent>(() => {
    return (
      event || {
        id: `timeline-${Date.now()}`,
        title: 'A Special Chapter in Our Story',
        subtitle: 'A memory carved forever in my heart',
        date: 'That Magical Day',
        description: 'Describe what made this moment so unforgettable and romantic...',
        iconName: 'Sparkles',
        badge: 'Chapter'
      }
    );
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        id: `timeline-${Date.now()}`,
        title: '',
        subtitle: '',
        date: 'A Special Moment',
        description: '',
        iconName: 'Sparkles',
        badge: 'New Chapter'
      });
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave({
      ...formData,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      date: formData.date.trim() || 'A Beautiful Day',
      description: formData.description.trim() || 'Every second with you is unforgettable.',
      badge: formData.badge?.trim() || 'Chapter',
      iconName: formData.iconName || 'Sparkles'
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const applyPreset = (preset: typeof STORY_PRESET_IDEAS[0]) => {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      subtitle: preset.subtitle,
      date: preset.date,
      badge: preset.badge,
      iconName: preset.iconName,
      description: preset.description
    }));
  };

  const getSelectedIcon = () => {
    const found = AVAILABLE_ICONS.find(i => i.id === formData.iconName);
    const IconComp = found ? found.icon : Sparkles;
    return <IconComp className="w-4 h-4 text-[#FFF3EF]" />;
  };

  return (
    <div
      id="edit-story-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="edit-story-modal-container"
        className="relative max-w-xl w-full max-h-[92vh] flex flex-col bg-[#1C0B13] border border-[#E8899D]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#FFF3EF] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-[#E8899D]/20 text-[#E8899D]">
              <Heart className="w-5 h-5 fill-[#E8899D]" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#FFF3EF]">
                {event ? 'Edit Love Story Chapter' : 'Add New Story Chapter'}
              </h3>
              <p className="text-xs text-[#F7B8C5]">
                Personalize your milestones, dates, memories, and descriptions
              </p>
            </div>
          </div>

          <button
            id="close-edit-story-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-[#FFF3EF] hover:bg-[#E8899D] hover:text-[#12080D] transition-colors cursor-pointer"
            aria-label="Close edit story"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Quick Preset Ideas */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#F7B8C5] uppercase font-semibold tracking-wider mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#D8A06C]" />
              <span>Quick Romantic Inspiration</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STORY_PRESET_IDEAS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="text-[11px] py-1 px-2.5 rounded-full bg-white/5 hover:bg-[#E8899D]/20 border border-[#E8899D]/30 text-[#FFF3EF] transition-all hover:border-[#E8899D] cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#D8A06C]" />
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-2xl bg-[#12080D] border border-[#E8899D]/40 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F7B8C5]/70">
              Live Preview in Timeline
            </span>
            <div className="p-4 rounded-xl glass-panel border border-[#E8899D]/30 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8A06C] bg-[#12080D]/80 px-2 py-0.5 rounded-full border border-[#D8A06C]/30">
                  {formData.badge || 'Chapter'}
                </span>
                <span className="text-[11px] text-[#F7B8C5]/80 font-mono">
                  {formData.date || 'That Special Day'}
                </span>
              </div>
              <h4 className="text-base font-serif font-semibold text-[#FFF3EF] flex items-center gap-1.5">
                <span className="p-1 rounded-full bg-[#E8899D]/30 inline-flex">
                  {getSelectedIcon()}
                </span>
                <span>{formData.title || 'Your Chapter Title'}</span>
              </h4>
              <p className="text-xs text-[#F7B8C5] italic mb-1.5">
                {formData.subtitle || 'A short romantic subtitle'}
              </p>
              <p className="text-xs text-[#FFF3EF]/85 leading-relaxed">
                {formData.description || 'Your heartfelt love story details will be displayed here beautifully...'}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                Chapter Title *
              </label>
              <input
                id="input-story-title"
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. The Day We Met"
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                Badge / Tag
              </label>
              <input
                id="input-story-badge"
                type="text"
                value={formData.badge || ''}
                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Chapter 01, Milestone, Forever"
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                Romantic Subtitle
              </label>
              <input
                id="input-story-subtitle"
                type="text"
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. The spark that started our universe"
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                Date / Moment
              </label>
              <input
                id="input-story-date"
                type="text"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. October 14th, That Magical Evening"
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-2">
              Select Chapter Emblem / Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map(item => {
                const IconComp = item.icon;
                const isSelected = (formData.iconName || 'Sparkles') === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, iconName: item.id })}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E8899D]/30 border-[#E8899D] text-[#FFF3EF] shadow-[0_0_10px_rgba(232,137,157,0.4)]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <IconComp className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-medium truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
              Story Paragraph / Details *
            </label>
            <textarea
              id="input-story-description"
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write your genuine memory, feelings, laughter, or the exact thoughts you had during this moment in your relationship..."
              className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D] leading-relaxed"
              required
            />
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {onDelete && event ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Chapter</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                id="save-story-chapter-btn"
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
                    <Heart className="w-4 h-4 fill-[#12080D]" />
                    <span>Save Love Story Chapter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
