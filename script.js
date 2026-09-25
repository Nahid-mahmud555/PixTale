/* ============================================================
   🎬 PROFESSIONAL SOUND SYNTHESIZER
   ============================================================ */
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  // ═══ TYPEWRITER CLICK ═══
  playTypewriterKey() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(2400 + Math.random() * 600, now);
    click.frequency.exponentialRampToValueAtTime(800, now + 0.015);
    clickGain.gain.setValueAtTime(0.09, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    click.connect(clickGain);
    clickGain.connect(this.masterGain);
    click.start(now);
    click.stop(now + 0.02);

    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'triangle';
    thump.frequency.setValueAtTime(180 + Math.random() * 60, now);
    thump.frequency.exponentialRampToValueAtTime(60, now + 0.025);
    thumpGain.gain.setValueAtTime(0.06, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    thump.connect(thumpGain);
    thumpGain.connect(this.masterGain);
    thump.start(now);
    thump.stop(now + 0.03);

    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.ctx.createBuffer(1, 800, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < 800; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / 800, 3);
    }
    noise.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2000;
    noise.connect(hp);
    hp.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.02);
  }

  // ═══ CUTE LETTER POP (Fade) ═══
  playLetterPop() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const basePitch = 800 + Math.random() * 600;
    osc.frequency.setValueAtTime(basePitch, now);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 2.2, now + 0.035);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 0.9, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    const spark = this.ctx.createOscillator();
    const sparkGain = this.ctx.createGain();
    spark.type = 'triangle';
    spark.frequency.setValueAtTime(basePitch * 3, now);
    spark.frequency.exponentialRampToValueAtTime(basePitch * 4.5, now + 0.03);
    sparkGain.gain.setValueAtTime(0.02, now);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    spark.connect(sparkGain);
    sparkGain.connect(this.masterGain);
    spark.start(now);
    spark.stop(now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // ═══ CUTE SWOOSH (Slide) ═══
  playWhoosh() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.25, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI);
    }
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.25);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.25);
  }

  // ═══ CUTE THUMP (Bounce) ═══
  playBounceThump() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(1200, now);
    click.frequency.exponentialRampToValueAtTime(400, now + 0.02);
    clickGain.gain.setValueAtTime(0.03, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    click.connect(clickGain);
    clickGain.connect(this.masterGain);
    click.start(now);
    click.stop(now + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // ═══ CUTE SWELL (Glow) ═══
  playGlowSwell() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.09);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    const harm = this.ctx.createOscillator();
    const harmGain = this.ctx.createGain();
    harm.type = 'sine';
    harm.frequency.setValueAtTime(1500, now);
    harm.frequency.exponentialRampToValueAtTime(3000, now + 0.08);
    harmGain.gain.setValueAtTime(0.015, now);
    harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    harm.connect(harmGain);
    harmGain.connect(this.masterGain);
    harm.start(now);
    harm.stop(now + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // ═══ SLIDE TRANSITION ═══
  playSlideTransition() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  // ═══ UI CLICK ═══
  playUIClick() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.04);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // ═══ SUCCESS CHIME ═══
  playSuccessChime() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const start = now + i * 0.06;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.06, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  }
}

const soundFx = new AudioSynthesizer();

/* ============================================================
   CANVAS COLORS
   ============================================================ */
const CANVAS_COLORS = [
  { name: 'Cream (Default)', value: '#FAF8F5' },
  { name: 'Sage',            value: '#BAC8B1' },
  { name: 'Beige',           value: '#CCBEB1' },
  { name: 'Gray',            value: '#CFCFCF' },
  { name: 'Light Gray',      value: '#E6E6E6' },
  { name: 'Olive',           value: '#B7C396' },
  { name: 'Gold',            value: '#ECB914' },
  { name: 'Honey',           value: '#F6D579' }
];

/* ============================================================
   STATE
   ============================================================ */
let slides = [];
let activeSlideId = null;
let presentationIndex = 0;
let presentationTimer = null;
let progressTimer = null;
let isPaused = false;
let typewriterTimeout = null;
let letterTimeouts = [];
let idleTimer = null;

/* ============================================================
   DOM ELEMENTS
   ============================================================ */
const imageFileInput = document.getElementById('imageFileInput');
const slideListContainer = document.getElementById('slideListContainer');
const emptySlidesState = document.getElementById('emptySlidesState');
const slideCountText = document.getElementById('slideCountText');
const mobileSlideCount = document.getElementById('mobileSlideCount');
const editorControlsWrapper = document.getElementById('editorControlsWrapper');
const activeSlideLabel = document.getElementById('activeSlideLabel');

const textInput = document.getElementById('textInput');
const animationSelect = document.getElementById('animationSelect');
const fontSelect = document.getElementById('fontSelect');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const textColorPicker = document.getElementById('textColorPicker');
const textColorHex = document.getElementById('textColorHex');
const durationInput = document.getElementById('durationInput');
const objectFitSelect = document.getElementById('objectFitSelect');
const alignBtns = document.querySelectorAll('.align-btn');

const previewImage = document.getElementById('previewImage');
const previewImageBlur = document.getElementById('previewImageBlur');
const previewImagePlaceholder = document.getElementById('previewImagePlaceholder');
const previewTextContainer = document.getElementById('previewTextContainer');
const replayAnimBtn = document.getElementById('replayAnimBtn');
const expandPreviewBtn = document.getElementById('expandPreviewBtn');

const presentationModal = document.getElementById('presentationModal');
const startPresentationBtn = document.getElementById('startPresentationBtn');
const closePresentationBtn = document.getElementById('closePresentationBtn');
const playerImage = document.getElementById('playerImage');
const playerImageBlur = document.getElementById('playerImageBlur');
const playerTextContainer = document.getElementById('playerTextContainer');
const playerSlideCounter = document.getElementById('playerSlideCounter');
const presentationProgressBar = document.getElementById('presentationProgressBar');
const playerPauseBtn = document.getElementById('playerPauseBtn');
const prevSlideBtn = document.getElementById('prevSlideBtn');
const nextSlideBtn = document.getElementById('nextSlideBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');

const tabPreviewBtn = document.getElementById('tabPreviewBtn');
const tabEditBtn = document.getElementById('tabEditBtn');
const tabSlidesBtn = document.getElementById('tabSlidesBtn');
const slidesSidebar = document.getElementById('slidesSidebar');
const customizerPanel = document.getElementById('customizerPanel');
const previewPanel = document.getElementById('previewPanel');

const canvasColorGrid = document.getElementById('canvasColorGrid');

// ✅ DOWNLOAD ELEMENTS
const downloadBtn = document.getElementById('downloadBtn');
const downloadMenu = document.getElementById('downloadMenu');
const downloadModal = document.getElementById('downloadModal');
const downloadTitle = document.getElementById('downloadTitle');
const downloadStatus = document.getElementById('downloadStatus');
const downloadProgressFill = document.getElementById('downloadProgressFill');
const downloadPercent = document.getElementById('downloadPercent');

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  renderCanvasColorSwatches();
  addDemoSlide();
  setupEventListeners();
  setupMobileTabs();
});

function addDemoSlide() {
  const demoSlide = {
    id: 'slide_' + Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    text: 'Welcome to PixTale\nCreate your story.',
    animation: 'typewriter',
    fontFamily: 'font-serif-elegant',
    fontSize: 'text-2xl md:text-4xl',
    alignment: 'text-center',
    textColor: '#1C1917',
    duration: 5,
    objectFit: 'object-contain',
    canvasBg: '#FAF8F5'
  };
  slides.push(demoSlide);
  renderSlideList();
  selectSlide(demoSlide.id);
}

/* ============================================================
   CANVAS SWATCHES
   ============================================================ */
function renderCanvasColorSwatches() {
  if (!canvasColorGrid) return;
  canvasColorGrid.innerHTML = '';

  CANVAS_COLORS.forEach(color => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'canvas-swatch';
    swatch.style.backgroundColor = color.value;
    swatch.title = color.name;
    swatch.dataset.color = color.value;

    swatch.addEventListener('click', () => {
      const slide = getActiveSlide();
      if (!slide) return;

      slide.canvasBg = color.value;
      soundFx.playUIClick();

      document.querySelectorAll('.canvas-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      updateLivePreview(slide);
    });

    canvasColorGrid.appendChild(swatch);
  });
}

function applyCanvasBg(color) {
  const bgColor = color || '#FAF8F5';
  const previewCanvas = previewTextContainer.closest('.creamy-canvas');
  if (previewCanvas) previewCanvas.style.backgroundColor = bgColor;
  const playerCanvas = playerTextContainer.closest('.creamy-canvas');
  if (playerCanvas) playerCanvas.style.backgroundColor = bgColor;
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
function setupEventListeners() {
  imageFileInput.addEventListener('change', handleFileUpload);
  textInput.addEventListener('input', updateActiveSlide);
  animationSelect.addEventListener('change', updateActiveSlide);
  fontSelect.addEventListener('change', updateActiveSlide);
  fontSizeSelect.addEventListener('change', updateActiveSlide);
  durationInput.addEventListener('change', updateActiveSlide);
  objectFitSelect.addEventListener('change', updateActiveSlide);

  textColorPicker.addEventListener('input', (e) => {
    textColorHex.textContent = e.target.value.toUpperCase();
    updateActiveSlide();
  });

  alignBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      alignBtns.forEach(b => b.classList.remove('active', 'bg-retro-yellow'));
      btn.classList.add('active', 'bg-retro-yellow');
      soundFx.playUIClick();
      updateActiveSlide();
    });
  });

  replayAnimBtn.addEventListener('click', () => {
    soundFx.playUIClick();
    const slide = getActiveSlide();
    if (slide) renderAnimatedText(slide, previewTextContainer);
  });

  expandPreviewBtn.addEventListener('click', () => {
    soundFx.playUIClick();
    startPresentation();
  });

  soundToggleBtn.addEventListener('click', () => {
    soundFx.soundEnabled = !soundFx.soundEnabled;
    soundIcon.className = soundFx.soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    soundToggleBtn.querySelector('span').textContent = soundFx.soundEnabled ? 'SOUND ON' : 'SOUND OFF';
    if (soundFx.soundEnabled) soundFx.playUIClick();
  });

  startPresentationBtn.addEventListener('click', startPresentation);
  closePresentationBtn.addEventListener('click', stopPresentation);
  playerPauseBtn.addEventListener('click', togglePausePresentation);
  prevSlideBtn.addEventListener('click', showPrevSlide);
  nextSlideBtn.addEventListener('click', showNextSlide);
  clearAllBtn.addEventListener('click', clearAllSlides);

  // ✅ Download menu toggle
  downloadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadMenu.classList.toggle('hidden');
    soundFx.playUIClick();
  });

  downloadMenu.querySelectorAll('button[data-download]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadMenu.classList.add('hidden');
      const type = btn.dataset.download;
      if (type === 'png') handleDownloadPNG();
      else if (type === 'video') handleDownloadVideo();
    });
  });

  document.addEventListener('click', () => {
    downloadMenu.classList.add('hidden');
  });

  document.addEventListener('keydown', (e) => {
    if (presentationModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') stopPresentation();
    if (e.key === 'ArrowRight' || e.key === 'Space') showNextSlide();
    if (e.key === 'ArrowLeft') showPrevSlide();
  });

  presentationModal.addEventListener('mousemove', resetIdleTimer);
  presentationModal.addEventListener('click', resetIdleTimer);
}

function setupMobileTabs() {
  function switchTab(activeTab, showElement) {
    [tabPreviewBtn, tabEditBtn, tabSlidesBtn].forEach(btn => {
      btn.classList.remove('bg-retro-yellow', 'text-black');
      btn.classList.add('text-black/60');
    });
    activeTab.classList.add('bg-retro-yellow', 'text-black');
    activeTab.classList.remove('text-black/60');

    slidesSidebar.classList.add('hidden');
    customizerPanel.classList.add('hidden');
    previewPanel.classList.add('hidden');

    showElement.classList.remove('hidden');
    showElement.classList.add('flex');
    soundFx.playUIClick();
  }

  tabPreviewBtn.addEventListener('click', () => switchTab(tabPreviewBtn, previewPanel));
  tabEditBtn.addEventListener('click', () => switchTab(tabEditBtn, customizerPanel));
  tabSlidesBtn.addEventListener('click', () => switchTab(tabSlidesBtn, slidesSidebar));
}

/* ============================================================
   FILE UPLOAD
   ============================================================ */
function handleFileUpload(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const newSlide = {
        id: 'slide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        imageUrl: event.target.result,
        text: 'Your caption or quote goes here...',
        animation: 'typewriter',
        fontFamily: 'font-serif-elegant',
        fontSize: 'text-2xl md:text-4xl',
        alignment: 'text-center',
        textColor: '#1C1917',
        duration: 5,
        objectFit: 'object-contain',
        canvasBg: '#FAF8F5'
      };
      slides.push(newSlide);
      renderSlideList();
      selectSlide(newSlide.id);
      soundFx.playSuccessChime();
    };
    reader.readAsDataURL(file);
  });
  imageFileInput.value = '';
}

/* ============================================================
   SLIDE LIST
   ============================================================ */
function renderSlideList() {
  slideCountText.textContent = slides.length;
  mobileSlideCount.textContent = slides.length;

  if (slides.length === 0) {
    emptySlidesState.classList.remove('hidden');
    slideListContainer.innerHTML = '';
    slideListContainer.appendChild(emptySlidesState);
    activeSlideId = null;
    disableEditor();
    resetPreview();
    return;
  }

  emptySlidesState.classList.add('hidden');
  slideListContainer.innerHTML = '';

  slides.forEach((slide, idx) => {
    const slideEl = document.createElement('div');
    slideEl.className = `group relative p-2 border-3 flex items-center space-x-3 cursor-pointer transition ${
      slide.id === activeSlideId
        ? 'bg-retro-yellow border-black shadow-retro'
        : 'bg-white border-black hover:bg-retro-cream'
    }`;

    const previewText = (slide.text || 'No text').replace(/\n/g, ' ');

    slideEl.innerHTML = `
      <div class="w-10 h-10 border-2 border-black bg-black overflow-hidden shrink-0">
        <img src="${slide.imageUrl}" class="w-full h-full object-cover object-center">
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono-retro font-bold text-black truncate">SLIDE ${idx + 1}</span>
          <span class="text-[10px] text-black font-mono-retro font-bold bg-retro-pink text-white px-1.5 border border-black">${slide.duration}S</span>
        </div>
        <p class="text-[11px] text-black/70 truncate mt-0.5 font-mono-retro">${previewText}</p>
      </div>
      <button data-delete-id="${slide.id}" class="w-6 h-6 border-2 border-black bg-retro-red text-white hover:bg-black transition flex items-center justify-center">
        <i class="fa-solid fa-xmark text-xs"></i>
      </button>
    `;

    slideEl.addEventListener('click', (e) => {
      if (e.target.closest('[data-delete-id]')) {
        e.stopPropagation();
        deleteSlide(slide.id);
        return;
      }
      soundFx.playUIClick();
      selectSlide(slide.id);
    });

    slideListContainer.appendChild(slideEl);
  });
}

/* ============================================================
   SLIDE SELECT & UPDATE
   ============================================================ */
function selectSlide(id) {
  activeSlideId = id;
  renderSlideList();

  const slide = getActiveSlide();
  if (!slide) return;

  enableEditor();
  activeSlideLabel.textContent = `SLIDE ${slides.findIndex(s => s.id === id) + 1}`;

  textInput.value = slide.text;
  animationSelect.value = slide.animation;
  fontSelect.value = slide.fontFamily;
  fontSizeSelect.value = slide.fontSize;
  textColorPicker.value = slide.textColor;
  textColorHex.textContent = slide.textColor.toUpperCase();
  durationInput.value = slide.duration;
  objectFitSelect.value = slide.objectFit;

  alignBtns.forEach(btn => {
    if (btn.dataset.align === slide.alignment) {
      btn.classList.add('active', 'bg-retro-yellow');
    } else {
      btn.classList.remove('active', 'bg-retro-yellow');
    }
  });

  document.querySelectorAll('.canvas-swatch').forEach(s => {
    if (s.dataset.color === slide.canvasBg) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  updateLivePreview(slide);
}

function getActiveSlide() { return slides.find(s => s.id === activeSlideId); }

function updateActiveSlide() {
  const slide = getActiveSlide();
  if (!slide) return;

  slide.text = textInput.value;
  slide.animation = animationSelect.value;
  slide.fontFamily = fontSelect.value;
  slide.fontSize = fontSizeSelect.value;
  slide.textColor = textColorPicker.value;
  slide.duration = parseFloat(durationInput.value) || 5;
  slide.objectFit = objectFitSelect.value;

  const activeAlignBtn = document.querySelector('.align-btn.active');
  if (activeAlignBtn) slide.alignment = activeAlignBtn.dataset.align;

  updateLivePreview(slide);
}

function deleteSlide(id) {
  slides = slides.filter(s => s.id !== id);
  activeSlideId = slides.length > 0 ? slides[0].id : null;
  renderSlideList();
  if (activeSlideId) selectSlide(activeSlideId);
  soundFx.playWhoosh();
}

function clearAllSlides() {
  if (!slides.length) return;
  if (confirm('Clear all slides?')) {
    slides = [];
    renderSlideList();
    soundFx.playWhoosh();
  }
}

function enableEditor() { editorControlsWrapper.classList.remove('opacity-40', 'pointer-events-none'); }
function disableEditor() { editorControlsWrapper.classList.add('opacity-40', 'pointer-events-none'); activeSlideLabel.textContent = 'NO SEL'; }

function resetPreview() {
  previewImage.classList.add('hidden');
  previewImageBlur.classList.add('hidden');
  previewImagePlaceholder.classList.remove('hidden');
  previewTextContainer.innerHTML = '<span class="text-black/40 italic text-sm font-mono-retro">SELECT A SLIDE...</span>';
  applyCanvasBg('#FAF8F5');
}

function updateLivePreview(slide) {
  if (!slide) return;

  previewImage.src = slide.imageUrl;
  previewImage.className = `relative w-full h-full ${slide.objectFit} object-center transition-all duration-300 z-10`;
  previewImage.classList.remove('hidden');

  previewImageBlur.style.backgroundImage = `url('${slide.imageUrl}')`;
  previewImageBlur.classList.remove('hidden');

  previewImagePlaceholder.classList.add('hidden');

  applyCanvasBg(slide.canvasBg);
  renderAnimatedText(slide, previewTextContainer);
}

/* ============================================================
   PER-LETTER ANIMATION ENGINE (with LINE BREAK support)
   ============================================================ */
function renderAnimatedText(slide, container) {
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
  letterTimeouts.forEach(t => clearTimeout(t));
  letterTimeouts = [];

  container.innerHTML = '';
  container.className = `w-full max-w-2xl ${slide.alignment} ${slide.fontFamily} ${slide.fontSize} leading-relaxed tracking-tight`;
  container.style.color = slide.textColor;

  const text = slide.text;
  if (!text.trim()) {
    container.innerHTML = '<span class="opacity-30 italic">(Empty Text)</span>';
    return;
  }

  // ✅ Split by lines to preserve line breaks
  const lines = text.split('\n');

  // ═══ TYPEWRITER MODE ═══
  if (slide.animation === 'typewriter') {
    const textSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'typewriter-cursor';
    container.appendChild(textSpan);
    container.appendChild(cursorSpan);

    let charIndex = 0;
    function typeChar() {
      if (charIndex < text.length) {
        const char = text.charAt(charIndex);
        if (char === '\n') {
          textSpan.appendChild(document.createElement('br'));
        } else {
          textSpan.appendChild(document.createTextNode(char));
          if (char !== ' ') soundFx.playTypewriterKey();
        }
        charIndex++;
        typewriterTimeout = setTimeout(typeChar, 50);
      } else {
        typewriterTimeout = setTimeout(() => cursorSpan.remove(), 2000);
      }
    }
    typeChar();
    return;
  }

  // ═══ OTHER MODES (line-by-line) ═══
  const animClassMap = {
    fade: 'anim-letter-fade',
    slide: 'anim-letter-slide',
    bounce: 'anim-letter-bounce',
    glow: 'anim-letter-glow'
  };
  const animClass = animClassMap[slide.animation] || 'anim-letter-fade';

  let globalLetterIndex = 0;

  lines.forEach((line) => {
    const lineWrapper = document.createElement('div');
    lineWrapper.className = 'block';

    const words = line.split(' ');

    words.forEach((word) => {
      if (word === '') return;

      const wordWrapper = document.createElement('span');
      wordWrapper.className = 'inline-block whitespace-nowrap';
      wordWrapper.style.marginRight = '0.35em';

      word.split('').forEach((char) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = `${animClass} inline-block`;
        letterSpan.textContent = char;

        const delay = globalLetterIndex * 0.05;
        letterSpan.style.animationDelay = `${delay}s`;

        wordWrapper.appendChild(letterSpan);
        globalLetterIndex++;
      });

      lineWrapper.appendChild(wordWrapper);
    });

    container.appendChild(lineWrapper);
    globalLetterIndex++;
  });

  // ═══ Sound sync per letter ═══
  let soundIndex = 0;
  lines.forEach((line) => {
    line.split(' ').forEach((word) => {
      if (word === '') return;
      word.split('').forEach(() => {
        const delay = soundIndex * 50;
        const timeoutId = setTimeout(() => {
          if (slide.animation === 'fade') soundFx.playLetterPop();
          else if (slide.animation === 'slide') soundFx.playWhoosh();
          else if (slide.animation === 'bounce') soundFx.playBounceThump();
          else if (slide.animation === 'glow') soundFx.playGlowSwell();
        }, delay);
        letterTimeouts.push(timeoutId);
        soundIndex++;
      });
      soundIndex++;
    });
    soundIndex++;
  });
}

/* ============================================================
   PRESENTATION MODE
   ============================================================ */
function startPresentation() {
  if (!slides.length) {
    alert('Please add slides first.');
    return;
  }
  presentationIndex = 0;
  isPaused = false;
  presentationModal.classList.remove('hidden');
  presentationModal.classList.add('flex');
  soundFx.playSuccessChime();
  resetIdleTimer();
  playSlide(presentationIndex);
}

function stopPresentation() {
  clearTimeout(presentationTimer);
  clearInterval(progressTimer);
  clearTimeout(idleTimer);
  letterTimeouts.forEach(t => clearTimeout(t));
  letterTimeouts = [];
  presentationModal.classList.add('hidden');
  presentationModal.classList.remove('flex');
  presentationModal.classList.remove('presentation-idle');
  soundFx.playWhoosh();
}

function playSlide(index) {
  if (index < 0 || index >= slides.length) {
    stopPresentation();
    return;
  }

  presentationIndex = index;
  const slide = slides[index];
  if (!slide) return;

  soundFx.playSlideTransition();

  playerImage.src = slide.imageUrl;
  playerImage.className = `relative w-full h-full ${slide.objectFit} object-center z-10`;

  playerImageBlur.style.backgroundImage = `url('${slide.imageUrl}')`;
  playerImageBlur.classList.remove('hidden');

  playerSlideCounter.textContent = `SLIDE ${index + 1} / ${slides.length}`;

  applyCanvasBg(slide.canvasBg);
  renderAnimatedText(slide, playerTextContainer);

  clearTimeout(presentationTimer);
  clearInterval(progressTimer);

  const durationMs = slide.duration * 1000;
  let startTime = Date.now();

  progressTimer = setInterval(() => {
    if (isPaused) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / durationMs) * 100, 100);
    presentationProgressBar.style.width = `${progress}%`;
    if (progress >= 100) clearInterval(progressTimer);
  }, 50);

  presentationTimer = setTimeout(() => {
    if (!isPaused) {
      if (presentationIndex + 1 < slides.length) {
        playSlide(presentationIndex + 1);
      } else {
        stopPresentation();
      }
    }
  }, durationMs);
}

function togglePausePresentation() {
  isPaused = !isPaused;
  playerPauseBtn.innerHTML = isPaused
    ? '<i class="fa-solid fa-play text-xs"></i>'
    : '<i class="fa-solid fa-pause text-xs"></i>';
  soundFx.playUIClick();
  resetIdleTimer();
}

function showNextSlide() {
  if (presentationIndex + 1 < slides.length) playSlide(presentationIndex + 1);
  else stopPresentation();
}

function showPrevSlide() {
  if (presentationIndex - 1 >= 0) playSlide(presentationIndex - 1);
}

function resetIdleTimer() {
  presentationModal.classList.remove('presentation-idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!presentationModal.classList.contains('hidden')) {
      presentationModal.classList.add('presentation-idle');
    }
  }, 3000);
}

/* ============================================================
   ✅ DOWNLOAD: PNG (INSTANT — no wait)
   ============================================================ */
async function handleDownloadPNG() {
  const slide = getActiveSlide();
  if (!slide) {
    alert('Please select a slide first.');
    return;
  }

  showDownloadModal('EXPORTING PNG', 'Rendering image...');
  soundFx.playUIClick();

  try {
    const img = await loadImage(slide.imageUrl);
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // progress = 1 means fully rendered (no animation)
    drawSlideOnCanvas(ctx, canvas.width, canvas.height, img, slide, 1);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixtale-slide-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      hideDownloadModal();
      soundFx.playSuccessChime();
    }, 'image/png');
  } catch (err) {
    console.error('PNG download error:', err);
    hideDownloadModal();
    alert('Download failed: ' + err.message);
  }
}

/* ============================================================
   ✅ DOWNLOAD: VIDEO (WebM with animation + sound)
   ============================================================ */
async function handleDownloadVideo() {
  const slide = getActiveSlide();
  if (!slide) {
    alert('Please select a slide first.');
    return;
  }

  showDownloadModal('EXPORTING VIDEO', 'Recording animation + sound...');
  soundFx.playUIClick();
  soundFx.init();

  try {
    await recordSlideToVideo(slide);
    hideDownloadModal();
    soundFx.playSuccessChime();
  } catch (err) {
    console.error('Video download error:', err);
    hideDownloadModal();
    alert('Video download failed: ' + err.message);
  }
}

function showDownloadModal(title, status) {
  downloadTitle.textContent = title;
  downloadStatus.textContent = status;
  downloadProgressFill.style.width = '0%';
  downloadPercent.textContent = '0%';
  downloadModal.classList.remove('hidden');
  downloadModal.classList.add('flex');
}

function hideDownloadModal() {
  downloadModal.classList.add('hidden');
  downloadModal.classList.remove('flex');
}

function updateDownloadProgress(percent, statusText) {
  downloadProgressFill.style.width = `${percent}%`;
  downloadPercent.textContent = `${Math.round(percent)}%`;
  if (statusText) downloadStatus.textContent = statusText;
}

async function recordSlideToVideo(slide) {
  const DURATION = slide.duration * 1000;
  const WIDTH = 1280;
  const HEIGHT = 720;

  const img = await loadImage(slide.imageUrl);

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // Audio routing: tap masterGain into a MediaStreamDest
  const audioDest = soundFx.ctx.createMediaStreamDestination();
  soundFx.masterGain.connect(audioDest);

  const videoStream = canvas.captureStream(30);
  const combinedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...audioDest.stream.getAudioTracks()
  ]);

  // Pick supported MIME type
  let mimeType = 'video/webm;codecs=vp9,opus';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8,opus';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 5000000
  });

  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      try { soundFx.masterGain.disconnect(audioDest); } catch (e) {}

      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixtale-slide-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    };

    recorder.onerror = (e) => reject(e.error || new Error('Recorder error'));

    recorder.start();

    const startTime = performance.now();

    // ── Schedule sounds to play during recording ──
    const lines = slide.text.split('\n');
    const soundTimeouts = [];

    if (slide.animation === 'typewriter') {
      for (let i = 0; i < slide.text.length; i++) {
        const char = slide.text.charAt(i);
        if (char === '\n' || char === ' ') continue;
        const delay = i * 50;
        const tid = setTimeout(() => soundFx.playTypewriterKey(), delay);
        soundTimeouts.push(tid);
      }
    } else {
      let soundIdx = 0;
      lines.forEach((line) => {
        line.split(' ').forEach((word) => {
          if (word === '') return;
          word.split('').forEach(() => {
            const delay = soundIdx * 50;
            const tid = setTimeout(() => {
              if (slide.animation === 'fade') soundFx.playLetterPop();
              else if (slide.animation === 'slide') soundFx.playWhoosh();
              else if (slide.animation === 'bounce') soundFx.playBounceThump();
              else if (slide.animation === 'glow') soundFx.playGlowSwell();
            }, delay);
            soundTimeouts.push(tid);
            soundIdx++;
          });
          soundIdx++;
        });
        soundIdx++;
      });
    }

    let lastProgressUpdate = 0;

    function drawFrame() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      drawSlideOnCanvas(ctx, WIDTH, HEIGHT, img, slide, progress);

      if (elapsed - lastProgressUpdate > 150) {
        updateDownloadProgress(progress * 100, 'Recording...');
        lastProgressUpdate = elapsed;
      }

      if (elapsed >= DURATION) {
        soundTimeouts.forEach(t => clearTimeout(t));
        setTimeout(() => {
          if (recorder.state !== 'inactive') recorder.stop();
        }, 500);
        return;
      }
      requestAnimationFrame(drawFrame);
    }

    setTimeout(() => drawFrame(), 150);
  });
}

/* ============================================================
   CANVAS RENDERING (shared by PNG + Video export)
   progress: 0 → 1  (0 = start of animation, 1 = fully visible)
   ============================================================ */
function drawSlideOnCanvas(ctx, W, H, img, slide, progress) {
  const photoH = H / 2;

  // ── 1. Blurred background ──
  ctx.save();
  ctx.filter = 'blur(30px)';
  drawImageCover(ctx, img, 0, 0, W, photoH);
  ctx.restore();

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, W, photoH);

  // ── 2. Main image (contain) ──
  const imgAspect = img.width / img.height;
  const frameAspect = W / photoH;
  let drawW, drawH;
  if (imgAspect > frameAspect) {
    drawW = W; drawH = W / imgAspect;
  } else {
    drawH = photoH; drawW = photoH * imgAspect;
  }
  const drawX = (W - drawW) / 2;
  const drawY = (photoH - drawH) / 2;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  // ── 3. Canvas BG ──
  ctx.fillStyle = slide.canvasBg || '#FAF8F5';
  ctx.fillRect(0, photoH, W, H - photoH);

  // Dot pattern
  ctx.fillStyle = 'rgba(201, 191, 168, 0.5)';
  for (let x = 0; x < W; x += 18) {
    for (let y = photoH; y < H; y += 18) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── 4. Text ──
  const fontFamilyMap = {
    'font-serif-elegant': '"Playfair Display", serif',
    'font-sans-clean': 'Inter, sans-serif',
    'font-handwriting': '"Caveat", cursive',
    'font-modern-display': '"Space Grotesk", sans-serif',
    'font-cinzel': 'Cinzel, serif'
  };
  const fontFamily = fontFamilyMap[slide.fontFamily] || 'Inter, sans-serif';

  const sizeMap = {
    'text-lg md:text-xl': 26,
    'text-xl md:text-2xl': 36,
    'text-2xl md:text-4xl': 52,
    'text-3xl md:text-5xl': 68
  };
  const fontSize = sizeMap[slide.fontSize] || 52;

  ctx.fillStyle = slide.textColor || '#1C1917';
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'middle';

  let textX = W / 2;
  ctx.textAlign = 'center';
  if (slide.alignment === 'text-left') { textX = 60; ctx.textAlign = 'left'; }
  else if (slide.alignment === 'text-right') { textX = W - 60; ctx.textAlign = 'right'; }

  const lineHeight = fontSize * 1.5;
  const lines = slide.text.split('\n');
  const totalTextH = lines.length * lineHeight;
  const textAreaCenterY = photoH + (H - photoH) / 2;
  let currentY = textAreaCenterY - totalTextH / 2 + lineHeight / 2;

  const letterDelay = 50; // ms
  const letterDuration = 0.45; // sec
  const currentTimeSec = progress * slide.duration;

  // Global letter index across all lines
  let charGlobalIdx = 0;

  lines.forEach((line) => {
    const words = line.split(' ');
    const lineWidth = ctx.measureText(line).width;
    let cursorX = textX;
    if (slide.alignment === 'text-center') cursorX = textX - lineWidth / 2;

    let firstWordOfLine = true;

    words.forEach((word) => {
      if (!firstWordOfLine) cursorX += ctx.measureText(' ').width;
      firstWordOfLine = false;

      word.split('').forEach((char) => {
        let charProgress = 1;

        if (progress < 1 || slide.animation !== 'typewriter') {
          const charStartTime = (charGlobalIdx * letterDelay) / 1000;
          const charEndTime = charStartTime + letterDuration;
          if (currentTimeSec < charStartTime) charProgress = 0;
          else if (currentTimeSec > charEndTime) charProgress = 1;
          else charProgress = (currentTimeSec - charStartTime) / letterDuration;
        }

        let eased = charProgress;
        if (slide.animation === 'fade' || slide.animation === 'slide' || slide.animation === 'glow') {
          eased = easeOutCubic(charProgress);
        } else if (slide.animation === 'bounce') {
          eased = easeOutBack(charProgress);
        }

        const charWidth = ctx.measureText(char).width;

        if (slide.animation === 'typewriter') {
          const revealUpTo = currentTimeSec / (letterDelay / 1000);
          const visibleChars = Math.floor(revealUpTo);
          if (charGlobalIdx < visibleChars) {
            ctx.globalAlpha = 1;
            ctx.fillText(char, cursorX, currentY);
          }
        } else {
          ctx.save();
          ctx.globalAlpha = eased;

          if (slide.animation === 'slide') {
            const offsetY = (1 - eased) * 40;
            ctx.fillText(char, cursorX, currentY + offsetY);
          } else if (slide.animation === 'bounce') {
            const offsetY = (1 - eased) * -30;
            const scale = 0.7 + eased * 0.3;
            ctx.translate(cursorX + charWidth / 2, currentY);
            ctx.scale(scale, scale);
            ctx.fillText(char, -charWidth / 2, 0);
          } else if (slide.animation === 'glow') {
            ctx.shadowColor = slide.textColor;
            ctx.shadowBlur = (1 - eased) * 25;
            ctx.fillText(char, cursorX, currentY);
          } else {
            ctx.fillText(char, cursorX, currentY);
          }

          ctx.restore();
        }

        cursorX += charWidth;
        charGlobalIdx++;
      });
    });

    currentLineY: currentY += lineHeight;
    charGlobalIdx++; // line break counts as one
  });
}

/* ============================================================
   HELPERS
   ============================================================ */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgAspect = img.width / img.height;
  const frameAspect = w / h;
  let drawW, drawH;
  if (imgAspect > frameAspect) {
    drawH = h; drawW = h * imgAspect;
  } else {
    drawW = w; drawH = w / imgAspect;
  }
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
