class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTypewriterKey() {
    if (!this.soundEnabled) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  playWordSwoosh() {
    if (!this.soundEnabled) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }
}

const soundFx = new AudioSynthesizer();

let slides = [];
let activeSlideId = null;
let presentationIndex = 0;
let presentationTimer = null;
let progressTimer = null;
let isPaused = false;
let typewriterTimeout = null;

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

window.addEventListener('DOMContentLoaded', () => {
  addDemoSlide();
  setupEventListeners();
  setupMobileTabs();
});

function addDemoSlide() {
  const demoSlide = {
    id: 'slide_' + Date.now(),
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    text: 'Welcome to PixTale - Create your story.',
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
      alignBtns.forEach(b => b.classList.remove('active', 'bg-slate-800', 'text-amber-400'));
      btn.classList.add('active', 'bg-slate-800', 'text-amber-400');
      updateActiveSlide();
    });
  });

  replayAnimBtn.addEventListener('click', () => {
    const slide = getActiveSlide();
    if (slide) renderAnimatedText(slide, previewTextContainer);
  });

  soundToggleBtn.addEventListener('click', () => {
    soundFx.soundEnabled = !soundFx.soundEnabled;
    soundIcon.className = soundFx.soundEnabled ? 'fa-solid fa-volume-high text-amber-400' : 'fa-solid fa-volume-xmark text-slate-500';
    soundToggleBtn.querySelector('span').textContent = soundFx.soundEnabled ? 'Sound ON' : 'Sound OFF';
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
      btn.classList.remove('text-amber-400', 'border-b-2', 'border-amber-500');
      btn.classList.add('text-slate-400');
    });
    activeTab.classList.add('text-amber-400', 'border-b-2', 'border-amber-500');
    activeTab.classList.remove('text-slate-400');

    slidesSidebar.classList.add('hidden');
    customizerPanel.classList.add('hidden');
    previewPanel.classList.add('hidden');

    showElement.classList.remove('hidden');
    showElement.classList.add('flex');
  }

  tabPreviewBtn.addEventListener('click', () => switchTab(tabPreviewBtn, previewPanel));
  tabEditBtn.addEventListener('click', () => switchTab(tabEditBtn, customizerPanel));
  tabSlidesBtn.addEventListener('click', () => switchTab(tabSlidesBtn, slidesSidebar));
}

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
    };
    reader.readAsDataURL(file);
  });
  imageFileInput.value = '';
}

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
    slideEl.className = `group relative p-2 rounded-xl border flex items-center space-x-3 cursor-pointer transition ${
      slide.id === activeSlideId
        ? 'bg-slate-800 border-amber-500/80 shadow-md'
        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
    }`;

    slideEl.innerHTML = `
      <div class="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-700/50">
        <img src="${slide.imageUrl}" class="w-full h-full object-cover">
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-200 truncate">Slide ${idx + 1}</span>
          <span class="text-[10px] text-amber-400 font-mono">${slide.duration}s</span>
        </div>
        <p class="text-[11px] text-slate-400 truncate mt-0.5">${slide.text || 'No text'}</p>
      </div>
      <button data-delete-id="${slide.id}" class="w-6 h-6 rounded-md bg-slate-900 text-slate-400 hover:text-red-400 transition flex items-center justify-center">
        <i class="fa-solid fa-xmark text-xs"></i>
      </button>
    `;

    slideEl.addEventListener('click', (e) => {
      if (e.target.closest('[data-delete-id]')) {
        e.stopPropagation();
        deleteSlide(slide.id);
        return;
      }
      selectSlide(slide.id);
    });

    slideListContainer.appendChild(slideEl);
  });
}

function selectSlide(id) {
  activeSlideId = id;
  renderSlideList();
  
  const slide = getActiveSlide();
  if (!slide) return;

  enableEditor();
  activeSlideLabel.textContent = `Slide ${slides.findIndex(s => s.id === id) + 1}`;

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
      btn.classList.add('active', 'bg-slate-800', 'text-amber-400');
    } else {
      btn.classList.remove('active', 'bg-slate-800', 'text-amber-400');
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
}

function clearAllSlides() {
  if (!slides.length) return;
  if (confirm('Clear all slides?')) {
    slides = [];
    renderSlideList();
  }
}

function enableEditor() { editorControlsWrapper.classList.remove('opacity-40', 'pointer-events-none'); }
function disableEditor() { editorControlsWrapper.classList.add('opacity-40', 'pointer-events-none'); activeSlideLabel.textContent = 'No Selection'; }
function resetPreview() {
  previewImage.classList.add('hidden');
  previewImagePlaceholder.classList.remove('hidden');
  previewTextContainer.innerHTML = '<span class="text-stone-400 italic text-sm">Select a slide to preview...</span>';
}

function updateLivePreview(slide) {
  if (!slide) return;
  previewImage.src = slide.imageUrl;
  previewImage.className = `w-full h-full ${slide.objectFit} transition-all duration-300`;
  previewImage.classList.remove('hidden');
  previewImagePlaceholder.classList.add('hidden');

  renderAnimatedText(slide, previewTextContainer);
}

function renderAnimatedText(slide, container) {
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
  container.innerHTML = '';

  container.className = `w-full max-w-2xl ${slide.alignment} ${slide.fontFamily} ${slide.fontSize} leading-relaxed tracking-tight`;
  container.style.color = slide.textColor;

  const text = slide.text.trim();
  if (!text) {
    container.innerHTML = '<span class="opacity-30 italic">(Empty Text)</span>';
    return;
  }

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
        setTimeout(() => cursorSpan.remove(), 2000);
      }
    }
    typeChar();
    return;
  }

  const words = text.split(' ');
  const animClassMap = {
    fade: 'anim-word-fade',
    slide: 'anim-word-slide',
    bounce: 'anim-word-bounce',
    glow: 'anim-word-glow'
  };
  const animClass = animClassMap[slide.animation] || 'anim-word-fade';

  words.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = `${animClass} mr-2.5 mb-1 inline-block`;
    wordSpan.style.animationDelay = `${index * 0.12}s`;
    wordSpan.textContent = word;
    container.appendChild(wordSpan);

    setTimeout(() => soundFx.playWordSwoosh(), index * 120);
  });
}

function startPresentation() {
  if (!slides.length) {
    alert('Please add slides first.');
    return;
  }
  presentationIndex = 0;
  isPaused = false;
  presentationModal.classList.remove('hidden');
  presentationModal.classList.add('flex');
  playSlide(presentationIndex);
}

function stopPresentation() {
  clearTimeout(presentationTimer);
  clearInterval(progressTimer);
  presentationModal.classList.add('hidden');
  presentationModal.classList.remove('flex');
}

function playSlide(index) {
  if (index < 0 || index >= slides.length) {
    stopPresentation();
    return;
  }

  presentationIndex = index;
  const slide = slides.length ? slides[index] : null;
  if (!slide) return;

  playerImage.src = slide.imageUrl;
  playerImage.className = `w-full h-full ${slide.objectFit}`;
  playerSlideCounter.textContent = `Slide ${index + 1} / ${slides.length}`;

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
  playerPauseBtn.innerHTML = isPaused ? '<i class="fa-solid fa-play text-xs"></i>' : '<i class="fa-solid fa-pause text-xs"></i>';
}

function showNextSlide() {
  if (presentationIndex + 1 < slides.length) playSlide(presentationIndex + 1);
  else stopPresentation();
}

function showPrevSlide() {
  if (presentationIndex - 1 >= 0) playSlide(presentationIndex - 1);
}
