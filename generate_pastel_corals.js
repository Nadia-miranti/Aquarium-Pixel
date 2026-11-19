const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

function rect(x, y, w, h, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

// 1. Soft Pastel Peach/Pink Anemone (Gentle & Cute)
function getPastelPinkCoralSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 48" shape-rendering="crispEdges">
    <!-- Base Pebbles -->
    ${rect(6, 38, 32, 10, '#57534e')}
    ${rect(8, 36, 28, 4, '#78716c')}
    ${rect(12, 34, 20, 3, '#a8a29e')}
    
    <!-- Small Seaweed Sprout -->
    ${rect(8, 18, 4, 18, '#16a34a')}
    ${rect(10, 16, 3, 20, '#22c55e')}
    ${rect(11, 14, 2, 8, '#4ade80')}
    
    <!-- Soft Pastel Peach/Pink Anemone Fingers (No Harsh Red!) -->
    ${rect(16, 24, 22, 12, '#f472b6')}
    ${rect(18, 22, 18, 12, '#fda4af')}
    ${rect(20, 20, 14, 12, '#fecdd3')}
    
    <!-- Delicate Polyps / Fingers -->
    ${rect(18, 14, 4, 8, '#fda4af')}
    ${rect(24, 10, 4, 12, '#fecdd3')}
    ${rect(30, 12, 4, 10, '#fda4af')}
    ${rect(35, 16, 3, 8, '#f472b6')}
    
    <!-- Soft Pastel Highlights -->
    ${rect(19, 13, 2, 3, '#fff1f2')}
    ${rect(25, 9, 2, 4, '#ffffff')}
    ${rect(31, 11, 2, 3, '#fff1f2')}
  </svg>`;
}

// 2. Soft Lavender & Lilac Tube Coral
function getPurpleTubeCoralSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 48" shape-rendering="crispEdges">
    <!-- Rock Base -->
    ${rect(4, 38, 36, 10, '#44403c')}
    ${rect(8, 34, 28, 6, '#57534e')}
    ${rect(12, 32, 20, 4, '#78716c')}
    
    <!-- Tube 1 (Left Tall) -->
    ${rect(10, 14, 6, 20, '#7e22ce')}
    ${rect(11, 12, 5, 22, '#a855f7')}
    ${rect(12, 10, 4, 24, '#c084fc')}
    <!-- Opening -->
    ${rect(11, 9, 5, 3, '#d8b4fe')}
    ${rect(12, 8, 3, 2, '#fef08a')}
    
    <!-- Tube 2 (Center Medium) -->
    ${rect(18, 18, 7, 16, '#7e22ce')}
    ${rect(19, 16, 6, 18, '#a855f7')}
    ${rect(20, 14, 4, 20, '#c084fc')}
    <!-- Opening -->
    ${rect(19, 13, 6, 3, '#d8b4fe')}
    ${rect(20, 12, 4, 2, '#fef08a')}
    
    <!-- Tube 3 (Right Short) -->
    ${rect(27, 22, 6, 12, '#7e22ce')}
    ${rect(28, 20, 5, 14, '#a855f7')}
    ${rect(29, 18, 4, 16, '#c084fc')}
    <!-- Opening -->
    ${rect(28, 17, 5, 3, '#d8b4fe')}
    ${rect(29, 16, 3, 2, '#fef08a')}
    
    <!-- Pearl/Shell Detail on rock -->
    ${rect(34, 36, 4, 4, '#fbcfe8')}
    ${rect(35, 37, 2, 2, '#ffffff')}
  </svg>`;
}

// 3. Mint Teal Sea Sponge with Golden Starfish
function getTealSpongeCoralSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 48" shape-rendering="crispEdges">
    <!-- Rock Base -->
    ${rect(6, 36, 32, 12, '#57534e')}
    ${rect(10, 32, 24, 6, '#78716c')}
    
    <!-- Mint / Teal Sponge Dome -->
    ${rect(12, 16, 18, 18, '#0f766e')}
    ${rect(13, 14, 16, 20, '#14b8a6')}
    ${rect(14, 12, 14, 22, '#2dd4bf')}
    ${rect(16, 10, 10, 24, '#5eead4')}
    
    <!-- Sponge Vents -->
    ${rect(17, 9, 3, 3, '#0d9488')}
    ${rect(22, 11, 3, 3, '#0d9488')}
    ${rect(19, 17, 3, 3, '#0d9488')}
    ${rect(16, 10, 2, 1, '#99f6e4')}
    
    <!-- Cute Little Golden Starfish on the right -->
    ${rect(28, 34, 8, 8, '#d97706')}
    ${rect(29, 33, 6, 8, '#f59e0b')}
    ${rect(30, 32, 4, 10, '#fbbf24')}
    ${rect(31, 35, 2, 2, '#fef08a')}
  </svg>`;
}

fs.writeFileSync(path.join(assetsDir, 'coral_pink.svg'), getPastelPinkCoralSvg());
fs.writeFileSync(path.join(assetsDir, 'coral_purple.svg'), getPurpleTubeCoralSvg());
fs.writeFileSync(path.join(assetsDir, 'coral_teal.svg'), getTealSpongeCoralSvg());

console.log('Successfully generated new pastel coral SVGs!');
