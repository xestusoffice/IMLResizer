/**
 * Interactive Touch & Mouse Cropper Component for IMLResizer
 * Features:
 * - Freeform or locked aspect ratios (1:1, 4:5, 3:4, 3.5:4.5, 16:9)
 * - Draggable box + 8 resize handles
 * - Rule-of-thirds grid
 * - Passport / Visa facial alignment guide overlay (chin, eyes, crown)
 * - Returns exact crop box coordinates in original image space
 */

export class InteractiveCropper {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.options = Object.assign({
      aspectRatio: null, // null for free, or number like 1, 3.5/4.5, 16/9
      showGrid: true,
      showFaceGuide: false,
      onCropChange: null
    }, options);

    this.img = null;
    this.crop = { x: 0, y: 0, width: 100, height: 100 }; // in original image px
    this.activeHandle = null;
    this.dragStart = null;
    this.cropStart = null;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.userSelect = 'none';
    this.container.style.overflow = 'hidden';
    this.container.style.display = 'flex';
    this.container.style.alignItems = 'center';
    this.container.style.justifyContent = 'center';

    this.displayCanvas = document.createElement('canvas');
    this.displayCanvas.className = 'cropper-canvas';
    this.displayCanvas.style.display = 'block';
    this.displayCanvas.style.maxWidth = '100%';
    this.displayCanvas.style.maxHeight = '100%';
    this.displayCanvas.style.cursor = 'crosshair';

    this.container.appendChild(this.displayCanvas);
    this.ctx = this.displayCanvas.getContext('2d');
  }

  setImage(imageElement) {
    this.img = imageElement;
    this.resetCrop();
    this.render();
  }

  setAspectRatio(ratio) {
    this.options.aspectRatio = ratio;
    this.adjustCropToAspectRatio();
    this.render();
    if (this.options.onCropChange) this.options.onCropChange(this.getCrop());
  }

  setFaceGuide(show) {
    this.options.showFaceGuide = show;
    this.render();
  }

  resetCrop() {
    if (!this.img) return;
    const nw = this.img.naturalWidth || this.img.width;
    const nh = this.img.naturalHeight || this.img.height;

    let w = nw * 0.85;
    let h = nh * 0.85;

    if (this.options.aspectRatio) {
      if (w / h > this.options.aspectRatio) {
        w = h * this.options.aspectRatio;
      } else {
        h = w / this.options.aspectRatio;
      }
    }

    this.crop = {
      x: (nw - w) / 2,
      y: (nh - h) / 2,
      width: w,
      height: h
    };

    if (this.options.onCropChange) this.options.onCropChange(this.getCrop());
  }

  adjustCropToAspectRatio() {
    if (!this.options.aspectRatio || !this.img) return;
    const ratio = this.options.aspectRatio;
    let { x, y, width, height } = this.crop;
    const nw = this.img.naturalWidth || this.img.width;
    const nh = this.img.naturalHeight || this.img.height;

    let newW = width;
    let newH = width / ratio;

    if (newH > nh) {
      newH = nh * 0.9;
      newW = newH * ratio;
    }
    if (newW > nw) {
      newW = nw * 0.9;
      newH = newW / ratio;
    }

    x = Math.max(0, Math.min(x, nw - newW));
    y = Math.max(0, Math.min(y, nh - newH));

    this.crop = { x, y, width: newW, height: newH };
  }

  getCrop() {
    return {
      x: Math.round(this.crop.x),
      y: Math.round(this.crop.y),
      width: Math.round(this.crop.width),
      height: Math.round(this.crop.height)
    };
  }

  render() {
    if (!this.img) return;

    // Dimensions of container vs image natural size
    const containerW = this.container.clientWidth || 600;
    const containerH = this.container.clientHeight || 450;

    const nw = this.img.naturalWidth || this.img.width;
    const nh = this.img.naturalHeight || this.img.height;

    const scale = Math.min(containerW / nw, containerH / nh, 1);
    const dw = Math.round(nw * scale);
    const dh = Math.round(nh * scale);

    this.displayCanvas.width = dw;
    this.displayCanvas.height = dh;
    this.scale = scale;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, dw, dh);

    // 1. Draw image
    ctx.drawImage(this.img, 0, 0, dw, dh);

    // 2. Dim background outside crop box
    const cx = this.crop.x * scale;
    const cy = this.crop.y * scale;
    const cw = this.crop.width * scale;
    const ch = this.crop.height * scale;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    // Top
    ctx.fillRect(0, 0, dw, cy);
    // Bottom
    ctx.fillRect(0, cy + ch, dw, dh - (cy + ch));
    // Left
    ctx.fillRect(0, cy, cx, ch);
    // Right
    ctx.fillRect(cx + cw, cy, dw - (cx + cw), ch);

    // 3. Crop Box Border
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cw, ch);

    // 4. Rule-of-thirds grid
    if (this.options.showGrid && cw > 60 && ch > 60) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // vertical lines
      ctx.moveTo(cx + cw / 3, cy);
      ctx.lineTo(cx + cw / 3, cy + ch);
      ctx.moveTo(cx + (cw * 2) / 3, cy);
      ctx.lineTo(cx + (cw * 2) / 3, cy + ch);
      // horizontal lines
      ctx.moveTo(cx, cy + ch / 3);
      ctx.lineTo(cx + cw, cy + ch / 3);
      ctx.moveTo(cx, cy + (ch * 2) / 3);
      ctx.lineTo(cx + cw, cy + (ch * 2) / 3);
      ctx.stroke();
    }

    // 5. Passport Facial Alignment Guide Overlay
    if (this.options.showFaceGuide && cw > 80 && ch > 80) {
      this.drawFaceGuideOverlay(ctx, cx, cy, cw, ch);
    }

    // 6. Draw 8 Resize Handles
    this.drawHandles(ctx, cx, cy, cw, ch);
  }

  drawFaceGuideOverlay(ctx, cx, cy, cw, ch) {
    ctx.save();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)'; // Emerald guide
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    const centerX = cx + cw / 2;
    const centerY = cy + ch * 0.48;
    const radiusX = cw * 0.28;
    const radiusY = ch * 0.36;

    // Face oval
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Eye line
    const eyeY = cy + ch * 0.42;
    ctx.beginPath();
    ctx.moveTo(centerX - radiusX * 0.8, eyeY);
    ctx.lineTo(centerX + radiusX * 0.8, eyeY);
    ctx.stroke();

    // Chin line
    const chinY = cy + ch * 0.78;
    ctx.beginPath();
    ctx.moveTo(centerX - radiusX * 0.6, chinY);
    ctx.lineTo(centerX + radiusX * 0.6, chinY);
    ctx.stroke();

    // Label
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('Eyes (42%)', centerX, eyeY - 4);
    ctx.fillText('Chin (78%)', centerX, chinY + 12);

    ctx.restore();
  }

  drawHandles(ctx, cx, cy, cw, ch) {
    const handleSize = 10;
    const half = handleSize / 2;

    const handles = [
      { id: 'tl', x: cx, y: cy },
      { id: 'tr', x: cx + cw, y: cy },
      { id: 'bl', x: cx, y: cy + ch },
      { id: 'br', x: cx + cw, y: cy + ch },
      { id: 't',  x: cx + cw / 2, y: cy },
      { id: 'b',  x: cx + cw / 2, y: cy + ch },
      { id: 'l',  x: cx, y: cy + ch / 2 },
      { id: 'r',  x: cx + cw, y: cy + ch / 2 }
    ];

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 2;

    handles.forEach(h => {
      ctx.fillRect(h.x - half, h.y - half, handleSize, handleSize);
      ctx.strokeRect(h.x - half, h.y - half, handleSize, handleSize);
    });
  }

  bindEvents() {
    const canvas = this.displayCanvas;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const onPointerDown = (e) => {
      if (!this.img) return;
      const pos = getPos(e);
      const hit = this.hitTest(pos.x, pos.y);
      if (hit) {
        e.preventDefault();
        this.activeHandle = hit;
        this.dragStart = pos;
        this.cropStart = { ...this.crop };
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);
      }
    };

    const onPointerMove = (e) => {
      if (!this.activeHandle || !this.img) return;
      e.preventDefault();
      const pos = getPos(e);
      const dx = (pos.x - this.dragStart.x) / this.scale;
      const dy = (pos.y - this.dragStart.y) / this.scale;

      this.updateCropFromDrag(this.activeHandle, dx, dy);
      this.render();
      if (this.options.onCropChange) this.options.onCropChange(this.getCrop());
    };

    const onPointerUp = () => {
      this.activeHandle = null;
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };

    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('touchstart', onPointerDown, { passive: false });

    // Update cursor style on hover
    canvas.addEventListener('mousemove', (e) => {
      if (!this.img || this.activeHandle) return;
      const pos = getPos(e);
      const hit = this.hitTest(pos.x, pos.y);
      if (hit === 'move') {
        canvas.style.cursor = 'move';
      } else if (hit === 'tl' || hit === 'br') {
        canvas.style.cursor = 'nwse-resize';
      } else if (hit === 'tr' || hit === 'bl') {
        canvas.style.cursor = 'nesw-resize';
      } else if (hit === 't' || hit === 'b') {
        canvas.style.cursor = 'ns-resize';
      } else if (hit === 'l' || hit === 'r') {
        canvas.style.cursor = 'ew-resize';
      } else {
        canvas.style.cursor = 'crosshair';
      }
    });

    window.addEventListener('resize', () => {
      if (this.img) this.render();
    });
  }

  hitTest(x, y) {
    if (!this.scale) return null;
    const cx = this.crop.x * this.scale;
    const cy = this.crop.y * this.scale;
    const cw = this.crop.width * this.scale;
    const ch = this.crop.height * this.scale;
    const threshold = 14;

    const near = (px, py) => Math.hypot(x - px, y - py) <= threshold;

    if (near(cx, cy)) return 'tl';
    if (near(cx + cw, cy)) return 'tr';
    if (near(cx, cy + ch)) return 'bl';
    if (near(cx + cw, cy + ch)) return 'br';

    if (near(cx + cw / 2, cy)) return 't';
    if (near(cx + cw / 2, cy + ch)) return 'b';
    if (near(cx, cy + ch / 2)) return 'l';
    if (near(cx + cw, cy + ch / 2)) return 'r';

    // Inside crop box
    if (x >= cx && x <= cx + cw && y >= cy && y <= cy + ch) {
      return 'move';
    }

    return null;
  }

  updateCropFromDrag(handle, dx, dy) {
    const orig = this.cropStart;
    const nw = this.img.naturalWidth || this.img.width;
    const nh = this.img.naturalHeight || this.img.height;
    const ratio = this.options.aspectRatio;
    const minSize = 25;

    let { x, y, width, height } = orig;

    if (handle === 'move') {
      x = Math.max(0, Math.min(orig.x + dx, nw - width));
      y = Math.max(0, Math.min(orig.y + dy, nh - height));
      this.crop = { x, y, width, height };
      return;
    }

    if (ratio) {
      // Locked aspect ratio resizing
      if (handle === 'br' || handle === 'r' || handle === 'b') {
        let newW = Math.max(minSize, Math.min(orig.width + dx, nw - x));
        let newH = newW / ratio;
        if (y + newH > nh) {
          newH = nh - y;
          newW = newH * ratio;
        }
        width = newW;
        height = newH;
      } else if (handle === 'tl') {
        let newW = Math.max(minSize, orig.width - dx);
        let newH = newW / ratio;
        let newX = orig.x + (orig.width - newW);
        let newY = orig.y + (orig.height - newH);
        if (newX >= 0 && newY >= 0) {
          x = newX;
          y = newY;
          width = newW;
          height = newH;
        }
      } else if (handle === 'tr') {
        let newW = Math.max(minSize, orig.width + dx);
        let newH = newW / ratio;
        let newY = orig.y + (orig.height - newH);
        if (x + newW <= nw && newY >= 0) {
          y = newY;
          width = newW;
          height = newH;
        }
      } else if (handle === 'bl') {
        let newW = Math.max(minSize, orig.width - dx);
        let newH = newW / ratio;
        let newX = orig.x + (orig.width - newW);
        if (newX >= 0 && y + newH <= nh) {
          x = newX;
          width = newW;
          height = newH;
        }
      }
    } else {
      // Freeform resizing
      if (handle.includes('r')) width = Math.max(minSize, Math.min(orig.width + dx, nw - x));
      if (handle.includes('b')) height = Math.max(minSize, Math.min(orig.height + dy, nh - y));
      if (handle.includes('l')) {
        const newX = Math.max(0, Math.min(orig.x + dx, orig.x + orig.width - minSize));
        width = orig.width - (newX - orig.x);
        x = newX;
      }
      if (handle.includes('t')) {
        const newY = Math.max(0, Math.min(orig.y + dy, orig.y + orig.height - minSize));
        height = orig.height - (newY - orig.y);
        y = newY;
      }
    }

    this.crop = { x, y, width, height };
  }
}
