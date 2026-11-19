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

function extractToSvg(filePath, minX, maxX, minY, maxY, cols, rows, bgThreshold = 225) {
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

  // Flood fill from outer borders ONLY to remove background
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

  // Generate SVG rects
  let rects = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!isBg[r][c]) {
        let [red, green, blue] = grid[r][c];
        // Clean up near-white inner pixels to pure white
        if (red > 240 && green > 240 && blue > 240) {
          red = 255; green = 255; blue = 255;
        }
        rects.push(`<rect x="${c}" y="${r}" width="1" height="1" fill="${hex(red, green, blue)}"/>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols} ${rows}" width="${cols * 4}" height="${rows * 4}" shape-rendering="crispEdges">\n  ${rects.join('\n  ')}\n</svg>`;
}

const blueFishSvg = extractToSvg('assets/blue_fish.png', 216, 807, 112, 567, 25, 19);
const pinkFishSvg = extractToSvg('assets/pink_fish.png', 37, 682, 128, 569, 47, 32);
const dolphinSvg = extractToSvg('assets/dolphin.png', 16, 293, 47, 271, 44, 36);
const jellyfishSvg = extractToSvg('assets/jellyfish.png', 97, 387, 67, 409, 38, 45);
const coralSvg = extractToSvg('assets/coral.png', 132, 603, 72, 661, 31, 39);

fs.writeFileSync('assets/blue_fish_faithful.svg', blueFishSvg);
fs.writeFileSync('assets/pink_fish_faithful.svg', pinkFishSvg);
fs.writeFileSync('assets/dolphin_faithful.svg', dolphinSvg);
fs.writeFileSync('assets/jellyfish_faithful.svg', jellyfishSvg);
fs.writeFileSync('assets/coral_faithful.svg', coralSvg);

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { background: #034b75; display: flex; flex-wrap: wrap; gap: 24px; padding: 30px; font-family: monospace; color: white; }
.card { background: rgba(0,0,0,0.4); padding: 16px; border: 2px solid #38bdf8; text-align: center; border-radius: 8px; }
svg { image-rendering: pixelated; margin-top: 10px; }
</style>
</head>
<body>
<div class="card"><h3>Ikan Biru</h3>${blueFishSvg}</div>
<div class="card"><h3>Ikan Pink</h3>${pinkFishSvg}</div>
<div class="card"><h3>Lumba-Lumba</h3>${dolphinSvg}</div>
<div class="card"><h3>Ubur-Ubur</h3>${jellyfishSvg}</div>
<div class="card"><h3>Karang & Rumput Laut</h3>${coralSvg}</div>
</body>
</html>`;
fs.writeFileSync('test_sprites.html', html);
console.log('Successfully saved faithful SVGs and test_sprites.html');
