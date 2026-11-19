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

function extractRuns(filePath, minX, maxX, minY, maxY, cols, rows, bgThreshold = 225) {
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

  // Flood fill from outer edges
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

  // Generate horizontal runs [x, y, w, hex]
  const runs = [];
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      if (!isBg[r][c]) {
        let [red, green, blue] = grid[r][c];
        if (red > 240 && green > 240 && blue > 240) { red = 255; green = 255; blue = 255; }
        let h = hex(red, green, blue);
        let start = c;
        let w = 1;
        while (c + w < cols && !isBg[r][c + w]) {
          let [r2, g2, b2] = grid[r][c + w];
          if (r2 > 240 && g2 > 240 && b2 > 240) { r2 = 255; g2 = 255; b2 = 255; }
          if (hex(r2, g2, b2) === h) {
            w++;
          } else {
            break;
          }
        }
        runs.push([start, r, w, h]);
        c += w;
      } else {
        c++;
      }
    }
  }

  return { cols, rows, runs };
}

const blue = extractRuns('assets/blue_fish.png', 216, 807, 112, 567, 25, 19);
const pink = extractRuns('assets/pink_fish.png', 37, 682, 128, 569, 47, 32);
const dolphin = extractRuns('assets/dolphin.png', 16, 293, 47, 271, 44, 36);
const jelly = extractRuns('assets/jellyfish.png', 97, 387, 67, 409, 38, 45);
const coral = extractRuns('assets/coral.png', 132, 603, 72, 661, 31, 39);

console.log('Blue runs:', blue.runs.length);
console.log('Pink runs:', pink.runs.length);
console.log('Dolphin runs:', dolphin.runs.length);
console.log('Jelly runs:', jelly.runs.length);
console.log('Coral runs:', coral.runs.length);

const outData = { blue, pink, dolphin, jelly, coral };
fs.writeFileSync('runtime_pixel_data.json', JSON.stringify(outData));
console.log('Saved runtime_pixel_data.json');
