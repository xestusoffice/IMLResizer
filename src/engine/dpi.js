/**
 * DPI injection utilities for JPEG and PNG formats.
 * Injects physical resolution metadata so government portals and image validators
 * recognize exact DPI (e.g. 200 DPI for SSC/PAN, 300 DPI for Passport/Visa).
 */

/**
 * Injects or updates JFIF APP0 marker in JPEG blob to set exact DPI.
 * @param {Blob} jpegBlob
 * @param {number} dpi - Dots per inch (e.g. 200, 300)
 * @returns {Promise<Blob>}
 */
export async function setJpegDpi(jpegBlob, dpi) {
  const arrayBuffer = await jpegBlob.arrayBuffer();
  const view = new DataView(arrayBuffer);

  // Check JPEG SOI (0xFF 0xD8)
  if (view.getUint16(0) !== 0xFFD8) {
    return jpegBlob; // Not a valid JPEG
  }

  const dpiInt = Math.round(dpi);
  let offset = 2;
  let jfifOffset = -1;

  while (offset < view.byteLength) {
    const marker = view.getUint16(offset);
    if (marker === 0xFFE0) { // APP0 marker
      // Check for JFIF identifier (0x4A46494600)
      if (
        view.getUint8(offset + 4) === 0x4A && // 'J'
        view.getUint8(offset + 5) === 0x46 && // 'F'
        view.getUint8(offset + 6) === 0x49 && // 'I'
        view.getUint8(offset + 7) === 0x46 && // 'F'
        view.getUint8(offset + 8) === 0x00
      ) {
        jfifOffset = offset;
        break;
      }
    } else if ((marker >= 0xFFE1 && marker <= 0xFFEF) || marker === 0xFFDB || marker === 0xFFC0 || marker === 0xFFDA) {
      // Reached other markers without finding APP0
      break;
    }
    const length = view.getUint16(offset + 2);
    offset += 2 + length;
  }

  if (jfifOffset !== -1) {
    // Existing JFIF marker: modify density unit (1 = dots per inch) and densities
    const newBuffer = arrayBuffer.slice(0);
    const newView = new DataView(newBuffer);
    newView.setUint8(jfifOffset + 11, 1); // 1 = dots per inch (DPI)
    newView.setUint16(jfifOffset + 12, dpiInt); // X density
    newView.setUint16(jfifOffset + 14, dpiInt); // Y density
    return new Blob([newBuffer], { type: 'image/jpeg' });
  } else {
    // Insert new APP0 JFIF segment right after SOI (offset 2)
    const jfifSegment = new Uint8Array([
      0xFF, 0xE0, // Marker APP0
      0x00, 0x10, // Length (16 bytes)
      0x4A, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
      0x01, 0x01, // Version 1.1
      0x01,       // Density unit: 1 = dots per inch
      (dpiInt >> 8) & 0xFF, dpiInt & 0xFF, // X density
      (dpiInt >> 8) & 0xFF, dpiInt & 0xFF, // Y density
      0x00, 0x00  // No thumbnail
    ]);

    const result = new Uint8Array(arrayBuffer.byteLength + jfifSegment.byteLength);
    result.set(new Uint8Array(arrayBuffer.slice(0, 2)), 0);
    result.set(jfifSegment, 2);
    result.set(new Uint8Array(arrayBuffer.slice(2)), 2 + jfifSegment.byteLength);

    return new Blob([result.buffer], { type: 'image/jpeg' });
  }
}

/**
 * Injects pHYs chunk into PNG blob to set physical pixel dimensions (DPI).
 * @param {Blob} pngBlob
 * @param {number} dpi
 * @returns {Promise<Blob>}
 */
export async function setPngDpi(pngBlob, dpi) {
  const arrayBuffer = await pngBlob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // PNG Signature: 89 50 4E 47 0D 0A 1A 0A
  if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4E || bytes[3] !== 0x47) {
    return pngBlob;
  }

  // 1 inch = 0.0254 meters => pixels per meter = round(dpi / 0.0254)
  const ppm = Math.round(dpi / 0.0254);

  // Construct pHYs chunk: length (9), type 'pHYs', data (4 bytes X, 4 bytes Y, 1 byte unit 1 for meter), CRC (4 bytes)
  const chunkData = new Uint8Array(9);
  const dataView = new DataView(chunkData.buffer);
  dataView.setUint32(0, ppm);
  dataView.setUint32(4, ppm);
  dataView.setUint8(8, 1); // 1 = meters

  const type = [112, 72, 89, 115]; // 'pHYs'
  const crc = calculatePngCrc(type, chunkData);

  const physChunk = new Uint8Array(12 + 9);
  const physView = new DataView(physChunk.buffer);
  physView.setUint32(0, 9); // length
  physChunk.set(type, 4);
  physChunk.set(chunkData, 8);
  physView.setUint32(17, crc);

  // Insert pHYs chunk right after IHDR chunk (IHDR is length 13, starts at offset 8, ends at 8 + 4 + 4 + 13 + 4 = 33)
  const insertOffset = 33;
  const result = new Uint8Array(bytes.length + physChunk.length);
  result.set(bytes.subarray(0, insertOffset), 0);
  result.set(physChunk, insertOffset);
  result.set(bytes.subarray(insertOffset), insertOffset + physChunk.length);

  return new Blob([result.buffer], { type: 'image/png' });
}

// CRC-32 table for PNG
let crcTable = null;
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xEDB88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }
  return table;
}

function calculatePngCrc(typeArray, dataArray) {
  if (!crcTable) crcTable = makeCrcTable();
  let c = 0xFFFFFFFF;
  for (let i = 0; i < typeArray.length; i++) {
    c = crcTable[(c ^ typeArray[i]) & 0xFF] ^ (c >>> 8);
  }
  for (let i = 0; i < dataArray.length; i++) {
    c = crcTable[(c ^ dataArray[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}
