/**
 * IndexedDB storage utility for large dream videos and media
 * Allows storing video files safely and reliably across sessions without crashing localStorage or exceeding Firestore limits.
 */

const DB_NAME = 'RomanticProposalMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'dream_videos';

export interface SavedVideoRecord {
  id: string;
  blob: Blob;
  mimeType: string;
  name?: string;
  updatedAt: number;
}

// In-memory cache of object URLs to avoid memory leaks
const objectUrlCache = new Map<string, string>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a video file/blob into IndexedDB
 */
export async function saveVideoBlob(id: string, fileOrBlob: Blob | File, name?: string): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const record: SavedVideoRecord = {
        id,
        blob: fileOrBlob,
        mimeType: fileOrBlob.type || 'video/mp4',
        name: name || (fileOrBlob instanceof File ? fileOrBlob.name : 'dream-video.mp4'),
        updatedAt: Date.now()
      };

      const req = store.put(record);
      req.onsuccess = () => {
        // Create or update object URL
        if (objectUrlCache.has(id)) {
          try {
            URL.revokeObjectURL(objectUrlCache.get(id)!);
          } catch {}
        }
        const newUrl = URL.createObjectURL(fileOrBlob);
        objectUrlCache.set(id, newUrl);
        resolve(newUrl);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save video to IndexedDB:', err);
    // Fallback: create an ephemeral Object URL
    const fallbackUrl = URL.createObjectURL(fileOrBlob);
    objectUrlCache.set(id, fallbackUrl);
    return fallbackUrl;
  }
}

/**
 * Get video blob from IndexedDB
 */
export async function getVideoBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const record = req.result as SavedVideoRecord | undefined;
        if (record && record.blob) {
          resolve(record.blob);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Error reading video from IndexedDB:', err);
    return null;
  }
}

/**
 * Get a live Object URL for a stored video ID
 */
export async function getVideoObjectUrl(id: string): Promise<string | null> {
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id)!;
  }

  const blob = await getVideoBlob(id);
  if (blob) {
    const url = URL.createObjectURL(blob);
    objectUrlCache.set(id, url);
    return url;
  }
  return null;
}

/**
 * Delete a stored video
 */
export async function deleteVideoBlob(id: string): Promise<void> {
  if (objectUrlCache.has(id)) {
    try {
      URL.revokeObjectURL(objectUrlCache.get(id)!);
    } catch {}
    objectUrlCache.delete(id);
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Error deleting video from IndexedDB:', err);
  }
}
