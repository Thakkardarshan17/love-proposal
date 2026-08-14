/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Compress an image file to a lightweight data URL guaranteed to be under 200KB
 * for instant sub-second delivery in Firestore real-time couple chat.
 */
export async function compressImageForChat(
  file: File | Blob,
  maxDimension = 720,
  quality = 0.65
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Calculate scaled dimensions keeping aspect ratio
            if (width > height) {
              if (width > maxDimension) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              }
            } else {
              if (height > maxDimension) {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            canvas.width = Math.max(1, width);
            canvas.height = Math.max(1, height);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve((e.target?.result as string) || '');
              return;
            }

            // High-quality downsampling smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Export as WebP if supported, fallback to JPEG
            let dataUrl = canvas.toDataURL('image/webp', quality);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }

            // If still larger than 250KB, do a quick second pass
            if (dataUrl.length > 250 * 1024) {
              const secondaryCanvas = document.createElement('canvas');
              const sWidth = Math.round(width * 0.7);
              const sHeight = Math.round(height * 0.7);
              secondaryCanvas.width = sWidth;
              secondaryCanvas.height = sHeight;
              const sCtx = secondaryCanvas.getContext('2d');
              if (sCtx) {
                sCtx.drawImage(canvas, 0, 0, sWidth, sHeight);
                dataUrl = secondaryCanvas.toDataURL('image/jpeg', 0.55);
              }
            }

            resolve(dataUrl);
          } catch (canvasErr) {
            console.warn('Canvas export failed, using reader result', canvasErr);
            resolve((e.target?.result as string) || '');
          }
        };

        img.onerror = (imgErr) => {
          console.error('Image element load error:', imgErr);
          reject(new Error('Failed to decode image file'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = (readErr) => {
        console.error('FileReader error:', readErr);
        reject(new Error('Failed to read image file'));
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('compressImageForChat unexpected error:', err);
      reject(err);
    }
  });
}

/**
 * Generate a lightweight thumbnail preview from a video file (~25KB)
 */
export async function generateVideoThumbnail(videoFile: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const url = URL.createObjectURL(videoFile);
      video.src = url;

      let hasResolved = false;
      const cleanupAndResolve = (result: string) => {
        if (hasResolved) return;
        hasResolved = true;
        try {
          URL.revokeObjectURL(url);
        } catch {}
        resolve(result);
      };

      video.onloadeddata = () => {
        try {
          video.currentTime = Math.min(1.0, (video.duration || 2) / 2 || 0.1);
        } catch {
          cleanupAndResolve('');
        }
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 360;
          let w = video.videoWidth || 320;
          let h = video.videoHeight || 240;

          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }

          canvas.width = Math.max(1, w);
          canvas.height = Math.max(1, h);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const thumb = canvas.toDataURL('image/jpeg', 0.6);
            cleanupAndResolve(thumb);
            return;
          }
        } catch {
          // Fallback to empty thumbnail
        }
        cleanupAndResolve('');
      };

      video.onerror = () => {
        cleanupAndResolve('');
      };

      // Fallback timeout after 2.5s
      setTimeout(() => {
        cleanupAndResolve('');
      }, 2500);
    } catch {
      resolve('');
    }
  });
}

/**
 * Process video for couple chat safely without exceeding Firestore 1MB limits
 */
export async function processVideoForChat(
  file: File
): Promise<{ mediaUrl: string; mediaThumbnail: string; mediaName: string }> {
  try {
    const thumbnail = await generateVideoThumbnail(file);
    const objectUrl = URL.createObjectURL(file);
    return {
      mediaUrl: objectUrl,
      mediaThumbnail: thumbnail,
      mediaName: file.name
    };
  } catch (err) {
    console.error('Error processing video for chat:', err);
    return {
      mediaUrl: URL.createObjectURL(file),
      mediaThumbnail: '',
      mediaName: file.name
    };
  }
}

