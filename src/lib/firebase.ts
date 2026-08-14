import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';
import { ProposalConfig, TimelineEvent, MemoryItem, ReasonItem, ChatMessage } from '../types';
import { initialProposalConfig, initialTimelineEvents, initialMemories, initialReasons } from '../config/proposalData';

export const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Attempt anonymous sign in for persistent cloud security context
export const initAuth = async () => {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.warn('Firebase anonymous auth notice:', error);
  }
};

export const PROPOSAL_DOC_ID = 'shared_love_story';

export interface SharedProposalData {
  config: ProposalConfig;
  storyEvents: TimelineEvent[];
  memories: MemoryItem[];
  reasons?: ReasonItem[];
  chatMessages?: ChatMessage[];
  hasAnsweredYes: boolean;
  yesTimestamp?: number | null;
  lastUpdatedBy?: string;
  updatedAt?: number;
}

// Default initial state
export const defaultSharedData: SharedProposalData = {
  config: initialProposalConfig,
  storyEvents: initialTimelineEvents,
  memories: initialMemories,
  reasons: initialReasons,
  chatMessages: [
    {
      id: 'msg-welcome-1',
      senderName: 'Deep',
      senderRole: 'boyfriend',
      text: 'Welcome to our private love world, my princess! ❤️ Let us chat and make promises here.',
      createdAt: Date.now() - 60000,
      dateTimeStr: 'Just now',
      location: 'In Your Heart',
      reaction: '💖'
    }
  ],
  hasAnsweredYes: false,
  yesTimestamp: null,
  updatedAt: Date.now()
};

// Listen to real-time changes across any device
export const subscribeToSharedProposal = (
  onData: (data: SharedProposalData) => void,
  onError?: (err: Error) => void
) => {
  const proposalRef = doc(db, 'proposals', PROPOSAL_DOC_ID);
  
  return onSnapshot(
    proposalRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data() as SharedProposalData;
        onData(cloudData);
      } else {
        // First time initialization in Cloud Firestore
        setDoc(proposalRef, defaultSharedData, { merge: true }).catch(console.error);
        onData(defaultSharedData);
      }
    },
    (err) => {
      console.error('Firestore real-time sync error:', err);
      if (onError) onError(err);
    }
  );
};

// Helper to sanitize data before saving to Firestore to prevent document size limit errors and undefined field errors
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanFirestoreData) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

const sanitizeForCloud = (data: Partial<SharedProposalData>): Partial<SharedProposalData> => {
  const clean = { ...data };

  if (clean.memories && Array.isArray(clean.memories)) {
    clean.memories = clean.memories.map(m => {
      const copy = { ...m };
      // Strip local blob URLs and huge base64 video data URLs from Firestore payload
      if (copy.videoUrl && (copy.videoUrl.startsWith('blob:') || copy.videoUrl.startsWith('data:video/'))) {
        delete copy.videoUrl;
      }
      return copy;
    });
  }

  return clean;
};

// Save updates directly to Cloud Firestore (instantly visible on Boyfriend/Girlfriend device)
export const saveSharedProposalData = async (
  partialData: Partial<SharedProposalData>,
  updaterName?: string
) => {
  try {
    const proposalRef = doc(db, 'proposals', PROPOSAL_DOC_ID);
    const sanitized = sanitizeForCloud(partialData);
    const payload = cleanFirestoreData({
      ...sanitized,
      lastUpdatedBy: updaterName || 'Partner',
      updatedAt: Date.now()
    });
    await setDoc(proposalRef, payload, { merge: true });
    return true;
  } catch (error) {
    console.error('Failed to save to Firestore:', error);
    return false;
  }
};

// Fetch initial data once if needed
export const fetchSharedProposalOnce = async (): Promise<SharedProposalData | null> => {
  try {
    const proposalRef = doc(db, 'proposals', PROPOSAL_DOC_ID);
    const snapshot = await getDoc(proposalRef);
    if (snapshot.exists()) {
      return snapshot.data() as SharedProposalData;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch from Firestore once:', err);
    return null;
  }
};

/**
 * Real-time subscription to dedicated chat messages collection
 * Listens for sub-second updates, attachments, and reactions across all devices
 */
export const subscribeToRealtimeChat = (
  onMessages: (messages: ChatMessage[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const messagesColRef = collection(db, 'love_chat_messages');
    const q = query(messagesColRef, orderBy('createdAt', 'asc'), limit(500));

    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const msgs: ChatMessage[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            msgs.push({
              id: d.id,
              senderName: data.senderName || 'Partner',
              senderRole: data.senderRole,
              senderId: data.senderId,
              text: data.text || '',
              createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
              dateTimeStr: data.dateTimeStr || 'Just now',
              location: data.location,
              reaction: data.reaction,
              sticker: data.sticker,
              mediaUrl: data.mediaUrl,
              mediaType: data.mediaType,
              mediaName: data.mediaName,
              mediaThumbnail: data.mediaThumbnail,
              read: Boolean(data.read)
            });
          });
          onMessages(msgs);
        } else {
          // Dedicated collection is empty (e.g. cleared or initial empty)
          onMessages([]);
        }
      },
      (err) => {
        console.warn('Real-time chat collection listener notice:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.error('Failed to initialize real-time chat listener:', err);
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
};

/**
 * Send a real-time romantic chat message with instant cross-device broadcast
 * Supports text, photos, video clips, and voice attachments
 */
export const sendRealtimeChatMessage = async (
  message: Omit<ChatMessage, 'id' | 'createdAt'>
): Promise<boolean> => {
  try {
    await initAuth();
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    // For Firestore storage, if mediaUrl is a blob: URL or exceeds 800KB, use thumbnail or placeholder for remote sync
    let remoteMediaUrl = message.mediaUrl;
    if (remoteMediaUrl && (remoteMediaUrl.startsWith('blob:') || remoteMediaUrl.length > 800 * 1024)) {
      remoteMediaUrl = message.mediaThumbnail || (message.mediaType === 'video' ? '[Video Attachment]' : undefined);
    }

    const newMsg: ChatMessage = {
      id: msgId,
      createdAt: Date.now(),
      ...message,
      mediaUrl: remoteMediaUrl
    };

    // 1. Direct write to atomic collection for sub-second real-time sync
    const msgDocRef = doc(db, 'love_chat_messages', msgId);
    const cleanedMsg = cleanFirestoreData(newMsg);
    await setDoc(msgDocRef, cleanedMsg);

    // 2. Also update parent proposal document with lightweight reference (strip heavy base64)
    const proposalRef = doc(db, 'proposals', PROPOSAL_DOC_ID);
    getDoc(proposalRef).then(async (snap) => {
      if (snap.exists()) {
        const current = snap.data() as SharedProposalData;
        const existingMessages = current.chatMessages || [];
        // Keep a lightweight summary in parent doc so parent doc never exceeds 1MB
        const lightweightMsg: ChatMessage = cleanFirestoreData({
          ...newMsg,
          mediaUrl: newMsg.mediaType ? '[attachment]' : undefined,
          mediaThumbnail: undefined
        });
        const updated = [...existingMessages, lightweightMsg].slice(-200);
        await setDoc(
          proposalRef,
          cleanFirestoreData({
            chatMessages: updated,
            lastUpdatedBy: message.senderName,
            updatedAt: Date.now()
          }),
          { merge: true }
        );
      }
    }).catch(() => {});

    return true;
  } catch (err) {
    console.error('Failed to send real-time chat message:', err);
    return false;
  }
};

/**
 * React to an existing chat message (e.g. ❤️, 💖, 😘, 💍, 🌹)
 */
export const reactToChatMessage = async (
  messageId: string,
  reaction: string,
  userName?: string
): Promise<boolean> => {
  try {
    await initAuth();
    const msgDocRef = doc(db, 'love_chat_messages', messageId);
    const snap = await getDoc(msgDocRef);
    if (snap.exists()) {
      const data = snap.data();
      const newReaction = data.reaction === reaction ? '' : reaction;
      await setDoc(msgDocRef, { reaction: newReaction }, { merge: true });
    }

    // Also update in shared proposal doc
    const proposalRef = doc(db, 'proposals', PROPOSAL_DOC_ID);
    getDoc(proposalRef).then(async (pSnap) => {
      if (pSnap.exists()) {
        const pData = pSnap.data() as SharedProposalData;
        const updated = (pData.chatMessages || []).map((m) =>
          m.id === messageId ? { ...m, reaction: m.reaction === reaction ? undefined : reaction } : m
        );
        await setDoc(proposalRef, cleanFirestoreData({ chatMessages: updated }), { merge: true });
      }
    }).catch(() => {});

    return true;
  } catch (err) {
    console.error('Failed to react to message:', err);
    return false;
  }
};

/**
 * Delete a specific chat message completely from Firestore
 */
export const deleteChatMessage = async (messageId: string): Promise<boolean> => {
  try {
    await initAuth();
    // 1. Delete from dedicated collection
    const msgDocRef = doc(db, 'love_chat_messages', messageId);
    await deleteDoc(msgDocRef);

    // 2. Also remove from parent proposal doc
    const proposalRef = doc(db, 'proposals', PROPOSAL_DOC_ID);
    const snap = await getDoc(proposalRef);
    if (snap.exists()) {
      const data = snap.data() as SharedProposalData;
      const filtered = (data.chatMessages || []).filter((m) => m.id !== messageId);
      await setDoc(proposalRef, cleanFirestoreData({ chatMessages: filtered }), { merge: true });
    }

    return true;
  } catch (err) {
    console.error('Failed to delete chat message:', err);
    return false;
  }
};

/**
 * Mark messages not sent by viewerName as read: true
 */
export const markChatMessagesAsRead = async (viewerName: string): Promise<void> => {
  try {
    await initAuth();
    const messagesColRef = collection(db, 'love_chat_messages');
    const snap = await getDocs(messagesColRef);
    const updatePromises = snap.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const sender = (data.senderName || '').trim().toLowerCase();
      const viewer = (viewerName || '').trim().toLowerCase();
      if (sender !== viewer && !data.read) {
        await setDoc(docSnap.ref, { read: true }, { merge: true });
      }
    });
    await Promise.all(updatePromises);
  } catch (err) {
    console.warn('Failed to mark chat messages as read:', err);
  }
};

/**
 * Clear all chat messages from Firestore
 */
export const clearChatMessages = async (userName?: string): Promise<boolean> => {
  try {
    await initAuth();

    // 1. Delete all documents in love_chat_messages collection
    try {
      const messagesColRef = collection(db, 'love_chat_messages');
      const snap = await getDocs(messagesColRef);
      const deletePromises = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
    } catch (colErr) {
      console.warn('Error clearing messages subcollection:', colErr);
    }

    // 2. Clear from shared proposal doc
    const proposalRef = doc(db, 'proposals', PROPOSAL_DOC_ID);
    await setDoc(
      proposalRef,
      {
        chatMessages: [],
        lastUpdatedBy: userName || 'Partner',
        updatedAt: Date.now()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Failed to clear chat:', err);
    return false;
  }
};

