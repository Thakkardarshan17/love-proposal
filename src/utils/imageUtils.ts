/**
 * Utility functions for handling image uploads, resizing, and optimizations
 * to ensure smooth rendering and safe LocalStorage persistence.
 */

export const compressAndResizeImage = (
  file: File,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.80
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
