import './style.css';
import { renderNavbar } from './components/nav.js';
import { renderFooter } from './components/footer.js';
import { initContactModal } from './components/contact-modal.js';
import { InteractiveCropper } from './components/cropper.js';
import { PRESETS } from './presets.js';
import {
  loadImage,
  convertToPixels,
  convertFromPixels,
  renderProcessedCanvas,
  compressToTargetKB,
  generatePassportSheet,
  exportToPdf
} from './engine/image-processor.js';
import JSZip from 'jszip';

// Global App State
const state = {
  currentFile: null,
  filesList: [],
  imageElement: null,
  cropper: null,
  cropRect: null,
  rotation: 0,
  flipH: false,
  flipV: false,
  unit: 'px', // 'px', 'cm', 'mm', 'inch', '%'
  width: null,
  height: null,
  dpi: 300,
  keepRatio: true,
  targetKB: null,
  format: 'image/jpeg', // 'image/jpeg', 'image/png', 'image/webp'
  bgColor: '#FFFFFF',
  enhanceSignature: false,
  signatureThreshold: 185,
  passportSheetMode: false,
  processedBlob: null,
  isProcessing: false
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar('home');
  renderFooter();
  initContactModal();

  initDropzone();
  initEditorControls();
  initPresetList();
  initSampleImages();
  initFaqAccordion();

  // Check URL parameters for pre-selected presets (e.g. ?target=20kb)
  handleUrlParams();
});

/**
 * URL Parameters handling (e.g. /?preset=ssc or ?kb=20)
 */
function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const targetKbParam = params.get('kb');
  const presetParam = params.get('preset');

  if (targetKbParam) {
    state.targetKB = parseInt(targetKbParam, 10);
  }

  if (presetParam) {
    const found = PRESETS.find(p => p.id === presetParam);
    if (found) applyPreset(found);
  }
}

/**
 * Dropzone & File Input Handling
 */
function initDropzone() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const selectFileBtn = document.getElementById('selectFileBtn');

  if (!dropzone || !fileInput) return;

  selectFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  dropzone.addEventListener('click', () => fileInput.click());

  // Drag and drop events
  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) handleFiles(files);
  });

  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) handleFiles(files);
  });

  // Paste from clipboard (Ctrl+V)
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) handleFiles([file]);
        break;
      }
    }
  });
}

/**
 * Handle Loaded Image Files
 */
async function handleFiles(files) {
  state.filesList = files;
  state.currentFile = files[0];

  try {
    const img = await loadImage(state.currentFile);
    state.imageElement = img;

    // Reset transformations
    state.rotation = 0;
    state.flipH = false;
    state.flipV = false;

    // Set initial width / height to image natural dimensions
    state.width = img.naturalWidth;
    state.height = img.naturalHeight;

    // Show Editor UI
    const studio = document.getElementById('editorStudio');
    const dropzoneSection = document.getElementById('dropzoneContainer');
    if (studio) studio.style.display = 'grid';
    if (dropzoneSection) dropzoneSection.style.display = 'none';

    // Mount Interactive Cropper
    const viewport = document.getElementById('cropperViewport');
    if (viewport) {
      state.cropper = new InteractiveCropper(viewport, {
        aspectRatio: null,
        showGrid: true,
        showFaceGuide: false,
        onCropChange: (crop) => {
          state.cropRect = crop;
          schedulePreviewUpdate();
        }
      });
      state.cropper.setImage(img);
      state.cropRect = state.cropper.getCrop();
    }

    // Update UI fields
    updateDimensionInputs();
    updateOriginalMetaDisplay();
    schedulePreviewUpdate();

    // Scroll smoothly to editor
    studio.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    alert('Failed to load image: ' + err.message);
  }
}

/**
 * Update UI for Original Image Metadata
 */
function updateOriginalMetaDisplay() {
  const origDimEl = document.getElementById('origDim');
  const origSizeEl = document.getElementById('origSize');

  if (state.imageElement && origDimEl && origSizeEl) {
    origDimEl.textContent = `${state.imageElement.naturalWidth} x ${state.imageElement.naturalHeight} px`;
    origSizeEl.textContent = `${(state.currentFile.size / 1024).toFixed(1)} KB`;
  }
}

/**
 * Editor Controls (Toolbar, Tabs, Aspect ratio, Dimensions, KB Target)
 */
function initEditorControls() {
  // 1. Toolbar buttons: Rotate, Flip, Face Guide, Reset
  const rotLeftBtn = document.getElementById('rotLeftBtn');
  const rotRightBtn = document.getElementById('rotRightBtn');
  const flipHBtn = document.getElementById('flipHBtn');
  const flipVBtn = document.getElementById('flipVBtn');
  const faceGuideBtn = document.getElementById('faceGuideBtn');
  const resetBtn = document.getElementById('resetCropBtn');
  const uploadNewBtn = document.getElementById('uploadNewBtn');

  if (rotLeftBtn) {
    rotLeftBtn.addEventListener('click', () => {
      state.rotation = (state.rotation - 90 + 360) % 360;
      schedulePreviewUpdate();
    });
  }
  if (rotRightBtn) {
    rotRightBtn.addEventListener('click', () => {
      state.rotation = (state.rotation + 90) % 360;
      schedulePreviewUpdate();
    });
  }
  if (flipHBtn) {
    flipHBtn.addEventListener('click', () => {
      state.flipH = !state.flipH;
      schedulePreviewUpdate();
    });
  }
  if (flipVBtn) {
    flipVBtn.addEventListener('click', () => {
      state.flipV = !state.flipV;
      schedulePreviewUpdate();
    });
  }
  if (faceGuideBtn) {
    faceGuideBtn.addEventListener('click', () => {
      faceGuideBtn.classList.toggle('active');
      const active = faceGuideBtn.classList.contains('active');
      if (state.cropper) state.cropper.setFaceGuide(active);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.rotation = 0;
      state.flipH = false;
      state.flipV = false;
      if (state.cropper) state.cropper.resetCrop();
      schedulePreviewUpdate();
    });
  }
  if (uploadNewBtn) {
    uploadNewBtn.addEventListener('click', () => {
      document.getElementById('editorStudio').style.display = 'none';
      document.getElementById('dropzoneContainer').style.display = 'block';
    });
  }

  // 2. Aspect Ratio Quick Bar
  const aspectPills = document.querySelectorAll('.aspect-pill');
  aspectPills.forEach(pill => {
    pill.addEventListener('click', () => {
      aspectPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const ratioAttr = pill.getAttribute('data-ratio');
      let ratioVal = null;
      if (ratioAttr === '1:1') ratioVal = 1;
      else if (ratioAttr === '4:5') ratioVal = 4 / 5;
      else if (ratioAttr === '3:4') ratioVal = 3 / 4;
      else if (ratioAttr === '3.5:4.5') ratioVal = 3.5 / 4.5;
      else if (ratioAttr === '16:9') ratioVal = 16 / 9;

      if (state.cropper) state.cropper.setAspectRatio(ratioVal);
      schedulePreviewUpdate();
    });
  });

  // 3. Tab switching inside control panel
  const tabBtns = document.querySelectorAll('.control-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');
    });
  });

  // 4. Target KB Quick Buttons & Inputs
  const kbButtons = document.querySelectorAll('.kb-btn');
  const targetKbInput = document.getElementById('targetKbInput');
  const enableKbCheck = document.getElementById('enableTargetKb');

  kbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      kbButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = parseInt(btn.getAttribute('data-kb'), 10);
      state.targetKB = val;
      if (targetKbInput) targetKbInput.value = val;
      if (enableKbCheck) enableKbCheck.checked = true;
      schedulePreviewUpdate();
    });
  });

  if (targetKbInput) {
    targetKbInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.targetKB = isNaN(val) ? null : val;
      kbButtons.forEach(b => b.classList.remove('active'));
      if (enableKbCheck) enableKbCheck.checked = true;
      schedulePreviewUpdate();
    });
  }

  if (enableKbCheck) {
    enableKbCheck.addEventListener('change', (e) => {
      if (!e.target.checked) {
        state.targetKB = null;
        kbButtons.forEach(b => b.classList.remove('active'));
      } else {
        const val = parseInt(targetKbInput.value, 10) || 50;
        state.targetKB = val;
      }
      schedulePreviewUpdate();
    });
  }

  // 5. Unit Selector (px, cm, mm, inch)
  const unitButtons = document.querySelectorAll('.unit-btn');
  unitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newUnit = btn.getAttribute('data-unit');
      if (newUnit === state.unit) return;

      unitButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Convert current width/height from old unit to px, then to new unit
      const currentPxW = convertToPixels(state.width, state.unit, state.dpi);
      const currentPxH = convertToPixels(state.height, state.unit, state.dpi);

      state.unit = newUnit;
      state.width = convertFromPixels(currentPxW, newUnit, state.dpi);
      state.height = convertFromPixels(currentPxH, newUnit, state.dpi);

      updateDimensionInputs();
      schedulePreviewUpdate();
    });
  });

  // 6. Dimension Inputs (Width & Height)
  const widthInput = document.getElementById('widthInput');
  const heightInput = document.getElementById('heightInput');
  const ratioLockBtn = document.getElementById('ratioLockBtn');

  if (ratioLockBtn) {
    ratioLockBtn.addEventListener('click', () => {
      state.keepRatio = !state.keepRatio;
      ratioLockBtn.classList.toggle('locked', state.keepRatio);
    });
  }

  if (widthInput) {
    widthInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (isNaN(val) || val <= 0) return;

      const oldW = state.width || 1;
      const oldH = state.height || 1;
      state.width = val;

      if (state.keepRatio && heightInput) {
        state.height = +(val * (oldH / oldW)).toFixed(2);
        heightInput.value = state.height;
      }
      schedulePreviewUpdate();
    });
  }

  if (heightInput) {
    heightInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (isNaN(val) || val <= 0) return;

      const oldW = state.width || 1;
      const oldH = state.height || 1;
      state.height = val;

      if (state.keepRatio && widthInput) {
        state.width = +(val * (oldW / oldH)).toFixed(2);
        widthInput.value = state.width;
      }
      schedulePreviewUpdate();
    });
  }

  // 7. DPI Selector
  const dpiSelect = document.getElementById('dpiSelect');
  if (dpiSelect) {
    dpiSelect.addEventListener('change', (e) => {
      state.dpi = parseInt(e.target.value, 10);
      schedulePreviewUpdate();
    });
  }

  // 8. Output Format
  const formatSelect = document.getElementById('formatSelect');
  if (formatSelect) {
    formatSelect.addEventListener('change', (e) => {
      state.format = e.target.value;
      schedulePreviewUpdate();
    });
  }

  // 9. Signature Enhancer
  const sigToggle = document.getElementById('enhanceSigToggle');
  const sigThreshold = document.getElementById('sigThresholdRange');
  if (sigToggle) {
    sigToggle.addEventListener('change', (e) => {
      state.enhanceSignature = e.target.checked;
      schedulePreviewUpdate();
    });
  }
  if (sigThreshold) {
    sigThreshold.addEventListener('input', (e) => {
      state.signatureThreshold = parseInt(e.target.value, 10);
      schedulePreviewUpdate();
    });
  }

  // 10. Passport Printable Sheet Toggle
  const sheetToggle = document.getElementById('passportSheetToggle');
  if (sheetToggle) {
    sheetToggle.addEventListener('change', (e) => {
      state.passportSheetMode = e.target.checked;
      schedulePreviewUpdate();
    });
  }

  // 11. Download & Export Action Buttons
  const downloadBtn = document.getElementById('downloadProcessedBtn');
  const downloadZipBtn = document.getElementById('downloadZipBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');

  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownloadSingle);
  }
  if (downloadZipBtn) {
    downloadZipBtn.addEventListener('click', handleDownloadZip);
  }
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', handleExportPdf);
  }
}

/**
 * Sync Dimension Inputs in DOM
 */
function updateDimensionInputs() {
  const wInput = document.getElementById('widthInput');
  const hInput = document.getElementById('heightInput');
  const unitLabel = document.querySelectorAll('.current-unit-label');

  if (wInput) wInput.value = state.width;
  if (hInput) hInput.value = state.height;
  unitLabel.forEach(el => el.textContent = state.unit);
}

/**
 * Preset Picker Population & Filtering
 */
function initPresetList() {
  const listContainer = document.getElementById('presetList');
  const searchInput = document.getElementById('presetSearch');
  if (!listContainer) return;

  function renderList(filtered) {
    listContainer.innerHTML = '';
    filtered.forEach(preset => {
      const item = document.createElement('div');
      item.className = 'preset-card-item';
      item.innerHTML = `
        <span class="p-title">${preset.name}</span>
        <span class="p-desc">${preset.description}</span>
      `;
      item.addEventListener('click', () => applyPreset(preset));
      listContainer.appendChild(item);
    });
  }

  renderList(PRESETS);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = PRESETS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
      renderList(filtered);
    });
  }
}

/**
 * Apply Preset Configuration
 */
function applyPreset(preset) {
  if (preset.unit) state.unit = preset.unit;
  if (preset.width) state.width = preset.width;
  if (preset.height) state.height = preset.height;
  if (preset.dpi) state.dpi = preset.dpi;
  if (preset.format) state.format = preset.format;
  if (preset.targetKB) state.targetKB = preset.targetKB;

  // Set aspect ratio on cropper if dimensions are present
  if (preset.width && preset.height && state.cropper) {
    const ratio = preset.width / preset.height;
    state.cropper.setAspectRatio(ratio);
  }

  // Update DOM inputs
  updateDimensionInputs();

  const dpiSelect = document.getElementById('dpiSelect');
  if (dpiSelect && preset.dpi) dpiSelect.value = preset.dpi;

  const targetKbInput = document.getElementById('targetKbInput');
  const enableKbCheck = document.getElementById('enableTargetKb');
  if (preset.targetKB) {
    if (targetKbInput) targetKbInput.value = preset.targetKB;
    if (enableKbCheck) enableKbCheck.checked = true;
  }

  // Switch to Dimensions or Target KB tab
  const dimTabBtn = document.querySelector('[data-tab="tabDimensions"]');
  if (dimTabBtn) dimTabBtn.click();

  schedulePreviewUpdate();
}

/**
 * Schedule Preview & Output Size Recalculation
 */
let previewTimeout = null;
function schedulePreviewUpdate() {
  if (previewTimeout) clearTimeout(previewTimeout);
  previewTimeout = setTimeout(processImageAndRenderPreview, 120);
}

/**
 * Process Image and Update Live Before/After Stats
 */
async function processImageAndRenderPreview() {
  if (!state.imageElement || state.isProcessing) return;
  state.isProcessing = true;

  try {
    const targetPxW = convertToPixels(state.width, state.unit, state.dpi);
    const targetPxH = convertToPixels(state.height, state.unit, state.dpi);

    // 1. Render transformed canvas
    let canvas = renderProcessedCanvas(state.imageElement, {
      crop: state.cropRect,
      rotation: state.rotation,
      flipH: state.flipH,
      flipV: state.flipV,
      targetWidth: targetPxW,
      targetHeight: targetPxH,
      bgColor: state.bgColor,
      enhanceSignature: state.enhanceSignature,
      signatureThreshold: state.signatureThreshold
    });

    // 2. If passport printable sheet mode enabled, wrap into 4x6 print canvas
    if (state.passportSheetMode) {
      canvas = generatePassportSheet(canvas, {
        paperSize: '4x6',
        photoWidthMm: state.unit === 'mm' ? state.width : 35,
        photoHeightMm: state.unit === 'mm' ? state.height : 45,
        dpi: state.dpi,
        copies: 8
      });
    }

    // 3. Compress to target KB (with binary search and DPI embedding)
    const result = await compressToTargetKB(canvas, {
      targetKB: state.targetKB,
      format: state.format,
      dpi: state.dpi
    });

    state.processedBlob = result.blob;
    state.activeCanvas = canvas;

    // 4. Update Summary Badges
    const newDimEl = document.getElementById('newDim');
    const newSizeEl = document.getElementById('newSize');
    const savingsEl = document.getElementById('savingsBadge');

    if (newDimEl) newDimEl.textContent = `${result.width} x ${result.height} px (${state.dpi} DPI)`;
    if (newSizeEl) newSizeEl.textContent = `${result.sizeKB} KB`;

    if (savingsEl && state.currentFile) {
      const origSize = state.currentFile.size / 1024;
      const savings = Math.round(((origSize - result.sizeKB) / origSize) * 100);
      savingsEl.textContent = savings > 0 ? `-${savings}%` : 'Optimal';
    }
  } catch (err) {
    console.error('Error during image processing preview:', err);
  } finally {
    state.isProcessing = false;
  }
}

/**
 * Download Processed Single Image
 */
function handleDownloadSingle() {
  if (!state.processedBlob) return;

  const ext = state.format === 'image/png' ? 'png' : state.format === 'image/webp' ? 'webp' : 'jpg';
  const targetLabel = state.targetKB ? `-${state.targetKB}kb` : '';
  const filename = `imlresizer-${Math.round(state.width)}x${Math.round(state.height)}${targetLabel}.${ext}`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(state.processedBlob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 5000);
}

/**
 * Batch Download All Images as a ZIP archive
 */
async function handleDownloadZip() {
  if (!state.filesList || state.filesList.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('imlresizer-images');

  const downloadBtn = document.getElementById('downloadZipBtn');
  const originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = '<span>Processing batch ZIP...</span>';

  try {
    for (let i = 0; i < state.filesList.length; i++) {
      const file = state.filesList[i];
      const img = await loadImage(file);

      const targetPxW = convertToPixels(state.width, state.unit, state.dpi);
      const targetPxH = convertToPixels(state.height, state.unit, state.dpi);

      const canvas = renderProcessedCanvas(img, {
        targetWidth: targetPxW,
        targetHeight: targetPxH,
        bgColor: state.bgColor,
        enhanceSignature: state.enhanceSignature,
        signatureThreshold: state.signatureThreshold
      });

      const result = await compressToTargetKB(canvas, {
        targetKB: state.targetKB,
        format: state.format,
        dpi: state.dpi
      });

      const ext = state.format === 'image/png' ? 'png' : state.format === 'image/webp' ? 'webp' : 'jpg';
      folder.file(`photo_${i + 1}_${Math.round(state.width)}x${Math.round(state.height)}.${ext}`, result.blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `imlresizer-batch-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    alert('Failed to generate batch zip: ' + err.message);
  } finally {
    downloadBtn.innerHTML = originalText;
  }
}

/**
 * Export to PDF
 */
function handleExportPdf() {
  if (!state.activeCanvas) return;
  exportToPdf([state.activeCanvas], `imlresizer-${Date.now()}.pdf`);
}

/**
 * Sample Demo Images Generator (for instant testing)
 */
function initSampleImages() {
  const sampleBtns = document.querySelectorAll('.sample-pill-btn');
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.getAttribute('data-sample');
      loadSampleCanvas(type);
    });
  });
}

function loadSampleCanvas(type) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (type === 'passport') {
    canvas.width = 600;
    canvas.height = 750;
    // Gradient studio portrait background
    const bg = ctx.createLinearGradient(0, 0, 0, 750);
    bg.addColorStop(0, '#E0E7FF');
    bg.addColorStop(1, '#C7D2FE');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 750);

    // Stylized person silhouette for testing
    ctx.fillStyle = '#4F46E5';
    // Head
    ctx.beginPath();
    ctx.arc(300, 310, 110, 0, Math.PI * 2);
    ctx.fill();
    // Shoulders
    ctx.beginPath();
    ctx.ellipse(300, 610, 220, 160, 0, 0, Math.PI, true);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(260, 300, 12, 0, Math.PI * 2);
    ctx.arc(340, 300, 12, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'signature') {
    canvas.width = 700;
    canvas.height = 350;
    // Paper texture / slight shadow
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, 700, 350);

    // Pen stroke
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(120, 220);
    ctx.bezierCurveTo(150, 100, 250, 90, 220, 210);
    ctx.bezierCurveTo(200, 260, 350, 120, 420, 180);
    ctx.bezierCurveTo(450, 210, 520, 140, 580, 210);
    ctx.stroke();

    // Underline
    ctx.beginPath();
    ctx.moveTo(160, 240);
    ctx.lineTo(540, 240);
    ctx.stroke();
  } else {
    // Landscape
    canvas.width = 1200;
    canvas.height = 800;
    const sky = ctx.createLinearGradient(0, 0, 0, 450);
    sky.addColorStop(0, '#38BDF8');
    sky.addColorStop(1, '#E0F2FE');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1200, 800);

    // Sun
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(950, 180, 60, 0, Math.PI * 2);
    ctx.fill();

    // Mountains
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(100, 600);
    ctx.lineTo(400, 250);
    ctx.lineTo(700, 600);
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(500, 600);
    ctx.lineTo(850, 300);
    ctx.lineTo(1200, 600);
    ctx.fill();

    // Hills foreground
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.ellipse(600, 750, 700, 200, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.toBlob((blob) => {
    const file = new File([blob], `sample_${type}.jpg`, { type: 'image/jpeg' });
    handleFiles([file]);
  }, 'image/jpeg', 0.95);
}

/**
 * FAQ Accordion Toggle
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });
}
