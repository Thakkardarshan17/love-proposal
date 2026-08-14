/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { MemoryModal } from './components/MemoryModal';
import { CustomizationModal } from './components/CustomizationModal';
import { EditMemoryModal } from './components/EditMemoryModal';
import { EditStoryModal } from './components/EditStoryModal';
import { WhatsAppAnswerModal } from './components/WhatsAppAnswerModal';
import { RomanticLoginGate } from './components/RomanticLoginGate';
import { CloudSyncIndicator } from './components/CloudSyncIndicator';
import {
  initAuth,
  subscribeToSharedProposal,
  saveSharedProposalData,
  SharedProposalData
} from './lib/firebase';

// Scenes 01 - 16
import { Scene01Loading } from './components/scenes/Scene01Loading';
import { Scene02TapHeart } from './components/scenes/Scene02TapHeart';
import { Scene03RomanticIntro } from './components/scenes/Scene03RomanticIntro';
import { Scene04OurStory } from './components/scenes/Scene04OurStory';
import { Scene05Memories } from './components/scenes/Scene05Memories';
import { Scene06Reasons } from './components/scenes/Scene06Reasons';
import { Scene07EmotionalMessage } from './components/scenes/Scene07EmotionalMessage';
import { Scene08Proposal } from './components/scenes/Scene08Proposal';
import { Scene10Celebration } from './components/scenes/Scene10Celebration';
import { Scene11FinalMessage } from './components/scenes/Scene11FinalMessage';
import { Scene11LoveShayari1 } from './components/scenes/Scene11LoveShayari1';
import { Scene12SacredPromises } from './components/scenes/Scene12SacredPromises';
import { Scene13LoveShayari2 } from './components/scenes/Scene13LoveShayari2';
import { Scene14LifetimePillars } from './components/scenes/Scene14LifetimePillars';
import { Scene15SealOfLove } from './components/scenes/Scene15SealOfLove';
import { Scene12Forever } from './components/scenes/Scene12Forever';

// Configurations and Data
import {
  initialProposalConfig,
  initialTimelineEvents,
  initialMemories,
  initialReasons
} from './config/proposalData';
import { ProposalConfig, MemoryItem, TimelineEvent } from './types';
import { SlidersHorizontal, ChevronLeft, ChevronRight, MessageCircle, Lock, Sparkles } from 'lucide-react';

const SCENE_NAMES: Record<number, string> = {
  1: 'Loading',
  2: 'Tap My Heart',
  3: 'Our Destiny',
  4: 'Our Story',
  5: 'Dreams',
  6: 'Reasons',
  7: 'Special Question',
  8: 'The Proposal',
  9: 'Celebration',
  10: 'Personal Vow',
  11: 'Love Shayari I',
  12: '7 Sacred Vows',
  13: 'Love Shayari II',
  14: 'Lifetime Pillars',
  15: 'Eternal Promise',
  16: 'Forever & Always'
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('proposal_user_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [hasSentYesAnswer, setHasSentYesAnswer] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('proposal_user_sent_yes') === 'true';
    } catch {
      return false;
    }
  });

  const [currentScene, setCurrentScene] = useState<number>(1);
  const [config, setConfig] = useState<ProposalConfig>(() => {
    try {
      const saved = localStorage.getItem('romantic_proposal_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.yourName === 'DARSHAN' || parsed.yourName === 'Darshan') {
          parsed.yourName = 'Deep';
        }
        if (parsed.partnerName === 'MY LOVE' || parsed.partnerName === 'My Love') {
          parsed.partnerName = 'Labdhi';
        }
        return parsed;
      }
      return initialProposalConfig;
    } catch {
      return initialProposalConfig;
    }
  });

  const [storyEvents, setStoryEvents] = useState<TimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem('romantic_proposal_story_events');
      return saved ? JSON.parse(saved) : initialTimelineEvents;
    } catch {
      return initialTimelineEvents;
    }
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('romantic_proposal_memories');
      return saved ? JSON.parse(saved) : initialMemories;
    } catch {
      return initialMemories;
    }
  });

  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null | undefined>(undefined);
  const [editingStoryEvent, setEditingStoryEvent] = useState<TimelineEvent | null | undefined>(undefined);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);

  // Real-time Cloud Sync state
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('offline');
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string>('');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Global Primary Dream Photo (dynamically updates everywhere when Dreams/Memories change)
  const primaryPhoto = memories[0]?.image || (memories[0] as any)?.photoUrl;

  // Real-time Cloud Firestore subscription across all devices
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    initAuth()
      .then(() => {
        unsubscribe = subscribeToSharedProposal(
          (cloudData: SharedProposalData) => {
            setSyncStatus('synced');
            if (cloudData.lastUpdatedBy) {
              setLastUpdatedBy(cloudData.lastUpdatedBy);
            }

            if (cloudData.config) {
              setConfig(cloudData.config);
              try {
                localStorage.setItem('romantic_proposal_config', JSON.stringify(cloudData.config));
              } catch {}
            }

            if (cloudData.storyEvents && Array.isArray(cloudData.storyEvents) && cloudData.storyEvents.length > 0) {
              setStoryEvents(cloudData.storyEvents);
              try {
                localStorage.setItem('romantic_proposal_story_events', JSON.stringify(cloudData.storyEvents));
              } catch {}
            }

            if (cloudData.memories && Array.isArray(cloudData.memories) && cloudData.memories.length > 0) {
              setMemories(cloudData.memories);
              try {
                localStorage.setItem('romantic_proposal_memories', JSON.stringify(cloudData.memories));
              } catch {}
            }

            if (cloudData.hasAnsweredYes !== undefined) {
              setHasSentYesAnswer(cloudData.hasAnsweredYes);
              if (cloudData.hasAnsweredYes) {
                try {
                  sessionStorage.setItem('proposal_user_sent_yes', 'true');
                } catch {}
              }
            }
          },
          (err) => {
            console.warn('Real-time cloud sync notice:', err);
            setSyncStatus('offline');
          }
        );
      })
      .catch((err) => {
        console.warn('Auth initialization error:', err);
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save config to localStorage & Cloud Firestore whenever changed
  const handleSaveConfig = (newConfig: ProposalConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('romantic_proposal_config', JSON.stringify(newConfig));
    } catch {}
    setSyncStatus('syncing');
    saveSharedProposalData({ config: newConfig }, newConfig.yourName || 'Partner')
      .then(() => {
        setSyncStatus('synced');
        showSyncToast('Saved to Cloud! Instantly visible on partner’s device ✨');
      })
      .catch(() => setSyncStatus('synced'));
  };

  // Save love story events to localStorage & Cloud Firestore whenever changed
  const handleUpdateStoryEvents = (newStoryEvents: TimelineEvent[]) => {
    setStoryEvents(newStoryEvents);
    try {
      localStorage.setItem('romantic_proposal_story_events', JSON.stringify(newStoryEvents));
    } catch (err) {
      console.warn('Could not persist story chapters:', err);
    }
    setSyncStatus('syncing');
    saveSharedProposalData({ storyEvents: newStoryEvents }, config.yourName || 'Partner')
      .then(() => {
        setSyncStatus('synced');
        showSyncToast('Story Chapters Synced to Cloud! ✨');
      })
      .catch(() => setSyncStatus('synced'));
  };

  const handleSaveSingleStoryEvent = (updatedEvent: TimelineEvent) => {
    const exists = storyEvents.some(e => e.id === updatedEvent.id);
    let updated: TimelineEvent[];
    if (exists) {
      updated = storyEvents.map(e => (e.id === updatedEvent.id ? updatedEvent : e));
    } else {
      updated = [...storyEvents, updatedEvent];
    }
    handleUpdateStoryEvents(updated);
  };

  const handleDeleteStoryEvent = (id: string) => {
    const updated = storyEvents.filter(e => e.id !== id);
    handleUpdateStoryEvents(updated);
  };

  // Save memories to localStorage & Cloud Firestore whenever changed
  const handleUpdateMemories = (newMemories: MemoryItem[]) => {
    setMemories(newMemories);
    try {
      localStorage.setItem('romantic_proposal_memories', JSON.stringify(newMemories));
    } catch (err) {
      console.warn('Could not persist all photos to local storage quota:', err);
    }
    setSyncStatus('syncing');
    saveSharedProposalData({ memories: newMemories }, config.yourName || 'Partner')
      .then(() => {
        setSyncStatus('synced');
        showSyncToast('Photos & Dreams Synced to Cloud! ✨');
      })
      .catch(() => setSyncStatus('synced'));
  };

  const handleSaveSingleMemory = (updatedMemory: MemoryItem) => {
    const exists = memories.some(m => m.id === updatedMemory.id);
    let updated: MemoryItem[];
    if (exists) {
      updated = memories.map(m => (m.id === updatedMemory.id ? updatedMemory : m));
    } else {
      updated = [...memories, updatedMemory];
    }
    handleUpdateMemories(updated);

    // If currently viewing in preview, update preview as well
    if (selectedMemory && selectedMemory.id === updatedMemory.id) {
      setSelectedMemory(updatedMemory);
    }
  };

  const handleAddMultipleMemories = (newItems: MemoryItem[]) => {
    const updated = [...memories, ...newItems];
    handleUpdateMemories(updated);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter(m => m.id !== id);
    handleUpdateMemories(updated);
    if (selectedMemory && selectedMemory.id === id) {
      setSelectedMemory(null);
    }
  };

  const showSyncToast = (msg: string) => {
    setSyncToast(msg);
    setTimeout(() => {
      setSyncToast(null);
    }, 3500);
  };

  // Keyboard navigation between scenes (Left/Right arrows when modal is closed)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMemory || isCustomizerOpen || isWhatsAppModalOpen || editingMemory !== undefined || editingStoryEvent !== undefined) return;
      if (e.key === 'ArrowRight' && currentScene < 11) {
        setCurrentScene(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentScene > 2) {
        setCurrentScene(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene, selectedMemory, isCustomizerOpen, isWhatsAppModalOpen, editingMemory, editingStoryEvent]);

  // Determine atmospheric background effect intensity based on scene
  const getParticleIntensity = () => {
    if (currentScene === 9) return 'celebration';
    if (currentScene >= 8) return 'romantic';
    return 'romantic';
  };

  const getSceneTheme = () => {
    if (currentScene === 11 || currentScene === 8) return 'starry';
    if (currentScene === 3 || currentScene === 7) return 'lightPink';
    return 'burgundy';
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('proposal_user_authenticated', 'true');
    } catch {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasSentYesAnswer(false);
    try {
      sessionStorage.removeItem('proposal_user_authenticated');
      sessionStorage.removeItem('proposal_user_sent_yes');
    } catch {}
  };

  const handleMarkAnsweredYes = () => {
    setHasSentYesAnswer(true);
    try {
      sessionStorage.setItem('proposal_user_sent_yes', 'true');
    } catch {}
  };

  // If user has not entered the secret credentials yet, show Romantic Login Gate
  if (!isAuthenticated) {
    return (
      <main
        id="romantic-app-root"
        className="relative min-h-svh w-full bg-[#12080D] text-[#FFF3EF] font-sans antialiased overflow-x-hidden select-none selection:bg-[#E8899D] selection:text-[#12080D]"
      >
        <BackgroundEffects
          intensity="romantic"
          theme="burgundy"
        />
        <RomanticLoginGate
          partnerName={config.partnerName}
          yourName={config.yourName}
          primaryPhoto={primaryPhoto}
          onLoginSuccess={handleLoginSuccess}
        />
      </main>
    );
  }

  return (
    <main
      id="romantic-app-root"
      className="relative min-h-svh w-full bg-[#12080D] text-[#FFF3EF] font-sans antialiased overflow-x-hidden select-none selection:bg-[#E8899D] selection:text-[#12080D]"
    >
      {/* 1. Global Atmospheric Particle Effects */}
      <BackgroundEffects
        intensity={getParticleIntensity()}
        theme={getSceneTheme()}
      />

      {/* 2. Global Romantic Music Engine Floating Controller for Scene 1 */}
      {currentScene === 1 && (
        <FloatingMusicPlayer variant="floating" />
      )}

      {/* 3. Global Top Bar Nav (Visible after user starts scene 2) */}
      {currentScene > 1 && (
        <nav
          id="global-top-navbar"
          aria-label="Proposal navigation bar"
          className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-4 md:px-6 py-2 flex items-center justify-between pointer-events-auto bg-[#12080D]/95 backdrop-blur-md border-b border-[#E8899D]/20 shadow-lg"
        >
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
            {/* Previous Scene Button */}
            <div className="flex items-center shrink-0">
              {currentScene > 2 ? (
                <button
                  id="nav-prev-scene-btn"
                  onClick={() => setCurrentScene(prev => Math.max(2, prev - 1))}
                  className="h-8 w-8 sm:w-auto sm:h-9 flex items-center justify-center gap-1 text-xs font-semibold tracking-wider text-[#F7B8C5] bg-[#2A101B]/90 hover:bg-[#2A101B] border border-[#E8899D]/30 sm:px-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer shrink-0"
                  aria-label="Previous scene"
                  title="Previous Scene"
                >
                  <ChevronLeft className="w-4 h-4 text-[#E8899D]" />
                  <span className="hidden md:inline text-xs">Prev</span>
                </button>
              ) : (
                <div className="w-8" />
              )}
            </div>

            {/* Current Step & Couple Names Tracker (Centered, Clean & Non-overlapping) */}
            <div className="flex-1 min-w-0 px-2 flex flex-col items-center justify-center text-center">
              <div 
                className="text-[11px] sm:text-xs md:text-sm tracking-wider uppercase font-mono font-bold text-center leading-tight truncate max-w-[170px] sm:max-w-xs md:max-w-md drop-shadow-sm flex items-center justify-center gap-1 text-[#D8A06C]"
                title={`${config.yourName} & ${config.partnerName}`}
              >
                <span className="truncate">{config.yourName}</span>
                <span className="text-[#E8899D] font-serif shrink-0">&amp;</span>
                <span className="truncate">{config.partnerName}</span>
                {syncStatus === 'synced' && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse shrink-0 ml-0.5"
                    title="Live Synced across devices"
                  />
                )}
              </div>
              <div className="text-[10px] sm:text-[11px] font-serif font-bold text-[#FFF3EF] flex items-center justify-center gap-1 text-center leading-tight truncate max-w-[170px] sm:max-w-xs md:max-w-md mt-0.5">
                <span className="truncate">{SCENE_NAMES[currentScene] || `Scene ${currentScene}`}</span>
                <span className="text-[9px] sm:text-[10px] text-[#F7B8C5]/80 font-mono shrink-0">
                  ({currentScene}/16)
                </span>
              </div>
            </div>

            {/* Right Actions: Next scene + Music + Customizer + Lock */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {currentScene >= 9 && (
                <button
                  id="nav-whatsapp-btn"
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="h-8 w-8 sm:w-auto sm:h-9 sm:px-2.5 flex items-center justify-center gap-1 text-[11px] font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(37,211,102,0.5)] cursor-pointer shrink-0"
                  title="Send Answer on WhatsApp"
                  aria-label="Send Answer on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden lg:inline text-xs">WhatsApp</span>
                </button>
              )}

              {currentScene < 16 && currentScene > 1 && (
                <button
                  id="nav-next-scene-btn"
                  onClick={() => {
                    if (currentScene === 9 && !hasSentYesAnswer) {
                      setIsWhatsAppModalOpen(true);
                      return;
                    }
                    setCurrentScene(prev => Math.min(16, prev + 1));
                  }}
                  className="h-8 px-2.5 sm:h-9 sm:px-3 flex items-center justify-center gap-0.5 sm:gap-1 text-xs font-bold tracking-wider text-[#12080D] bg-gradient-to-r from-[#E8899D] to-[#D8A06C] rounded-full transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer shrink-0"
                  aria-label="Next scene"
                  title={currentScene === 9 && !hasSentYesAnswer ? "Send YES answer to unlock" : "Next Scene"}
                >
                  <span className="text-[11px] sm:text-xs">Next</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#12080D]" />
                </button>
              )}

              {/* Embedded Top Navbar Music Player */}
              <FloatingMusicPlayer variant="navbar" />

              {/* Customizer Modal Trigger */}
              <button
                id="open-customizer-btn"
                onClick={() => setIsCustomizerOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-[#2A101B]/90 hover:bg-[#2A101B] border border-[#E8899D]/40 text-[#F7B8C5] hover:text-[#FFF3EF] transition-all hover:rotate-45 shadow-md cursor-pointer shrink-0"
                title="Personalize Love Story, Photos & Names"
                aria-label="Open settings and customize love story"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Lock / Logout Button */}
              <button
                id="lock-app-btn"
                onClick={handleLogout}
                className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-[#2A101B]/90 hover:bg-[#2A101B] border border-[#E8899D]/40 text-[#F7B8C5] hover:text-[#FFF3EF] transition-all hover:scale-105 shadow-md cursor-pointer shrink-0"
                title="Lock Proposal Experience"
                aria-label="Lock Proposal Experience"
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E8899D]" />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* 4. Active Scene Render View (Mobile-First 100svh Container) */}
      <div className="relative w-full min-h-svh flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-svh flex flex-col items-center justify-center"
          >
            {currentScene === 1 && (
              <Scene01Loading
                partnerName={config.partnerName}
                yourName={config.yourName}
                onComplete={() => setCurrentScene(2)}
              />
            )}

            {currentScene === 2 && (
              <Scene02TapHeart onHeartTapped={() => setCurrentScene(3)} />
            )}

            {currentScene === 3 && (
              <Scene03RomanticIntro
                partnerName={config.partnerName}
                onNext={() => setCurrentScene(4)}
              />
            )}

            {currentScene === 4 && (
              <Scene04OurStory
                events={storyEvents}
                memories={memories}
                onNext={() => setCurrentScene(5)}
                onEditEvent={event => setEditingStoryEvent(event)}
                onAddNewEvent={() => setEditingStoryEvent(null)}
              />
            )}

            {currentScene === 5 && (
              <Scene05Memories
                memories={memories}
                onSelectMemory={mem => setSelectedMemory(mem)}
                onEditMemory={mem => setEditingMemory(mem)}
                onAddNewMemory={() => setEditingMemory(null)}
                onAddMultipleMemories={handleAddMultipleMemories}
                onNext={() => setCurrentScene(6)}
              />
            )}

            {currentScene === 6 && (
              <Scene06Reasons
                reasons={initialReasons}
                primaryPhoto={primaryPhoto}
                onNext={() => setCurrentScene(7)}
              />
            )}

            {currentScene === 7 && (
              <Scene07EmotionalMessage
                partnerName={config.partnerName}
                primaryPhoto={primaryPhoto}
                onOpenPhotoPreview={() => {
                  if (memories && memories.length > 0) setSelectedMemory(memories[0]);
                }}
                onNext={() => setCurrentScene(8)}
              />
            )}

            {currentScene === 8 && (
              <Scene08Proposal
                config={config}
                primaryPhoto={primaryPhoto}
                onYesSelected={() => {
                  setHasSentYesAnswer(false);
                  setCurrentScene(9);
                }}
              />
            )}

            {currentScene === 9 && (
              <Scene10Celebration
                config={config}
                primaryPhoto={primaryPhoto}
                hasAnsweredYes={hasSentYesAnswer}
                onMarkAnsweredYes={handleMarkAnsweredYes}
                onNext={() => setCurrentScene(10)}
                onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
              />
            )}

            {currentScene === 10 && (
              <Scene11FinalMessage
                config={config}
                primaryPhoto={primaryPhoto}
                onNext={() => setCurrentScene(11)}
              />
            )}

            {currentScene === 11 && (
              <Scene11LoveShayari1
                config={config}
                primaryPhoto={primaryPhoto}
                onNext={() => setCurrentScene(12)}
              />
            )}

            {currentScene === 12 && (
              <Scene12SacredPromises
                config={config}
                primaryPhoto={primaryPhoto}
                onNext={() => setCurrentScene(13)}
              />
            )}

            {currentScene === 13 && (
              <Scene13LoveShayari2
                config={config}
                primaryPhoto={primaryPhoto}
                onNext={() => setCurrentScene(14)}
              />
            )}

            {currentScene === 14 && (
              <Scene14LifetimePillars
                config={config}
                primaryPhoto={primaryPhoto}
                onNext={() => setCurrentScene(15)}
              />
            )}

            {currentScene === 15 && (
              <Scene15SealOfLove
                config={config}
                primaryPhoto={primaryPhoto}
                onNext={() => setCurrentScene(16)}
              />
            )}

            {currentScene === 16 && (
              <Scene12Forever
                config={config}
                primaryPhoto={primaryPhoto}
                onReplay={() => setCurrentScene(2)}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
                onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 5. Memory Polaroid Expander Modal */}
      <MemoryModal
        isOpen={!!selectedMemory}
        memory={selectedMemory}
        allMemories={memories}
        onClose={() => setSelectedMemory(null)}
        onSelectMemory={mem => setSelectedMemory(mem)}
        onEditMemory={mem => {
          setSelectedMemory(null);
          setEditingMemory(mem);
        }}
      />

      {/* 6. Customization Modal */}
      <CustomizationModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        storyEvents={storyEvents}
        onUpdateStoryEvents={handleUpdateStoryEvents}
        onOpenStoryEditor={event => {
          setIsCustomizerOpen(false);
          setEditingStoryEvent(event !== undefined ? event : null);
        }}
        memories={memories}
        onUpdateMemories={handleUpdateMemories}
        onAddMultipleMemories={handleAddMultipleMemories}
        onOpenMemoryEditor={mem => {
          setIsCustomizerOpen(false);
          setEditingMemory(mem !== undefined ? mem : null);
        }}
        syncStatus={syncStatus}
        lastUpdatedBy={lastUpdatedBy}
      />

      {/* 7. Edit Story Chapter Modal */}
      <EditStoryModal
        isOpen={editingStoryEvent !== undefined}
        onClose={() => setEditingStoryEvent(undefined)}
        event={editingStoryEvent || null}
        onSave={handleSaveSingleStoryEvent}
        onDelete={handleDeleteStoryEvent}
      />

      {/* 8. Edit Memory Photo Modal */}
      <EditMemoryModal
        isOpen={editingMemory !== undefined}
        onClose={() => setEditingMemory(undefined)}
        memory={editingMemory || null}
        onSave={handleSaveSingleMemory}
        onSaveMultiple={handleAddMultipleMemories}
        onDelete={handleDeleteMemory}
      />

      {/* 9. Send Answer on WhatsApp Modal */}
      <WhatsAppAnswerModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        config={config}
        onAnswerSent={handleMarkAnsweredYes}
      />

      {/* 10. Real-time Cloud Sync Live Alert Notification */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1C0B13]/95 border border-[#25D366]/50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-[#FFF3EF] pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span>{syncToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
