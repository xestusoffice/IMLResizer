import { setJpegDpi, setPngDpi } from './dpi.js';
import { jsPDF } from 'jspdf';

/**
 * Unit conversion helper: calculates pixel dimensions based on unit and DPI.
 */
export function convertToPixels(value, unit, dpi = 300) {
  if (!value || isNaN(value)) return 0;
  const val = parseFloat(value);
  switch (unit) {
    case 'inch':
    case 'in':
      return Math.round(val * dpi);
    case 'cm':
      return Math.round((val / 2.54) * dpi);
    case 'mm':
      return Math.round((val / 25.4) * dpi);
    case 'px':
    default:
      return Math.round(val);
  }
}

/**
 * Converts pixels back to a specified unit.
 */
export function convertFromPixels(pixels, unit, dpi = 300) {
  if (!pixels || isNaN(pixels)) return 0;
  switch (unit) {
    case 'inch':
    case 'in':
      return +(pixels / dpi).toFixed(2);
    case 'cm':
      return +((pixels / dpi) * 2.54).toFixed(2);
    case 'mm':
      return +((pixels / dpi) * 25.4).toFixed(1);
    case 'px':
    default:
      return Math.round(pixels);
  }
}

/**
 * Loads an image from a File, Blob, or URL into an HTMLImageElement.
 * @param {File|Blob|string} source
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl = null;
    if (source instanceof Blob || source instanceof File) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else if (typeof source === 'string') {
      img.src = source;
    } else {
      reject(new Error('Invalid image source'));
      return;
    }

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (err) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image: ' + err.message));
    };
  });
}

/**
 * Renders an image with optional crop rectangle, rotation, flip, and target dimensions onto a Canvas.
 * @param {HTMLImageElement|HTMLCanvasElement} img
 * @param {Object} options
 * @returns {HTMLCanvasElement}
 */
export function renderProcessedCanvas(img, options = {}) {
  const {
    crop = null, // { x, y, width, height } in original image coordinates
    rotation = 0, // 0, 90, 180, 270 degrees
    flipH = false,
    flipV = false,
    targetWidth = null,
    targetHeight = null,
    fitMode = 'stretch', // 'stretch', 'contain', 'cover'
    bgColor = '#FFFFFF',
    enhanceSignature = false,
    signatureThreshold = 185
  } = options;

  // 1. Source region
  const sx = crop ? crop.x : 0;
  const sy = crop ? crop.y : 0;
  const sw = crop ? crop.width : img.naturalWidth || img.width;
  const sh = crop ? crop.height : img.naturalHeight || img.height;

  // 2. Intermediate canvas for rotation & flipping
  const rotCanvas = document.createElement('canvas');
  const rotCtx = rotCanvas.getContext('2d', { willReadFrequently: true });

  const isSwap = (rotation % 180 !== 0);
  rotCanvas.width = isSwap ? sh : sw;
  rotCanvas.height = isSwap ? sw : sh;

  rotCtx.save();
  // Move origin to center
  rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
  rotCtx.rotate((rotation * Math.PI) / 180);
  rotCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  // Draw source crop region centered
  rotCtx.drawImage(
    img,
    sx, sy, sw, sh,
    -sw / 2, -sh / 2, sw, sh
  );
  rotCtx.restore();

  // 3. Final target dimensions
  const finalWidth = Math.round(targetWidth || rotCanvas.width);
  const finalHeight = Math.round(targetHeight || rotCanvas.height);

  const outCanvas = document.createElement('canvas');
  outCanvas.width = Math.max(1, finalWidth);
  outCanvas.height = Math.max(1, finalHeight);
  const outCtx = outCanvas.getContext('2d', { willReadFrequently: true });

  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = 'high';

  // Fill background
  if (bgColor && bgColor !== 'transparent') {
    outCtx.fillStyle = bgColor;
    outCtx.fillRect(0, 0, finalWidth, finalHeight);
  }

  if (fitMode === 'contain') {
    const scale = Math.min(finalWidth / rotCanvas.width, finalHeight / rotCanvas.height);
    const dw = rotCanvas.width * scale;
    const dh = rotCanvas.height * scale;
    const dx = (finalWidth - dw) / 2;
    const dy = (finalHeight - dh) / 2;
    outCtx.drawImage(rotCanvas, dx, dy, dw, dh);
  } else if (fitMode === 'cover') {
    const scale = Math.max(finalWidth / rotCanvas.width, finalHeight / rotCanvas.height);
    const dw = rotCanvas.width * scale;
    const dh = rotCanvas.height * scale;
    const dx = (finalWidth - dw) / 2;
    const dy = (finalHeight - dh) / 2;
    outCtx.drawImage(rotCanvas, dx, dy, dw, dh);
  } else {
    // Exact stretch / direct scaling
    outCtx.drawImage(rotCanvas, 0, 0, finalWidth, finalHeight);
  }

  // 4. Signature enhancement (B&W thresholding & contrast boost)
  if (enhanceSignature) {
    applySignatureEnhancement(outCtx, finalWidth, finalHeight, signatureThreshold);
  }

  return outCanvas;
}

/**
 * Enhances signature to crisp black ink on clean white background.
 */
function applySignatureEnhancement(ctx, width, height, threshold = 185) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    // Luminance
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (lum > threshold) {
      // Paper background -> pure white
      d[i] = 255;
      d[i + 1] = 255;
      d[i + 2] = 255;
    } else {
      // Ink -> darken smoothly towards deep black
      const factor = lum / threshold;
      const inkVal = Math.round(factor * 35); // Very dark gray / black
      d[i] = inkVal;
      d[i + 1] = inkVal;
      d[i + 2] = inkVal;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Compresses canvas to a target file size in KB using binary search on quality,
 * falling back to dimension downsampling if lowest quality still exceeds target.
 *
 * @param {HTMLCanvasElement} initialCanvas
 * @param {Object} options
 * @returns {Promise<{ blob: Blob, quality: number, width: number, height: number, sizeKB: number }>}
 */
export async function compressToTargetKB(initialCanvas, options = {}) {
  const {
    targetKB = null, // e.g. 20, 50, 100
    format = 'image/jpeg', // 'image/jpeg', 'image/png', 'image/webp'
    dpi = 300,
    minQuality = 0.05,
    maxQuality = 0.98,
    maxIterations = 8
  } = options;

  let currentCanvas = initialCanvas;

  // Helper to convert canvas to blob at a given quality
  const getBlob = (canvas, mime, q) => {
    return new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), mime, q);
    });
  };

  // If no target KB is set, just export at standard quality (0.92)
  if (!targetKB || targetKB <= 0) {
    let rawBlob = await getBlob(currentCanvas, format, 0.92);
    if (format === 'image/jpeg') {
      rawBlob = await setJpegDpi(rawBlob, dpi);
    } else if (format === 'image/png') {
      rawBlob = await setPngDpi(rawBlob, dpi);
    }
    return {
      blob: rawBlob,
      quality: 0.92,
      width: currentCanvas.width,
      height: currentCanvas.height,
      sizeKB: +(rawBlob.size / 1024).toFixed(2)
    };
  }

  const targetBytes = targetKB * 1024;
  const isLossless = (format === 'image/png');

  // If format is PNG, quality parameter does not compress size in standard toBlob;
  // so we downscale if PNG exceeds target size.
  if (isLossless) {
    let scale = 1.0;
    let blob = await getBlob(currentCanvas, format, 1.0);
    while (blob.size > targetBytes && scale > 0.2) {
      scale *= 0.88;
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = Math.max(1, Math.round(initialCanvas.width * scale));
      scaledCanvas.height = Math.max(1, Math.round(initialCanvas.height * scale));
      const sCtx = scaledCanvas.getContext('2d');
      sCtx.imageSmoothingQuality = 'high';
      sCtx.drawImage(initialCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      currentCanvas = scaledCanvas;
      blob = await getBlob(currentCanvas, format, 1.0);
    }
    const finalBlob = await setPngDpi(blob, dpi);
    return {
      blob: finalBlob,
      quality: 1.0,
      width: currentCanvas.width,
      height: currentCanvas.height,
      sizeKB: +(finalBlob.size / 1024).toFixed(2)
    };
  }

  // Binary search on quality for JPEG & WebP
  let low = minQuality;
  let high = maxQuality;
  let bestBlob = null;
  let bestQuality = 0.85;

  for (let i = 0; i < maxIterations; i++) {
    const midQuality = (low + high) / 2;
    const trialBlob = await getBlob(currentCanvas, format, midQuality);

    if (trialBlob.size <= targetBytes) {
      bestBlob = trialBlob;
      bestQuality = midQuality;
      // Try higher quality to get closer to target
      low = midQuality;
    } else {
      // Exceeds target, decrease quality
      high = midQuality;
    }
  }

  // If even at lowest quality it exceeds target size, downscale dimensions incrementally
  let downscaleFactor = 0.9;
  while ((!bestBlob || bestBlob.size > targetBytes) && downscaleFactor > 0.25) {
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = Math.max(1, Math.round(currentCanvas.width * downscaleFactor));
    scaledCanvas.height = Math.max(1, Math.round(currentCanvas.height * downscaleFactor));
    const sCtx = scaledCanvas.getContext('2d');
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(currentCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    currentCanvas = scaledCanvas;

    const trialBlob = await getBlob(currentCanvas, format, minQuality + 0.15);
    if (trialBlob.size <= targetBytes) {
      bestBlob = trialBlob;
      bestQuality = minQuality + 0.15;
      break;
    }
    downscaleFactor *= 0.85;
  }

  if (!bestBlob) {
    bestBlob = await getBlob(currentCanvas, format, minQuality);
  }

  // Inject DPI
  let finalBlob = bestBlob;
  if (format === 'image/jpeg') {
    finalBlob = await setJpegDpi(bestBlob, dpi);
  } else if (format === 'image/png') {
    finalBlob = await setPngDpi(bestBlob, dpi);
  }

  return {
    blob: finalBlob,
    quality: +bestQuality.toFixed(2),
    width: currentCanvas.width,
    height: currentCanvas.height,
    sizeKB: +(finalBlob.size / 1024).toFixed(2)
  };
}

/**
 * Generates a 4x6 inch or A4 printable passport photo sheet with cutting lines.
 */
export function generatePassportSheet(singlePhotoCanvas, options = {}) {
  const {
    paperSize = '4x6', // '4x6' or 'A4'
    photoWidthMm = 35,
    photoHeightMm = 45,
    dpi = 300,
    copies = 8,
    addCuttingGuides = true
  } = options;

  let sheetWidthInMm, sheetHeightInMm;
  if (paperSize === 'A4') {
    sheetWidthInMm = 210;
    sheetHeightInMm = 297;
  } else {
    // 4 x 6 inch = 101.6 x 152.4 mm
    sheetWidthInMm = 101.6;
    sheetHeightInMm = 152.4;
  }

  const sheetWidthPx = convertToPixels(sheetWidthInMm, 'mm', dpi);
  const sheetHeightPx = convertToPixels(sheetHeightInMm, 'mm', dpi);
  const photoWidthPx = convertToPixels(photoWidthMm, 'mm', dpi);
  const photoHeightPx = convertToPixels(photoHeightMm, 'mm', dpi);

  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = sheetWidthPx;
  sheetCanvas.height = sheetHeightPx;
  const ctx = sheetCanvas.getContext('2d');

  // Background white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, sheetWidthPx, sheetHeightPx);

  // Layout grid calculation
  const marginMm = 6;
  const gapMm = 3;
  const marginPx = convertToPixels(marginMm, 'mm', dpi);
  const gapPx = convertToPixels(gapMm, 'mm', dpi);

  const cols = Math.floor((sheetWidthPx - 2 * marginPx + gapPx) / (photoWidthPx + gapPx));
  const rows = Math.floor((sheetHeightPx - 2 * marginPx + gapPx) / (photoHeightPx + gapPx));

  const totalPossible = cols * rows;
  const actualCopies = Math.min(copies, totalPossible);

  const totalGridW = cols * photoWidthPx + (cols - 1) * gapPx;
  const totalGridH = Math.ceil(actualCopies / cols) * photoHeightPx + (Math.ceil(actualCopies / cols) - 1) * gapPx;
  const startX = (sheetWidthPx - totalGridW) / 2;
  const startY = (sheetHeightPx - totalGridH) / 2;

  let count = 0;
  for (let r = 0; r < rows && count < actualCopies; r++) {
    for (let c = 0; c < cols && count < actualCopies; c++) {
      const px = startX + c * (photoWidthPx + gapPx);
      const py = startY + r * (photoHeightPx + gapPx);

      // Draw photo
      ctx.drawImage(singlePhotoCanvas, px, py, photoWidthPx, photoHeightPx);

      // Draw subtle cutting border
      if (addCuttingGuides) {
        ctx.strokeStyle = '#D1D5DB';
        ctx.lineWidth = 1;
        ctx.strokeRect(px - 0.5, py - 0.5, photoWidthPx + 1, photoHeightPx + 1);
      }
      count++;
    }
  }

  // Footer branding / credit
  ctx.fillStyle = '#9CA3AF';
  ctx.font = `${Math.round(dpi * 0.04)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Generated by IMLResizer (xestus.in) - 100% Free & Private', sheetWidthPx / 2, sheetHeightPx - Math.round(dpi * 0.05));

  return sheetCanvas;
}

/**
 * Exports one or more canvases to a PDF file using jsPDF.
 */
export function exportToPdf(canvasList, filename = 'imlresizer-document.pdf') {
  if (!canvasList || canvasList.length === 0) return;

  const firstCanvas = canvasList[0];
  const isLandscape = firstCanvas.width > firstCanvas.height;

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  canvasList.forEach((canvas, index) => {
    if (index > 0) pdf.addPage('a4', isLandscape ? 'landscape' : 'portrait');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgRatio = canvas.width / canvas.height;
    const pageRatio = pageWidth / pageHeight;

    let renderW = pageWidth - 40;
    let renderH = renderW / imgRatio;

    if (renderH > pageHeight - 40) {
      renderH = pageHeight - 40;
      renderW = renderH * imgRatio;
    }

    const x = (pageWidth - renderW) / 2;
    const y = (pageHeight - renderH) / 2;

    pdf.addImage(imgData, 'JPEG', x, y, renderW, renderH);
  });

  pdf.save(filename);
}
