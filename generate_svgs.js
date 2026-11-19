const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

// Helper to build pixel rects
function rect(x, y, w, h, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

// 1. BLUE FISH (4 Frames)
function getBlueFishSvg(frame = 0) {
  const tailOffsetY = frame === 1 ? -2 : (frame === 3 ? 2 : 0);
  const finOffset = frame % 2 === 1 ? 1 : 0;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" shape-rendering="crispEdges">
    <!-- Outline -->
    ${rect(8, 4, 16, 16, '#0b2545')}
    ${rect(5, 7, 22, 10, '#0b2545')}
    ${rect(24, 7 + tailOffsetY, 6, 10, '#0b2545')}
    ${rect(12, 1, 8, 4, '#0b2545')}
    ${rect(14, 19, 6, 4, '#0b2545')}
    
    <!-- Body Blue Palette -->
    ${rect(9, 5, 14, 14, '#0284c7')}
    ${rect(11, 7, 10, 10, '#0ea5e9')}
    ${rect(12, 8, 8, 8, '#38bdf8')}
    
    <!-- Top & Bottom Fins -->
    ${rect(13, 2, 6, 3, '#0369a1')}
    ${rect(14, 3, 4, 2, '#38bdf8')}
    ${rect(15, 19, 4, 3, '#0369a1')}
    
    <!-- Tail Fluke (Animated) -->
    ${rect(25, 8 + tailOffsetY, 3, 8, '#0369a1')}
    ${rect(28, 6 + tailOffsetY, 2, 4, '#0284c7')}
    ${rect(28, 14 + tailOffsetY, 2, 4, '#0284c7')}
    
    <!-- Solid White Belly & Face (NOT transparent!) -->
    ${rect(5, 9, 6, 7, '#ffffff')}
    ${rect(8, 14, 12, 4, '#ffffff')}
    ${rect(7, 12, 8, 4, '#e0f2fe')}
    ${rect(10, 16, 8, 2, '#bae6fd')}
    
    <!-- Mouth -->
    ${rect(4, 11, 2, 2, '#0369a1')}
    
    <!-- Pectoral Fin -->
    ${rect(16 + finOffset, 11, 3, 5, '#0284c7')}
    ${rect(17 + finOffset, 12, 2, 3, '#7dd3fc')}
    
    <!-- Cute Eye -->
    ${rect(9, 8, 3, 4, '#0f172a')}
    ${rect(9, 8, 1, 2, '#ffffff')}
  </svg>`;
}

// 2. PINK FISH (4 Frames)
function getPinkFishSvg(frame = 0) {
  const tailWave = frame === 1 ? -2 : (frame === 3 ? 2 : 0);
  const finWave = frame % 2 === 1 ? -1 : 0;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 28" shape-rendering="crispEdges">
    <!-- Huge Veil Tail (Animated) -->
    ${rect(20, 4 + tailWave, 14, 20, '#881337')}
    ${rect(22, 6 + tailWave, 10, 16, '#f472b6')}
    ${rect(24, 8 + tailWave, 7, 12, '#fbcfe8')}
    ${rect(26, 10 + tailWave, 5, 8, '#fce7f3')}
    ${rect(31, 4 + tailWave, 3, 7, '#f472b6')}
    ${rect(31, 17 + tailWave, 3, 7, '#f472b6')}
    
    <!-- Head & Body Outline -->
    ${rect(6, 7, 16, 14, '#881337')}
    ${rect(16, 2 + finWave, 8, 6, '#881337')}
    ${rect(14, 20, 6, 6, '#881337')}
    
    <!-- Body Pastel Gradient -->
    ${rect(7, 8, 14, 12, '#fb7185')}
    ${rect(9, 9, 10, 10, '#fda4af')}
    ${rect(11, 11, 6, 6, '#fecdd3')}
    
    <!-- Top & Bottom Petal Fins -->
    ${rect(17, 3 + finWave, 6, 4, '#f472b6')}
    ${rect(18, 4 + finWave, 4, 2, '#fce7f3')}
    ${rect(15, 20, 4, 4, '#f472b6')}
    
    <!-- Solid Cream / White Belly -->
    ${rect(6, 12, 6, 6, '#ffffff')}
    ${rect(8, 15, 8, 3, '#fff1f2')}
    
    <!-- Side Flower Fin -->
    ${rect(13, 13, 4, 4, '#f472b6')}
    ${rect(14, 14, 2, 2, '#ffffff')}
    
    <!-- Eye & Blushing Cheek -->
    ${rect(7, 10, 3, 3, '#4c0519')}
    ${rect(7, 10, 1, 1, '#ffffff')}
    ${rect(5, 14, 2, 2, '#f43f5e')}
  </svg>`;
}

// 3. CLOWNFISH (4 Frames)
function getClownfishSvg(frame = 0) {
  const tailY = frame === 1 ? -1 : (frame === 3 ? 1 : 0);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 24" shape-rendering="crispEdges">
    <!-- Outline -->
    ${rect(6, 5, 20, 14, '#431407')}
    ${rect(24, 7 + tailY, 7, 10, '#431407')}
    ${rect(12, 2, 10, 4, '#431407')}
    ${rect(13, 18, 8, 4, '#431407')}
    
    <!-- Body Orange -->
    ${rect(7, 6, 18, 12, '#ea580c')}
    ${rect(8, 7, 16, 10, '#f97316')}
    ${rect(9, 8, 14, 8, '#fb923c')}
    
    <!-- Tail Fin -->
    ${rect(25, 8 + tailY, 4, 8, '#f97316')}
    ${rect(29, 7 + tailY, 2, 10, '#0f172a')}
    ${rect(28, 8 + tailY, 1, 8, '#ffffff')}
    
    <!-- Stripe 1 (Head) -->
    ${rect(10, 5, 4, 14, '#0f172a')}
    ${rect(11, 6, 2, 12, '#ffffff')}
    
    <!-- Stripe 2 (Mid Body) -->
    ${rect(17, 3, 4, 18, '#0f172a')}
    ${rect(18, 4, 2, 16, '#ffffff')}
    
    <!-- Stripe 3 (Tail Base) -->
    ${rect(23, 7, 3, 10, '#0f172a')}
    ${rect(24, 8, 1, 8, '#ffffff')}
    
    <!-- Fins -->
    ${rect(13, 3, 8, 2, '#f97316')}
    ${rect(14, 18, 6, 2, '#f97316')}
    ${rect(13, 11, 4, 4, '#c2410c')}
    ${rect(14, 12, 2, 2, '#ffffff')}
    
    <!-- Eye & Snout -->
    ${rect(7, 8, 3, 3, '#0f172a')}
    ${rect(7, 8, 1, 1, '#ffffff')}
    ${rect(4, 11, 3, 3, '#c2410c')}
  </svg>`;
}

// 4. YELLOW TANG (4 Frames)
function getYellowTangSvg(frame = 0) {
  const tailY = frame === 1 ? -1 : (frame === 3 ? 1 : 0);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30" shape-rendering="crispEdges">
    <!-- Tall Oval Body & Fins Outline -->
    ${rect(8, 3, 16, 24, '#713f12')}
    ${rect(4, 11, 6, 8, '#713f12')}
    ${rect(24, 9 + tailY, 6, 12, '#713f12')}
    
    <!-- Yellow Palette -->
    ${rect(8, 4, 15, 22, '#ca8a04')}
    ${rect(9, 5, 13, 20, '#eab308')}
    ${rect(10, 7, 11, 16, '#facc15')}
    ${rect(12, 9, 7, 12, '#fef08a')}
    
    <!-- Tall Dorsal & Anal Fins -->
    ${rect(14, 1, 6, 4, '#facc15')}
    ${rect(15, 25, 6, 4, '#facc15')}
    ${rect(15, 2, 4, 2, '#fef08a')}
    
    <!-- Pointy Snout -->
    ${rect(5, 12, 4, 5, '#facc15')}
    ${rect(3, 14, 2, 2, '#ca8a04')}
    
    <!-- Tail Fin -->
    ${rect(25, 10 + tailY, 4, 10, '#facc15')}
    ${rect(28, 9 + tailY, 2, 12, '#ca8a04')}
    
    <!-- White Scalpel Spine -->
    ${rect(22, 14 + tailY, 3, 2, '#ffffff')}
    
    <!-- Eye -->
    ${rect(8, 10, 3, 3, '#451a03')}
    ${rect(8, 10, 1, 1, '#ffffff')}
  </svg>`;
}

// 5. DOLPHIN (4 DISTINCT ANIMATED FRAMES)
// Frame 0: Neutral Glide
// Frame 1: Power Downstroke (Tail pumping DOWN, arched body)
// Frame 2: Dive Crest (Snout curving down, tail horizontal-high)
// Frame 3: Upstroke Recovery (Tail bent UP, body streamlined)
function getDolphinSvg(frame = 0) {
  let tailY = 0;
  let flukeTilt = 0;
  let archY = 0;
  let snoutY = 0;
  
  if (frame === 1) { // Power Downstroke
    tailY = 4;
    flukeTilt = 3;
    archY = -1;
    snoutY = -1;
  } else if (frame === 2) { // Dive Crest
    tailY = -1;
    flukeTilt = 0;
    archY = 1;
    snoutY = 2;
  } else if (frame === 3) { // Upstroke
    tailY = -3;
    flukeTilt = -3;
    archY = 0;
    snoutY = 0;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 28" shape-rendering="crispEdges">
    <!-- Outline -->
    ${rect(8, 7 + archY, 26, 14, '#0e7490')}
    ${rect(20, 2 + archY, 8, 6, '#0e7490')}
    ${rect(32, 8 + tailY, 8, 8, '#0e7490')}
    ${rect(38, 5 + tailY + flukeTilt, 6, 14, '#0e7490')}
    ${rect(2, 11 + snoutY, 8, 6, '#0e7490')}
    
    <!-- Cyan Body -->
    ${rect(9, 8 + archY, 24, 12, '#06b6d4')}
    ${rect(10, 9 + archY, 22, 10, '#22d3ee')}
    ${rect(12, 10 + archY, 18, 7, '#67e8f9')}
    
    <!-- Dorsal Fin -->
    ${rect(21, 3 + archY, 6, 5, '#0891b2')}
    ${rect(22, 4 + archY, 3, 3, '#22d3ee')}
    
    <!-- Tail & Fluke (Animated) -->
    ${rect(32, 9 + tailY, 6, 6, '#0891b2')}
    ${rect(36, 10 + tailY, 4, 4, '#06b6d4')}
    ${rect(39, 6 + tailY + flukeTilt, 4, 5, '#0891b2')}
    ${rect(39, 13 + tailY + flukeTilt, 4, 5, '#0891b2')}
    ${rect(40, 7 + tailY + flukeTilt, 2, 10, '#22d3ee')}
    
    <!-- White Underbelly & Snout -->
    ${rect(12, 15 + archY, 16, 4, '#f0fdfa')}
    ${rect(4, 12 + snoutY, 6, 4, '#ccfbf1')}
    ${rect(6, 14 + snoutY, 6, 2, '#f0fdfa')}
    
    <!-- Pectoral Flipper -->
    ${rect(17, 16 + archY, 6, 5, '#0891b2')}
    ${rect(18, 17 + archY, 4, 3, '#22d3ee')}
    
    <!-- Cute Sparkling Eye -->
    ${rect(10, 10 + snoutY, 3, 3, '#083344')}
    ${rect(10, 10 + snoutY, 1, 1, '#ffffff')}
    ${rect(11, 11 + snoutY, 1, 1, '#67e8f9')}
  </svg>`;
}

// 6. JELLYFISH (3 Frames: Contracted, Expanding, Relaxed)
function getJellyfishSvg(frame = 0) {
  const stretch = frame === 0 ? -2 : (frame === 2 ? 2 : 0);
  const tentWave = frame === 1 ? 1 : (frame === 2 ? -1 : 0);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" shape-rendering="crispEdges">
    <!-- Bell Dome (Translucent Cyan-Blue) -->
    ${rect(6 - stretch / 2, 4, 20 + stretch, 14, '#1e3a8a')}
    ${rect(7 - stretch / 2, 5, 18 + stretch, 12, '#0284c7')}
    ${rect(8 - stretch / 2, 6, 16 + stretch, 10, '#38bdf8')}
    ${rect(9 - stretch / 2, 7, 14 + stretch, 7, '#bae6fd')}
    
    <!-- Bell Scalloped Rim -->
    ${rect(5 - stretch / 2, 17, 22 + stretch, 3, '#0284c7')}
    
    <!-- White Highlights on Cap -->
    ${rect(10, 7, 4, 2, '#ffffff')}
    ${rect(18, 7, 3, 2, '#ffffff')}
    
    <!-- Wavy Flowing Tentacles (Animated) -->
    <!-- Tentacle 1 -->
    ${rect(7 + tentWave, 20, 2, 5, '#38bdf8')}
    ${rect(8 + tentWave, 25, 2, 6, '#0284c7')}
    ${rect(6 + tentWave, 31, 2, 6, '#38bdf8')}
    
    <!-- Tentacle 2 -->
    ${rect(12 - tentWave, 20, 2, 7, '#38bdf8')}
    ${rect(14 - tentWave, 27, 2, 8, '#0ea5e9')}
    ${rect(13 - tentWave, 35, 2, 4, '#0284c7')}
    
    <!-- Tentacle 3 -->
    ${rect(18 + tentWave, 20, 2, 6, '#38bdf8')}
    ${rect(16 + tentWave, 26, 2, 8, '#0ea5e9')}
    ${rect(19 + tentWave, 34, 2, 5, '#0284c7')}
    
    <!-- Tentacle 4 -->
    ${rect(23 - tentWave, 20, 2, 5, '#38bdf8')}
    ${rect(21 - tentWave, 25, 2, 6, '#0284c7')}
    ${rect(23 - tentWave, 31, 2, 5, '#38bdf8')}
  </svg>`;
}

// Write files to assets
fs.writeFileSync(path.join(assetsDir, 'blue_fish_0.svg'), getBlueFishSvg(0));
fs.writeFileSync(path.join(assetsDir, 'blue_fish_1.svg'), getBlueFishSvg(1));
fs.writeFileSync(path.join(assetsDir, 'blue_fish_2.svg'), getBlueFishSvg(2));
fs.writeFileSync(path.join(assetsDir, 'blue_fish_3.svg'), getBlueFishSvg(3));

fs.writeFileSync(path.join(assetsDir, 'pink_fish_0.svg'), getPinkFishSvg(0));
fs.writeFileSync(path.join(assetsDir, 'pink_fish_1.svg'), getPinkFishSvg(1));
fs.writeFileSync(path.join(assetsDir, 'pink_fish_2.svg'), getPinkFishSvg(2));
fs.writeFileSync(path.join(assetsDir, 'pink_fish_3.svg'), getPinkFishSvg(3));

fs.writeFileSync(path.join(assetsDir, 'clownfish_0.svg'), getClownfishSvg(0));
fs.writeFileSync(path.join(assetsDir, 'clownfish_1.svg'), getClownfishSvg(1));
fs.writeFileSync(path.join(assetsDir, 'clownfish_2.svg'), getClownfishSvg(2));
fs.writeFileSync(path.join(assetsDir, 'clownfish_3.svg'), getClownfishSvg(3));

fs.writeFileSync(path.join(assetsDir, 'yellow_tang_0.svg'), getYellowTangSvg(0));
fs.writeFileSync(path.join(assetsDir, 'yellow_tang_1.svg'), getYellowTangSvg(1));
fs.writeFileSync(path.join(assetsDir, 'yellow_tang_2.svg'), getYellowTangSvg(2));
fs.writeFileSync(path.join(assetsDir, 'yellow_tang_3.svg'), getYellowTangSvg(3));

fs.writeFileSync(path.join(assetsDir, 'dolphin_0.svg'), getDolphinSvg(0));
fs.writeFileSync(path.join(assetsDir, 'dolphin_1.svg'), getDolphinSvg(1));
fs.writeFileSync(path.join(assetsDir, 'dolphin_2.svg'), getDolphinSvg(2));
fs.writeFileSync(path.join(assetsDir, 'dolphin_3.svg'), getDolphinSvg(3));

fs.writeFileSync(path.join(assetsDir, 'jellyfish_0.svg'), getJellyfishSvg(0));
fs.writeFileSync(path.join(assetsDir, 'jellyfish_1.svg'), getJellyfishSvg(1));
fs.writeFileSync(path.join(assetsDir, 'jellyfish_2.svg'), getJellyfishSvg(2));

console.log('Successfully generated all animated pixel art SVGs into assets/ folder!');
