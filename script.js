/* ============================================================
   🎬 PROFESSIONAL SOUND SYNTHESIZER
   Video editor style: pop, click, whoosh, tick, swoosh
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

  // ══════════════════════════════════════════════════════════
  // 🎯 TYPEWRITER CLICK — Mechanical keyboard key tap
  // (CapCut / Premiere style: crisp, short, clicky)
  // ══════════════════════════════════════════════════════════
  playTypewriterKey() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    // Layer 1: High click (metallic)
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

    // Layer 2: Body thump (low meaty part)
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

    // Layer 3: Noise burst (key release texture)
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

  // ══════════════════════════════════════════════════════════
  // 🎯 LETTER POP — Cute candy-pop sound
  // (For fade/slide/bounce/glow animation letters)
  // ══════════════════════════════════════════════════════════
  playLetterPop() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    // Random pitch for organic feel
    const basePitch = 700 + Math.random() * 500;
    osc.frequency.setValueAtTime(basePitch, now);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 2, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 0.8, now + 0.09);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // ══════════════════════════════════════════════════════════
  // 🎯 SOFT WHOOSH — For slide transitions
  // ══════════════════════════════════════════════════════════
  playWhoosh() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI);
    }
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.3);
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.3);
  }

  // ══════════════════════════════════════════════════════════
  // 🎯 SUB BASS THUMP — For bounce animation
  // ══════════════════════════════════════════════════════════
  playBounceThump() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // ══════════════════════════════════════════════════════════
  // 🎯 CINEMATIC SWELL — For glow animation
  // ══════════════════════════════════════════════════════════
  playGlowSwell() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // ══════════════════════════════════════════════════════════
  // 🎯 SLIDE CHANGE — Big transition whoosh
  // ══════════════════════════════════════════════════════════
  playSlideTransition() {
    if (!this.soundEnabled) return;
    this.init();
    const now = this.ctx.currentTime;

    // Descending swoosh
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

  // ══════════════════════════════════════════════════════════
  // 🎯 UI CLICK — Cute UI feedback pop
  // ══════════════════════════════════════════════════════════
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

  // ══════════════════════════════════════════════════════════
  // 🎯 SUCCESS CHIME — For slide end / play start
  // ══════════════════════════════════════════════════════════
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
   STATE VARIABLES
   ============================================================ */
let slides = [];
let activeSlideId = null;
let presentationIndex = 0;
let presentationTimer = null;
let progressTimer = null;
let isPaused = false;
let typewriterTimeout = null;
let letterTimeouts = [];

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
const previewImagePlaceholder = document.getElementById('previewImagePlaceholder');
const previewTextContainer = document.getElementById('previewTextContainer');
const replayAnimBtn = document.getElementById('replayAnimBtn');

const presentationModal = document.getElementById('presentationModal');
const startPresentationBtn = document.getElementById('startPresentationBtn');
const closePresentationBtn = document.getElementById('closePresentationBtn');
const playerImage = document.getElementById('playerImage');
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

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  addDemoSlide();
  setupEventListeners();
  setupMobileTabs();
});

function addDemoSlide() {
  const demoSlide = {
    id: 'slide_' + Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    text: 'Welcome to PixTale — Create your story.',
    animation: 'typewriter',
    fontFamily: 'font-serif-elegant',
    fontSize: 'text-2xl md:text-4xl',
    alignment: 'text-center',
    textColor: '#1C1917',
    duration: 5,
    objectFit: 'object-cover'
  };
  slides.push(demoSlide);
  renderSlideList();
  selectSlide(demoSlide.id);
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
      alignBtns.forEach(b => {
        b.classList.remove('active', 'bg-retro-yellow');
      });
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

  document.addEventListener('keydown', (e) => {
    if (presentationModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') stopPresentation();
    if (e.key === 'ArrowRight' || e.key === 'Space') showNextSlide();
    if (e.key === 'ArrowLeft') showPrevSlide();
  });
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
        objectFit: 'object-cover'
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
   SLIDE LIST RENDER
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

    slideEl.innerHTML = `
      <div class="w-10 h-10 border-2 border-black bg-black overflow-hidden shrink-0">
        <img src="${slide.imageUrl}" class="w-full h-full object-cover object-center">
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono-retro font-bold text-black truncate">SLIDE ${idx + 1}</span>
          <span class="text-[10px] text-black font-mono-retro font-bold bg-retro-pink text-white px-1.5 border border-black">${slide.duration}S</span>
        </div>
        <p class="text-[11px] text-black/70 truncate mt-0.5 font-mono-retro">${slide.text || 'No text'}</p>
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
  previewImagePlaceholder.classList.remove('hidden');
  previewTextContainer.innerHTML = '<span class="text-black/40 italic text-sm font-mono-retro">SELECT A SLIDE...</span>';
}

function updateLivePreview(slide) {
  if (!slide) return;
  previewImage.src = slide.imageUrl;
  previewImage.className = `w-full h-full ${slide.objectFit} object-center transition-all duration-300`;
  previewImage.classList.remove('hidden');
  previewImagePlaceholder.classList.add('hidden');

  renderAnimatedText(slide, previewTextContainer);
}

/* ============================================================
   🎬 PER-LETTER ANIMATION ENGINE
   ============================================================ */
function renderAnimatedText(slide, container) {
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
  letterTimeouts.forEach(t => clearTimeout(t));
  letterTimeouts = [];

  container.innerHTML = '';
  container.className = `w-full max-w-2xl ${slide.alignment} ${slide.fontFamily} ${slide.fontSize} leading-relaxed tracking-tight`;
  container.style.color = slide.textColor;

  const text = slide.text.trim();
  if (!text) {
    container.innerHTML = '<span class="opacity-30 italic">(Empty Text)</span>';
    return;
  }

  // ═══════ TYPEWRITER MODE (letter-by-letter + click) ═══════
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
        textSpan.textContent += char;
        if (char !== ' ') soundFx.playTypewriterKey();
        charIndex++;
        typewriterTimeout = setTimeout(typeChar, 50);
      } else {
        typewriterTimeout = setTimeout(() => cursorSpan.remove(), 2000);
      }
    }
    typeChar();
    return;
  }

  // ═══════ OTHER MODES (per-letter with synced sounds) ═══════
  const animClassMap = {
    fade: 'anim-letter-fade',
    slide: 'anim-letter-slide',
    bounce: 'anim-letter-bounce',
    glow: 'anim-letter-glow'
  };
  const animClass = animClassMap[slide.animation] || 'anim-letter-fade';

  const words = text.split(' ');

  words.forEach((word, wordIdx) => {
    const wordWrapper = document.createElement('span');
    wordWrapper.className = 'inline-block whitespace-nowrap';
    wordWrapper.style.marginRight = '0.35em';

    word.split('').forEach((char, charIdx) => {
      const letterSpan = document.createElement('span');
      letterSpan.className = `${animClass} inline-block`;
      letterSpan.textContent = char;

      const globalLetterIndex = getGlobalLetterIndex(words, wordIdx, charIdx);
      const delay = globalLetterIndex * 0.05;
      letterSpan.style.animationDelay = `${delay}s`;

      wordWrapper.appendChild(letterSpan);
    });

    container.appendChild(wordWrapper);
  });

  // ═══════ Sound sync per letter (different sound per animation) ═══════
  let globalIndex = 0;
  words.forEach((word) => {
    word.split('').forEach(() => {
      const delay = globalIndex * 50;
      const timeoutId = setTimeout(() => {
        if (slide.animation === 'fade') soundFx.playLetterPop();
        else if (slide.animation === 'slide') soundFx.playWhoosh();
        else if (slide.animation === 'bounce') soundFx.playBounceThump();
        else if (slide.animation === 'glow') soundFx.playGlowSwell();
      }, delay);
      letterTimeouts.push(timeoutId);
      globalIndex++;
    });
    globalIndex++; // space gap
  });
}

function getGlobalLetterIndex(words, targetWordIdx, targetCharIdx) {
  let index = 0;
  for (let i = 0; i < targetWordIdx; i++) index += words[i].length + 1;
  index += targetCharIdx;
  return index;
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
  playSlide(presentationIndex);
}

function stopPresentation() {
  clearTimeout(presentationTimer);
  clearInterval(progressTimer);
  letterTimeouts.forEach(t => clearTimeout(t));
  letterTimeouts = [];
  presentationModal.classList.add('hidden');
  presentationModal.classList.remove('flex');
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
  playerImage.className = `w-full h-full ${slide.objectFit} object-center`;
  playerSlideCounter.textContent = `SLIDE ${index + 1} / ${slides.length}`;

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
}

function showNextSlide() {
  if (presentationIndex + 1 < slides.length) playSlide(presentationIndex + 1);
  else stopPresentation();
}

function showPrevSlide() {
  if (presentationIndex - 1 >= 0) playSlide(presentationIndex - 1);
}
