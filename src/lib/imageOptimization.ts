/**
 * Image Optimization Utilities
 * Compress and optimize images for API uploads
 */

export const imageOptimization = {
  /**
   * Compress a base64 image to a specified quality
   * @param base64String - The base64 encoded image string
   * @param maxWidth - Max width in pixels (default: 1280)
   * @param maxHeight - Max height in pixels (default: 1280)
   * @param quality - Compression quality 0-1 (default: 0.7)
   * @returns Promise<string> - Compressed base64 string
   */
  compressBase64: async (
    base64String: string,
    maxWidth: number = 1280,
    maxHeight: number = 1280,
    quality: number = 0.7
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions maintaining aspect ratio
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

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = base64String;
    });
  },

  /**
   * Get size of base64 string in bytes
   */
  getBase64Size: (base64String: string): number => {
    const base64 = base64String.split(',')[1] || base64String;
    return Math.round((base64.length * 3) / 4);
  },

  /**
   * Format bytes to human readable size
   */
  formatBytes: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },
};
