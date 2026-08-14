import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link,
  Sparkles,
  Heart,
  Image as ImageIcon,
  Check,
  Trash2,
  Calendar,
  MapPin,
  Camera
} from 'lucide-react';
import { MemoryItem } from '../types';
import { compressAndResizeImage, ROMANTIC_PRESET_PHOTOS } from '../utils/imageUtils';

interface EditMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: MemoryItem | null;
  onSave: (updatedMemory: MemoryItem) => void;
  onDelete?: (id: string) => void;
}

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  isOpen,
  onClose,
  memory,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<MemoryItem>(() => {
    return (
      memory || {
        id: `mem-${Date.now()}`,
        title: 'A Special Moment',
        description: 'Every moment spent with you is a memory I treasure forever.',
        date: 'Our Beautiful Day',
        location: 'With You',
        image: ROMANTIC_PRESET_PHOTOS[0].url,
        rotationDeg: -2,
        badge: 'Special Moment'
      }
    );
  });

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update formData when selected memory changes
  React.useEffect(() => {
    if (memory) {
      setFormData(memory);
      setUrlInput(memory.image.startsWith('http') ? memory.image : '');
    }
  }, [memory]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      const optimizedDataUrl = await compressAndResizeImage(files[0]);
      setFormData(prev => ({ ...prev, image: optimizedDataUrl }));
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      try {
        setIsProcessing(true);
        const optimizedDataUrl = await compressAndResizeImage(e.dataTransfer.files[0]);
        setFormData(prev => ({ ...prev, image: optimizedDataUrl }));
      } catch (err) {
        console.error('Failed to process dropped image:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setFormData(prev => ({ ...prev, image: urlInput.trim() }));
    }
  };

  const handleSelectPreset = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div
      id="edit-memory-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="edit-memory-modal-container"
        className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-[#1C0B13] border border-[#E8899D]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#FFF3EF] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#2A101B]/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E8899D]/20 text-[#E8899D]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#FFF3EF]">
                {memory ? 'Change Dream Photo & Details' : 'Add New Romantic Dream'}
              </h3>
              <p className="text-xs text-[#F7B8C5]">
                Upload your couple photo, add personal notes and romantic dates
              </p>
            </div>
          </div>

          <button
            id="close-edit-memory-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-[#FFF3EF] hover:bg-[#E8899D] hover:text-[#12080D] transition-colors"
            aria-label="Close photo editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Photo Source Selector & Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Preview: Polaroid Card Preview */}
            <div className="md:col-span-5 flex flex-col items-center">
              <span className="text-[11px] font-semibold text-[#F7B8C5] uppercase tracking-wider mb-2 self-start flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D8A06C]" />
                Live Polaroid Preview
              </span>
              <div className="w-full max-w-[220px] bg-white p-3 rounded-xl shadow-xl text-[#12080D] rotate-[-1deg] border border-black/10 transition-transform">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#2A101B] mb-2">
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {formData.badge && (
                    <span className="absolute top-1.5 left-1.5 bg-[#E8899D] text-[#12080D] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {formData.badge}
                    </span>
                  )}
                </div>
                <div className="text-center px-1">
                  <p className="text-xs font-script font-bold text-[#12080D] truncate">
                    {formData.title || 'Untitled Memory'}
                  </p>
                  <p className="text-[9px] text-[#12080D]/70 font-sans">
                    {formData.date || 'Romantic Day'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Upload Tabs & Image Selection */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-[11px] font-semibold text-[#F7B8C5] uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#E8899D]" />
                Choose Photo Source
              </span>

              {/* Source Tabs */}
              <div className="flex gap-1.5 p-1 bg-[#12080D] rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] font-semibold shadow-xs'
                      : 'text-[#F7B8C5] hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'presets'
                      ? 'bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] font-semibold shadow-xs'
                      : 'text-[#F7B8C5] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Romantic Presets</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'url'
                      ? 'bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] font-semibold shadow-xs'
                      : 'text-[#F7B8C5] hover:text-white'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Image URL</span>
                </button>
              </div>

              {/* Tab 1: File Upload (Drag & Drop + File Selector) */}
              {activeTab === 'upload' && (
                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center group ${
                    dragOver
                      ? 'border-[#E8899D] bg-[#E8899D]/15 scale-[1.01]'
                      : 'border-[#E8899D]/40 bg-[#12080D]/60 hover:border-[#E8899D] hover:bg-[#2A101B]/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="p-3 rounded-full bg-[#E8899D]/20 text-[#E8899D] group-hover:scale-110 transition-transform mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#FFF3EF]">
                    {isProcessing ? 'Processing image...' : 'Click to select or drag & drop photo'}
                  </p>
                  <p className="text-[10px] text-[#F7B8C5]/70 mt-1">
                    Supports JPG, PNG, WEBP from your phone or computer
                  </p>
                </div>
              )}

              {/* Tab 2: Romantic Presets */}
              {activeTab === 'presets' && (
                <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto p-1 bg-[#12080D]/60 rounded-2xl border border-white/10">
                  {ROMANTIC_PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all group ${
                        formData.image === preset.url
                          ? 'border-[#E8899D] ring-2 ring-[#E8899D]/50 scale-95'
                          : 'border-transparent hover:border-white/40 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white py-0.5 text-center truncate px-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Tab 3: URL Input */}
              {activeTab === 'url' && (
                <div className="space-y-2 bg-[#12080D]/60 p-3 rounded-2xl border border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/our-photo.jpg"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      className="flex-1 bg-[#1C0B13] border border-[#E8899D]/30 rounded-xl px-3 py-2 text-xs text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3 py-2 rounded-xl bg-[#E8899D] text-[#12080D] font-bold text-xs hover:bg-[#F7B8C5] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-[10px] text-[#F7B8C5]/70">
                    Paste any public web image URL
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details Fields */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                  Dream Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. That Sunset Shore"
                  className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#D8A06C]" />
                  <span>Date / Time</span>
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. Golden Hour Dreams"
                  className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E8899D]" />
                  <span>Location (Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Our favorite beach"
                  className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D8A06C]" />
                  <span>Badge Tag (Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Pure Magic"
                  className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F7B8C5] uppercase tracking-wider mb-1">
                Story / Description
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what made this moment so unforgettable..."
                className="w-full bg-[#12080D] border border-[#E8899D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF3EF] focus:outline-none focus:border-[#E8899D]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {onDelete && memory ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to remove this dream photo?')) {
                    onDelete(memory.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Dream</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                Cancel
              </button>

              <button
                id="save-memory-photo-btn"
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#E8899D] via-[#F7B8C5] to-[#D8A06C] text-[#12080D] shadow-[0_0_20px_rgba(232,137,157,0.5)] hover:scale-105 active:scale-95 transition-all"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-[#12080D]" />
                    <span>Save Photo &amp; Dream</span>
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
