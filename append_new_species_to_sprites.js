const fs = require('fs');

let spritesJs = fs.readFileSync('sprites.js', 'utf8');

// The new species SVG generator functions
const newSpeciesCode = `
  // ==========================================================================
  // SPESIES BARU: KUDA LAUT, PENYU LAUT, IKAN PARI, & IKAN BUNTAL KOTAK
  // ==========================================================================
  function rect(x, y, w, h, fill) {
    return '<rect x=\"' + x + '\" y=\"' + y + '\" width=\"' + w + '\" height=\"' + h + '\" fill=\"' + fill + '\"/>';
  }

  function getSeahorseSvg(frame, variant) {
    const finFlutter = frame % 2 === 1 ? 1 : 0;
    const tailCurl = frame === 1 ? -1 : (frame === 3 ? 1 : 0);
    const breath = frame === 2 ? 1 : 0;
    const c_dark = variant === 'gold' ? '#78350f' : '#881337';
    const c_main = variant === 'gold' ? '#d97706' : '#e11d48';
    const c_mid  = variant === 'gold' ? '#f59e0b' : '#fb7185';
    const c_light = variant === 'gold' ? '#fbbf24' : '#fda4af';
    const c_pale = variant === 'gold' ? '#fef08a' : '#ffe4e6';
    const c_belly = variant === 'gold' ? '#fef9c3' : '#fff1f2';

    return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 36\" shape-rendering=\"crispEdges\">' +
      rect(10, 2, 4, 3, c_dark) + rect(11, 1, 2, 2, c_light) +
      rect(6, 4, 8, 7, c_dark) + rect(7, 5, 6, 5, c_mid) + rect(8, 6, 4, 3, c_light) +
      rect(1, 7, 6, 4, c_dark) + rect(2, 8, 5, 2, c_light) + rect(1, 8, 1, 2, c_pale) +
      rect(7, 6, 3, 3, '#0f172a') + rect(7, 6, 1, 1, '#ffffff') + rect(9, 8, 1, 1, c_pale) +
      rect(9, 10, 5, 4, c_dark) + rect(10, 11, 3, 3, c_mid) +
      rect(6 - breath, 14, 9 + breath, 10, c_dark) + rect(7 - breath, 15, 7 + breath, 8, c_mid) + rect(8 - breath, 16, 5 + breath, 6, c_light) +
      rect(6 - breath, 16, 3, 2, c_belly) + rect(6 - breath, 19, 3, 2, c_belly) + rect(6 - breath, 22, 3, 2, c_belly) +
      rect(14 + finFlutter, 15, 3, 7, c_dark) + rect(15 + finFlutter, 16, 2, 5, c_pale) +
      rect(12, 11, 2 + finFlutter, 3, c_pale) +
      rect(8, 24, 6, 4, c_dark) + rect(9, 25, 4, 2, c_mid) +
      rect(9 + tailCurl, 27, 5, 4, c_dark) + rect(10 + tailCurl, 28, 3, 2, c_light) +
      rect(7 + tailCurl, 30, 6, 4, c_dark) + rect(8 + tailCurl, 31, 4, 2, c_mid) +
      rect(6 + tailCurl, 28, 3, 4, c_dark) + rect(7 + tailCurl, 29, 2, 2, c_pale) +
    '</svg>';
  }

  PIXEL_SPRITES.seahorse_gold = [
    makeSvgCanvas(24, 36, getSeahorseSvg(0, 'gold')),
    makeSvgCanvas(24, 36, getSeahorseSvg(1, 'gold')),
    makeSvgCanvas(24, 36, getSeahorseSvg(2, 'gold')),
    makeSvgCanvas(24, 36, getSeahorseSvg(3, 'gold'))
  ];

  PIXEL_SPRITES.seahorse_pink = [
    makeSvgCanvas(24, 36, getSeahorseSvg(0, 'pink')),
    makeSvgCanvas(24, 36, getSeahorseSvg(1, 'pink')),
    makeSvgCanvas(24, 36, getSeahorseSvg(2, 'pink')),
    makeSvgCanvas(24, 36, getSeahorseSvg(3, 'pink'))
  ];

  function getSeaTurtleSvg(frame) {
    let flipperY = 0, rearY = 0;
    if (frame === 1) { flipperY = -2; rearY = 1; }
    else if (frame === 2) { flipperY = 0; rearY = 0; }
    else if (frame === 3) { flipperY = 3; rearY = -1; }

    return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 38 28\" shape-rendering=\"crispEdges\">' +
      rect(26, 17 + rearY, 8, 6, '#064e3b') + rect(27, 18 + rearY, 6, 4, '#047857') + rect(28, 19 + rearY, 4, 2, '#34d399') +
      rect(33, 13, 4, 3, '#064e3b') + rect(34, 14, 2, 1, '#10b981') +
      rect(10, 7, 20, 15, '#022c22') + rect(11, 8, 18, 13, '#065f46') + rect(13, 9, 14, 11, '#047857') +
      rect(14, 10, 5, 4, '#10b981') + rect(21, 10, 5, 4, '#10b981') + rect(17, 14, 6, 4, '#34d399') +
      rect(14, 11, 3, 2, '#6ee7b7') + rect(21, 11, 3, 2, '#6ee7b7') + rect(18, 15, 3, 2, '#a7f3d0') +
      rect(10, 10, 2, 9, '#34d399') + rect(29, 10, 2, 9, '#047857') + rect(13, 6, 14, 2, '#34d399') + rect(13, 21, 14, 2, '#047857') +
      rect(3, 10, 8, 7, '#064e3b') + rect(4, 11, 6, 5, '#10b981') + rect(5, 12, 4, 3, '#34d399') + rect(2, 12, 2, 3, '#10b981') +
      rect(4, 11, 3, 3, '#022c22') + rect(4, 11, 1, 1, '#ffffff') + rect(6, 14, 2, 1, '#a7f3d0') +
      rect(10, 3 + flipperY, 8, 6, '#064e3b') + rect(11, 4 + flipperY, 6, 4, '#10b981') + rect(12, 5 + flipperY, 4, 2, '#6ee7b7') +
      rect(12, 19 - flipperY, 8, 6, '#064e3b') + rect(13, 20 - flipperY, 6, 4, '#047857') + rect(14, 21 - flipperY, 4, 2, '#10b981') +
    '</svg>';
  }

  PIXEL_SPRITES.sea_turtle = [
    makeSvgCanvas(38, 28, getSeaTurtleSvg(0)),
    makeSvgCanvas(38, 28, getSeaTurtleSvg(1)),
    makeSvgCanvas(38, 28, getSeaTurtleSvg(2)),
    makeSvgCanvas(38, 28, getSeaTurtleSvg(3))
  ];

  function getMantaRaySvg(frame) {
    const wingY = frame === 1 ? -2 : (frame === 3 ? 2 : 0);
    return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 42 28\" shape-rendering=\"crispEdges\">' +
      rect(12, 2 + wingY, 14, 6, '#0f172a') + rect(14, 3 + wingY, 10, 5, '#1e293b') + rect(16, 4 + wingY, 8, 4, '#0284c7') + rect(18, 5 + wingY, 4, 2, '#38bdf8') +
      rect(12, 20 - wingY, 14, 6, '#0f172a') + rect(14, 20 - wingY, 10, 5, '#1e293b') + rect(16, 20 - wingY, 8, 4, '#0284c7') + rect(18, 21 - wingY, 4, 2, '#38bdf8') +
      rect(8, 7, 20, 14, '#0f172a') + rect(10, 8, 16, 12, '#1e293b') + rect(12, 9, 12, 10, '#0369a1') + rect(14, 11, 8, 6, '#0ea5e9') +
      rect(15, 12, 2, 2, '#ffffff') + rect(19, 12, 2, 2, '#ffffff') + rect(17, 10, 2, 2, '#bae6fd') + rect(17, 14, 2, 2, '#bae6fd') +
      rect(4, 9, 5, 4, '#0f172a') + rect(5, 10, 3, 2, '#0ea5e9') + rect(4, 15, 5, 4, '#0f172a') + rect(5, 16, 3, 2, '#0ea5e9') +
      rect(7, 8, 2, 2, '#0284c7') + rect(7, 8, 1, 1, '#ffffff') + rect(7, 18, 2, 2, '#0284c7') + rect(7, 19, 1, 1, '#ffffff') +
      rect(26, 13, 8, 2, '#0f172a') + rect(34, 13, 6, 1, '#0284c7') + rect(38, 12, 3, 1, '#38bdf8') +
    '</svg>';
  }

  PIXEL_SPRITES.manta_ray = [
    makeSvgCanvas(42, 28, getMantaRaySvg(0)),
    makeSvgCanvas(42, 28, getMantaRaySvg(1)),
    makeSvgCanvas(42, 28, getMantaRaySvg(2)),
    makeSvgCanvas(42, 28, getMantaRaySvg(3))
  ];

  function getBoxfishSvg(frame) {
    const tailY = frame === 1 ? -1 : (frame === 3 ? 1 : 0);
    const finMove = frame % 2 === 1 ? 1 : 0;
    return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 24\" shape-rendering=\"crispEdges\">' +
      rect(22, 9 + tailY, 6, 7, '#854d0e') + rect(23, 10 + tailY, 4, 5, '#eab308') + rect(26, 8 + tailY, 2, 9, '#fef08a') +
      rect(5, 4, 18, 15, '#713f12') + rect(6, 5, 16, 13, '#ca8a04') + rect(7, 6, 14, 11, '#eab308') + rect(8, 7, 12, 9, '#facc15') + rect(10, 9, 8, 6, '#fef08a') +
      rect(15, 2, 4, 3, '#ca8a04') + rect(16, 1, 2, 2, '#fef08a') + rect(15, 18, 4, 3, '#ca8a04') + rect(16, 19, 2, 2, '#fef08a') +
      rect(14 + finMove, 11, 4, 4, '#ca8a04') + rect(15 + finMove, 12, 2, 2, '#fef9c3') +
      rect(11, 7, 2, 2, '#1c1917') + rect(16, 7, 2, 2, '#1c1917') + rect(13, 11, 2, 2, '#1c1917') + rect(18, 11, 2, 2, '#1c1917') + rect(11, 14, 2, 2, '#1c1917') + rect(16, 14, 2, 2, '#1c1917') +
      rect(2, 10, 4, 4, '#713f12') + rect(3, 11, 2, 2, '#fde047') +
      rect(5, 6, 4, 4, '#0f172a') + rect(5, 6, 2, 2, '#ffffff') + rect(8, 9, 1, 1, '#fde047') +
    '</svg>';
  }

  PIXEL_SPRITES.boxfish = [
    makeSvgCanvas(32, 24, getBoxfishSvg(0)),
    makeSvgCanvas(32, 24, getBoxfishSvg(1)),
    makeSvgCanvas(32, 24, getBoxfishSvg(2)),
    makeSvgCanvas(32, 24, getBoxfishSvg(3))
  ];
`;

const insertTarget = '  window.PIXEL_SPRITES = PIXEL_SPRITES;';
spritesJs = spritesJs.replace(insertTarget, newSpeciesCode + '\n  ' + insertTarget);

fs.writeFileSync('sprites.js', spritesJs);
console.log('Appended new species to sprites.js successfully!');
