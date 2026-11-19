const fs = require('fs');

const data = JSON.parse(fs.readFileSync('runtime_pixel_data.json'));

let js = `/**
 * ============================================================================
 * PIXEL ART SPRITES ENGINE - FAITHFUL HIGH-FIDELITY VECTOR MATRICES
 * Built from original reference assets with 100% solid opacity (no cutouts)
 * ============================================================================
 */

(function(window) {
  'use strict';

  function renderRuns(w, h, runs, transform) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let i = 0; i < runs.length; i++) {
      const [origX, origY, origW, fill] = runs[i];
      let [x, y, runW] = transform ? transform(origX, origY, origW) : [origX, origY, origW];
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, runW, 1);
    }
    return canvas;
  }

  // Raw run data
  const RAW = ${JSON.stringify(data)};

  const PIXEL_SPRITES = {};

  // 1. IKAN BIRU (4 FRAMES)
  PIXEL_SPRITES.blue_fish = [];
  for (let f = 0; f < 4; f++) {
    const tailY = f === 1 ? -1 : (f === 3 ? 1 : 0);
    const finY = f % 2 === 1 ? -1 : 0;
    
    PIXEL_SPRITES.blue_fish.push(renderRuns(RAW.blue.cols, RAW.blue.rows + 3, RAW.blue.runs, (x, y, w) => {
      let ny = y + 1;
      if (x >= 18) {
        ny += tailY;
        if (x >= 22) ny += tailY;
      }
      if (y <= 3 && x >= 8 && x <= 16) {
        ny += finY;
      }
      return [x, ny, w];
    }));
  }

  // 2. IKAN PINK BETTA (4 FRAMES DENGAN GELOMBANG EKOR KELOPAK)
  PIXEL_SPRITES.pink_fish = [];
  for (let f = 0; f < 4; f++) {
    const phase = (f / 4) * Math.PI * 2;
    PIXEL_SPRITES.pink_fish.push(renderRuns(RAW.pink.cols, RAW.pink.rows + 4, RAW.pink.runs, (x, y, w) => {
      let ny = y + 2;
      let nx = x;
      if (x >= 18) {
        const dist = x - 18;
        const wave = Math.round(1.8 * (dist / 28) * Math.sin(phase - dist * 0.28));
        ny += wave;
      }
      if (y >= 22 && x >= 11 && x <= 17) {
        nx += Math.round(0.8 * Math.sin(phase));
      }
      return [nx, ny, w];
    }));
  }

  // 3. LUMBA-LUMBA CYAN (4 FRAMES ARCHING & FLUKE MOTION)
  PIXEL_SPRITES.dolphin = [];
  for (let f = 0; f < 4; f++) {
    const phase = (f / 4) * Math.PI * 2;
    const flukeY = Math.round(2.6 * Math.sin(phase));
    const snoutY = Math.round(-0.8 * Math.sin(phase));

    PIXEL_SPRITES.dolphin.push(renderRuns(RAW.dolphin.cols, RAW.dolphin.rows + 6, RAW.dolphin.runs, (x, y, w) => {
      let ny = y + 3;
      if (x <= 12) {
        ny += snoutY;
      } else if (x >= 28) {
        const factor = (x - 28) / 16;
        ny += Math.round(flukeY * factor);
      }
      return [x, ny, w];
    }));
  }

  // 4. UBUR-UBUR BIRU (4 FRAMES PULSING & TENTACLE WAVE)
  PIXEL_SPRITES.jellyfish = [];
  for (let f = 0; f < 4; f++) {
    const phase = (f / 4) * Math.PI * 2;
    const domeCompress = Math.round(1.2 * Math.sin(phase));

    PIXEL_SPRITES.jellyfish.push(renderRuns(RAW.jelly.cols + 4, RAW.jelly.rows + 2, RAW.jelly.runs, (x, y, w) => {
      let nx = x + 2;
      let ny = y;
      if (y <= 16) {
        if (domeCompress > 0 && y >= 4) ny += domeCompress;
      } else {
        const tentWave = Math.round(1.5 * Math.sin(phase + (y - 16) * 0.3));
        nx += tentWave;
      }
      return [nx, ny, w];
    }));
  }

  // 5. KARANG & RUMPUT LAUT (IMAGE 5 CENTERPIECE)
  PIXEL_SPRITES.coral = renderRuns(RAW.coral.cols, RAW.coral.rows, RAW.coral.runs);

  // 6. IKAN BADUT (CLOWNFISH - 4 FRAMES)
  function makeClownfish(frame) {
    const tailY = frame === 1 ? -1 : (frame === 3 ? 1 : 0);
    const canvas = document.createElement('canvas');
    canvas.width = 34; canvas.height = 24;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    function r(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
    // Outline hitam/cokelat gelap
    r(6, 5, 20, 14, '#2d1502');
    r(24, 7 + tailY, 7, 10, '#2d1502');
    r(12, 2, 10, 4, '#2d1502');
    r(13, 18, 8, 4, '#2d1502');

    // Badan Oranye Cerah
    r(7, 6, 18, 12, '#ea580c');
    r(8, 7, 16, 10, '#f97316');
    r(9, 8, 14, 8, '#fb923c');

    // Ekor oranye & hitam
    r(25, 8 + tailY, 4, 8, '#f97316');
    r(29, 7 + tailY, 2, 10, '#0f172a');
    r(28, 8 + tailY, 1, 8, '#ffffff');

    // Garis Putih Clownfish Khas Nemo
    r(10, 6, 3, 12, '#ffffff');
    r(9, 6, 1, 12, '#0f172a');
    r(13, 6, 1, 12, '#0f172a');

    r(17, 7, 3, 10, '#ffffff');
    r(16, 7, 1, 10, '#0f172a');
    r(20, 7, 1, 10, '#0f172a');

    // Mata lucu & mulut
    r(8, 9, 3, 3, '#0f172a');
    r(8, 9, 1, 1, '#ffffff');
    r(9, 10, 1, 1, '#ea580c');
    r(6, 11, 2, 2, '#9a3412');
    return canvas;
  }
  PIXEL_SPRITES.clownfish = [makeClownfish(0), makeClownfish(1), makeClownfish(2), makeClownfish(3)];

  // 7. IKAN TANG KUNING (YELLOW TANG - 4 FRAMES)
  function makeYellowTang(frame) {
    const tailY = frame === 1 ? -1 : (frame === 3 ? 1 : 0);
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 30;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    function r(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
    // Outline keemasan gelap
    r(8, 6, 16, 18, '#78350f');
    r(12, 1, 8, 7, '#78350f');
    r(13, 22, 7, 7, '#78350f');
    r(23, 11 + tailY, 6, 8, '#78350f');

    // Badan Kuning Cerah & Gradasi
    r(9, 7, 14, 16, '#ca8a04');
    r(10, 8, 12, 14, '#eab308');
    r(11, 9, 10, 12, '#facc15');
    r(12, 10, 8, 10, '#fef08a');

    // Sirip atas runcing
    r(13, 2, 6, 5, '#eab308');
    r(14, 3, 4, 3, '#fef08a');
    // Sirip bawah
    r(14, 23, 5, 5, '#eab308');
    r(15, 24, 3, 3, '#fef08a');

    // Ekor
    r(24, 12 + tailY, 4, 6, '#facc15');
    r(27, 11 + tailY, 2, 8, '#fef08a');

    // Garis putih samping
    r(21, 14, 2, 2, '#ffffff');

    // Mata dan moncong
    r(7, 14, 3, 2, '#ca8a04');
    r(10, 11, 3, 3, '#0f172a');
    r(10, 11, 1, 1, '#ffffff');
    return canvas;
  }
  PIXEL_SPRITES.yellow_tang = [makeYellowTang(0), makeYellowTang(1), makeYellowTang(2), makeYellowTang(3)];

  // 8. FAUNA DASAR LAUT (Starfish, Clams, Conch, Crab)
  function makeSvgCanvas(w, h, svgStr) {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStr, 'image/svg+xml');
    doc.querySelectorAll('rect').forEach(rect => {
      ctx.fillStyle = rect.getAttribute('fill');
      ctx.fillRect(
        parseFloat(rect.getAttribute('x')),
        parseFloat(rect.getAttribute('y')),
        parseFloat(rect.getAttribute('width')),
        parseFloat(rect.getAttribute('height'))
      );
    });
    return canvas;
  }

  // Bintang Laut
  PIXEL_SPRITES.starfish = makeSvgCanvas(24, 24, \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="9" y="9" width="6" height="6" fill="#d97706"/>
    <rect x="10" y="10" width="4" height="4" fill="#f59e0b"/>
    <rect x="11" y="11" width="2" height="2" fill="#fbbf24"/>
    <rect x="10" y="3" width="4" height="6" fill="#d97706"/>
    <rect x="11" y="2" width="2" height="6" fill="#f59e0b"/>
    <rect x="11" y="4" width="2" height="2" fill="#fef08a"/>
    <rect x="5" y="14" width="5" height="4" fill="#d97706"/>
    <rect x="3" y="17" width="4" height="4" fill="#f59e0b"/>
    <rect x="4" y="16" width="2" height="2" fill="#fbbf24"/>
    <rect x="14" y="14" width="5" height="4" fill="#d97706"/>
    <rect x="17" y="17" width="4" height="4" fill="#f59e0b"/>
    <rect x="16" y="16" width="2" height="2" fill="#fbbf24"/>
    <rect x="3" y="7" width="6" height="4" fill="#d97706"/>
    <rect x="2" y="6" width="4" height="4" fill="#f59e0b"/>
    <rect x="4" y="8" width="2" height="2" fill="#fbbf24"/>
    <rect x="15" y="7" width="6" height="4" fill="#d97706"/>
    <rect x="18" y="6" width="4" height="4" fill="#f59e0b"/>
    <rect x="17" y="8" width="2" height="2" fill="#fbbf24"/>
    <rect x="11" y="10" width="1" height="1" fill="#ffffff"/>
  </svg>\`);

  // Kerang Mutiara Terbuka & Tertutup
  PIXEL_SPRITES.clam_open = makeSvgCanvas(28, 24, \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24">
    <rect x="4" y="14" width="20" height="8" fill="#701a75"/>
    <rect x="6" y="15" width="16" height="6" fill="#a21caf"/>
    <rect x="8" y="16" width="12" height="4" fill="#d946ef"/>
    <rect x="10" y="17" width="8" height="2" fill="#f5d0fe"/>
    <rect x="5" y="3" width="18" height="8" fill="#701a75"/>
    <rect x="7" y="4" width="14" height="6" fill="#c026d3"/>
    <rect x="9" y="5" width="10" height="4" fill="#e879f9"/>
    <rect x="11" y="6" width="6" height="2" fill="#fae8ff"/>
    <rect x="11" y="11" width="6" height="6" fill="#0284c7"/>
    <rect x="12" y="11" width="4" height="5" fill="#bae6fd"/>
    <rect x="12" y="12" width="4" height="4" fill="#ffffff"/>
    <rect x="13" y="12" width="2" height="2" fill="#ffffff"/>
  </svg>\`);

  PIXEL_SPRITES.clam_closed = makeSvgCanvas(28, 20, \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20">
    <rect x="4" y="4" width="20" height="14" fill="#701a75"/>
    <rect x="6" y="5" width="16" height="12" fill="#a21caf"/>
    <rect x="8" y="7" width="12" height="8" fill="#d946ef"/>
    <rect x="10" y="9" width="8" height="4" fill="#f5d0fe"/>
    <rect x="8" y="5" width="2" height="12" fill="#701a75"/>
    <rect x="13" y="5" width="2" height="12" fill="#701a75"/>
    <rect x="18" y="5" width="2" height="12" fill="#701a75"/>
  </svg>\`);

  // Keong / Conch
  PIXEL_SPRITES.conch = makeSvgCanvas(22, 18, \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18">
    <rect x="4" y="4" width="14" height="12" fill="#78350f"/>
    <rect x="6" y="5" width="11" height="10" fill="#b45309"/>
    <rect x="8" y="6" width="8" height="8" fill="#d97706"/>
    <rect x="10" y="7" width="6" height="6" fill="#f59e0b"/>
    <rect x="12" y="8" width="4" height="4" fill="#fef3c7"/>
    <rect x="2" y="6" width="3" height="5" fill="#78350f"/>
    <rect x="3" y="7" width="2" height="3" fill="#d97706"/>
    <rect x="14" y="8" width="6" height="7" fill="#78350f"/>
    <rect x="15" y="9" width="4" height="5" fill="#fbcfe8"/>
    <rect x="16" y="10" width="2" height="3" fill="#fdf2f8"/>
  </svg>\`);

  // Kepiting Mini (2 Frame Berjalan)
  function makeCrab(f) {
    const leg = f % 2 === 1 ? 1 : -1;
    return makeSvgCanvas(28, 20, \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20">
      <rect x="8" y="6" width="12" height="8" fill="#881337"/>
      <rect x="9" y="7" width="10" height="6" fill="#e11d48"/>
      <rect x="10" y="8" width="8" height="4" fill="#fb7185"/>
      <rect x="11" y="9" width="6" height="2" fill="#fda4af"/>
      <rect x="3" y="\${3 + leg}" width="5" height="4" fill="#881337"/>
      <rect x="4" y="\${4 + leg}" width="3" height="3" fill="#e11d48"/>
      <rect x="2" y="\${2 + leg}" width="2" height="3" fill="#fb7185"/>
      <rect x="6" y="\${6 + leg}" width="3" height="2" fill="#881337"/>
      <rect x="20" y="\${3 - leg}" width="5" height="4" fill="#881337"/>
      <rect x="21" y="\${4 - leg}" width="3" height="3" fill="#e11d48"/>
      <rect x="24" y="\${2 - leg}" width="2" height="3" fill="#fb7185"/>
      <rect x="19" y="\${6 - leg}" width="3" height="2" fill="#881337"/>
      <rect x="10" y="3" width="2" height="3" fill="#881337"/>
      <rect x="10" y="2" width="2" height="2" fill="#0f172a"/>
      <rect x="10" y="2" width="1" height="1" fill="#ffffff"/>
      <rect x="16" y="3" width="2" height="3" fill="#881337"/>
      <rect x="16" y="2" width="2" height="2" fill="#0f172a"/>
      <rect x="16" y="2" width="1" height="1" fill="#ffffff"/>
      <rect x="6" y="\${13 + leg}" width="3" height="3" fill="#9f1239"/>
      <rect x="5" y="\${15 + leg}" width="2" height="2" fill="#e11d48"/>
      <rect x="8" y="\${14 - leg}" width="2" height="3" fill="#9f1239"/>
      <rect x="19" y="\${13 - leg}" width="3" height="3" fill="#9f1239"/>
      <rect x="21" y="\${15 - leg}" width="2" height="2" fill="#e11d48"/>
      <rect x="18" y="\${14 + leg}" width="2" height="3" fill="#9f1239"/>
    </svg>\`);
  }
  PIXEL_SPRITES.crab = [makeCrab(0), makeCrab(1)];

  window.PIXEL_SPRITES = PIXEL_SPRITES;
})(typeof window !== 'undefined' ? window : this);
`;

fs.writeFileSync('sprites.js', js);
console.log('Successfully generated sprites.js!');
