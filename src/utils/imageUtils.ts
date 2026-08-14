import { MemoryItem } from '../types';

/**
 * Utility functions for handling photo and video media uploads, resizing,
 * and optimizations to ensure smooth rendering and safe persistence.
 */

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/') || /\.(mp4|mov|webm|ogg|m4v|mkv)$/i.test(file.name);
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(file.name);
};

/**
 * Extracts a high-quality poster frame thumbnail from a video File or video URL.
 */
export const createVideoThumbnail = (
  fileOrUrl: File | string,
  seekTime = 0.5,
  maxWidth = 700
): Promise<string> => {
  return new Promise((resolve) => {
    let videoUrl = '';
    let isBlob = false;

    if (typeof fileOrUrl === 'string') {
      videoUrl = fileOrUrl;
    } else {
      videoUrl = URL.createObjectURL(fileOrUrl);
      isBlob = true;
    }

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    const cleanup = () => {
      if (isBlob && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };

    video.onloadedmetadata = () => {
      // Clamp seek time within video duration
      const duration = video.duration || 1;
      video.currentTime = Math.min(seekTime, Math.max(0.1, duration / 2));
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = video.videoWidth || 640;
        let height = video.videoHeight || 360;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(video, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          cleanup();
          resolve(dataUrl);
          return;
        }
      } catch (err) {
        console.warn('Could not generate canvas thumbnail for video:', err);
      }
      cleanup();
      // Fallback romantic video poster
      resolve('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop');
    };

    video.onerror = () => {
      cleanup();
      // Fallback romantic video poster
      resolve('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop');
    };

    video.src = videoUrl;
  });
};

/**
 * Parses any video URL (YouTube, Vimeo, Direct MP4, WebM, Blob, Data URL)
 */
export interface ParsedVideoInfo {
  isVideo: boolean;
  videoType?: 'youtube' | 'vimeo' | 'direct';
  embedUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export const parseVideoUrl = (url: string): ParsedVideoInfo => {
  if (!url || typeof url !== 'string') return { isVideo: false };
  const trimmed = url.trim();

  // 1. YouTube (watch, embed, youtu.be, shorts)
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isVideo: true,
      videoType: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      videoUrl: trimmed,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    const videoId = vimeoMatch[3];
    return {
      isVideo: true,
      videoType: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`,
      videoUrl: trimmed,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop'
    };
  }

  // 3. Direct Video file extensions or data/blob URLs
  if (
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed) ||
    trimmed.startsWith('data:video/') ||
    trimmed.startsWith('blob:')
  ) {
    return {
      isVideo: true,
      videoType: 'direct',
      videoUrl: trimmed,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop'
    };
  }

  return { isVideo: false };
};

export const compressAndResizeImage = (
  file: File,
  maxWidth = 850,
  maxHeight = 850,
  quality = 0.78
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to jpeg dataURL with safe compression size
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch {
          resolve(canvas.toDataURL());
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };

    reader.readAsDataURL(file);
  });
};

export const compressMultipleImages = async (
  files: FileList | File[]
): Promise<string[]> => {
  const fileArray = Array.from(files);
  return Promise.all(fileArray.map(f => compressAndResizeImage(f)));
};

/**
 * Process a single media file (either image or video)
 */
export const processMediaFile = async (
  file: File,
  index = 0
): Promise<MemoryItem> => {
  const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const title = cleanName.length > 2
    ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
    : `Dream Moment ${index + 1}`;

  const isVideo = isVideoFile(file);

  if (isVideo) {
    // Generate video thumbnail and read as object or data url
    const thumbnail = await createVideoThumbnail(file, 0.5);
    
    // For local videos, create a stable blob / data url
    let videoUrl = '';
    if (file.size <= 25 * 1024 * 1024) {
      // Under 25MB: read as data url for persistent portability
      try {
        videoUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } catch {
        videoUrl = URL.createObjectURL(file);
      }
    } else {
      videoUrl = URL.createObjectURL(file);
    }

    return {
      id: `mem-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      description: 'A magical video dream and promise we will cherish forever and always.',
      date: 'Our Video Memory',
      location: 'With You Forever',
      image: thumbnail,
      mediaType: 'video',
      videoUrl,
      videoType: 'upload',
      rotationDeg: ((index % 2 === 0 ? -1 : 1) * ((index % 3) + 1.5)),
      badge: '🎥 Video'
    };
  } else {
    // Photo
    const optimizedDataUrl = await compressAndResizeImage(file);
    return {
      id: `mem-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      description: 'A magical dream and beautiful moment forever etched in our hearts.',
      date: 'Our Sweet Journey',
      location: 'Everywhere with You',
      image: optimizedDataUrl,
      mediaType: 'image',
      rotationDeg: ((index % 2 === 0 ? -1 : 1) * ((index % 3) + 1.5)),
      badge: 'Dream'
    };
  }
};

/**
 * Process multiple mixed media files (Photos and Videos) with NO LIMIT
 */
export const processMultipleMediaFiles = async (
  files: FileList | File[]
): Promise<MemoryItem[]> => {
  const fileArray = Array.from(files);
  const items: MemoryItem[] = [];
  for (let i = 0; i < fileArray.length; i++) {
    const item = await processMediaFile(fileArray[i], i);
    items.push(item);
  }
  return items;
};

export const ROMANTIC_PRESET_PHOTOS = [
  {
    name: 'Sunset Shore',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    tag: 'Golden Hour'
  },
  {
    name: 'Cozy Café Date',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    tag: 'Cozy Vibe'
  },
  {
    name: 'Rainy Night Romance',
    url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop',
    tag: 'City Lights'
  },
  {
    name: 'Stargazing Hilltop',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    tag: 'Midnight Stars'
  },
  {
    name: 'Gentle Embrace',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop',
    tag: 'Sweet Hugs'
  },
  {
    name: 'Open Road Adventure',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
    tag: 'Roadtrip'
  },
  {
    name: 'Holding Hands',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    tag: 'Intimate'
  },
  {
    name: 'Candlelight Dinner',
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
    tag: 'Romantic'
  },
  {
    name: 'Parisian Stroll',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
    tag: 'Dream Travel'
  }
];

export const ROMANTIC_PRESET_VIDEOS = [
  {
    name: 'Golden Shore Sunset Waves',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-water-1200-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    tag: 'Romantic Beach'
  },
  {
    name: 'Sparklers In The Night',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-sparkler-at-night-42778-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    tag: 'Sparkles & Magic'
  },
  {
    name: 'Starlight Romance & City Lights',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41551-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop',
    tag: 'City Lights'
  },
  {
    name: 'Cozy Fireside Warmth',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fireplace-burning-with-cozy-flames-42867-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    tag: 'Cozy Fire'
  }
];

