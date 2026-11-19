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

function extractToMatrix(filePath, minX, maxX, minY, maxY, cols, rows, bgThreshold = 225) {
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

  // Flood fill from borders
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

  // Build color palette
  const palette = [];
  const colorMap = {};

  function getColorIndex(red, green, blue) {
    if (red > 240 && green > 240 && blue > 240) {
      red = 255; green = 255; blue = 255;
    }
    // Round color slightly to reduce unique palette count to < 60
    const r5 = Math.round(red / 6) * 6;
    const g5 = Math.round(green / 6) * 6;
    const b5 = Math.round(blue / 6) * 6;
    const h = hex(r5, g5, b5);
    if (colorMap[h] === undefined) {
      colorMap[h] = palette.length;
      palette.push(h);
    }
    return colorMap[h];
  }

  // Characters for palette indices: 0-9, a-z, A-Z (up to 62 colors)
  const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const rowsData = [];
  for (let r = 0; r < rows; r++) {
    let rowStr = '';
    for (let c = 0; c < cols; c++) {
      if (isBg[r][c]) {
        rowStr += '.';
      } else {
        const [red, green, blue] = grid[r][c];
        const idx = getColorIndex(red, green, blue);
        rowStr += CHARS[idx];
      }
    }
    rowsData.push(rowStr);
  }

  return { cols, rows, palette, rowsData };
}

const blue = extractToMatrix('assets/blue_fish.png', 216, 807, 112, 567, 25, 19);
const pink = extractToMatrix('assets/pink_fish.png', 37, 682, 128, 569, 47, 32);
const dolphin = extractToMatrix('assets/dolphin.png', 16, 293, 47, 271, 44, 36);
const jelly = extractToMatrix('assets/jellyfish.png', 97, 387, 67, 409, 38, 45);
const coral = extractToMatrix('assets/coral.png', 132, 603, 72, 661, 31, 39);

console.log('Blue palette size:', blue.palette.length);
console.log('Pink palette size:', pink.palette.length);
console.log('Dolphin palette size:', dolphin.palette.length);
console.log('Jelly palette size:', jelly.palette.length);
console.log('Coral palette size:', coral.palette.length);

const outCode = `// Generated Faithful Pixel Art Matrices
const FAITHFUL_DATA = {
  blue_fish: ${JSON.stringify(blue, null, 2)},
  pink_fish: ${JSON.stringify(pink, null, 2)},
  dolphin: ${JSON.stringify(dolphin, null, 2)},
  jellyfish: ${JSON.stringify(jelly, null, 2)},
  coral: ${JSON.stringify(coral, null, 2)}
};
`;

fs.writeFileSync('faithful_matrices.js', outCode);
console.log('Written faithful_matrices.js successfully!');
