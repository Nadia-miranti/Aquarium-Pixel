/**
 * ============================================================================
 * INTERACTIVE PIXEL ART AQUARIUM (MASTERPIECE ECOSYSTEM EDITION)
 * Vanilla JavaScript (ES6+), HTML5 Canvas, CSS3
 * Zero External Frameworks / Pure Native Web Technologies
 * ============================================================================
 */

// Global State
const STATE = {
  isSplashActive: true,
  splashDuration: 5000,
  splashStartTime: null,
  mouse: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    isInside: false,
    isActive: false,
    lastMoveTime: 0
  },
  cursorIdleTimeoutMs: 1800,
  pellets: [],
  particles: [],
  bubbles: [],
  floatingTexts: [],
  creatures: [],
  seabedFauna: [],
  seaweeds: [],
  corals: [],
  svgSprites: {}
};

// Referensi DOM
const dom = {
  splashScreen: document.getElementById('splash-screen'),
  splashCanvas: document.getElementById('splash-canvas'),
  loadingBar: document.getElementById('loading-bar'),
  loadingText: document.getElementById('loading-text'),
  aquariumCanvas: document.getElementById('aquarium-canvas'),
  foodCounter: document.getElementById('food-counter'),
  statusBadge: document.querySelector('.badge-pink')
};

const splashCtx = dom.splashCanvas.getContext('2d');
const ctx = dom.aquariumCanvas.getContext('2d');

splashCtx.imageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

/* ============================================================================
   MODUL 1: NATIVE SVG PIXEL ART ENGINE & ASSET GENERATORS
   ============================================================================ */

function rect(x, y, w, h, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

// 1. Ikan Biru Bulat (Blue Tang) - 4 Frame
function getBlueFishSvg(frame = 0) {
  const tailOffsetY = frame === 1 ? -2 : (frame === 3 ? 2 : 0);
  const finOffset = frame % 2 === 1 ? 1 : 0;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" shape-rendering="crispEdges">
    ${rect(8, 4, 16, 16, '#0b2545')}
    ${rect(5, 7, 22, 10, '#0b2545')}
    ${rect(24, 7 + tailOffsetY, 6, 10, '#0b2545')}
    ${rect(12, 1, 8, 4, '#0b2545')}
    ${rect(14, 19, 6, 4, '#0b2545')}
    
    ${rect(9, 5, 14, 14, '#0284c7')}
    ${rect(11, 7, 10, 10, '#0ea5e9')}
    ${rect(12, 8, 8, 8, '#38bdf8')}
    
    ${rect(13, 2, 6, 3, '#0369a1')}
    ${rect(14, 3, 4, 2, '#38bdf8')}
    ${rect(15, 19, 4, 3, '#0369a1')}
    
    ${rect(25, 8 + tailOffsetY, 3, 8, '#0369a1')}
    ${rect(28, 6 + tailOffsetY, 2, 4, '#0284c7')}
    ${rect(28, 14 + tailOffsetY, 2, 4, '#0284c7')}
    
    <!-- Perut & Wajah Putih Solid -->
    ${rect(5, 9, 6, 7, '#ffffff')}
    ${rect(8, 14, 12, 4, '#ffffff')}
    ${rect(7, 12, 8, 4, '#e0f2fe')}
    ${rect(10, 16, 8, 2, '#bae6fd')}
    
    ${rect(4, 11, 2, 2, '#0369a1')}
    ${rect(16 + finOffset, 11, 3, 5, '#0284c7')}
    ${rect(17 + finOffset, 12, 2, 3, '#7dd3fc')}
    
    ${rect(9, 8, 3, 4, '#0f172a')}
    ${rect(9, 8, 1, 2, '#ffffff')}
  </svg>`;
}

// 2. Ikan Pink Pastel (Pink Betta) - 4 Frame
function getPinkFishSvg(frame = 0) {
  const tailWave = frame === 1 ? -2 : (frame === 3 ? 2 : 0);
  const finWave = frame % 2 === 1 ? -1 : 0;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 28" shape-rendering="crispEdges">
    ${rect(20, 4 + tailWave, 14, 20, '#881337')}
    ${rect(22, 6 + tailWave, 10, 16, '#f472b6')}
    ${rect(24, 8 + tailWave, 7, 12, '#fbcfe8')}
    ${rect(26, 10 + tailWave, 5, 8, '#fce7f3')}
    ${rect(31, 4 + tailWave, 3, 7, '#f472b6')}
    ${rect(31, 17 + tailWave, 3, 7, '#f472b6')}
    
    ${rect(6, 7, 16, 14, '#881337')}
    ${rect(16, 2 + finWave, 8, 6, '#881337')}
    ${rect(14, 20, 6, 6, '#881337')}
    
    ${rect(7, 8, 14, 12, '#fb7185')}
    ${rect(9, 9, 10, 10, '#fda4af')}
    ${rect(11, 11, 6, 6, '#fecdd3')}
    
    ${rect(17, 3 + finWave, 6, 4, '#f472b6')}
    ${rect(18, 4 + finWave, 4, 2, '#fce7f3')}
    ${rect(15, 20, 4, 4, '#f472b6')}
    
    ${rect(6, 12, 6, 6, '#ffffff')}
    ${rect(8, 15, 8, 3, '#fff1f2')}
    
    ${rect(13, 13, 4, 4, '#f472b6')}
    ${rect(14, 14, 2, 2, '#ffffff')}
    
    ${rect(7, 10, 3, 3, '#4c0519')}
    ${rect(7, 10, 1, 1, '#ffffff')}
    ${rect(5, 14, 2, 2, '#f43f5e')}
  </svg>`;
}

// 3. Ikan Badut (Clownfish) - 4 Frame
function getClownfishSvg(frame = 0) {
  const tailY = frame === 1 ? -1 : (frame === 3 ? 1 : 0);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 24" shape-rendering="crispEdges">
    ${rect(6, 5, 20, 14, '#431407')}
    ${rect(24, 7 + tailY, 7, 10, '#431407')}
    ${rect(12, 2, 10, 4, '#431407')}
    ${rect(13, 18, 8, 4, '#431407')}
    
    ${rect(7, 6, 18, 12, '#ea580c')}
    ${rect(8, 7, 16, 10, '#f97316')}
    ${rect(9, 8, 14, 8, '#fb923c')}
    
    ${rect(25, 8 + tailY, 4, 8, '#f97316')}
    ${rect(29, 7 + tailY, 2, 10, '#0f172a')}
    ${rect(28, 8 + tailY, 1, 8, '#ffffff')}
    
    ${rect(10, 5, 4, 14, '#0f172a')}
    ${rect(11, 6, 2, 12, '#ffffff')}
    ${rect(17, 3, 4, 18, '#0f172a')}
    ${rect(18, 4, 2, 16, '#ffffff')}
    ${rect(23, 7, 3, 10, '#0f172a')}
    ${rect(24, 8, 1, 8, '#ffffff')}
    
    ${rect(13, 3, 8, 2, '#f97316')}
    ${rect(14, 18, 6, 2, '#f97316')}
    ${rect(13, 11, 4, 4, '#c2410c')}
    ${rect(14, 12, 2, 2, '#ffffff')}
    
    ${rect(7, 8, 3, 3, '#0f172a')}
    ${rect(7, 8, 1, 1, '#ffffff')}
    ${rect(4, 11, 3, 3, '#c2410c')}
  </svg>`;
}

// 4. Ikan Tang Kuning (Yellow Tang) - 4 Frame
function getYellowTangSvg(frame = 0) {
  const tailY = frame === 1 ? -1 : (frame === 3 ? 1 : 0);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30" shape-rendering="crispEdges">
    ${rect(8, 3, 16, 24, '#713f12')}
    ${rect(4, 11, 6, 8, '#713f12')}
    ${rect(24, 9 + tailY, 6, 12, '#713f12')}
    
    ${rect(8, 4, 15, 22, '#ca8a04')}
    ${rect(9, 5, 13, 20, '#eab308')}
    ${rect(10, 7, 11, 16, '#facc15')}
    ${rect(12, 9, 7, 12, '#fef08a')}
    
    ${rect(14, 1, 6, 4, '#facc15')}
    ${rect(15, 25, 6, 4, '#facc15')}
    ${rect(15, 2, 4, 2, '#fef08a')}
    
    ${rect(5, 12, 4, 5, '#facc15')}
    ${rect(3, 14, 2, 2, '#ca8a04')}
    
    ${rect(25, 10 + tailY, 4, 10, '#facc15')}
    ${rect(28, 9 + tailY, 2, 12, '#ca8a04')}
    
    ${rect(22, 14 + tailY, 3, 2, '#ffffff')}
    ${rect(8, 10, 3, 3, '#451a03')}
    ${rect(8, 10, 1, 1, '#ffffff')}
  </svg>`;
}

// 5. Lumba-Lumba Cyan (Dolphin) - 4 Frame Dinamis
function getDolphinSvg(frame = 0) {
  let tailY = 0;
  let flukeTilt = 0;
  let archY = 0;
  let snoutY = 0;
  
  if (frame === 1) {
    tailY = 4; flukeTilt = 3; archY = -1; snoutY = -1;
  } else if (frame === 2) {
    tailY = -1; flukeTilt = 0; archY = 1; snoutY = 2;
  } else if (frame === 3) {
    tailY = -3; flukeTilt = -3; archY = 0; snoutY = 0;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 28" shape-rendering="crispEdges">
    ${rect(8, 7 + archY, 26, 14, '#0e7490')}
    ${rect(20, 2 + archY, 8, 6, '#0e7490')}
    ${rect(32, 8 + tailY, 8, 8, '#0e7490')}
    ${rect(38, 5 + tailY + flukeTilt, 6, 14, '#0e7490')}
    ${rect(2, 11 + snoutY, 8, 6, '#0e7490')}
    
    ${rect(9, 8 + archY, 24, 12, '#06b6d4')}
    ${rect(10, 9 + archY, 22, 10, '#22d3ee')}
    ${rect(12, 10 + archY, 18, 7, '#67e8f9')}
    
    ${rect(21, 3 + archY, 6, 5, '#0891b2')}
    ${rect(22, 4 + archY, 3, 3, '#22d3ee')}
    
    ${rect(32, 9 + tailY, 6, 6, '#0891b2')}
    ${rect(36, 10 + tailY, 4, 4, '#06b6d4')}
    ${rect(39, 6 + tailY + flukeTilt, 4, 5, '#0891b2')}
    ${rect(39, 13 + tailY + flukeTilt, 4, 5, '#0891b2')}
    ${rect(40, 7 + tailY + flukeTilt, 2, 10, '#22d3ee')}
    
    ${rect(12, 15 + archY, 16, 4, '#f0fdfa')}
    ${rect(4, 12 + snoutY, 6, 4, '#ccfbf1')}
    ${rect(6, 14 + snoutY, 6, 2, '#f0fdfa')}
    
    ${rect(17, 16 + archY, 6, 5, '#0891b2')}
    ${rect(18, 17 + archY, 4, 3, '#22d3ee')}
    
    ${rect(10, 10 + snoutY, 3, 3, '#083344')}
    ${rect(10, 10 + snoutY, 1, 1, '#ffffff')}
    ${rect(11, 11 + snoutY, 1, 1, '#67e8f9')}
  </svg>`;
}

// 6. Ubur-ubur Biru (Jellyfish) - 3 Frame
function getJellyfishSvg(frame = 0) {
  const stretch = frame === 0 ? -2 : (frame === 2 ? 2 : 0);
  const tentWave = frame === 1 ? 1 : (frame === 2 ? -1 : 0);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" shape-rendering="crispEdges">
    ${rect(6 - stretch / 2, 4, 20 + stretch, 14, '#1e3a8a')}
    ${rect(7 - stretch / 2, 5, 18 + stretch, 12, '#0284c7')}
    ${rect(8 - stretch / 2, 6, 16 + stretch, 10, '#38bdf8')}
    ${rect(9 - stretch / 2, 7, 14 + stretch, 7, '#bae6fd')}
    
    ${rect(5 - stretch / 2, 17, 22 + stretch, 3, '#0284c7')}
    ${rect(10, 7, 4, 2, '#ffffff')}
    ${rect(18, 7, 3, 2, '#ffffff')}
    
    ${rect(7 + tentWave, 20, 2, 5, '#38bdf8')}
    ${rect(8 + tentWave, 25, 2, 6, '#0284c7')}
    ${rect(6 + tentWave, 31, 2, 6, '#38bdf8')}
    
    ${rect(12 - tentWave, 20, 2, 7, '#38bdf8')}
    ${rect(14 - tentWave, 27, 2, 8, '#0ea5e9')}
    ${rect(13 - tentWave, 35, 2, 4, '#0284c7')}
    
    ${rect(18 + tentWave, 20, 2, 6, '#38bdf8')}
    ${rect(16 + tentWave, 26, 2, 8, '#0ea5e9')}
    ${rect(19 + tentWave, 34, 2, 5, '#0284c7')}
    
    ${rect(23 - tentWave, 20, 2, 5, '#38bdf8')}
    ${rect(21 - tentWave, 25, 2, 6, '#0284c7')}
    ${rect(23 - tentWave, 31, 2, 5, '#38bdf8')}
  </svg>`;
}

// 7. Karang Pastel Cantik (3 Varian)
function getPastelPinkCoralSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 48" shape-rendering="crispEdges">
    ${rect(6, 38, 32, 10, '#57534e')}
    ${rect(8, 36, 28, 4, '#78716c')}
    ${rect(12, 34, 20, 3, '#a8a29e')}
    ${rect(8, 18, 4, 18, '#16a34a')}
    ${rect(10, 16, 3, 20, '#22c55e')}
    ${rect(11, 14, 2, 8, '#4ade80')}
    ${rect(16, 24, 22, 12, '#f472b6')}
    ${rect(18, 22, 18, 12, '#fda4af')}
    ${rect(20, 20, 14, 12, '#fecdd3')}
    ${rect(18, 14, 4, 8, '#fda4af')}
    ${rect(24, 10, 4, 12, '#fecdd3')}
    ${rect(30, 12, 4, 10, '#fda4af')}
    ${rect(35, 16, 3, 8, '#f472b6')}
    ${rect(19, 13, 2, 3, '#fff1f2')}
    ${rect(25, 9, 2, 4, '#ffffff')}
    ${rect(31, 11, 2, 3, '#fff1f2')}
  </svg>`;
}

function getPurpleTubeCoralSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 48" shape-rendering="crispEdges">
    ${rect(4, 38, 36, 10, '#44403c')}
    ${rect(8, 34, 28, 6, '#57534e')}
    ${rect(12, 32, 20, 4, '#78716c')}
    ${rect(10, 14, 6, 20, '#7e22ce')}
    ${rect(11, 12, 5, 22, '#a855f7')}
    ${rect(12, 10, 4, 24, '#c084fc')}
    ${rect(11, 9, 5, 3, '#d8b4fe')}
    ${rect(12, 8, 3, 2, '#fef08a')}
    ${rect(18, 18, 7, 16, '#7e22ce')}
    ${rect(19, 16, 6, 18, '#a855f7')}
    ${rect(20, 14, 4, 20, '#c084fc')}
    ${rect(19, 13, 6, 3, '#d8b4fe')}
    ${rect(20, 12, 4, 2, '#fef08a')}
    ${rect(27, 22, 6, 12, '#7e22ce')}
    ${rect(28, 20, 5, 14, '#a855f7')}
    ${rect(29, 18, 4, 16, '#c084fc')}
    ${rect(28, 17, 5, 3, '#d8b4fe')}
    ${rect(29, 16, 3, 2, '#fef08a')}
    ${rect(34, 36, 4, 4, '#fbcfe8')}
    ${rect(35, 37, 2, 2, '#ffffff')}
  </svg>`;
}

function getTealSpongeCoralSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 48" shape-rendering="crispEdges">
    ${rect(6, 36, 32, 12, '#57534e')}
    ${rect(10, 32, 24, 6, '#78716c')}
    ${rect(12, 16, 18, 18, '#0f766e')}
    ${rect(13, 14, 16, 20, '#14b8a6')}
    ${rect(14, 12, 14, 22, '#2dd4bf')}
    ${rect(16, 10, 10, 24, '#5eead4')}
    ${rect(17, 9, 3, 3, '#0d9488')}
    ${rect(22, 11, 3, 3, '#0d9488')}
    ${rect(19, 17, 3, 3, '#0d9488')}
    ${rect(16, 10, 2, 1, '#99f6e4')}
    ${rect(28, 34, 8, 8, '#d97706')}
    ${rect(29, 33, 6, 8, '#f59e0b')}
    ${rect(30, 32, 4, 10, '#fbbf24')}
    ${rect(31, 35, 2, 2, '#fef08a')}
  </svg>`;
}

// 8. FAUNA DASAR LAUT BARU (Bintang Laut, Kerang Mutiara, Keong, Kepiting Mini)
function getStarfishSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    ${rect(9, 9, 6, 6, '#d97706')}
    ${rect(10, 10, 4, 4, '#f59e0b')}
    ${rect(11, 11, 2, 2, '#fbbf24')}
    ${rect(10, 3, 4, 6, '#d97706')}
    ${rect(11, 2, 2, 6, '#f59e0b')}
    ${rect(11, 4, 2, 2, '#fef08a')}
    ${rect(5, 14, 5, 4, '#d97706')}
    ${rect(3, 17, 4, 4, '#f59e0b')}
    ${rect(4, 16, 2, 2, '#fbbf24')}
    ${rect(14, 14, 5, 4, '#d97706')}
    ${rect(17, 17, 4, 4, '#f59e0b')}
    ${rect(16, 16, 2, 2, '#fbbf24')}
    ${rect(3, 7, 6, 4, '#d97706')}
    ${rect(2, 6, 4, 4, '#f59e0b')}
    ${rect(4, 8, 2, 2, '#fbbf24')}
    ${rect(15, 7, 6, 4, '#d97706')}
    ${rect(18, 6, 4, 4, '#f59e0b')}
    ${rect(17, 8, 2, 2, '#fbbf24')}
    ${rect(11, 10, 1, 1, '#ffffff')}
  </svg>`;
}

function getClamSvg(isOpen = true) {
  if (isOpen) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24" shape-rendering="crispEdges">
      ${rect(4, 14, 20, 8, '#701a75')}
      ${rect(6, 15, 16, 6, '#a21caf')}
      ${rect(8, 16, 12, 4, '#d946ef')}
      ${rect(10, 17, 8, 2, '#f5d0fe')}
      ${rect(5, 3, 18, 8, '#701a75')}
      ${rect(7, 4, 14, 6, '#c026d3')}
      ${rect(9, 5, 10, 4, '#e879f9')}
      ${rect(11, 6, 6, 2, '#fae8ff')}
      ${rect(11, 11, 6, 6, '#0284c7')}
      ${rect(12, 11, 4, 5, '#bae6fd')}
      ${rect(12, 12, 4, 4, '#ffffff')}
      ${rect(13, 12, 2, 2, '#ffffff')}
    </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" shape-rendering="crispEdges">
      ${rect(4, 4, 20, 14, '#701a75')}
      ${rect(6, 5, 16, 12, '#a21caf')}
      ${rect(8, 7, 12, 8, '#d946ef')}
      ${rect(10, 9, 8, 4, '#f5d0fe')}
      ${rect(8, 5, 2, 12, '#701a75')}
      ${rect(13, 5, 2, 12, '#701a75')}
      ${rect(18, 5, 2, 12, '#701a75')}
    </svg>`;
  }
}

function getConchSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18" shape-rendering="crispEdges">
    ${rect(4, 4, 14, 12, '#78350f')}
    ${rect(6, 5, 11, 10, '#b45309')}
    ${rect(8, 6, 8, 8, '#d97706')}
    ${rect(10, 7, 6, 6, '#f59e0b')}
    ${rect(12, 8, 4, 4, '#fef3c7')}
    ${rect(2, 6, 3, 5, '#78350f')}
    ${rect(3, 7, 2, 3, '#d97706')}
    ${rect(14, 8, 6, 7, '#78350f')}
    ${rect(15, 9, 4, 5, '#fbcfe8')}
    ${rect(16, 10, 2, 3, '#fdf2f8')}
  </svg>`;
}

function getCrabSvg(frame = 0) {
  const legOffset = frame % 2 === 1 ? 1 : -1;
  const clawY = frame % 2 === 1 ? -1 : 1;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" shape-rendering="crispEdges">
    ${rect(8, 6, 12, 8, '#881337')}
    ${rect(9, 7, 10, 6, '#e11d48')}
    ${rect(10, 8, 8, 4, '#fb7185')}
    ${rect(11, 9, 6, 2, '#fda4af')}
    ${rect(3, 3 + clawY, 5, 4, '#881337')}
    ${rect(4, 4 + clawY, 3, 3, '#e11d48')}
    ${rect(2, 2 + clawY, 2, 3, '#fb7185')}
    ${rect(6, 6 + clawY, 3, 2, '#881337')}
    ${rect(20, 3 - clawY, 5, 4, '#881337')}
    ${rect(21, 4 - clawY, 3, 3, '#e11d48')}
    ${rect(24, 2 - clawY, 2, 3, '#fb7185')}
    ${rect(19, 6 - clawY, 3, 2, '#881337')}
    ${rect(10, 3, 2, 3, '#881337')}
    ${rect(10, 2, 2, 2, '#0f172a')}
    ${rect(10, 2, 1, 1, '#ffffff')}
    ${rect(16, 3, 2, 3, '#881337')}
    ${rect(16, 2, 2, 2, '#0f172a')}
    ${rect(16, 2, 1, 1, '#ffffff')}
    ${rect(6, 13 + legOffset, 3, 3, '#9f1239')}
    ${rect(5, 15 + legOffset, 2, 2, '#e11d48')}
    ${rect(8, 14 - legOffset, 2, 3, '#9f1239')}
    ${rect(19, 13 - legOffset, 3, 3, '#9f1239')}
    ${rect(21, 15 - legOffset, 2, 2, '#e11d48')}
    ${rect(18, 14 + legOffset, 2, 3, '#9f1239')}
  </svg>`;
}

function svgToCanvas(svgString, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext('2d');
  c.imageSmoothingEnabled = false;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const rects = doc.querySelectorAll('rect');
  rects.forEach(r => {
    c.fillStyle = r.getAttribute('fill');
    c.fillRect(
      parseFloat(r.getAttribute('x')),
      parseFloat(r.getAttribute('y')),
      parseFloat(r.getAttribute('width')),
      parseFloat(r.getAttribute('height'))
    );
  });
  return canvas;
}

function initSvgSprites() {
  if (window.PIXEL_SPRITES) {
    STATE.svgSprites.blue_fish = window.PIXEL_SPRITES.blue_fish;
    STATE.svgSprites.pink_fish = window.PIXEL_SPRITES.pink_fish;
    STATE.svgSprites.clownfish = window.PIXEL_SPRITES.clownfish;
    STATE.svgSprites.yellow_tang = window.PIXEL_SPRITES.yellow_tang;
    STATE.svgSprites.dolphin = window.PIXEL_SPRITES.dolphin;
    STATE.svgSprites.jellyfish = window.PIXEL_SPRITES.jellyfish;
    STATE.svgSprites.coral_pink = window.PIXEL_SPRITES.coral;
    STATE.svgSprites.coral_purple = window.PIXEL_SPRITES.coral;
    STATE.svgSprites.coral_teal = window.PIXEL_SPRITES.coral;
    STATE.svgSprites.starfish = window.PIXEL_SPRITES.starfish;
    STATE.svgSprites.clam_open = window.PIXEL_SPRITES.clam_open;
    STATE.svgSprites.clam_closed = window.PIXEL_SPRITES.clam_closed;
    STATE.svgSprites.conch = window.PIXEL_SPRITES.conch;
    STATE.svgSprites.crab = window.PIXEL_SPRITES.crab;
    STATE.svgSprites.seahorse_gold = window.PIXEL_SPRITES.seahorse_gold;
    STATE.svgSprites.seahorse_pink = window.PIXEL_SPRITES.seahorse_pink;
    STATE.svgSprites.sea_turtle = window.PIXEL_SPRITES.sea_turtle;
    STATE.svgSprites.manta_ray = window.PIXEL_SPRITES.manta_ray;
    STATE.svgSprites.boxfish = window.PIXEL_SPRITES.boxfish;
    STATE.svgSprites.angelfish = window.PIXEL_SPRITES.angelfish;
    STATE.svgSprites.goby = window.PIXEL_SPRITES.goby;
    return;
  }

  STATE.svgSprites.blue_fish = [
    svgToCanvas(getBlueFishSvg(0), 32, 24),
    svgToCanvas(getBlueFishSvg(1), 32, 24),
    svgToCanvas(getBlueFishSvg(2), 32, 24),
    svgToCanvas(getBlueFishSvg(3), 32, 24)
  ];
  STATE.svgSprites.pink_fish = [
    svgToCanvas(getPinkFishSvg(0), 36, 28),
    svgToCanvas(getPinkFishSvg(1), 36, 28),
    svgToCanvas(getPinkFishSvg(2), 36, 28),
    svgToCanvas(getPinkFishSvg(3), 36, 28)
  ];
  STATE.svgSprites.clownfish = [
    svgToCanvas(getClownfishSvg(0), 34, 24),
    svgToCanvas(getClownfishSvg(1), 34, 24),
    svgToCanvas(getClownfishSvg(2), 34, 24),
    svgToCanvas(getClownfishSvg(3), 34, 24)
  ];
  STATE.svgSprites.yellow_tang = [
    svgToCanvas(getYellowTangSvg(0), 32, 30),
    svgToCanvas(getYellowTangSvg(1), 32, 30),
    svgToCanvas(getYellowTangSvg(2), 32, 30),
    svgToCanvas(getYellowTangSvg(3), 32, 30)
  ];
  STATE.svgSprites.dolphin = [
    svgToCanvas(getDolphinSvg(0), 46, 28),
    svgToCanvas(getDolphinSvg(1), 46, 28),
    svgToCanvas(getDolphinSvg(2), 46, 28),
    svgToCanvas(getDolphinSvg(3), 46, 28)
  ];
  STATE.svgSprites.jellyfish = [
    svgToCanvas(getJellyfishSvg(0), 32, 40),
    svgToCanvas(getJellyfishSvg(1), 32, 40),
    svgToCanvas(getJellyfishSvg(2), 32, 40)
  ];
  STATE.svgSprites.coral_pink = svgToCanvas(getPastelPinkCoralSvg(), 44, 48);
  STATE.svgSprites.coral_purple = svgToCanvas(getPurpleTubeCoralSvg(), 44, 48);
  STATE.svgSprites.coral_teal = svgToCanvas(getTealSpongeCoralSvg(), 44, 48);
  
  // Fauna Dasar Laut
  STATE.svgSprites.starfish = svgToCanvas(getStarfishSvg(), 24, 24);
  STATE.svgSprites.clam_open = svgToCanvas(getClamSvg(true), 28, 24);
  STATE.svgSprites.clam_closed = svgToCanvas(getClamSvg(false), 28, 20);
  STATE.svgSprites.conch = svgToCanvas(getConchSvg(), 22, 18);
  STATE.svgSprites.crab = [
    svgToCanvas(getCrabSvg(0), 28, 20),
    svgToCanvas(getCrabSvg(1), 28, 20)
  ];
}

initSvgSprites();

/* ============================================================================
   MODUL 2: SWAYING SEAWEED CLASS
   ============================================================================ */

class Seaweed {
  constructor(x, baseY, height, segments = 8) {
    this.x = x;
    this.baseY = baseY;
    this.height = height;
    this.segments = segments;
    this.segmentHeight = height / segments;
    this.swaySpeed = 0.0016 + Math.random() * 0.0008;
    this.swayAmp = 16 + Math.random() * 12;
    this.phaseOffset = Math.random() * Math.PI * 2;
    this.stemWidth = 5 + Math.floor(Math.random() * 3);
    this.colors = ['#14532d', '#16a34a', '#22c55e', '#4ade80'];
  }

  draw(c, time) {
    for (let i = 0; i < this.segments; i++) {
      const progress = (i + 1) / this.segments;
      const swayFactor = Math.pow(progress, 1.4);
      const sway = Math.sin(time * this.swaySpeed + this.phaseOffset + i * 0.3) * this.swayAmp * swayFactor;

      const nextX = this.x + sway;
      const nextY = this.baseY - (i + 1) * this.segmentHeight;

      c.fillStyle = this.colors[i % this.colors.length];
      const w = Math.max(3, Math.round(this.stemWidth * (1 - progress * 0.4)));
      c.fillRect(Math.round(nextX - w / 2), Math.round(nextY), w, Math.round(this.segmentHeight + 1));

      if (i > 1 && i % 2 === 0) {
        const leafDir = (i % 4 === 0) ? 1 : -1;
        const leafLen = Math.round(9 * (1 - progress * 0.3));
        c.fillStyle = this.colors[2];
        c.fillRect(
          Math.round(nextX + (leafDir === 1 ? w / 2 : -w / 2 - leafLen)),
          Math.round(nextY + 2),
          leafLen,
          4
        );
        c.fillStyle = this.colors[3];
        c.fillRect(
          Math.round(nextX + (leafDir === 1 ? w / 2 + 2 : -w / 2 - leafLen + 2)),
          Math.round(nextY + 3),
          Math.max(2, leafLen - 4),
          2
        );
      }
    }
  }
}

/* ============================================================================
   MODUL 3: ENHANCED RETRO SPLASH SCREEN
   ============================================================================ */

const SPLASH_LORE = [
  "Menjelajahi Terumbu Karang...",
  "Membangunkan Biota Laut...",
  "Menyiapkan Camilan Laut...",
  "Menyelaraskan Ekosistem...",
  "Siap Menyelam! 🌊"
];

function renderSplashScreen(timestamp) {
  if (!STATE.isSplashActive) return;

  if (!STATE.splashStartTime) STATE.splashStartTime = timestamp;
  const elapsed = timestamp - STATE.splashStartTime;
  const progress = Math.min(1, elapsed / STATE.splashDuration);

  const percent = Math.floor(progress * 100);
  const loreIndex = Math.min(SPLASH_LORE.length - 1, Math.floor(progress * SPLASH_LORE.length));
  
  if (dom.loadingBar) dom.loadingBar.style.width = `${percent}%`;
  if (dom.loadingText) dom.loadingText.textContent = `${SPLASH_LORE[loreIndex]} ${percent}%`;

  splashCtx.clearRect(0, 0, dom.splashCanvas.width, dom.splashCanvas.height);

  const centerX = dom.splashCanvas.width / 2;
  const centerY = dom.splashCanvas.height / 2;
  const radius = 78;
  const orbitSpeed = 2.4;
  const currentAngle = (elapsed / 1000) * orbitSpeed;

  // Orbit ring dengan efek pixel glow
  splashCtx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  splashCtx.lineWidth = 2;
  splashCtx.beginPath();
  splashCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  splashCtx.stroke();

  // Partikel stardust & gelembung mini di sekitar orbit
  if (Math.random() < 0.25) {
    const starAngle = Math.random() * Math.PI * 2;
    const starDist = radius + (Math.random() - 0.5) * 24;
    const sx = centerX + Math.cos(starAngle) * starDist;
    const sy = centerY + Math.sin(starAngle) * starDist;
    splashCtx.fillStyle = Math.random() < 0.5 ? '#fef08a' : '#bae6fd';
    splashCtx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
  }

  const fish1Angle = currentAngle;
  const fish2Angle = currentAngle + Math.PI;

  const fish1X = centerX + Math.cos(fish1Angle) * radius;
  const fish1Y = centerY + Math.sin(fish1Angle) * radius;

  const fish2X = centerX + Math.cos(fish2Angle) * radius;
  const fish2Y = centerY + Math.sin(fish2Angle) * radius;

  const wiggle1 = Math.sin(elapsed * 0.015) * 0.16;
  const wiggle2 = Math.sin(elapsed * 0.015 + Math.PI) * 0.16;

  const heading1 = fish1Angle - Math.PI / 2 + wiggle1;
  const heading2 = fish2Angle - Math.PI / 2 + wiggle2;

  const blueFrames = STATE.svgSprites.blue_fish;
  if (blueFrames) {
    const fIdx = Math.floor(elapsed * 0.008) % blueFrames.length;
    drawRotatedSprite(splashCtx, blueFrames[fIdx], fish1X, fish1Y, 70, 52, heading1, false);
  }

  const pinkFrames = STATE.svgSprites.pink_fish;
  if (pinkFrames) {
    const fIdx = Math.floor(elapsed * 0.008) % pinkFrames.length;
    drawRotatedSprite(splashCtx, pinkFrames[fIdx], fish2X, fish2Y, 76, 58, heading2, false);
  }

  if (elapsed >= STATE.splashDuration) {
    endSplashScreen();
    return;
  }

  requestAnimationFrame(renderSplashScreen);
}

function endSplashScreen() {
  if (!STATE.isSplashActive) return;
  STATE.isSplashActive = false;
  if (dom.splashScreen) {
    dom.splashScreen.classList.add('fade-out');
    setTimeout(() => {
      dom.splashScreen.style.display = 'none';
    }, 900);
  }
}

function drawRotatedSprite(c, img, x, y, width, height, angle, flipH = false) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.rotate(angle);
  c.scale(flipH ? -1 : 1, 1);
  c.drawImage(img, -width / 2, -height / 2, width, height);
  c.restore();
}

/* ============================================================================
   MODUL 4: FAUNA DASAR LAUT BARU (KEPITING, BINTANG LAUT, KERANG MUTIARA)
   ============================================================================ */

// Kepiting Mini yang Berjalan Menyamping di Pasir & Memungut Camilan di Dasar Laut
class MiniCrab {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = Math.random() < 0.5 ? 1 : -1;
    this.speed = 0.55 + Math.random() * 0.35;
    this.animTimer = 0;
    this.width = 38;
    this.height = 26;
    this.pauseTimer = 0;
  }

  update(width) {
    if (this.pauseTimer > 0) {
      this.pauseTimer--;
      return;
    }

    this.animTimer += 0.12;

    // Deteksi Camilan Laut yang jatuh di dekat pasir
    let closestPellet = null;
    let minD = 200;
    for (const p of STATE.pellets) {
      if (!p.isEaten && p.y > this.y - 85) {
        const dx = p.x - this.x;
        const dy = p.y - this.y;
        const d = Math.hypot(dx, dy);
        if (d < minD) {
          minD = d;
          closestPellet = p;
        }
      }
    }

    if (closestPellet) {
      const dx = closestPellet.x - this.x;
      if (Math.abs(dx) > 14) {
        this.direction = dx > 0 ? 1 : -1;
        this.x += this.direction * (this.speed * 1.4);
      } else {
        // Makan camilan laut di pasir!
        closestPellet.isEaten = true;
        this.pauseTimer = 75;
        spawnHappyHearts(this.x, this.y - 16);
        spawnFloatingText(this.x, this.y - 14, '🦀 Crunch!');
      }
    } else {
      this.x += this.direction * this.speed;

      // Kadang berhenti sejenak & mengapit capit
      if (Math.random() < 0.004) {
        this.pauseTimer = 60 + Math.random() * 90;
      }
    }

    // Berbalik arah di batas layar
    if (this.x < 60) {
      this.x = 60;
      this.direction = 1;
    } else if (this.x > width - 60) {
      this.x = width - 60;
      this.direction = -1;
    }
  }

  draw(c) {
    const frames = STATE.svgSprites.crab;
    if (!frames) return;
    const fIdx = Math.floor(this.animTimer) % frames.length;
    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));
    c.scale(this.direction, 1);
    c.drawImage(frames[fIdx], -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

// Kerang Mutiara yang Terbuka & Tertutup secara Berkala
class PearlClam {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.cycle = Math.random() * Math.PI * 2;
    this.width = 36;
    this.height = 30;
  }

  update() {
    this.cycle += 0.015;
    // Munculkan kilau mutiara sesekali saat terbuka
    if (Math.sin(this.cycle) > 0.5 && Math.random() < 0.08) {
      STATE.particles.push(new PixelParticle(
        this.x + (Math.random() - 0.5) * 10,
        this.y - 12,
        (Math.random() - 0.5) * 0.4,
        -Math.random() * 0.6,
        '#ffffff', 2, 28
      ));
    }
  }

  draw(c) {
    const isOpen = Math.sin(this.cycle) > -0.2;
    const sprite = isOpen ? STATE.svgSprites.clam_open : STATE.svgSprites.clam_closed;
    if (!sprite) return;
    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));
    c.drawImage(sprite, -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

/* ============================================================================
   MODUL 5: SISTEM RENDERING AKUARIUM & GELEMBUNG UDARA
   ============================================================================ */

class Bubble {
  constructor(canvasWidth, canvasHeight, startAtBottom = true) {
    this.x = Math.random() * canvasWidth;
    this.y = startAtBottom ? canvasHeight + 10 : Math.random() * canvasHeight;
    this.size = Math.floor(Math.random() * 4) * 2 + 3;
    this.speed = 0.8 + Math.random() * 1.4;
    this.wobbleSpeed = 0.03 + Math.random() * 0.04;
    this.wobbleAmplitude = 0.8 + Math.random() * 1.2;
    this.wobbleOffset = Math.random() * 100;
  }

  update(canvasWidth, canvasHeight) {
    this.y -= this.speed;
    this.x += Math.sin(this.y * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmplitude;

    if (this.y < 35) {
      spawnBubblePopParticles(this.x, 35);
      this.reset(canvasWidth, canvasHeight);
    }
  }

  reset(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight + 10 + Math.random() * 30;
    this.speed = 0.8 + Math.random() * 1.4;
  }

  draw(c) {
    drawPixelBubble(c, this.x, this.y, this.size);
  }
}

function drawPixelBubble(c, x, y, size) {
  const px = Math.round(x);
  const py = Math.round(y);
  const s = Math.round(size);

  c.fillStyle = 'rgba(255, 255, 255, 0.28)';
  c.fillRect(px - s / 2, py - s / 2, s, s);

  c.strokeStyle = 'rgba(186, 230, 253, 0.75)';
  c.lineWidth = 1;
  c.strokeRect(px - s / 2, py - s / 2, s, s);

  c.fillStyle = '#ffffff';
  c.fillRect(px - s / 2 + 1, py - s / 2 + 1, Math.max(1, Math.floor(s / 3)), Math.max(1, Math.floor(s / 3)));
}

function spawnBubblePopParticles(x, y) {
  for (let i = 0; i < 3; i++) {
    STATE.particles.push(new PixelParticle(x, y, (Math.random() - 0.5) * 1.5, -Math.random() * 1.2, '#e0f2fe', 2, 18));
  }
}

function setupSeabedDecorations(width, height) {
  STATE.seaweeds = [];
  STATE.corals = [];
  STATE.seabedFauna = [];

  const sandY = height - 48;

  // 1. Rumput Laut Hijau Subur
  const seaweedPositions = [
    { x: 35, h: 140 },
    { x: 75, h: 200 },
    { x: 140, h: 160 },
    { x: width * 0.24, h: 180 },
    { x: width * 0.38, h: 130 },
    { x: width * 0.44, h: 210 },
    { x: width * 0.54, h: 150 },
    { x: width * 0.68, h: 190 },
    { x: width * 0.74, h: 130 },
    { x: width * 0.84, h: 170 },
    { x: width - 85, h: 220 },
    { x: width - 40, h: 150 }
  ];

  seaweedPositions.forEach(pos => {
    STATE.seaweeds.push(new Seaweed(pos.x, sandY, pos.h, Math.floor(pos.h / 18)));
  });

  // 2. Karang & Batu Laut Cantik (Sesuai Referensi Gambar)
  STATE.corals = [
    { type: 'coral_pink', x: 100, w: 78, h: 98, flip: 1, swayOffset: 0.2 },
    { type: 'coral_purple', x: 210, w: 72, h: 90, flip: -1, swayOffset: 0.8 },
    { type: 'coral_teal', x: width * 0.35, w: 82, h: 104, flip: 1, swayOffset: 1.4 },
    { type: 'coral_pink', x: width * 0.50, w: 76, h: 96, flip: -1, swayOffset: 2.1 },
    { type: 'coral_purple', x: width * 0.65, w: 80, h: 100, flip: 1, swayOffset: 2.7 },
    { type: 'coral_teal', x: width * 0.80, w: 74, h: 94, flip: -1, swayOffset: 3.3 },
    { type: 'coral_pink', x: width - 110, w: 82, h: 104, flip: -1, swayOffset: 3.9 }
  ];

  // 3. Fauna Dasar Laut: Kepiting, Bintang Laut, Kerang Mutiara, dan Keong
  // Dua Kepiting Mini berjalan menyamping
  STATE.seabedFauna.push(new MiniCrab(width * 0.25, height - 24));
  STATE.seabedFauna.push(new MiniCrab(width * 0.70, height - 24));

  // Kerang Mutiara Bercahaya
  STATE.seabedFauna.push(new PearlClam(width * 0.40, height - 26));
  STATE.seabedFauna.push(new PearlClam(width * 0.85, height - 26));

  // Bintang Laut & Keong di Pasir (Static/Breathing Fauna)
  STATE.staticFauna = [
    { type: 'starfish', x: 150, y: height - 22, w: 32, h: 32, rot: 0.2 },
    { type: 'starfish', x: width * 0.58, y: height - 24, w: 28, h: 28, rot: -0.4 },
    { type: 'conch', x: width * 0.16, y: height - 20, w: 26, h: 22, rot: 0.1 },
    { type: 'conch', x: width - 160, y: height - 20, w: 28, h: 24, rot: -0.3 }
  ];
}

function drawAquariumEnvironment(c, width, height, time) {
  // 1. Gradasi Latar Belakang Laut Tropis Terang & Vibrant (Tropical Ocean Blue)
  const oceanGrad = c.createLinearGradient(0, 0, 0, height);
  // Permukaan Atas: aquamarine/cyan bercahaya matahari (#38bdf8 to #0ea5e9)
  oceanGrad.addColorStop(0, '#38bdf8');
  oceanGrad.addColorStop(0.20, '#0ea5e9');
  // Kedalaman Tengah: cerulean blue jernih dan luminous (#0284c7 to #0369a1)
  oceanGrad.addColorStop(0.48, '#0284c7');
  oceanGrad.addColorStop(0.72, '#0369a1');
  // Dasar Laut Bawah: deep marine blue pekat (#07457a to #06284a) yang membuat karang dan pasir menonjol
  oceanGrad.addColorStop(0.88, '#07457a');
  oceanGrad.addColorStop(1.0, '#06284a');
  c.fillStyle = oceanGrad;
  c.fillRect(0, 0, width, height);

  // 2. Berkas Sinar Cahaya Bawah Air Bersinar (Radiant God Rays)
  c.save();
  for (let i = 0; i < 5; i++) {
    const rx = (width / 6) * (i + 1) + Math.sin(time * 0.00075 + i * 1.35) * 40;
    const topW = 26 + Math.sin(time * 0.0012 + i) * 8;
    const bottomW = 125 + Math.cos(time * 0.0009 + i) * 22;

    const rayGrad = c.createLinearGradient(rx, 0, rx + 45, height * 0.85);
    rayGrad.addColorStop(0, 'rgba(240, 249, 255, 0.22)');
    rayGrad.addColorStop(0.25, 'rgba(186, 230, 253, 0.16)');
    rayGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.07)');
    rayGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

    c.fillStyle = rayGrad;
    c.beginPath();
    c.moveTo(rx - topW * 0.5, 0);
    c.lineTo(rx + topW * 0.5, 0);
    c.lineTo(rx + bottomW * 0.65, height * 0.85);
    c.lineTo(rx - bottomW * 0.35, height * 0.85);
    c.closePath();
    c.fill();
  }
  c.restore();

  // 2b. Riak Air & Kaustik Cahaya Permukaan (Soft Caustic Water Ripples)
  c.save();
  for (let row = 0; row < 3; row++) {
    const yBase = 8 + row * 14;
    c.strokeStyle = row === 0 ? 'rgba(255, 255, 255, 0.28)' : 'rgba(224, 242, 254, 0.18)';
    c.lineWidth = 2 - row * 0.4;
    c.beginPath();
    for (let x = 0; x <= width + 20; x += 20) {
      const yWave = yBase + Math.sin(x * 0.018 + time * 0.0022 + row * 1.8) * 3.5
                          + Math.cos(x * 0.032 - time * 0.0018) * 2;
      if (x === 0) c.moveTo(x, yWave);
      else c.lineTo(x, yWave);
    }
    c.stroke();
  }

  // Pola pantulan kaustik lembut di lapisan atas
  c.fillStyle = 'rgba(255, 255, 255, 0.07)';
  for (let i = 0; i < 7; i++) {
    const cx = ((time * 0.035 + i * (width / 6.5)) % (width + 120)) - 60;
    const cy = 16 + Math.sin(time * 0.002 + i * 2) * 8;
    const rw = 36 + Math.sin(time * 0.0025 + i * 12);
    const rh = 7 + Math.cos(time * 0.003 + i) * 2.5;
    c.beginPath();
    c.ellipse(cx, cy, Math.max(10, rw), Math.max(3, rh), 0, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();

  // 3. Render Rumput Laut
  for (const seaweed of STATE.seaweeds) {
    seaweed.draw(c, time);
  }

  // 4. Render Karang Pastel Cantik
  for (const coral of STATE.corals) {
    const sprite = STATE.svgSprites[coral.type];
    if (sprite) {
      const sway = Math.sin(time * 0.0016 + coral.swayOffset) * 0.04;
      c.save();
      c.translate(coral.x, height - 38);
      c.scale(coral.flip, 1);
      c.rotate(sway);
      c.drawImage(sprite, -coral.w / 2, -coral.h, coral.w, coral.h);
      c.restore();
    }
  }

  // 5. Hamparan Dasar Pasir Pixel
  const sandHeight = 58;
  const sandY = height - sandHeight;

  c.fillStyle = '#92734f';
  c.fillRect(0, sandY, width, sandHeight);
  c.fillStyle = '#b69263';
  c.fillRect(0, sandY - 6, width, 6);

  c.fillStyle = '#785b37';
  for (let x = 0; x < width; x += 18) {
    const h = (x % 36 === 0) ? 4 : 2;
    c.fillRect(x, sandY - 4, 12, h);
    c.fillRect(x + 6, height - 18, 8, 4);
  }

  // 6. Render Bintang Laut & Keong di Pasir
  if (STATE.staticFauna) {
    for (const f of STATE.staticFauna) {
      const sprite = STATE.svgSprites[f.type];
      if (sprite) {
        c.save();
        c.translate(f.x, f.y);
        c.rotate(f.rot);
        c.drawImage(sprite, -f.w / 2, -f.h / 2, f.w, f.h);
        c.restore();
      }
    }
  }

  // 7. Update & Render Fauna Bergerak di Dasar Laut (Kepiting, Kerang Mutiara)
  for (const fauna of STATE.seabedFauna) {
    fauna.update(width);
    fauna.draw(c);
  }
}

/* ============================================================================
   MODUL 6: CLASS BIOTA LAUT (IKAN, UBUR-UBUR, LUMBA-LUMBA)
   ============================================================================ */

class Fish {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.facing = 1;
    this.tilt = 0;
    this.wigglePhase = Math.random() * 10;
    this.happyTimer = 0;
    this.animFrame = 0;

    this.wanderTargetX = x;
    this.wanderTargetY = y;
    this.wanderTimer = 0;

    if (type === 'blue') {
      this.spriteKey = 'blue_fish';
      this.width = 84;
      this.height = 64;
      this.maxSpeed = 3.9;
      this.agility = 0.048;
      this.wiggleSpeed = 0.16;
      this.cursorOffsetAngle = 0;
    } else if (type === 'pink') {
      this.spriteKey = 'pink_fish';
      this.width = 110;
      this.height = 76;
      this.maxSpeed = 3.3;
      this.agility = 0.040;
      this.wiggleSpeed = 0.13;
      this.cursorOffsetAngle = Math.PI * 0.5;
    } else if (type === 'clownfish') {
      this.spriteKey = 'clownfish';
      this.width = 78;
      this.height = 55;
      this.maxSpeed = 4.2;
      this.agility = 0.056;
      this.wiggleSpeed = 0.20;
      this.cursorOffsetAngle = Math.PI;
    } else if (type === 'yellow_tang') {
      this.spriteKey = 'yellow_tang';
      this.width = 76;
      this.height = 72;
      this.maxSpeed = 3.5;
      this.agility = 0.044;
      this.wiggleSpeed = 0.14;
      this.cursorOffsetAngle = Math.PI * 1.5;
    } else if (type === 'boxfish') {
      this.spriteKey = 'boxfish';
      this.width = 68;
      this.height = 54;
      this.maxSpeed = 3.6;
      this.agility = 0.052;
      this.wiggleSpeed = 0.22;
      this.cursorOffsetAngle = Math.PI * 0.25;
    } else if (type === 'angelfish') {
      this.spriteKey = 'angelfish';
      this.width = 84;
      this.height = 76;
      this.maxSpeed = 3.4;
      this.agility = 0.046;
      this.wiggleSpeed = 0.14;
      this.cursorOffsetAngle = Math.PI * 0.75;
    }

    this.eatRadius = this.width * 0.48;
    this.stuckNearPelletTimer = 0;
    this.stuckPelletRef = null;
  }

  update(width, height) {
    this.wigglePhase += this.wiggleSpeed;
    if (this.happyTimer > 0) this.happyTimer--;

    this.animFrame = Math.floor(this.wigglePhase * 0.8) % 4;

    let targetX = this.x;
    let targetY = this.y;
    let isTrackingCursor = false;

    // 1. PRIORITAS UTAMA: CAMILAN LAUT
    let closestPellet = null;
    let minDistance = Infinity;

    for (const pellet of STATE.pellets) {
      if (!pellet.isEaten) {
        const d = Math.hypot(pellet.x - this.x, pellet.y - this.y);
        if (d < minDistance) {
          minDistance = d;
          closestPellet = pellet;
        }
      }
    }

    if (closestPellet) {
      targetX = closestPellet.x;
      targetY = closestPellet.y;

      const effectiveRadius = closestPellet.getEffectiveEatRadius
        ? closestPellet.getEffectiveEatRadius(this.eatRadius)
        : (closestPellet.settled ? Math.max(this.eatRadius + 24, 60) : this.eatRadius);

      // Anti-stuck watchdog: jika ikan berada dalam jarak 65px dari pelet yang mendarat selama > 120 frame (~2s),
      // otomatis santap agar tidak tertahan dan bisa segera kembali berenang bebas
      if (closestPellet.settled && minDistance <= 65) {
        if (this.stuckPelletRef === closestPellet) {
          this.stuckNearPelletTimer++;
        } else {
          this.stuckPelletRef = closestPellet;
          this.stuckNearPelletTimer = 1;
        }

        if (this.stuckNearPelletTimer >= 120) {
          closestPellet.isEaten = true;
          this.happyTimer = 50;
          this.stuckNearPelletTimer = 0;
          this.stuckPelletRef = null;
          this.wanderTimer = 0;
          spawnHappyHearts(this.x, this.y - this.height * 0.4);
          spawnFloatingText(this.x, this.y - 18, Math.random() < 0.5 ? '+Yum! 🍤' : 'Nom! ✨');
          this.vx *= 1.4;
          this.vy = -1.5;
        }
      } else {
        this.stuckNearPelletTimer = 0;
        this.stuckPelletRef = null;
      }

      if (!closestPellet.isEaten && minDistance < effectiveRadius) {
        closestPellet.isEaten = true;
        this.happyTimer = 50;
        this.stuckNearPelletTimer = 0;
        this.stuckPelletRef = null;
        this.wanderTimer = 0;
        spawnHappyHearts(this.x, this.y - this.height * 0.4);
        spawnFloatingText(this.x, this.y - 18, Math.random() < 0.5 ? '+Yum! 🍤' : 'Nom! ✨');
        this.vx *= 1.4;
        this.vy = -1.2;
      }
    } else if (STATE.mouse.isInside && STATE.mouse.isActive) {
      this.stuckNearPelletTimer = 0;
      this.stuckPelletRef = null;
      // 2. KURSOR AKTIF BERGERAK
      isTrackingCursor = true;
      const followRadius = 48;
      const angle = this.cursorOffsetAngle + this.wigglePhase * 0.2;
      targetX = STATE.mouse.x + Math.cos(angle) * followRadius;
      targetY = STATE.mouse.y + Math.sin(angle) * (followRadius * 0.6);
    } else {
      // 3. KURSOR DIAM (WANDERING BEBAS)
      this.wanderTimer--;
      const distToWander = Math.hypot(this.wanderTargetX - this.x, this.wanderTargetY - this.y);

      if (this.wanderTimer <= 0 || distToWander < 60) {
        let preferredYMin = 90;
        let preferredYMax = height - 120;

        if (this.type === 'clownfish') {
          preferredYMin = height * 0.45;
        } else if (this.type === 'yellow_tang') {
          preferredYMax = height * 0.65;
        } else if (this.type === 'angelfish') {
          preferredYMin = height * 0.20;
          preferredYMax = height * 0.65;
        }

        this.wanderTargetX = 70 + Math.random() * (width - 140);
        this.wanderTargetY = preferredYMin + Math.random() * (preferredYMax - preferredYMin);
        this.wanderTimer = 180 + Math.floor(Math.random() * 200);
      }

      targetX = this.wanderTargetX + Math.sin(this.wigglePhase * 0.3) * 35;
      targetY = this.wanderTargetY + Math.cos(this.wigglePhase * 0.25) * 25;
    }

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    const speedBoost = closestPellet ? 1.35 : (this.happyTimer > 0 ? 1.45 : 1.0);
    const speedLimit = isTrackingCursor ? this.maxSpeed : this.maxSpeed * 0.72;
    const speed = Math.min(speedLimit * speedBoost, dist * 0.055);

    if (dist > 10) {
      const angle = Math.atan2(dy, dx);
      const desiredVx = Math.cos(angle) * speed;
      const desiredVy = Math.sin(angle) * speed;

      this.vx += (desiredVx - this.vx) * this.agility;
      this.vy += (desiredVy - this.vy) * this.agility;
    } else {
      this.vx *= 0.90;
      this.vy *= 0.90;
    }

    // BOIDS SEPARATION FORCE
    for (const other of STATE.creatures) {
      if (other !== this && other instanceof Fish) {
        const sDx = this.x - other.x;
        const sDy = this.y - other.y;
        const sDist = Math.hypot(sDx, sDy);
        const minSeparation = (this.width + other.width) * 0.44;

        if (sDist > 0 && sDist < minSeparation) {
          const pushForce = (1 - sDist / minSeparation) * 0.42;
          this.vx += (sDx / sDist) * pushForce;
          this.vy += (sDy / sDist) * pushForce;
        }
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    this.x = Math.max(55, Math.min(width - 55, this.x));
    this.y = Math.max(65, Math.min(height - 52, this.y));

    if (this.vx > 0.15) {
      this.facing = -1;
    } else if (this.vx < -0.15) {
      this.facing = 1;
    }

    const verticalPitch = Math.atan2(this.vy, Math.abs(this.vx) + 0.5) * 0.45;
    const targetTilt = this.facing === 1 ? -verticalPitch : verticalPitch;
    this.tilt += (targetTilt - this.tilt) * 0.1;
  }

  draw(c) {
    const frames = STATE.svgSprites[this.spriteKey];
    if (!frames || frames.length === 0) return;

    const frameImg = frames[this.animFrame % frames.length];
    const subtleSquash = 1 + Math.sin(this.wigglePhase * 1.5) * 0.04;

    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));
    c.scale(this.facing, 1);
    c.rotate(this.tilt);

    if (this.happyTimer > 0) {
      c.shadowColor = '#f472b6';
      c.shadowBlur = 18;
    }

    c.scale(1, subtleSquash);
    c.drawImage(frameImg, -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

/* ============================================================================
   MODUL 6.5: SPESIES BARU - KUDA LAUT, PENYU LAUT, & IKAN PARI MANTA
   ============================================================================ */

// 1. Kuda Laut (Seahorse) - Gerakan Mengapung Tegak & Sirip Cepat
class Seahorse {
  constructor(variant = 'gold', x, y) {
    this.variant = variant;
    this.spriteKey = variant === 'gold' ? 'seahorse_gold' : 'seahorse_pink';
    this.x = x;
    this.baseX = x;
    this.y = y;
    this.baseY = y;
    this.targetX = x;
    this.targetY = y;
    this.facing = Math.random() < 0.5 ? 1 : -1;
    this.bobPhase = Math.random() * Math.PI * 2;
    this.animTimer = Math.random() * 10;
    this.width = 46;
    this.height = 68;
    this.tilt = 0;
    this.driftTimer = 0;
    this.vx = 0;
    this.vy = 0;
  }

  update(width, height) {
    this.bobPhase += 0.04;
    this.animTimer += 0.22;

    const bob = Math.sin(this.bobPhase) * 0.7;

    this.driftTimer--;
    if (this.driftTimer <= 0) {
      this.driftTimer = 140 + Math.random() * 180;
      this.targetX = this.baseX + (Math.random() - 0.5) * 130;
      this.targetY = this.baseY + (Math.random() - 0.5) * 80;
    }

    let closestPellet = null;
    let minD = 200;
    for (const p of STATE.pellets) {
      if (!p.isEaten) {
        const d = Math.hypot(p.x - this.x, p.y - this.y);
        if (d < minD) { minD = d; closestPellet = p; }
      }
    }

    let destX = this.targetX;
    let destY = this.targetY;
    if (closestPellet) {
      destX = closestPellet.x;
      destY = closestPellet.y;
      const effectiveEatRadius = closestPellet.getEffectiveEatRadius ? closestPellet.getEffectiveEatRadius(32) : (closestPellet.settled ? 52 : 32);
      if (minD < effectiveEatRadius) {
        closestPellet.isEaten = true;
        spawnHappyHearts(this.x, this.y - 30);
        spawnFloatingText(this.x, this.y - 20, 'Nom! 🍤');
        this.driftTimer = 0;
      }
    }

    const dx = destX - this.x;
    const dy = destY - this.y;
    this.vx += (dx * 0.009 - this.vx) * 0.06;
    this.vy += (dy * 0.009 + bob - this.vy) * 0.06;

    this.x += this.vx;
    this.y += this.vy;

    this.x = Math.max(45, Math.min(width - 45, this.x));
    this.y = Math.max(70, Math.min(height - 75, this.y));

    if (this.vx > 0.12) this.facing = -1;
    else if (this.vx < -0.12) this.facing = 1;

    const targetTilt = this.facing === 1 ? -this.vx * 0.14 : this.vx * 0.14;
    this.tilt += (targetTilt - this.tilt) * 0.1;
  }

  draw(c) {
    const frames = STATE.svgSprites[this.spriteKey];
    if (!frames || frames.length === 0) return;
    const fIdx = Math.floor(this.animTimer) % frames.length;

    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));
    c.scale(this.facing, 1);
    c.rotate(this.tilt);
    c.drawImage(frames[fIdx], -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

// 2. Penyu Laut (Sea Turtle) - Berenang Anggun Mengayuh Sirip Dayung
class SeaTurtle {
  constructor(x, y, direction = 1) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 1.4;
    this.vx = direction * this.speed;
    this.vy = 0;
    this.swimPhase = Math.random() * Math.PI * 2;
    this.width = 82;
    this.height = 60;
    this.pitch = 0;
    this.happyTimer = 0;
  }

  update(width, height) {
    this.swimPhase += 0.032;
    if (this.happyTimer > 0) this.happyTimer--;

    const targetVy = Math.sin(this.swimPhase) * 0.75;
    this.vy += (targetVy - this.vy) * 0.08;

    let closestPellet = null;
    let minD = 230;
    for (const p of STATE.pellets) {
      if (!p.isEaten) {
        const d = Math.hypot(p.x - this.x, p.y - this.y);
        if (d < minD) { minD = d; closestPellet = p; }
      }
    }

    if (closestPellet) {
      const pAngle = Math.atan2(closestPellet.y - this.y, closestPellet.x - this.x);
      this.vx += (Math.cos(pAngle) * 2.0 - this.vx) * 0.045;
      this.vy += (Math.sin(pAngle) * 2.0 - this.vy) * 0.045;
      const effectiveEatRadius = closestPellet.getEffectiveEatRadius ? closestPellet.getEffectiveEatRadius(42) : (closestPellet.settled ? 62 : 42);
      if (minD < effectiveEatRadius) {
        closestPellet.isEaten = true;
        this.happyTimer = 60;
        spawnHappyHearts(this.x, this.y - 25);
        spawnFloatingText(this.x, this.y - 18, 'Yummy! 🐢');
      }
    } else {
      this.vx = this.direction * this.speed;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.vx > 0.15) this.direction = 1;
    else if (this.vx < -0.15) this.direction = -1;

    const targetPitch = Math.atan2(this.vy, Math.abs(this.vx)) * 0.42;
    this.pitch += (targetPitch - this.pitch) * 0.1;

    if (this.direction === 1 && this.x > width + 110) {
      this.direction = -1;
      this.x = width + 100;
      this.y = 80 + Math.random() * (height * 0.45);
    } else if (this.direction === -1 && this.x < -110) {
      this.direction = 1;
      this.x = -100;
      this.y = 80 + Math.random() * (height * 0.45);
    }
  }

  draw(c) {
    const frames = STATE.svgSprites.sea_turtle;
    if (!frames || frames.length === 0) return;
    const fIdx = Math.floor(this.swimPhase * 1.5) % frames.length;

    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));
    if (this.direction === 1) {
      c.rotate(this.pitch);
      c.scale(-1, 1);
    } else {
      c.rotate(-this.pitch);
      c.scale(1, 1);
    }
    c.drawImage(frames[fIdx], -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

// 3. Ikan Pari Manta (Manta Ray) - Meluncur Tenang dengan Kepakan Sayap
class MantaRay {
  constructor(x, y, direction = 1) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 1.9;
    this.vx = direction * this.speed;
    this.vy = 0;
    this.glidePhase = Math.random() * Math.PI * 2;
    this.width = 92;
    this.height = 62;
    this.pitch = 0;
  }

  update(width, height) {
    this.glidePhase += 0.036;
    const targetVy = Math.sin(this.glidePhase) * 1.15;
    this.vy += (targetVy - this.vy) * 0.08;
    this.vx = this.direction * this.speed;

    this.x += this.vx;
    this.y += this.vy;

    const targetPitch = Math.atan2(this.vy, Math.abs(this.vx)) * 0.35;
    this.pitch += (targetPitch - this.pitch) * 0.1;

    if (this.direction === 1 && this.x > width + 130) {
      this.direction = -1;
      this.x = width + 120;
      this.y = height * 0.32 + Math.random() * (height * 0.38);
    } else if (this.direction === -1 && this.x < -130) {
      this.direction = 1;
      this.x = -120;
      this.y = height * 0.32 + Math.random() * (height * 0.38);
    }
  }

  draw(c) {
    const frames = STATE.svgSprites.manta_ray;
    if (!frames || frames.length === 0) return;
    const fIdx = Math.floor(this.glidePhase * 1.8) % frames.length;

    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));
    if (this.direction === 1) {
      c.rotate(this.pitch);
      c.scale(-1, 1);
    } else {
      c.rotate(-this.pitch);
      c.scale(1, 1);
    }
    c.drawImage(frames[fIdx], -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

class Jellyfish {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = 0;
    this.pulseTimer = Math.random() * Math.PI * 2;
    this.width = 72;
    this.height = 86;
    this.frameIndex = 0;
  }

  update(width, height) {
    this.pulseTimer += 0.035;

    const pulseCycle = Math.sin(this.pulseTimer);
    if (pulseCycle > 0.7) {
      this.vy -= 0.085;
      this.frameIndex = 0;
    } else if (pulseCycle > 0.2) {
      this.vy += 0.015;
      this.frameIndex = 1;
    } else {
      this.vy += 0.025;
      this.frameIndex = 2;
    }

    this.vy = Math.max(-1.4, Math.min(0.65, this.vy));

    this.x += Math.sin(this.pulseTimer * 0.5) * 0.45 + this.vx;
    this.y += this.vy;

    if (this.y < 80) {
      this.y = 80;
      this.vy = 0.2;
    }
    if (this.y > height - 120) {
      this.y = height - 120;
      this.vy = -0.8;
    }
    if (this.x < 50 || this.x > width - 50) {
      this.vx *= -1;
    }
  }

  draw(c) {
    const frames = STATE.svgSprites.jellyfish;
    if (!frames || frames.length === 0) return;

    const frameImg = frames[this.frameIndex % frames.length];

    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));
    c.globalAlpha = 0.90;
    c.shadowColor = '#38bdf8';
    c.shadowBlur = 10;
    c.drawImage(frameImg, -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

class Dolphin {
  constructor(x, y, direction = 1) {
    this.x = x;
    this.baseY = y;
    this.y = y;
    this.direction = direction;
    this.speed = 2.4;
    this.vx = this.direction * this.speed;
    this.vy = 0;
    this.wavePhase = Math.random() * Math.PI * 2;
    this.waveFrequency = 0.024;
    this.verticalMaxSpeed = 1.6;
    this.pitch = 0;
    this.width = 126;
    this.height = 82;
    this.animFrame = 0;
  }

  update(width, height) {
    this.wavePhase += this.waveFrequency;

    const normalizedPhase = ((this.wavePhase % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
    this.animFrame = Math.floor((normalizedPhase / (Math.PI * 2)) * 4) % 4;

    const targetVy = Math.sin(this.wavePhase) * this.verticalMaxSpeed;

    let boundaryCorrection = 0;
    if (this.y < 85) {
      boundaryCorrection = 0.6;
    } else if (this.y > height * 0.62) {
      boundaryCorrection = -0.6;
    }

    this.vy += (targetVy + boundaryCorrection - this.vy) * 0.12;
    this.vx = this.direction * this.speed;

    this.x += this.vx;
    this.y += this.vy;

    // Jejak partikel gelembung renang (Fluke Bubble Wake)
    if (Math.random() < 0.20) {
      const tailX = this.x - this.direction * (this.width * 0.42);
      const tailY = this.y + (this.animFrame === 1 ? 4 : -2);
      STATE.particles.push(new PixelParticle(
        tailX, tailY,
        -this.direction * 0.6 + (Math.random() - 0.5) * 0.4,
        -Math.random() * 0.5,
        '#bae6fd', 3, 24
      ));
    }

    // Semburan napas lubang lumba-lumba jika dekat permukaan (Blowhole Mist)
    if (this.y < 105 && Math.random() < 0.04) {
      const blowX = this.x - this.direction * 12;
      for (let i = 0; i < 3; i++) {
        STATE.particles.push(new PixelParticle(
          blowX, this.y - 14,
          (Math.random() - 0.5) * 0.8,
          -1.2 - Math.random() * 0.8,
          '#e0f2fe', 2, 20
        ));
      }
    }

    const targetPitch = Math.atan2(this.vy, Math.abs(this.vx));
    const clampedTargetPitch = Math.max(-0.48, Math.min(0.48, targetPitch));
    this.pitch += (clampedTargetPitch - this.pitch) * 0.14;

    if (this.direction === 1 && this.x > width + 130) {
      this.direction = -1;
      this.baseY = 95 + Math.random() * (height * 0.40);
      this.y = this.baseY;
      this.wavePhase = Math.PI * 0.5;
    } else if (this.direction === -1 && this.x < -130) {
      this.direction = 1;
      this.baseY = 95 + Math.random() * (height * 0.40);
      this.y = this.baseY;
      this.wavePhase = Math.PI * 1.5;
    }
  }

  draw(c) {
    const frames = STATE.svgSprites.dolphin;
    if (!frames || frames.length === 0) return;

    const frameImg = frames[this.animFrame % frames.length];

    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));

    if (this.direction === 1) {
      c.rotate(this.pitch);
      c.scale(-1, 1);
    } else {
      c.rotate(-this.pitch);
      c.scale(1, 1);
    }

    c.drawImage(frameImg, -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

// 5. Ikan Goby (Neon Blue Watchman Goby) - Penjaga Pasir Dasar Laut yang Melompat Lincah
class Goby {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.vx = 0;
    this.vy = 0;
    this.facing = Math.random() < 0.5 ? 1 : -1;
    this.width = 76;
    this.height = 44;
    this.animFrame = 0;
    this.animTimer = 0;
    this.state = 'perched'; // 'perched' | 'hopping'
    this.perchTimer = 90 + Math.random() * 120;
    this.hopTimer = 0;
    this.happyTimer = 0;
  }

  update(width, height) {
    const sandLevel = height - 36;
    if (this.happyTimer > 0) this.happyTimer--;

    // 1. Cek Camilan Laut di sekitar pasir
    let closestPellet = null;
    let minD = 240;
    for (const p of STATE.pellets) {
      if (!p.isEaten && p.y > height - 90) {
        const d = Math.hypot(p.x - this.x, p.y - this.y);
        if (d < minD) {
          minD = d;
          closestPellet = p;
        }
      }
    }

    if (this.state === 'perched') {
      this.vx *= 0.8;
      this.vy = 0;
      this.y += (sandLevel - this.y) * 0.15;
      this.animTimer += 0.05;
      this.animFrame = Math.floor(this.animTimer) % 2;

      if (closestPellet) {
        const dx = closestPellet.x - this.x;
        this.facing = dx > 0 ? -1 : 1;
        this.state = 'hopping';
        this.hopTimer = 24;
        const jumpDir = dx > 0 ? 1 : -1;
        this.vx = jumpDir * Math.min(3.6, Math.max(1.8, Math.abs(dx) * 0.07));
        this.vy = -2.6;
      } else {
        this.perchTimer--;
        if (this.perchTimer <= 0) {
          this.state = 'hopping';
          this.hopTimer = 20 + Math.floor(Math.random() * 15);
          if (Math.random() < 0.4) this.facing = -this.facing;
          const jumpDir = this.facing === -1 ? 1 : -1;
          this.vx = jumpDir * (1.8 + Math.random() * 1.5);
          this.vy = -(1.8 + Math.random() * 1.4);
          this.perchTimer = 100 + Math.random() * 160;
        }
      }
    } else if (this.state === 'hopping') {
      this.animTimer += 0.22;
      this.animFrame = 2 + (Math.floor(this.animTimer) % 2);
      this.vy += 0.20; // Gravitasi air
      this.x += this.vx;
      this.y += this.vy;

      if (this.y >= sandLevel) {
        this.y = sandLevel;
        this.vy = 0;
        this.vx *= 0.5;
        this.hopTimer--;
        if (this.hopTimer <= 0) {
          this.state = 'perched';
        }
      }
    }

    // Makan camilan jika dekat
    if (closestPellet) {
      const d = Math.hypot(closestPellet.x - this.x, closestPellet.y - this.y);
      const effectiveEatRadius = closestPellet.getEffectiveEatRadius ? closestPellet.getEffectiveEatRadius(36) : (closestPellet.settled ? 54 : 36);
      if (d < effectiveEatRadius) {
        closestPellet.isEaten = true;
        this.happyTimer = 55;
        this.state = 'perched';
        this.perchTimer = 90;
        spawnHappyHearts(this.x, this.y - 20);
        spawnFloatingText(this.x, this.y - 16, 'Nom! 🐟');
      }
    }

    // Batas tepi layar
    if (this.x < 70) {
      this.x = 70;
      this.vx = Math.abs(this.vx);
      this.facing = -1;
    } else if (this.x > width - 70) {
      this.x = width - 70;
      this.vx = -Math.abs(this.vx);
      this.facing = 1;
    }
  }

  draw(c) {
    const frames = STATE.svgSprites.goby;
    if (!frames || frames.length === 0) return;
    const fIdx = this.animFrame % frames.length;

    c.save();
    c.translate(Math.round(this.x), Math.round(this.y));
    c.scale(this.facing, 1);

    if (this.happyTimer > 0) {
      c.shadowColor = '#38bdf8';
      c.shadowBlur = 14;
    }

    c.drawImage(frames[fIdx], -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

/* ============================================================================
   MODUL 7: CAMILAN LAUT (PENGGANTI PELET), PARTIKEL, & FLOATING TEXTS
   ============================================================================ */

class CamilanLaut {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = 0.3;
    this.size = 7;
    this.wobbleOffset = Math.random() * 10;
    this.isEaten = false;
    this.settled = false;
    this.life = 360;
  }

  getEffectiveEatRadius(creatureEatRadius = 35) {
    return this.settled ? Math.max(creatureEatRadius + 24, 60) : creatureEatRadius;
  }

  update(height) {
    if (this.settled) {
      this.life--;
      return;
    }

    this.vy = Math.min(1.4, this.vy + 0.025);
    this.y += this.vy;
    this.x += Math.sin(this.y * 0.1 + this.wobbleOffset) * 0.35;

    const seabedLevel = height - 50;
    if (this.y >= seabedLevel) {
      this.y = seabedLevel;
      this.settled = true;
    }
  }

  draw(c) {
    if (this.isEaten) return;

    const alpha = this.settled ? Math.min(1, this.life / 60) : 1;
    c.save();
    c.globalAlpha = alpha;

    // Camilan Laut Pixel Keemasan Bercahaya
    c.fillStyle = '#f59e0b';
    c.fillRect(Math.round(this.x) - 3, Math.round(this.y) - 3, 7, 7);
    c.fillStyle = '#fef08a';
    c.fillRect(Math.round(this.x) - 2, Math.round(this.y) - 2, 4, 4);
    c.fillStyle = '#b45309';
    c.strokeRect(Math.round(this.x) - 3, Math.round(this.y) - 3, 7, 7);

    c.restore();
  }
}

class FloatingText {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.vy = -1.0;
    this.life = 45;
    this.maxLife = 45;
  }

  update() {
    this.y += this.vy;
    this.life--;
  }

  draw(c) {
    if (this.life <= 0) return;
    c.save();
    c.globalAlpha = this.life / this.maxLife;
    c.font = '10px "Press Start 2P", monospace';
    c.fillStyle = '#fef08a';
    c.shadowColor = '#b45309';
    c.shadowBlur = 4;
    c.fillText(this.text, Math.round(this.x - 18), Math.round(this.y));
    c.restore();
  }
}

function spawnFloatingText(x, y, text) {
  STATE.floatingTexts.push(new FloatingText(x, y, text));
}

class PixelParticle {
  constructor(x, y, vx, vy, color, size, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(c) {
    if (this.life <= 0) return;
    c.save();
    c.globalAlpha = this.life / this.maxLife;
    c.fillStyle = this.color;
    c.fillRect(Math.round(this.x), Math.round(this.y), this.size, this.size);
    c.restore();
  }
}

class HeartParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = -1.2;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.life = 40;
    this.maxLife = 40;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(c) {
    if (this.life <= 0) return;
    const px = Math.round(this.x);
    const py = Math.round(this.y);
    c.save();
    c.globalAlpha = this.life / this.maxLife;
    c.fillStyle = '#f43f5e';

    c.fillRect(px - 3, py - 2, 2, 2);
    c.fillRect(px + 1, py - 2, 2, 2);
    c.fillRect(px - 4, py - 1, 8, 3);
    c.fillRect(px - 3, py + 2, 6, 2);
    c.fillRect(px - 2, py + 4, 4, 1);
    c.fillRect(px - 1, py + 5, 2, 1);
    c.restore();
  }
}

function spawnHappyHearts(x, y) {
  for (let i = 0; i < 2; i++) {
    STATE.particles.push(new HeartParticle(x + (Math.random() - 0.5) * 20, y));
  }
}

function dropCamilanLaut(x, y) {
  const count = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const offsetX = (Math.random() - 0.5) * 24;
    const offsetY = (Math.random() - 0.5) * 12;
    STATE.pellets.push(new CamilanLaut(x + offsetX, y + offsetY));
  }

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6;
    STATE.particles.push(new PixelParticle(
      x, y,
      Math.cos(angle) * 1.5, Math.sin(angle) * 1.5,
      '#7dd3fc', 3, 18
    ));
  }

  updateFoodCounter();
}

function updateFoodCounter() {
  const activeCount = STATE.pellets.filter(p => !p.isEaten && !p.settled).length;
  if (dom.foodCounter) {
    dom.foodCounter.textContent = `🍤 Camilan: ${activeCount}`;
  }
}

/* ============================================================================
   MAIN GAME LOOP & INITIALIZATION
   ============================================================================ */

function setupBiotaEntities(width, height) {
  STATE.creatures = [];

  // Spesies Ikan Perenang Bebas: 4 Klasik + Queen Angelfish + Spotted Boxfish
  STATE.creatures.push(new Fish('blue', width * 0.28, height * 0.45));
  STATE.creatures.push(new Fish('pink', width * 0.68, height * 0.40));
  STATE.creatures.push(new Fish('clownfish', width * 0.42, height * 0.55));
  STATE.creatures.push(new Fish('yellow_tang', width * 0.56, height * 0.32));
  STATE.creatures.push(new Fish('angelfish', width * 0.36, height * 0.38));
  STATE.creatures.push(new Fish('boxfish', width * 0.50, height * 0.48));

  // Spesies Laut Unik: Kuda Laut, Penyu Laut, Ikan Pari Manta, & Goby Penjaga Pasir
  STATE.creatures.push(new Seahorse('gold', width * 0.16, height * 0.65));
  STATE.creatures.push(new Seahorse('pink', width * 0.86, height * 0.60));
  STATE.creatures.push(new SeaTurtle(width * 0.12, height * 0.22, 1));
  STATE.creatures.push(new MantaRay(-60, height * 0.40, 1));
  STATE.creatures.push(new Goby(width * 0.30, height - 36));
  STATE.creatures.push(new Goby(width * 0.72, height - 36));

  // Ambient Non-Ikan: Ubur-ubur & Lumba-lumba Realistis
  STATE.creatures.push(new Jellyfish(width * 0.18, height * 0.55));
  STATE.creatures.push(new Jellyfish(width * 0.82, height * 0.35));
  STATE.creatures.push(new Dolphin(-80, height * 0.28, 1));

  // Gelembung Udara
  STATE.bubbles = [];
  const bubbleCount = Math.floor(width / 35);
  for (let i = 0; i < bubbleCount; i++) {
    STATE.bubbles.push(new Bubble(width, height, false));
  }

  setupSeabedDecorations(width, height);
}

function handleResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  dom.aquariumCanvas.width = w;
  dom.aquariumCanvas.height = h;

  ctx.imageSmoothingEnabled = false;

  setupBiotaEntities(w, h);
}

function registerEventListeners() {
  window.addEventListener('mousemove', (e) => {
    STATE.mouse.x = e.clientX;
    STATE.mouse.y = e.clientY;
    STATE.mouse.isInside = true;
    STATE.mouse.isActive = true;
    STATE.mouse.lastMoveTime = performance.now();
  });

  window.addEventListener('mouseleave', () => {
    STATE.mouse.isInside = false;
    STATE.mouse.isActive = false;
  });

  dom.aquariumCanvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      dropCamilanLaut(e.clientX, e.clientY);
    }
  });

  if (dom.splashScreen) {
    dom.splashScreen.addEventListener('click', () => {
      endSplashScreen();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      endSplashScreen();
    }
  });

  dom.aquariumCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      STATE.mouse.x = touch.clientX;
      STATE.mouse.y = touch.clientY;
      STATE.mouse.isInside = true;
      STATE.mouse.isActive = true;
      STATE.mouse.lastMoveTime = performance.now();
      dropCamilanLaut(touch.clientX, touch.clientY);
    }
  }, { passive: false });

  window.addEventListener('resize', handleResize);
}

function mainAquariumLoop(timestamp) {
  const width = dom.aquariumCanvas.width;
  const height = dom.aquariumCanvas.height;

  const now = performance.now();
  if (STATE.mouse.isActive && (now - STATE.mouse.lastMoveTime > STATE.cursorIdleTimeoutMs)) {
    STATE.mouse.isActive = false;
  }

  if (dom.statusBadge) {
    if (STATE.mouse.isActive) {
      dom.statusBadge.textContent = 'Ikan Mengikuti Kursor 🎯';
      dom.statusBadge.style.borderColor = '#f472b6';
    } else {
      dom.statusBadge.textContent = 'Ikan Berenang Bebas 🌊';
      dom.statusBadge.style.borderColor = '#38bdf8';
    }
  }

  // 1. Render Latar, Pasir, Rumput Laut, Karang, & Fauna Dasar Laut
  drawAquariumEnvironment(ctx, width, height, timestamp);

  // 2. Update & Gambar Gelembung Udara
  for (const bubble of STATE.bubbles) {
    bubble.update(width, height);
    bubble.draw(ctx);
  }

  // 3. Update & Gambar Camilan Laut
  for (let i = STATE.pellets.length - 1; i >= 0; i--) {
    const pellet = STATE.pellets[i];
    pellet.update(height);
    pellet.draw(ctx);

    if (pellet.isEaten || (pellet.settled && pellet.life <= 0)) {
      STATE.pellets.splice(i, 1);
      updateFoodCounter();
    }
  }

  // 4. Update & Gambar Semua Biota Laut
  for (const creature of STATE.creatures) {
    creature.update(width, height);
    creature.draw(ctx);
  }

  // 5. Update & Gambar Partikel & Floating Text
  for (let i = STATE.particles.length - 1; i >= 0; i--) {
    const p = STATE.particles[i];
    p.update();
    p.draw(ctx);
    if (p.life <= 0) {
      STATE.particles.splice(i, 1);
    }
  }

  for (let i = STATE.floatingTexts.length - 1; i >= 0; i--) {
    const ft = STATE.floatingTexts[i];
    ft.update();
    ft.draw(ctx);
    if (ft.life <= 0) {
      STATE.floatingTexts.splice(i, 1);
    }
  }

  requestAnimationFrame(mainAquariumLoop);
}

/* ============================================================================
   BOOTSTRAP APLIKASI
   ============================================================================ */
function init() {
  handleResize();
  registerEventListeners();

  requestAnimationFrame(renderSplashScreen);
  requestAnimationFrame(mainAquariumLoop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
