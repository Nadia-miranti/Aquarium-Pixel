const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

function rect(x, y, w, h, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

// 1. STARFISH (Bintang Laut Emas & Oranye)
function getStarfishSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <!-- Center Body -->
    ${rect(9, 9, 6, 6, '#d97706')}
    ${rect(10, 10, 4, 4, '#f59e0b')}
    ${rect(11, 11, 2, 2, '#fbbf24')}
    
    <!-- Top Arm -->
    ${rect(10, 3, 4, 6, '#d97706')}
    ${rect(11, 2, 2, 6, '#f59e0b')}
    ${rect(11, 4, 2, 2, '#fef08a')}
    
    <!-- Bottom Left Arm -->
    ${rect(5, 14, 5, 4, '#d97706')}
    ${rect(3, 17, 4, 4, '#f59e0b')}
    ${rect(4, 16, 2, 2, '#fbbf24')}
    
    <!-- Bottom Right Arm -->
    ${rect(14, 14, 5, 4, '#d97706')}
    ${rect(17, 17, 4, 4, '#f59e0b')}
    ${rect(16, 16, 2, 2, '#fbbf24')}
    
    <!-- Upper Left Arm -->
    ${rect(3, 7, 6, 4, '#d97706')}
    ${rect(2, 6, 4, 4, '#f59e0b')}
    ${rect(4, 8, 2, 2, '#fbbf24')}
    
    <!-- Upper Right Arm -->
    ${rect(15, 7, 6, 4, '#d97706')}
    ${rect(18, 6, 4, 4, '#f59e0b')}
    ${rect(17, 8, 2, 2, '#fbbf24')}
    
    <!-- Glint Sparkle -->
    ${rect(11, 10, 1, 1, '#ffffff')}
  </svg>`;
}

// 2. CLAMSHELL WITH GLOWING PEARL (Kerang Mutiara - 2 Frame: Open & Closed)
function getClamSvg(isOpen = true) {
  if (isOpen) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24" shape-rendering="crispEdges">
      <!-- Bottom Shell -->
      ${rect(4, 14, 20, 8, '#701a75')}
      ${rect(6, 15, 16, 6, '#a21caf')}
      ${rect(8, 16, 12, 4, '#d946ef')}
      ${rect(10, 17, 8, 2, '#f5d0fe')}
      
      <!-- Open Top Shell (Tilted up) -->
      ${rect(5, 3, 18, 8, '#701a75')}
      ${rect(7, 4, 14, 6, '#c026d3')}
      ${rect(9, 5, 10, 4, '#e879f9')}
      ${rect(11, 6, 6, 2, '#fae8ff')}
      
      <!-- Glowing Radiant Pearl inside -->
      ${rect(11, 11, 6, 6, '#0284c7')}
      ${rect(12, 11, 4, 5, '#bae6fd')}
      ${rect(12, 12, 4, 4, '#ffffff')}
      ${rect(13, 12, 2, 2, '#ffffff')}
    </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" shape-rendering="crispEdges">
      <!-- Closed Shell -->
      ${rect(4, 4, 20, 14, '#701a75')}
      ${rect(6, 5, 16, 12, '#a21caf')}
      ${rect(8, 7, 12, 8, '#d946ef')}
      ${rect(10, 9, 8, 4, '#f5d0fe')}
      <!-- Ridges -->
      ${rect(8, 5, 2, 12, '#701a75')}
      ${rect(13, 5, 2, 12, '#701a75')}
      ${rect(18, 5, 2, 12, '#701a75')}
    </svg>`;
  }
}

// 3. SEASHELL / SPIRAL CONCH (Keong Laut Karamel)
function getConchSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18" shape-rendering="crispEdges">
    ${rect(4, 4, 14, 12, '#78350f')}
    ${rect(6, 5, 11, 10, '#b45309')}
    ${rect(8, 6, 8, 8, '#d97706')}
    ${rect(10, 7, 6, 6, '#f59e0b')}
    ${rect(12, 8, 4, 4, '#fef3c7')}
    
    <!-- Spiral Tip -->
    ${rect(2, 6, 3, 5, '#78350f')}
    ${rect(3, 7, 2, 3, '#d97706')}
    
    <!-- Shell Opening (Creamy Pink) -->
    ${rect(14, 8, 6, 7, '#78350f')}
    ${rect(15, 9, 4, 5, '#fbcfe8')}
    ${rect(16, 10, 2, 3, '#fdf2f8')}
  </svg>`;
}

// 4. MINI CRAB (Kepiting Pantai Mini - 2 Frame Scuttle Walk)
function getCrabSvg(frame = 0) {
  const legOffset = frame % 2 === 1 ? 1 : -1;
  const clawY = frame % 2 === 1 ? -1 : 1;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" shape-rendering="crispEdges">
    <!-- Main Shell -->
    ${rect(8, 6, 12, 8, '#881337')}
    ${rect(9, 7, 10, 6, '#e11d48')}
    ${rect(10, 8, 8, 4, '#fb7185')}
    ${rect(11, 9, 6, 2, '#fda4af')}
    
    <!-- Left Claw -->
    ${rect(3, 3 + clawY, 5, 4, '#881337')}
    ${rect(4, 4 + clawY, 3, 3, '#e11d48')}
    ${rect(2, 2 + clawY, 2, 3, '#fb7185')}
    ${rect(6, 6 + clawY, 3, 2, '#881337')}
    
    <!-- Right Claw -->
    ${rect(20, 3 - clawY, 5, 4, '#881337')}
    ${rect(21, 4 - clawY, 3, 3, '#e11d48')}
    ${rect(24, 2 - clawY, 2, 3, '#fb7185')}
    ${rect(19, 6 - clawY, 3, 2, '#881337')}
    
    <!-- Cute Eyes on Stalks -->
    ${rect(10, 3, 2, 3, '#881337')}
    ${rect(10, 2, 2, 2, '#0f172a')}
    ${rect(10, 2, 1, 1, '#ffffff')}
    
    ${rect(16, 3, 2, 3, '#881337')}
    ${rect(16, 2, 2, 2, '#0f172a')}
    ${rect(16, 2, 1, 1, '#ffffff')}
    
    <!-- Walking Legs (Left) -->
    ${rect(6, 13 + legOffset, 3, 3, '#9f1239')}
    ${rect(5, 15 + legOffset, 2, 2, '#e11d48')}
    ${rect(8, 14 - legOffset, 2, 3, '#9f1239')}
    
    <!-- Walking Legs (Right) -->
    ${rect(19, 13 - legOffset, 3, 3, '#9f1239')}
    ${rect(21, 15 - legOffset, 2, 2, '#e11d48')}
    ${rect(18, 14 + legOffset, 2, 3, '#9f1239')}
  </svg>`;
}

fs.writeFileSync(path.join(assetsDir, 'starfish.svg'), getStarfishSvg());
fs.writeFileSync(path.join(assetsDir, 'clam_open.svg'), getClamSvg(true));
fs.writeFileSync(path.join(assetsDir, 'clam_closed.svg'), getClamSvg(false));
fs.writeFileSync(path.join(assetsDir, 'conch.svg'), getConchSvg());
fs.writeFileSync(path.join(assetsDir, 'crab_0.svg'), getCrabSvg(0));
fs.writeFileSync(path.join(assetsDir, 'crab_1.svg'), getCrabSvg(1));

console.log('Successfully generated new seabed fauna SVGs!');
