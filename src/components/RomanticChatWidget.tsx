/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircleHeart,
  Send,
  X,
  Heart,
  Sparkles,
  MapPin,
  Smile,
  Trash2,
  Minimize2,
  Maximize2,
  User,
  Radio,
  Clock,
  Volume2,
  VolumeX,
  Bell,
  BellRing,
  Lock,
  Image as ImageIcon,
  Video,
  Play,
  Pause,
  Loader2,
  CheckCheck,
  Calendar,
  LogOut,
  Camera,
  Phone
} from 'lucide-react';
import { ChatMessage, VideoCallState } from '../types';
import {
  sendRealtimeChatMessage,
  reactToChatMessage,
  clearChatMessages,
  deleteChatMessage,
  subscribeToRealtimeChat,
  markChatMessagesAsRead,
  saveSharedProposalData
} from '../lib/firebase';
import { compressImageForChat, processVideoForChat } from '../utils/chatMediaUtils';
import { JitsiMeeting } from '@jitsi/react-sdk';

interface RomanticChatWidgetProps {
  currentUserName: string;
  onUpdateUserName: (name: string) => void;
  partnerName: string;
  yourName: string;
  chatMessages?: ChatMessage[];
  lastUpdatedBy?: string;
  isCloudSynced?: boolean;
  videoCallState?: VideoCallState | null;
}

const LOVE_QUICK_PHRASES = [
  'I love you so much! ❤️',
  'You are my entire world ✨',
  'Can’t wait to hold you 🥰',
  'Yes! A thousand times yes! 💍',
  'My heart beats only for you 💓',
  'You look so beautiful today 🌹',
  'Forever & Always, my love 🌸',
  'Thinking of you every second 💌'
];

const LOVE_REACTIONS = ['❤️', '💖', '😘', '💍', '🌸', '🌹', '🔥', '✨'];

export const RomanticChatWidget: React.FC<RomanticChatWidgetProps> = ({
  currentUserName,
  onUpdateUserName,
  partnerName = 'Labdhi',
  yourName = 'Deep',
  chatMessages: initialPropMessages = [],
  lastUpdatedBy,
  isCloudSynced = true,
  videoCallState
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialPropMessages);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(soundEnabled);
  
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [showQuickPhrases, setShowQuickPhrases] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deleteMsgConfirmId, setDeleteMsgConfirmId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [incomingNotification, setIncomingNotification] = useState<{
    senderName: string;
    text: string;
    mediaType?: string;
    time: string;
  } | null>(null);

  // Media Attachment State
  const [attachedMedia, setAttachedMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    name: string;
    thumbnail?: string;
  } | null>(null);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [selectedLightboxMedia, setSelectedLightboxMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    messageId?: string;
    caption?: string;
    senderName?: string;
    time?: string;
    location?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(0);
  const isInitialSnapshotRef = useRef<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Request browser system notification permission safely
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    } catch {}
  }, []);

  // Call State Handlers
  const handleStartCall = async (type: 'audio' | 'video') => {
    if (!currentUserName) return;
    const partner = currentUserName.toLowerCase() === yourName.toLowerCase() ? partnerName : yourName;
    const roomName = `RomanticRoom_${Math.random().toString(36).substring(2, 9)}`;
    
    await saveSharedProposalData({
      videoCallState: {
        caller: currentUserName,
        receiver: partner,
        status: 'ringing',
        roomName,
        timestamp: Date.now(),
        callType: type
      }
    });
  };

  const handleAnswerVideoCall = async () => {
    if (videoCallState) {
      await saveSharedProposalData({
        videoCallState: {
          ...videoCallState,
          status: 'accepted'
        }
      });
    }
  };

  const handleEndVideoCall = async () => {
    if (videoCallState) {
      await saveSharedProposalData({
        videoCallState: {
          ...videoCallState,
          status: 'ended'
        }
      });
    }
  };

  // Web Audio Context initialization helper
  const getAudioContext = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch {
      return null;
    }
  };

  // Play crisp "Message Sent" feedback audio
  const playSentSound = () => {
    if (!soundEnabledRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  };

  // Play romantic melodious chime when receiving partner's incoming message
  const playIncomingNotificationSound = () => {
    if (!soundEnabledRef.current) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Romantic three-tone chime (E5 -> G#5 -> B5 -> E6)
      const frequencies = [659.25, 830.61, 987.77, 1318.51];
      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = index === 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        const startTime = now + index * 0.07;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.14, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.48);
      });
    } catch {}
  };

  // Subscribe to real-time chat collection across all devices
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeChat((liveMessages) => {
      const msgs = liveMessages || [];
      setMessages(msgs);

      // Check for incoming new message from partner
      if (isInitialSnapshotRef.current) {
        isInitialSnapshotRef.current = false;
        prevMessagesLengthRef.current = msgs.length;
        return;
      }

      if (msgs.length > prevMessagesLengthRef.current) {
        const newMsg = msgs[msgs.length - 1];
        if (newMsg) {
          const isFromPartner = newMsg.senderName.trim().toLowerCase() !== currentUserName.trim().toLowerCase();
          if (isFromPartner) {
            playIncomingNotificationSound();
            if (!isOpen) {
              setUnreadCount((prev) => prev + 1);
            }
            // Trigger in-app top notification banner
            setIncomingNotification({
              senderName: newMsg.senderName,
              text: newMsg.text || (newMsg.mediaType === 'image' ? 'Sent a photo 📸' : 'Sent a video 🎬'),
              mediaType: newMsg.mediaType,
              time: newMsg.dateTimeStr
            });
            setTimeout(() => {
              setIncomingNotification(null);
            }, 6000);

            // Browser Web notification if tab not focused
            try {
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(`❤️ New Message from ${newMsg.senderName}`, {
                  body: newMsg.text || 'Sent you a romantic attachment 💌',
                  icon: '/icon.png'
                });
              }
            } catch {}
          }
        }
      }
      prevMessagesLengthRef.current = msgs.length;
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUserName, isOpen]);

  // Sync prop messages as fallback if available
  useEffect(() => {
    if (initialPropMessages && initialPropMessages.length > 0 && messages.length === 0) {
      setMessages(initialPropMessages);
    }
  }, [initialPropMessages]);

  // Auto-detect current device location on mount or open
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsDetectingLocation(true);
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                { headers: { 'Accept-Language': 'en' } }
              );
              if (res.ok) {
                const data = await res.json();
                const fullAddress = data.display_name || [
                  data.address?.road,
                  data.address?.suburb || data.address?.neighbourhood,
                  data.address?.city || data.address?.town || data.address?.village,
                  data.address?.state,
                  data.address?.postcode,
                  data.address?.country
                ].filter(Boolean).join(', ');

                const coordStr = `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                const name = fullAddress ? `${fullAddress} ${coordStr}` : `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                setDetectedLocation(name);
              } else {
                setDetectedLocation(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} 📍`);
              }
            } catch {
              setDetectedLocation('Live Device GPS 📍');
            } finally {
              setIsDetectingLocation(false);
            }
          },
          (error) => {
            console.warn('Geolocation permission/context restricted:', error?.message);
            setDetectedLocation('Live Location 📍');
            setIsDetectingLocation(false);
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
      } catch (err) {
        console.warn('Geolocation not allowed in current context:', err);
        setDetectedLocation('Live Location 📍');
        setIsDetectingLocation(false);
      }
    } else {
      setDetectedLocation('Live Location 📍');
    }
  }, [isOpen]);

  // Scroll to bottom and mark messages as read when opening chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      markChatMessagesAsRead(currentUserName);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages.length, currentUserName]);

  // Handle Photo selection
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      setIsProcessingMedia(true);
      const compressedDataUrl = await compressImageForChat(file);
      if (compressedDataUrl) {
        setAttachedMedia({
          url: compressedDataUrl,
          type: 'image',
          name: file.name
        });
        setActionToast('Photo ready to send 📸');
        setTimeout(() => setActionToast(null), 2500);
      } else {
        setActionToast('Could not load image. Please choose another.');
        setTimeout(() => setActionToast(null), 3000);
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      setActionToast('Image error. Please choose a smaller photo.');
      setTimeout(() => setActionToast(null), 3000);
    } finally {
      setIsProcessingMedia(false);
      if (e.target) e.target.value = '';
    }
  };

  // Handle Video selection
  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      setIsProcessingMedia(true);
      const videoResult = await processVideoForChat(file);
      if (videoResult.mediaUrl) {
        setAttachedMedia({
          url: videoResult.mediaUrl,
          type: 'video',
          name: videoResult.mediaName,
          thumbnail: videoResult.mediaThumbnail
        });
        setActionToast('Video ready to send 🎬');
        setTimeout(() => setActionToast(null), 2500);
      } else {
        setActionToast('Could not process video file.');
        setTimeout(() => setActionToast(null), 3000);
      }
    } catch (err) {
      console.error('Failed to process video:', err);
      setActionToast('Video error. Please select a shorter video.');
      setTimeout(() => setActionToast(null), 3000);
    } finally {
      setIsProcessingMedia(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const textToSend = (customText !== undefined ? customText : inputText).trim();

    // Must have either text or media
    if ((!textToSend && !attachedMedia) || isSending) return;

    setIsSending(true);

    try {
      // Format current human readable real-time with date and time
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const formattedDateTime = `${dateStr}, ${timeStr}`;

      // Determine sender role
      const isGirlfriend = currentUserName.toLowerCase().includes(partnerName.toLowerCase());
      const isBoyfriend = currentUserName.toLowerCase().includes(yourName.toLowerCase());
      const senderRole = isGirlfriend ? 'girlfriend' : isBoyfriend ? 'boyfriend' : 'partner';

      const payload: Omit<ChatMessage, 'id' | 'createdAt'> = {
        senderName: currentUserName,
        senderRole,
        text: textToSend,
        dateTimeStr: formattedDateTime,
        location: includeLocation ? detectedLocation || 'Live GPS 📍' : undefined,
        mediaUrl: attachedMedia?.url,
        mediaType: attachedMedia?.type,
        mediaName: attachedMedia?.name,
        mediaThumbnail: attachedMedia?.thumbnail
      };

      const success = await sendRealtimeChatMessage(payload);

      if (success) {
        playSentSound();
        setInputText('');
        setAttachedMedia(null);
        setShowQuickPhrases(false);
      } else {
        setActionToast('Failed to send. Please check connection & retry.');
        setTimeout(() => setActionToast(null), 3000);
      }
    } catch (sendErr) {
      console.error('Error sending message:', sendErr);
      setActionToast('Error sending message.');
      setTimeout(() => setActionToast(null), 3000);
    } finally {
      setIsSending(false);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    setActiveReactionMsgId(null);
    playSentSound();

    // Optimistic UI state update for immediate feedback
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const nextReaction = m.reaction === emoji ? undefined : emoji;
          return { ...m, reaction: nextReaction };
        }
        return m;
      })
    );

    try {
      await reactToChatMessage(messageId, emoji, currentUserName);
    } catch (err) {
      console.error('Failed to react to message:', err);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setDeleteMsgConfirmId(messageId);
  };

  const confirmDeleteMessage = async () => {
    if (!deleteMsgConfirmId) return;
    const targetId = deleteMsgConfirmId;
    setDeleteMsgConfirmId(null);
    setIsDeleting(true);

    // Optimistic UI update
    setMessages((prev) => prev.filter((m) => m.id !== targetId));

    try {
      await deleteChatMessage(targetId);
      setActionToast('Message deleted 🗑️');
      setTimeout(() => setActionToast(null), 2800);
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearHistory = () => {
    setShowClearAllModal(true);
  };

  const confirmClearAll = async () => {
    setShowClearAllModal(false);
    setIsDeleting(true);

    // Optimistic UI update
    setMessages([]);

    try {
      await clearChatMessages(currentUserName);
      setActionToast('All chat messages cleared 🧹');
      setTimeout(() => setActionToast(null), 2800);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to check if a message belongs to THIS device's active user
  const isMessageFromMe = (msg: ChatMessage) => {
    const cleanSender = msg.senderName.trim().toLowerCase();
    const cleanCurrent = currentUserName.trim().toLowerCase();
    return cleanSender === cleanCurrent;
  };

  // Helper to check if message sender is Girlfriend (Labdhi)
  const isMessageGirlfriend = (msg: ChatMessage) => {
    return (
      msg.senderRole === 'girlfriend' ||
      msg.senderName.toLowerCase().includes(partnerName.toLowerCase())
    );
  };

  return (
    <>
      {/* 0. Real-time Incoming Love Message Alert Banner */}
      {incomingNotification && (
        <div
          role="status"
          aria-live="polite"
          onClick={() => {
            setIsOpen(true);
            setIncomingNotification(null);
          }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-70 w-[92vw] max-w-md p-3.5 rounded-2xl bg-[var(--c-bg-darker)]/95 border border-[var(--c-accent-main)]/70 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] text-[var(--c-text-main)] flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.02] transition-all animate-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--c-accent-main)] to-[var(--c-accent-gold)] p-0.5 shrink-0 shadow-md">
              <div className="w-full h-full rounded-full bg-[var(--c-bg-darkest)] flex items-center justify-center text-[var(--c-accent-main)]">
                <Heart className="w-5 h-5 fill-[var(--c-accent-main)] animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-serif text-[var(--c-text-main)] truncate">
                  {incomingNotification.senderName}
                </span>
                <span className="text-[10px] text-[var(--c-accent-gold)] font-medium flex items-center gap-0.5">
                  <BellRing className="w-2.5 h-2.5 animate-bounce" />
                  <span>New Message</span>
                </span>
              </div>
              <p className="text-xs text-[var(--c-accent-light)]/90 truncate mt-0.5">
                {incomingNotification.text}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--c-accent-main)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] text-xs font-bold shadow-md">
              Open Chat
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIncomingNotification(null);
              }}
              className="p-1 rounded-lg text-[var(--c-accent-light)]/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Floating Love Chat Trigger Pill (Docked at Bottom-Right) */}
      {!isOpen && (
        <aside
          id="floating-love-chat-trigger"
          aria-label="Real-time Love Chat"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Active User Mini Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--c-bg-darker)]/90 backdrop-blur-md border border-[var(--c-accent-main)]/30 text-xs text-[var(--c-text-main)] shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[var(--c-accent-light)]/70 text-[11px]">Chatting as:</span>
            <span className="font-bold text-[var(--c-accent-gold)] max-w-[100px] truncate">{currentUserName}</span>
          </div>

          {/* Main Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-bold shadow-[0_0_25px_rgba(232,137,157,0.55)] hover:shadow-[0_0_35px_rgba(232,137,157,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open Cross-Device Real-Time Chat"
          >
            <div className="relative">
              <MessageCircleHeart className="w-5 h-5 fill-[var(--c-bg-darkest)]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-[var(--c-text-main)] animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-[var(--c-text-main)]" />
            </div>

            <span className="text-xs uppercase tracking-wider font-extrabold hidden xs:inline">
              Live Chat
            </span>

            {/* Unread Counter Badge */}
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--c-bg-darkest)] text-[var(--c-text-main)] text-[10px] font-extrabold animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </aside>
      )}

      {/* 2. Real-Time Chat Modal / Drawer */}
      {isOpen && (
        <aside
          id="realtime-love-chat-drawer"
          aria-label="Private Couple Live Chat"
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-2 sm:inset-6 md:inset-10'
              : 'bottom-2 sm:bottom-5 right-2 sm:right-5 w-[calc(100vw-16px)] sm:w-[440px] h-[620px] max-h-[92vh]'
          } flex flex-col rounded-3xl bg-[var(--c-bg-darker)]/95 backdrop-blur-2xl border border-[var(--c-accent-main)]/40 shadow-[0_20px_70px_rgba(0,0,0,0.85)] text-[var(--c-text-main)] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Header */}
          <header className="p-3.5 sm:p-4 bg-gradient-to-r from-[var(--c-bg-dark)] via-[var(--c-bg-light)] to-[var(--c-bg-dark)] border-b border-[var(--c-accent-main)]/20 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--c-accent-main)] to-[var(--c-accent-gold)] p-0.5 shrink-0 shadow-md">
                <div className="w-full h-full rounded-full bg-[var(--c-bg-darkest)] flex items-center justify-center text-[var(--c-accent-main)]">
                  <Heart className="w-4 h-4 fill-[var(--c-accent-main)]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--c-bg-darkest)]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold font-serif text-[var(--c-text-main)] truncate">
                    Real-time Love Chat
                  </h2>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-0.5">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    <span>Live</span>
                  </span>
                  {detectedLocation && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--c-accent-gold)]/20 border border-[var(--c-accent-gold)]/30 text-[var(--c-accent-gold)] font-medium flex items-center gap-0.5 truncate max-w-[140px]" title={detectedLocation}>
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{detectedLocation}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--c-accent-light)]/70 truncate flex items-center gap-1">
                  <span>Chatting with</span>
                  <span className="font-semibold text-[var(--c-accent-gold)]">
                    {currentUserName.toLowerCase().includes(partnerName.toLowerCase()) ? yourName : partnerName}
                  </span>
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Audio Call */}
              <button
                type="button"
                onClick={() => handleStartCall('audio')}
                className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer animate-pulse"
                title="Start Audio Call"
                aria-label="Start Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              {/* Video Call */}
              <button
                type="button"
                onClick={() => handleStartCall('video')}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer animate-pulse"
                title="Start Video Call"
                aria-label="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  getAudioContext();
                }}
                className="p-1.5 rounded-lg text-[var(--c-accent-light)]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
                aria-label={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[var(--c-accent-gold)]" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Clear History */}
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-[var(--c-accent-light)]/50 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                title="Clear Chat History"
                aria-label="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Expand / Collapse */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-[var(--c-accent-light)]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Restore Size' : 'Expand Fullscreen'}
                aria-label={isExpanded ? 'Restore Size' : 'Expand Fullscreen'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[var(--c-accent-light)]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize Chat"
                aria-label="Minimize Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Active Identity Bar - Private & Personal Chat */}
          <section
            aria-label="Sender Identity Bar"
            className="px-3.5 py-2 bg-[var(--c-bg-darkest)]/85 border-b border-[var(--c-accent-main)]/15 flex items-center justify-between text-xs gap-2 shrink-0"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[var(--c-accent-light)]/70 text-[11px]">Logged in as:</span>
              <span className="font-bold text-[var(--c-text-main)] truncate">
                {currentUserName} {currentUserName.toLowerCase().includes(partnerName.toLowerCase()) ? '👸' : '🤴'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-[var(--c-accent-gold)] bg-white/5 px-2.5 py-1 rounded-full border border-[var(--c-accent-gold)]/30 font-medium">
              <Lock className="w-3 h-3" />
              <span>Personal &amp; Private</span>
            </div>
          </section>

          {/* Messages Stream */}
          <main
            tabIndex={0}
            aria-label="Love Chat Messages Feed"
            className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-4 space-y-3.5 focus:outline-none scrollbar-thin scrollbar-thumb-[var(--c-accent-main)]/20"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--c-accent-light)]/60 space-y-2">
                <Heart className="w-10 h-10 text-[var(--c-accent-main)]/40 animate-pulse fill-[var(--c-accent-main)]/20" />
                <p className="text-xs">No messages yet. Send a love note, photo, or video to start chatting!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = isMessageFromMe(msg);
                const isGirlfriend = isMessageGirlfriend(msg);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group/msg relative`}
                  >
                    {/* Sender Header Name & Timestamp */}
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isMe ? 'text-[var(--c-accent-gold)]' : isGirlfriend ? 'text-[var(--c-accent-main)]' : 'text-[var(--c-accent-gold)]'
                        }`}
                      >
                        {isMe ? (
                          <>
                            <span>You ({msg.senderName})</span>
                            {msg.read ? (
                              <span className="text-green-500 font-bold ml-1 text-xs" title="Read by partner">✓✓</span>
                            ) : (
                              <span className="text-red-500 font-bold ml-1 text-xs animate-pulse" title="Sent, waiting for partner to read">✓</span>
                            )}
                          </>
                        ) : (
                          <>
                            <span>{msg.senderName}</span>
                            <span>{isGirlfriend ? '👸' : '🤴'}</span>
                          </>
                        )}
                      </span>
                      <span className="text-[9px] text-[var(--c-accent-light)]/60 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{msg.dateTimeStr}</span>
                      </span>
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl text-xs leading-relaxed shadow-md transition-all ${
                        isMe
                          ? 'bg-gradient-to-tr from-[var(--c-accent-main)] via-[var(--c-accent-light)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] font-medium rounded-tr-none'
                          : isGirlfriend
                          ? 'bg-gradient-to-tr from-[var(--c-bg-dark)] via-[var(--c-bg-light)] to-[#250F18] border border-[var(--c-accent-main)]/40 text-[var(--c-text-main)] rounded-tl-none'
                          : 'bg-gradient-to-tr from-[#231710] via-[#2F1F17] to-[#1E110A] border border-[var(--c-accent-gold)]/40 text-[var(--c-text-main)] rounded-tl-none'
                      }`}
                    >
                      {/* Attached Media Render (Photo or Video) */}
                      {msg.mediaUrl && (
                        <div className="w-full rounded-t-xl overflow-hidden">
                          {msg.mediaType === 'video' ? (
                            <div className="relative bg-black/80 overflow-hidden group/vid">
                              <video
                                src={msg.mediaUrl}
                                controls
                                playsInline
                                preload="auto"
                                muted={false}
                                poster={msg.mediaThumbnail}
                                onClick={(e) => e.stopPropagation()}
                                onError={(e) => {
                                  (e.target as HTMLVideoElement).src = 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-water-1200-large.mp4';
                                }}
                                className="w-full max-h-56 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedLightboxMedia({
                                    url: msg.mediaUrl!,
                                    type: 'video',
                                    messageId: msg.id,
                                    caption: msg.text,
                                    senderName: msg.senderName,
                                    time: msg.dateTimeStr,
                                    location: msg.location
                                  })
                                }
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/90 transition-colors"
                                title="Expand Video"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                setSelectedLightboxMedia({
                                  url: msg.mediaUrl!,
                                  type: 'image',
                                  messageId: msg.id,
                                  caption: msg.text,
                                  senderName: msg.senderName,
                                  time: msg.dateTimeStr,
                                  location: msg.location
                                })
                              }
                              className="relative cursor-pointer group/img overflow-hidden bg-black/40"
                            >
                              <img
                                src={msg.mediaUrl}
                                alt="Shared moment"
                                className="w-full max-h-60 object-cover hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="p-2 rounded-full bg-black/70 text-white text-xs font-semibold flex items-center gap-1">
                                  <Maximize2 className="w-3.5 h-3.5" />
                                  <span>View Photo</span>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Text Content */}
                      {msg.text && (
                        <div className="px-3.5 py-2.5">
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        </div>
                      )}

                      {/* Attached Live Location & Date Tag */}
                      {msg.location && (
                        <div
                          className={`flex items-center justify-between gap-1 px-3.5 pb-2 text-[10px] ${
                            isMe ? 'text-[var(--c-bg-darkest)]/75' : 'text-[var(--c-accent-gold)]'
                          }`}
                        >
                          <div className="flex items-start gap-1 w-full">
                            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                            <span className="whitespace-normal break-words leading-tight">{msg.location}</span>
                          </div>
                        </div>
                      )}

                      {/* Prominent Reaction Tag on Bubble */}
                      {msg.reaction && msg.reaction.trim() !== '' && (
                        <div className={`absolute -bottom-3 z-10 ${isMe ? 'right-3' : 'left-3'}`}>
                          <button
                            type="button"
                            onClick={() => handleReaction(msg.id, msg.reaction!)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--c-bg-darker)] border border-[var(--c-accent-main)]/80 text-xs shadow-[0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer hover:scale-115 transition-all"
                            title="Click to remove or toggle reaction"
                          >
                            <span className="text-sm leading-none">{msg.reaction}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Message Actions (React & Delete) */}
                    <div className="flex items-center gap-1.5 mt-1.5 px-1 relative">
                      {/* Floating Reactions Popup right above message */}
                      {activeReactionMsgId === msg.id && (
                        <div className={`absolute z-30 bottom-[calc(100%+6px)] ${isMe ? 'right-0' : 'left-0'} p-1.5 rounded-2xl bg-[var(--c-bg-darker)]/98 border border-[var(--c-accent-main)]/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center gap-1.5 animate-in zoom-in-90 duration-150`}>
                          {LOVE_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleReaction(msg.id, emoji)}
                              className="p-1.5 hover:scale-130 active:scale-95 transition-all text-base cursor-pointer rounded-lg hover:bg-white/10"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)
                        }
                        className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-all ${
                          activeReactionMsgId === msg.id
                            ? 'bg-[var(--c-accent-main)] text-[var(--c-bg-darkest)] font-bold shadow'
                            : 'text-[var(--c-accent-light)]/80 hover:text-white bg-white/5 hover:bg-white/10'
                        }`}
                        title="React with love emoji"
                      >
                        <Smile className="w-3 h-3 text-[var(--c-accent-gold)]" />
                        <span>React</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-[10px] text-red-400/70 hover:text-red-300 hover:bg-red-500/15 px-2 py-0.5 rounded-full bg-white/5 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Delete this message"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* Pending Media Attachment Preview Bar */}
          {attachedMedia && (
            <div className="px-3.5 py-2 bg-[var(--c-bg-dark)] border-t border-[var(--c-accent-main)]/20 flex items-center justify-between gap-2 shrink-0 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-12 h-12 rounded-lg bg-black/60 overflow-hidden border border-[var(--c-accent-main)]/40 shrink-0">
                  {attachedMedia.type === 'image' ? (
                    <img
                      src={attachedMedia.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--c-bg-darkest)] text-[var(--c-accent-gold)]">
                      <Video className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 text-xs">
                  <p className="font-bold text-[var(--c-text-main)] truncate">{attachedMedia.name}</p>
                  <p className="text-[10px] text-[var(--c-accent-gold)]">
                    Ready to send with location &amp; timestamp 🚀
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAttachedMedia(null)}
                className="p-1.5 rounded-lg text-[var(--c-accent-light)]/70 hover:text-white hover:bg-white/10 cursor-pointer"
                title="Remove Attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Processing Media Spinner */}
          {isProcessingMedia && (
            <div className="px-3.5 py-2 bg-[var(--c-bg-dark)] border-t border-[var(--c-accent-main)]/20 flex items-center gap-2 text-xs text-[var(--c-accent-gold)] shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizing media attachment for real-time delivery...</span>
            </div>
          )}

          {/* Quick Love Sparks Drawer */}
          {showQuickPhrases && (
            <div className="px-3 py-2 bg-[var(--c-bg-dark)]/95 border-t border-[var(--c-accent-main)]/20 max-h-32 overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between mb-1 text-[10px] font-semibold text-[var(--c-accent-gold)] uppercase tracking-wider">
                <span>Quick Love Sparks</span>
                <button
                  type="button"
                  onClick={() => setShowQuickPhrases(false)}
                  className="text-[var(--c-accent-light)]/60 hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {LOVE_QUICK_PHRASES.map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(undefined, phrase)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[var(--c-accent-main)] hover:text-[var(--c-bg-darkest)] text-[11px] text-[var(--c-text-main)] transition-all text-left cursor-pointer"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Media & GPS Attachment Toolbar */}
          <div className="px-3 py-1.5 bg-[var(--c-bg-darkest)]/90 border-t border-[var(--c-accent-main)]/15 flex items-center justify-between gap-1 overflow-x-auto shrink-0">
            <div className="flex items-center gap-1">
              {/* Photo Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-[var(--c-text-main)] flex items-center gap-1 font-medium cursor-pointer transition-colors"
                title="Send Photo"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[var(--c-accent-main)]" />
                <span className="hidden xs:inline">Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* Video Upload Button */}
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-[var(--c-text-main)] flex items-center gap-1 font-medium cursor-pointer transition-colors"
                title="Send Video"
              >
                <Video className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
                <span className="hidden xs:inline">Video</span>
              </button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />

              {/* Love Sparks Toggle */}
              <button
                type="button"
                onClick={() => setShowQuickPhrases(!showQuickPhrases)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-[var(--c-accent-gold)] flex items-center gap-1 font-medium cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden xs:inline">Sparks</span>
              </button>

              {/* Location Tag Toggle */}
              <button
                type="button"
                onClick={() => setIncludeLocation(!includeLocation)}
                className={`px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                  includeLocation
                    ? 'bg-[var(--c-accent-main)]/20 text-[var(--c-accent-main)] border border-[var(--c-accent-main)]/30'
                    : 'bg-white/5 text-[var(--c-accent-light)]/50'
                }`}
                title={detectedLocation ? `Attach ${detectedLocation}` : 'Attach Location'}
              >
                <MapPin className="w-3 h-3" />
                <span className="hidden xs:inline">
                  {includeLocation ? 'GPS On 📍' : 'GPS Off'}
                </span>
              </button>
            </div>

            {/* Quick Emoji Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {['❤️', '💖', '😘', '💍', '🌸'].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setInputText((prev) => prev + em)}
                  className="p-1 hover:scale-125 transition-transform text-xs cursor-pointer"
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[var(--c-bg-darker)] border-t border-[var(--c-accent-main)]/20 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                attachedMedia
                  ? 'Add a caption for your media...'
                  : `Send message as ${currentUserName}...`
              }
              className="flex-1 px-3.5 py-2.5 bg-[var(--c-bg-darkest)] border border-[var(--c-accent-main)]/30 focus:border-[var(--c-accent-gold)] focus:ring-2 focus:ring-[var(--c-accent-gold)]/30 rounded-xl text-xs sm:text-sm text-[var(--c-text-main)] placeholder-[var(--c-accent-light)]/40 outline-none transition-all"
            />

            <button
              type="submit"
              disabled={(!inputText.trim() && !attachedMedia) || isSending}
              className="p-2.5 rounded-xl font-bold bg-gradient-to-r from-[var(--c-accent-main)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(232,137,157,0.4)] flex items-center justify-center cursor-pointer shrink-0"
              title="Send Message"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin text-[var(--c-bg-darkest)]" />
              ) : (
                <Send className="w-4 h-4 text-[var(--c-bg-darkest)]" />
              )}
            </button>
          </form>
        </aside>
      )}

      {/* 3. Media Lightbox / Fullscreen Viewer */}
      {selectedLightboxMedia && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Media Preview"
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLightboxMedia(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center justify-center bg-[var(--c-bg-darker)] rounded-3xl border border-[var(--c-accent-main)]/40 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="w-full p-4 bg-[var(--c-bg-dark)] border-b border-[var(--c-accent-main)]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--c-accent-gold)]">
                  {selectedLightboxMedia.senderName}
                </span>
                <span className="text-[var(--c-accent-light)]/60">• {selectedLightboxMedia.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {selectedLightboxMedia.messageId && (
                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedLightboxMedia.messageId!;
                      setSelectedLightboxMedia(null);
                      handleDeleteMessage(id);
                    }}
                    className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Delete this photo/video"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedLightboxMedia(null)}
                  className="p-1.5 rounded-lg text-[var(--c-accent-light)]/70 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Close viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Body */}
            <div className="w-full max-h-[65vh] flex items-center justify-center p-2 bg-black/50 overflow-hidden">
              {selectedLightboxMedia.type === 'video' ? (
                <video
                  src={selectedLightboxMedia.url}
                  controls
                  autoPlay
                  playsInline
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    (e.target as HTMLVideoElement).src = 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-water-1200-large.mp4';
                  }}
                  className="max-w-full max-h-[60vh] object-contain rounded-xl"
                />
              ) : (
                <img
                  src={selectedLightboxMedia.url}
                  alt="Full view"
                  className="max-w-full max-h-[60vh] object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Caption & Location Footer */}
            {(selectedLightboxMedia.caption || selectedLightboxMedia.location) && (
              <div className="w-full p-4 bg-[var(--c-bg-darker)] border-t border-[var(--c-accent-main)]/20 text-xs space-y-1">
                {selectedLightboxMedia.caption && (
                  <p className="text-[var(--c-text-main)] text-sm font-medium">
                    {selectedLightboxMedia.caption}
                  </p>
                )}
                {selectedLightboxMedia.location && (
                  <div className="flex items-center gap-1 text-[var(--c-accent-gold)] text-[11px]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedLightboxMedia.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Delete Single Message Confirmation Modal */}
      {deleteMsgConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Delete Message Confirmation"
          className="fixed inset-0 z-70 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setDeleteMsgConfirmId(null)}
        >
          <div
            className="w-full max-w-sm p-6 rounded-3xl bg-[var(--c-bg-darker)] border border-red-500/40 text-[var(--c-text-main)] text-center space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-[var(--c-text-main)]">Delete Message?</h3>
              <p className="text-xs text-[var(--c-accent-light)]/70 mt-1">
                Kya aap ye message delete karna chahte hain? This message will be permanently removed for both Deep &amp; Labdhi across all devices.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteMessage}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Message'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteMsgConfirmId(null)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[var(--c-accent-light)]/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Clear Entire Chat Confirmation Modal */}
      {showClearAllModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Clear Chat History Confirmation"
          className="fixed inset-0 z-70 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowClearAllModal(false)}
        >
          <div
            className="w-full max-w-sm p-6 rounded-3xl bg-[var(--c-bg-darker)] border border-red-500/40 text-[var(--c-text-main)] text-center space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-[var(--c-text-main)]">Clear Entire Chat?</h3>
              <p className="text-xs text-[var(--c-accent-light)]/70 mt-1 leading-relaxed">
                Kya aap sabhi messages, photos aur videos delete karna chahte hain? This will clear the entire chat conversation for both devices.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmClearAll}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Clearing...' : 'Yes, Clear All Messages'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[var(--c-accent-light)]/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Video Call Modal UI */}
      {videoCallState && videoCallState.status !== 'ended' && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          {videoCallState.status === 'ringing' && videoCallState.receiver === currentUserName ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className={`w-24 h-24 rounded-full ${videoCallState.callType === 'audio' ? 'bg-blue-500/20 border-blue-500' : 'bg-emerald-500/20 border-emerald-500'} border flex items-center justify-center animate-pulse`}>
                {videoCallState.callType === 'audio' ? (
                  <Phone className="w-12 h-12 text-blue-400" />
                ) : (
                  <Video className="w-12 h-12 text-emerald-400" />
                )}
              </div>
              <h2 className="text-2xl font-serif text-white">{videoCallState.caller} is {videoCallState.callType === 'audio' ? 'calling' : 'video calling'}...</h2>
              <div className="flex items-center gap-6 mt-8">
                <button
                  type="button"
                  onClick={() => saveSharedProposalData({ videoCallState: { ...videoCallState, status: 'declined' } })}
                  className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-transform active:scale-95"
                >
                  <X className="w-8 h-8 text-white" />
                </button>
                <button
                  type="button"
                  onClick={handleAnswerVideoCall}
                  className={`w-16 h-16 rounded-full ${videoCallState.callType === 'audio' ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]'} flex items-center justify-center transition-transform active:scale-95 animate-bounce`}
                >
                  {videoCallState.callType === 'audio' ? (
                    <Phone className="w-8 h-8 text-white" />
                  ) : (
                    <Video className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>
            </div>
          ) : videoCallState.status === 'ringing' && videoCallState.caller === currentUserName ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className={`w-24 h-24 rounded-full ${videoCallState.callType === 'audio' ? 'bg-blue-500/20 border-blue-500' : 'bg-emerald-500/20 border-emerald-500'} border flex items-center justify-center animate-pulse`}>
                {videoCallState.callType === 'audio' ? (
                  <Phone className="w-12 h-12 text-blue-400" />
                ) : (
                  <Video className="w-12 h-12 text-emerald-400" />
                )}
              </div>
              <h2 className="text-xl font-serif text-white">Calling {videoCallState.receiver}...</h2>
              <button
                type="button"
                onClick={handleEndVideoCall}
                className="mt-8 w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-transform active:scale-95"
              >
                <X className="w-8 h-8 text-white" />
              </button>
            </div>
          ) : videoCallState.status === 'accepted' ? (
            <div className="w-full max-w-4xl h-full max-h-[80vh] flex flex-col bg-[var(--c-bg-darkest)] rounded-3xl overflow-hidden border border-[var(--c-accent-main)]/20 shadow-2xl relative">
              <div className="flex items-center justify-between p-4 bg-[var(--c-bg-darker)] border-b border-[var(--c-accent-main)]/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-white">Live with {videoCallState.caller === currentUserName ? videoCallState.receiver : videoCallState.caller}</span>
                </div>
                <button
                  onClick={handleEndVideoCall}
                  className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                >
                  End Call
                </button>
              </div>
              <div className="flex-1 w-full bg-black">
                <JitsiMeeting
                  roomName={videoCallState.roomName}
                  getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
                  configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: videoCallState.callType === 'audio',
                    disableModeratorIndicator: true,
                    disableInviteFunctions: true,
                    prejoinPageEnabled: false
                  }}
                  userInfo={{
                    displayName: currentUserName,
                    email: `${currentUserName.toLowerCase().replace(/[^a-z]/g, '') || 'partner'}@lovestory.com`
                  }}
                />
              </div>
            </div>
          ) : videoCallState.status === 'declined' && videoCallState.caller === currentUserName ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
                <X className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-xl font-serif text-white">Call Declined</h2>
              <button
                type="button"
                onClick={handleEndVideoCall}
                className="mt-4 px-6 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* 8. Action Toast Notification */}
      {actionToast && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-80 px-4 py-2.5 rounded-full bg-[var(--c-bg-darker)]/95 border border-[var(--c-accent-main)]/40 shadow-2xl text-xs font-semibold text-[var(--c-text-main)] flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-[var(--c-accent-main)] animate-ping" />
          <span>{actionToast}</span>
        </div>
      )}
    </>
  );
};

