/**
 * Convert an image file to WebP format using HTML5 Canvas
 * @param {File} file - Original image file
 * @param {Object} options - Conversion settings
 * @returns {Promise<Object>} Converted WebP image metadata & blob URL
 */
export async function convertImageToWebP(file, options = {}) {
  const {
    keyword = 'image',
    sequenceIndex = 1,
    padding = 1,
    separator = '-',
    quality = 85,
    aspectRatio169 = false,
    googleDiscoverPreset = false,
    targetSeoSize = true, // Default: target 90 KB - 95 KB
    cropPositionY = 50,  // 0 = Top, 50 = Center, 100 = Bottom
    cropPositionX = 50   // 0 = Left, 50 = Center, 100 = Right
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = async () => {
        try {
          let width = img.width;
          let height = img.height;

          let srcX = 0;
          let srcY = 0;
          let srcWidth = width;
          let srcHeight = height;

          // Apply 16:9 aspect ratio crop/fit and target 1200x675 resolution
          if (aspectRatio169) {
            const targetRatio = 16 / 9;
            const currentRatio = width / height;

            if (currentRatio > targetRatio) {
              // Wider than 16:9 -> crop horizontal sides
              srcWidth = height * targetRatio;
              srcHeight = height;
              const maxExtraX = width - srcWidth;
              srcX = maxExtraX * (cropPositionX / 100);
              srcY = 0;
            } else {
              // Taller than 16:9 -> crop vertical sides
              srcWidth = width;
              srcHeight = width / targetRatio;
              srcX = 0;
              const maxExtraY = height - srcHeight;
              srcY = maxExtraY * (cropPositionY / 100);
            }

            // Output resolution: 1200px width x 675px height (16:9 ratio)
            width = 1200;
            height = 675;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, width, height);

          const canvasToBlob = (c, q) => new Promise((res) => c.toBlob((b) => res(b), 'image/webp', q));

          let finalBlob = null;
          let finalWidth = width;
          let finalHeight = height;

          if (targetSeoSize) {
            const THRESHOLD_BYTES = 100 * 1024; // 100 KB
            const MIN_BYTES = 90 * 1024;        // 90 KB
            const MAX_BYTES = 95 * 1024;        // 95 KB
            const TARGET_BYTES = 92.5 * 1024;   // Target ~92.5 KB

            const standardQuality = quality / 100;
            let initialBlob = await canvasToBlob(canvas, standardQuality);

            // Rule: If image size (original or standard WebP) is under 100 KB, keep natural size
            if (file.size < THRESHOLD_BYTES || (initialBlob && initialBlob.size < THRESHOLD_BYTES)) {
              finalBlob = initialBlob;
            } else {
              // Image is > 100 KB -> Compress/adjust to 90 KB - 95 KB window
              if (initialBlob && initialBlob.size >= MIN_BYTES && initialBlob.size <= MAX_BYTES) {
                finalBlob = initialBlob;
              } else {
                let lowQ = 0.05;
                let highQ = 0.95;
                let bestBlob = initialBlob;
                let bestDiff = Math.abs(initialBlob.size - TARGET_BYTES);

                for (let i = 0; i < 7; i++) {
                  const midQ = (lowQ + highQ) / 2;
                  const b = await canvasToBlob(canvas, midQ);
                  if (!b) break;
                  const diff = Math.abs(b.size - TARGET_BYTES);

                  if (b.size >= MIN_BYTES && b.size <= MAX_BYTES) {
                    bestBlob = b;
                    break;
                  }
                  if (diff < bestDiff) {
                    bestDiff = diff;
                    bestBlob = b;
                  }
                  if (b.size > MAX_BYTES) {
                    highQ = midQ;
                  } else {
                    lowQ = midQ;
                  }
                }

                // If still > MAX_BYTES even at low quality, scale down resolution slightly
                if (bestBlob && bestBlob.size > MAX_BYTES && width > 320) {
                  const scaleFactor = Math.max(0.35, Math.sqrt(TARGET_BYTES / bestBlob.size));
                  finalWidth = Math.round(width * scaleFactor);
                  finalHeight = Math.round(height * scaleFactor);

                  const scaledCanvas = document.createElement('canvas');
                  scaledCanvas.width = finalWidth;
                  scaledCanvas.height = finalHeight;
                  const sCtx = scaledCanvas.getContext('2d');
                  sCtx.imageSmoothingEnabled = true;
                  sCtx.imageSmoothingQuality = 'high';
                  sCtx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, finalWidth, finalHeight);

                  lowQ = 0.3;
                  highQ = 0.95;
                  for (let i = 0; i < 6; i++) {
                    const midQ = (lowQ + highQ) / 2;
                    const b = await canvasToBlob(scaledCanvas, midQ);
                    if (!b) break;
                    const diff = Math.abs(b.size - TARGET_BYTES);

                    if (b.size >= MIN_BYTES && b.size <= MAX_BYTES) {
                      bestBlob = b;
                      break;
                    }
                    if (diff < bestDiff) {
                      bestDiff = diff;
                      bestBlob = b;
                    }
                    if (b.size > MAX_BYTES) {
                      highQ = midQ;
                    } else {
                      lowQ = midQ;
                    }
                  }
                }
                finalBlob = bestBlob;
              }
            }
          } else {
            const qualityFraction = quality / 100;
            finalBlob = await canvasToBlob(canvas, qualityFraction);
          }

          if (!finalBlob) {
            reject(new Error(`Failed to convert image ${file.name} to WebP.`));
            return;
          }

          // Generate Output Filename
          const seqStr = padding > 1 ? String(sequenceIndex).padStart(padding, '0') : String(sequenceIndex);
          const outFilename = `${keyword}${separator}${seqStr}.webp`;

          // Create Object URL for preview/download
          const blobUrl = URL.createObjectURL(finalBlob);
          const webpSize = finalBlob.size;
          const origSize = file.size;

          const savingsPercent = origSize > 0 
            ? Math.max(0, ((origSize - webpSize) / origSize) * 100).toFixed(1)
            : 0;

          // Generate WordPress HTML Snippet
          const altText = sequenceIndex === 1 ? keyword : `${keyword} image ${sequenceIndex}`;
          const wpSnippet = `<img src="${outFilename}" alt="${altText}" title="${keyword}" width="${finalWidth}" height="${finalHeight}" loading="lazy" />`;

          resolve({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            originalFile: file,
            originalName: file.name,
            originalSize: origSize,
            originalUrl: URL.createObjectURL(file),
            webpName: outFilename,
            webpSize: webpSize,
            webpUrl: blobUrl,
            blob: finalBlob,
            width: finalWidth,
            height: finalHeight,
            savingsPercent: savingsPercent,
            cropY: cropPositionY,
            cropX: cropPositionX,
            wpSnippet: wpSnippet
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error(`Failed to load image file ${file.name}`));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human readable KB / MB
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
