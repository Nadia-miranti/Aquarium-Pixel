const fs = require('fs');

function optimizeSvg(svgStr) {
  const match = svgStr.match(/viewBox="0 0 (\d+) (\d+)"/);
  const w = parseInt(match[1]), h = parseInt(match[2]);
  
  const rectMatches = [...svgStr.matchAll(/<rect x="(\d+)" y="(\d+)" width="1" height="1" fill="(#[0-9a-fA-F]+)"\/>/g)];
  const rows = {};
  for (const m of rectMatches) {
    const x = parseInt(m[1]), y = parseInt(m[2]), fill = m[3];
    if (!rows[y]) rows[y] = {};
    rows[y][x] = fill;
  }
  
  let mergedRects = [];
  for (let y = 0; y < h; y++) {
    if (!rows[y]) continue;
    let x = 0;
    while (x < w) {
      if (rows[y][x]) {
        let fill = rows[y][x];
        let run = 1;
        while (x + run < w && rows[y][x + run] === fill) {
          run++;
        }
        mergedRects.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${fill}"/>`);
        x += run;
      } else {
        x++;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${mergedRects.join('')}</svg>`;
}

const data = JSON.parse(fs.readFileSync('generated_svg_sprites.json'));
let totalBefore = 0, totalAfter = 0;
for (const k in data) {
  if (Array.isArray(data[k])) {
    data[k] = data[k].map(s => {
      totalBefore += s.length;
      let opt = optimizeSvg(s);
      totalAfter += opt.length;
      return opt;
    });
  } else {
    totalBefore += data[k].length;
    let opt = optimizeSvg(data[k]);
    totalAfter += opt.length;
    data[k] = opt;
  }
}
console.log('Size before:', (totalBefore/1024).toFixed(1), 'KB, after:', (totalAfter/1024).toFixed(1), 'KB');
fs.writeFileSync('generated_svg_sprites_optimized.json', JSON.stringify(data));
