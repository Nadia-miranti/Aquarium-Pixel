const fs = require('fs');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');

function decodeImage(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    const png = PNG.sync.read(buf);
    return { width: png.width, height: png.height, data: png.data };
  } else {
    const raw = jpeg.decode(buf, { useTArray: true });
    return { width: raw.width, height: raw.height, data: raw.data };
  }
}

function hex(r,g,b) {
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
}

function extractGrid(filePath, minX, maxX, minY, maxY, cols, rows, bgThreshold = 225) {
  const img = decodeImage(filePath);
  const stepX = (maxX - minX + 1) / cols;
  const stepY = (maxY - minY + 1) / rows;

  function getPixel(x, y) {
    x = Math.max(0, Math.min(img.width - 1, Math.floor(x)));
    y = Math.max(0, Math.min(img.height - 1, Math.floor(y)));
    const idx = (y * img.width + x) * 4;
    return [img.data[idx], img.data[idx+1], img.data[idx+2]];
  }

  const grid = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      let cx = minX + (c + 0.5) * stepX;
      let cy = minY + (r + 0.5) * stepY;
      row.push(getPixel(cx, cy));
    }
    grid.push(row);
  }

  // Flood fill from outer borders ONLY
  const isBg = Array.from({length: rows}, () => Array(cols).fill(false));
  const queue = [];
  for (let c = 0; c < cols; c++) { queue.push([0, c], [rows - 1, c]); }
  for (let r = 0; r < rows; r++) { queue.push([r, 0], [r, cols - 1]); }

  while (queue.length > 0) {
    const [r, c] = queue.pop();
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (isBg[r][c]) continue;
    const [red, green, blue] = grid[r][c];
    if (red > bgThreshold && green > bgThreshold && blue > bgThreshold) {
      isBg[r][c] = true;
      queue.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
    }
  }

  return { cols, rows, grid, isBg };
}

function gridToSvg(cols, rows, pixelMap) {
  let rects = [];
  for (const p of pixelMap) {
    rects.push(`<rect x="${p.x}" y="${p.y}" width="1" height="1" fill="${p.fill}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges">\n  ${rects.join('\n  ')}\n</svg>`;
}

// 1. GENERATE BLUE FISH 4 FRAMES
const blueData = extractGrid('assets/blue_fish.png', 216, 807, 112, 567, 25, 19);
const blueFishFrames = [];
for (let f = 0; f < 4; f++) {
  const pixels = [];
  // wave parameter for tail (c >= 17)
  const tailShift = f === 1 ? -1 : (f === 3 ? 1 : 0);
  const finFlutter = f % 2 === 1 ? -1 : 0;

  for (let r = 0; r < blueData.rows; r++) {
    for (let c = 0; c < blueData.cols; c++) {
      if (blueData.isBg[r][c]) continue;
      let [red, green, blue] = blueData.grid[r][c];
      if (red > 240 && green > 240 && blue > 240) { red = 255; green = 255; blue = 255; }
      
      let x = c;
      let y = r;
      // Tail wag: starts at c >= 18
      if (c >= 18) {
        y += tailShift;
        if (c >= 22) y += tailShift;
      }
      // Dorsal fin flutter
      if (r <= 3 && c >= 8 && c <= 16) {
        y += finFlutter;
      }

      pixels.push({ x, y, fill: hex(red, green, blue) });
    }
  }
  const svg = gridToSvg(blueData.cols, blueData.rows + 3, pixels);
  blueFishFrames.push(svg);
  fs.writeFileSync(`assets/blue_fish_${f}.svg`, svg);
}

// 2. GENERATE PINK BETTA 4 FRAMES
const pinkData = extractGrid('assets/pink_fish.png', 37, 682, 128, 569, 47, 32);
const pinkFishFrames = [];
for (let f = 0; f < 4; f++) {
  const pixels = [];
  const phase = (f / 4) * Math.PI * 2;

  for (let r = 0; r < pinkData.rows; r++) {
    for (let c = 0; c < pinkData.cols; c++) {
      if (pinkData.isBg[r][c]) continue;
      let [red, green, blue] = pinkData.grid[r][c];
      if (red > 240 && green > 240 && blue > 240) { red = 255; green = 255; blue = 255; }

      let x = c;
      let y = r;
      // Wave traveling from body (c = 18) to tail tip (c = 46)
      if (c >= 18) {
        const dist = c - 18;
        const wave = Math.round(1.8 * (dist / 28) * Math.sin(phase - dist * 0.28));
        y += wave;
      }
      // Ventral fin soft sway
      if (r >= 22 && c >= 11 && c <= 17) {
        x += Math.round(0.8 * Math.sin(phase));
      }

      pixels.push({ x, y: y + 2, fill: hex(red, green, blue) });
    }
  }
  const svg = gridToSvg(pinkData.cols, pinkData.rows + 4, pixels);
  pinkFishFrames.push(svg);
  fs.writeFileSync(`assets/pink_fish_${f}.svg`, svg);
}

// 3. GENERATE DOLPHIN 4 FRAMES
const dolphinData = extractGrid('assets/dolphin.png', 16, 293, 47, 271, 44, 36);
const dolphinFrames = [];
for (let f = 0; f < 4; f++) {
  const pixels = [];
  const phase = (f / 4) * Math.PI * 2;
  // Fluke vertical movement & slight snout counter-pitch
  const flukeY = Math.round(2.5 * Math.sin(phase));
  const snoutY = Math.round(-0.8 * Math.sin(phase));

  for (let r = 0; r < dolphinData.rows; r++) {
    for (let c = 0; c < dolphinData.cols; c++) {
      if (dolphinData.isBg[r][c]) continue;
      let [red, green, blue] = dolphinData.grid[r][c];
      if (red > 240 && green > 240 && blue > 240) { red = 255; green = 255; blue = 255; }

      let x = c;
      let y = r;
      if (c <= 12) {
        y += snoutY;
      } else if (c >= 28) {
        const factor = (c - 28) / 16;
        y += Math.round(flukeY * factor);
      }

      pixels.push({ x, y: y + 3, fill: hex(red, green, blue) });
    }
  }
  const svg = gridToSvg(dolphinData.cols, dolphinData.rows + 6, pixels);
  dolphinFrames.push(svg);
  fs.writeFileSync(`assets/dolphin_${f}.svg`, svg);
}

// 4. GENERATE JELLYFISH 4 FRAMES
const jellyData = extractGrid('assets/jellyfish.png', 97, 387, 67, 409, 38, 45);
const jellyfishFrames = [];
for (let f = 0; f < 4; f++) {
  const pixels = [];
  const phase = (f / 4) * Math.PI * 2;
  // Pulsing: dome height compress/expand
  const domeCompress = Math.round(1.2 * Math.sin(phase));
  
  for (let r = 0; r < jellyData.rows; r++) {
    for (let c = 0; c < jellyData.cols; c++) {
      if (jellyData.isBg[r][c]) continue;
      let [red, green, blue] = jellyData.grid[r][c];
      if (red > 240 && green > 240 && blue > 240) { red = 255; green = 255; blue = 255; }

      let x = c;
      let y = r;

      if (r <= 16) {
        // Bell dome: vertical pulse
        if (domeCompress > 0 && r >= 4) y += domeCompress;
      } else {
        // Tentacles: sinusoidal trailing flow
        const tentWave = Math.round(1.5 * Math.sin(phase + (r - 16) * 0.3));
        x += tentWave;
      }

      pixels.push({ x: x + 2, y, fill: hex(red, green, blue) });
    }
  }
  const svg = gridToSvg(jellyData.cols + 4, jellyData.rows + 2, pixels);
  jellyfishFrames.push(svg);
  fs.writeFileSync(`assets/jellyfish_${f}.svg`, svg);
}

// 5. CORAL ON ROCK (IMAGE 5 REFERENCE)
const coralData = extractGrid('assets/coral.png', 132, 603, 72, 661, 31, 39);
const coralPixels = [];
for (let r = 0; r < coralData.rows; r++) {
  for (let c = 0; c < coralData.cols; c++) {
    if (coralData.isBg[r][c]) continue;
    let [red, green, blue] = coralData.grid[r][c];
    if (red > 240 && green > 240 && blue > 240) { red = 255; green = 255; blue = 255; }
    coralPixels.push({ x: c, y: r, fill: hex(red, green, blue) });
  }
}
const coralSvg = gridToSvg(coralData.cols, coralData.rows, coralPixels);
fs.writeFileSync('assets/coral_faithful.svg', coralSvg);

// Export JSON metadata with exact SVG strings for direct synchronous inclusion in script.js
const exportedSVGs = {
  blue_fish: blueFishFrames,
  pink_fish: pinkFishFrames,
  dolphin: dolphinFrames,
  jellyfish: jellyfishFrames,
  coral_rock: coralSvg
};
fs.writeFileSync('generated_svg_sprites.json', JSON.stringify(exportedSVGs, null, 2));

console.log('All 4-frame animated SVG sprites successfully generated and exported!');
