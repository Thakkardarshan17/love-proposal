import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';
import { ProposalConfig, TimelineEvent, MemoryItem, ReasonItem } from '../types';
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

// Helper to sanitize data before saving to Firestore to prevent document size limit errors
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
    const payload = {
      ...sanitized,
      lastUpdatedBy: updaterName || 'Partner',
      updatedAt: Date.now()
    };
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
