import React, { useState, useRef, useEffect } from 'react';
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
  Camera,
  Video,
  Play,
  Film,
  Layers,
  Clock,
  Navigation,
  Loader2
} from 'lucide-react';
import { MemoryItem } from '../types';
import {
  compressAndResizeImage,
  compressMultipleImages,
  ROMANTIC_PRESET_PHOTOS
} from '../utils/imageUtils';
import { getRealtimeDateTimeString, getRealtimeLocation } from '../utils/dateTimeLocation';

interface EditMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: MemoryItem | null;
  onSave: (updatedMemory: MemoryItem) => void;
  onSaveMultiple?: (newMemories: MemoryItem[]) => void;
  onDelete?: (id: string) => void;
}

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  isOpen,
  onClose,
  memory,
  onSave,
  onSaveMultiple,
  onDelete
}) => {
  const [formData, setFormData] = useState<MemoryItem>(() => {
    return (
      memory || {
        id: `mem-${Date.now()}`,
        title: 'A Special Moment',
        description: 'Every moment spent with you is a memory I treasure forever.',
        date: getRealtimeDateTimeString(),
        location: 'Detecting location...',
        image: ROMANTIC_PRESET_PHOTOS[0].url,
        mediaType: 'image',
        rotationDeg: -2,
        badge: 'Special Moment'
      }
    );
  });

  const [activeTab, setActiveTab] = useState<'upload' | 'image-url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadCountNotice, setUploadCountNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update formData when selected memory changes or auto-detect real-time date & location on new item
  useEffect(() => {
    if (memory) {
      setFormData(memory);
      setUrlInput(memory.image.startsWith('http') ? memory.image : '');
    } else {
      // New Memory: Set real-time date/time & detect real-time location
      const nowStr = getRealtimeDateTimeString();
      setFormData(prev => ({
        ...prev,
        date: nowStr
      }));

      getRealtimeLocation().then(loc => {
        setFormData(prev => ({
          ...prev,
          location: loc
        }));
      }).catch(() => {
        setFormData(prev => ({
          ...prev,
          location: 'With You Forever'
        }));
      });
    }
  }, [memory, isOpen]);

  const handleRefreshDateTime = () => {
    const nowStr = getRealtimeDateTimeString();
    setFormData(prev => ({ ...prev, date: nowStr }));
  };

  const handleDetectLocation = async () => {
    try {
      setIsDetectingLocation(true);
      const loc = await getRealtimeLocation();
      setFormData(prev => ({ ...prev, location: loc }));
    } catch {
      // fallback
    } finally {
      setIsDetectingLocation(false);
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      if (files.length > 1 && onSaveMultiple && !memory) {
        const compressedUrls = await compressMultipleImages(files);
        const realTimeDate = getRealtimeDateTimeString();
        const realTimeLocation = await getRealtimeLocation();
        const newItems: MemoryItem[] = compressedUrls.map((url, idx) => {
          const file = files[idx];
          const cleanName = file ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : `Dream ${idx + 1}`;
          const title = cleanName.length > 2 ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : `Dream Moment ${idx + 1}`;
          return {
            id: `mem-${Date.now()}-${idx}`,
            title,
            description: 'Every moment spent with you is a memory I treasure forever.',
            date: realTimeDate,
            location: realTimeLocation,
            image: url,
            mediaType: 'image',
            rotationDeg: (idx % 2 === 0 ? -1 : 1) * ((idx % 3) + 1.5),
            badge: 'Dream'
          };
        });
        onSaveMultiple(newItems);
        setUploadCountNotice(`Successfully added ${files.length} new dream photos with live time & location!`);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setUploadCountNotice(null);
          onClose();
        }, 1200);
      } else {
        const compressedUrl = await compressAndResizeImage(files[0]);
        const file = files[0];
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const title = cleanName.length > 2 ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : 'A Special Moment';
        setFormData(prev => ({
          ...prev,
          title: (!memory || prev.title === 'A Special Moment') ? title : prev.title,
          image: compressedUrl,
          mediaType: 'image',
          videoUrl: undefined,
          videoEmbedUrl: undefined,
          videoType: undefined,
          date: prev.date || getRealtimeDateTimeString(),
          badge: prev.badge || 'Dream'
        }));
      }
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
      const files = e.dataTransfer.files;
      try {
        setIsProcessing(true);
        if (files.length > 1 && onSaveMultiple && !memory) {
          const compressedUrls = await compressMultipleImages(files);
          const realTimeDate = getRealtimeDateTimeString();
          const realTimeLocation = await getRealtimeLocation();
          const newItems: MemoryItem[] = compressedUrls.map((url, idx) => {
            const file = files[idx];
            const cleanName = file ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : `Dream ${idx + 1}`;
            const title = cleanName.length > 2 ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : `Dream Moment ${idx + 1}`;
            return {
              id: `mem-${Date.now()}-${idx}`,
              title,
              description: 'Every moment spent with you is a memory I treasure forever.',
              date: realTimeDate,
              location: realTimeLocation,
              image: url,
              mediaType: 'image',
              rotationDeg: (idx % 2 === 0 ? -1 : 1) * ((idx % 3) + 1.5),
              badge: 'Dream'
            };
          });
          onSaveMultiple(newItems);
          setUploadCountNotice(`Successfully added ${files.length} new dream photos with live time & location!`);
          setSaveSuccess(true);
          setTimeout(() => {
            setSaveSuccess(false);
            setUploadCountNotice(null);
            onClose();
          }, 1200);
        } else {
          const compressedUrl = await compressAndResizeImage(files[0]);
          const file = files[0];
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const title = cleanName.length > 2 ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : 'A Special Moment';
          setFormData(prev => ({
            ...prev,
            title: (!memory || prev.title === 'A Special Moment') ? title : prev.title,
            image: compressedUrl,
            mediaType: 'image',
            videoUrl: undefined,
            videoEmbedUrl: undefined,
            videoType: undefined,
            date: prev.date || getRealtimeDateTimeString(),
            badge: prev.badge || 'Dream'
          }));
        }
      } catch (err) {
        console.error('Failed to process dropped image:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleApplyImageUrl = () => {
    if (urlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        mediaType: 'image',
        image: urlInput.trim(),
        videoUrl: undefined,
        videoEmbedUrl: undefined,
        videoType: undefined
      }));
    }
  };

  const handleSelectPhotoPreset = (url: string) => {
    setFormData(prev => ({
      ...prev,
      mediaType: 'image',
      image: url,
      videoUrl: undefined,
      videoEmbedUrl: undefined,
      videoType: undefined
    }));
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
        className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-[var(--c-bg-darker)] border border-[var(--c-accent-main)]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[var(--c-text-main)] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[var(--c-bg-dark)]/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--c-accent-main)]/20 text-[var(--c-accent-main)]">
              {formData.mediaType === 'video' ? <Video className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[var(--c-text-main)]">
                {memory
                  ? formData.mediaType === 'video' ? 'Edit Dream Video & Story' : 'Edit Dream Photo & Story'
                  : 'Add New Dream Photo / Video'}
              </h3>
              <p className="text-xs text-[var(--c-accent-light)]">
                Upload videos &amp; photos with no limit, paste YouTube or MP4 links, and add your romantic story
              </p>
            </div>
          </div>

          <button
            id="close-edit-memory-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-[var(--c-text-main)] hover:bg-[var(--c-accent-main)] hover:text-[var(--c-bg-darkest)] transition-colors cursor-pointer"
            aria-label="Close media editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          {/* Media Source Selector & Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Preview: Polaroid Card Preview */}
            <div className="md:col-span-5 flex flex-col items-center">
              <span className="text-[11px] font-semibold text-[var(--c-accent-light)] uppercase tracking-wider mb-2 self-start flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[var(--c-accent-gold)]" />
                Live Polaroid Preview
              </span>
              <div className="w-full max-w-[220px] bg-white p-3 rounded-xl shadow-xl text-[var(--c-bg-darkest)] rotate-[-1deg] border border-black/10 transition-transform">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--c-bg-dark)] mb-2">
                  {formData.mediaType === 'video' && formData.videoUrl && !formData.videoEmbedUrl ? (
                    <video
                      src={formData.videoUrl}
                      poster={formData.image}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      autoPlay
                      loop
                    />
                  ) : (
                    <img
                      src={formData.image}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {formData.mediaType === 'video' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                      <div className="p-2 rounded-full bg-black/60 text-white backdrop-blur-xs">
                        <Play className="w-4 h-4 fill-white" />
                      </div>
                    </div>
                  )}

                  {formData.badge && (
                    <span className="absolute top-1.5 left-1.5 bg-[var(--c-accent-main)] text-[var(--c-bg-darkest)] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {formData.badge}
                    </span>
                  )}
                </div>
                <div className="text-center px-1">
                  <p className="text-xs font-script font-bold text-[var(--c-bg-darkest)] truncate">
                    {formData.title || 'Untitled Memory'}
                  </p>
                  <p className="text-[9px] text-[var(--c-bg-darkest)]/70 font-sans">
                    {formData.date || 'Romantic Day'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Upload Tabs & Media Selection */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-[11px] font-semibold text-[var(--c-accent-light)] uppercase tracking-wider flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-[var(--c-accent-main)]" />
                Choose Photo / Video Source
              </span>

              {/* Source Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--c-bg-darkest)] rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-[var(--c-accent-main)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-semibold shadow-xs'
                      : 'text-[var(--c-accent-light)] hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'presets'
                      ? 'bg-gradient-to-r from-[var(--c-accent-main)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-semibold shadow-xs'
                      : 'text-[var(--c-accent-light)] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Presets</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('image-url')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'image-url'
                      ? 'bg-gradient-to-r from-[var(--c-accent-main)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-semibold shadow-xs'
                      : 'text-[var(--c-accent-light)] hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Image URL</span>
                </button>
              </div>

              {/* Tab 1: File Upload (Photos Only) */}
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
                      ? 'border-[var(--c-accent-main)] bg-[var(--c-accent-main)]/15 scale-[1.01]'
                      : 'border-[var(--c-accent-main)]/40 bg-[var(--c-bg-darkest)]/60 hover:border-[var(--c-accent-main)] hover:bg-[var(--c-bg-dark)]/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={!memory}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="p-3 rounded-full bg-[var(--c-accent-main)]/20 text-[var(--c-accent-main)] group-hover:scale-110 transition-transform mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--c-text-main)]">
                    {isProcessing
                      ? 'Processing photo(s)...'
                      : !memory
                      ? 'Click to select 1 or multiple Photos (No Limit)'
                      : 'Click to select or drop Photo'}
                  </p>
                  <p className="text-[10px] text-[var(--c-accent-light)]/70 mt-1 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-[var(--c-accent-gold)]" />
                    <span>Upload JPG, PNG, WEBP photos • No Limit</span>
                  </p>
                  {uploadCountNotice && (
                    <div className="mt-2 text-xs font-semibold text-[var(--c-accent-gold)] bg-[var(--c-accent-gold)]/10 px-3 py-1 rounded-full border border-[var(--c-accent-gold)]/30 animate-pulse">
                      {uploadCountNotice}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Presets (Photos Only) */}
              {activeTab === 'presets' && (
                <div className="space-y-2 bg-[var(--c-bg-darkest)]/60 p-2 rounded-2xl border border-white/10">
                  <div className="grid grid-cols-3 gap-2 max-h-[160px] overflow-y-auto p-1 custom-scrollbar">
                    {ROMANTIC_PRESET_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPhotoPreset(preset.url)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all group ${
                          formData.image === preset.url
                            ? 'border-[var(--c-accent-main)] ring-2 ring-[var(--c-accent-main)]/50 scale-95'
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
                </div>
              )}

              {/* Tab 4: Image URL Input */}
              {activeTab === 'image-url' && (
                <div className="space-y-2 bg-[var(--c-bg-darkest)]/60 p-3 rounded-2xl border border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/our-photo.jpg"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      className="flex-1 bg-[var(--c-bg-darker)] border border-[var(--c-accent-main)]/30 rounded-xl px-3 py-2 text-xs text-[var(--c-text-main)] focus:outline-none focus:border-[var(--c-accent-main)]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyImageUrl}
                      className="px-3 py-2 rounded-xl bg-[var(--c-accent-main)] text-[var(--c-bg-darkest)] font-bold text-xs hover:bg-[var(--c-accent-light)] transition-colors cursor-pointer"
                    >
                      Apply Photo
                    </button>
                  </div>
                  <p className="text-[10px] text-[var(--c-accent-light)]/70">
                    Paste any direct public web photo URL
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details Fields */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--c-accent-light)] uppercase tracking-wider mb-1">
                  Dream Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. That Sunset Shore / Our Proposal Video"
                  className="w-full bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 rounded-xl px-3.5 py-2 text-sm text-[var(--c-text-main)] focus:outline-none focus:border-[var(--c-accent-main)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[var(--c-accent-light)] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
                    <span>Real-time Date & Time</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRefreshDateTime}
                    className="text-[10px] text-[var(--c-accent-gold)] hover:text-white flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Set to Current Real-time"
                  >
                    <span>Now 🕒</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 14 Aug 2026, 12:05 PM"
                  className="w-full bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 rounded-xl px-3.5 py-2 text-sm text-[var(--c-text-main)] focus:outline-none focus:border-[var(--c-accent-main)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[var(--c-accent-light)] uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--c-accent-main)]" />
                    <span>Location</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="text-[10px] text-[var(--c-accent-main)] hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                    title="Detect Current Live Location"
                  >
                    {isDetectingLocation ? (
                      <>
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        <span>Locating...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-2.5 h-2.5" />
                        <span>Live GPS 📍</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Mumbai, India / Our favorite spot"
                  className="w-full bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 rounded-xl px-3.5 py-2 text-sm text-[var(--c-text-main)] focus:outline-none focus:border-[var(--c-accent-main)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--c-accent-light)] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[var(--c-accent-gold)]" />
                  <span>Badge Tag (Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. 🎥 Video / Pure Magic"
                  className="w-full bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 rounded-xl px-3.5 py-2 text-sm text-[var(--c-text-main)] focus:outline-none focus:border-[var(--c-accent-main)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--c-accent-light)] uppercase tracking-wider mb-1">
                Story / Description
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what made this moment or video clip so unforgettable..."
                className="w-full bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 rounded-xl px-3.5 py-2 text-sm text-[var(--c-text-main)] focus:outline-none focus:border-[var(--c-accent-main)]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {onDelete && memory ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(memory.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
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
                className="px-4 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                id="save-memory-photo-btn"
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] shadow-[0_0_20px_rgba(232,137,157,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-[var(--c-bg-darkest)]" />
                    <span>Save {formData.mediaType === 'video' ? 'Video' : 'Photo'} Dream</span>
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

