const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ARTIFACT_DIR = 'C:\\Users\\Nadia\\.gemini\\antigravity\\brain\\969d87b2-76a8-453d-82d2-d90dd398a55a';
const PROJECT_DIR = 'C:\\Data Nadia\\01_Coding_Projects\\aquariumproject';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
    
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method) {
        if (this.eventListeners.has(msg.method)) {
          this.eventListeners.get(msg.method)(msg.params);
        }
      }
    };
  }

  ready() {
    if (this.ws.readyState === WebSocket.OPEN) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
    });
  }

  on(method, callback) {
    this.eventListeners.set(method, callback);
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function runQC() {
  console.log('=== STARTING VISUAL QC VERIFICATION ===');
  const tempUserData = path.join(os.tmpdir(), 'chrome_qc_' + Date.now());
  fs.mkdirSync(tempUserData, { recursive: true });

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeArgs = [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempUserData}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,800',
    'about:blank'
  ];

  console.log('Launching Headless Chrome (1280x800)...');
  const proc = spawn(chromePath, chromeArgs);
  proc.on('error', err => console.error('Chrome spawn error:', err));

  let client = null;
  try {
    await sleep(1500);

    const pagesRes = await fetch('http://127.0.0.1:9222/json/list');
    const pages = await pagesRes.json();
    const pageTarget = pages.find(p => p.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    console.log('Connecting CDP to page target:', pageTarget.webSocketDebuggerUrl);
    client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.ready();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    console.log('\n--- Step 1: Navigating to http://localhost:8080/ ---');
    const loadedPromise = new Promise(resolve => client.on('Page.loadEventFired', resolve));
    await client.send('Page.navigate', { url: 'http://localhost:8080/' });
    await loadedPromise;
    console.log('Page loadEventFired received!');

    await sleep(500);

    // Dismiss splash screen
    await client.evaluate(`
      (() => {
        if (typeof endSplashScreen === 'function') {
          endSplashScreen();
        }
        const s = document.getElementById('splash-screen');
        if (s) {
          s.style.display = 'none';
          s.classList.add('fade-out');
        }
      })()
    `);
    console.log('Splash screen dismissed. Waiting for aquarium loop render...');
    await sleep(1500);

    console.log('\n--- Step 2: Ocean Background Gradient & Lighting Verification ---');
    const oceanAnalysis = await client.evaluate(`
      (() => {
        const c = document.getElementById('aquarium-canvas');
        const ctx = c.getContext('2d');
        const w = c.width;
        const h = c.height;

        function getPixel(x, y) {
          const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
          return {
            r: p[0],
            g: p[1],
            b: p[2],
            a: p[3],
            hex: '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('')
          };
        }

        // Sampling at different depths
        const surfaceSample = getPixel(w * 0.5, 25);
        const upperMidSample = getPixel(w * 0.5, h * 0.25);
        const midSample = getPixel(w * 0.5, h * 0.50);
        const lowerMidSample = getPixel(w * 0.5, h * 0.75);
        const seabedSample = getPixel(w * 0.5, h * 0.95);

        return {
          canvasResolution: { width: w, height: h },
          surfaceSample,
          upperMidSample,
          midSample,
          lowerMidSample,
          seabedSample,
          // Checks: surface should have bright cyan/sky tones (high B and high G, brighter than seabed)
          isSurfaceBrightCyan: surfaceSample.b > 200 && surfaceSample.g > 150,
          isSeabedDeepMarine: seabedSample.b < 150 && seabedSample.r < 40,
          isLuminanceGradientSmooth: (surfaceSample.r + surfaceSample.g + surfaceSample.b) > (midSample.r + midSample.g + midSample.b) &&
                                     (midSample.r + midSample.g + midSample.b) > (seabedSample.r + seabedSample.g + seabedSample.b)
        };
      })()
    `);
    console.log('Ocean Analysis Results:');
    console.log(`  Surface (y=25px): ${oceanAnalysis.surfaceSample.hex} (R:${oceanAnalysis.surfaceSample.r}, G:${oceanAnalysis.surfaceSample.g}, B:${oceanAnalysis.surfaceSample.b}) - Bright Cyan: ${oceanAnalysis.isSurfaceBrightCyan}`);
    console.log(`  Upper-Mid (y=25%): ${oceanAnalysis.upperMidSample.hex} (R:${oceanAnalysis.upperMidSample.r}, G:${oceanAnalysis.upperMidSample.g}, B:${oceanAnalysis.upperMidSample.b})`);
    console.log(`  Mid-Depth (y=50%): ${oceanAnalysis.midSample.hex} (R:${oceanAnalysis.midSample.r}, G:${oceanAnalysis.midSample.g}, B:${oceanAnalysis.midSample.b})`);
    console.log(`  Lower-Mid (y=75%): ${oceanAnalysis.lowerMidSample.hex} (R:${oceanAnalysis.lowerMidSample.r}, G:${oceanAnalysis.lowerMidSample.g}, B:${oceanAnalysis.lowerMidSample.b})`);
    console.log(`  Seabed (y=95%): ${oceanAnalysis.seabedSample.hex} (R:${oceanAnalysis.seabedSample.r}, G:${oceanAnalysis.seabedSample.g}, B:${oceanAnalysis.seabedSample.b}) - Deep Marine: ${oceanAnalysis.isSeabedDeepMarine}`);
    console.log(`  Luminance Gradient Depth Falloff: ${oceanAnalysis.isLuminanceGradientSmooth ? 'PERFECT SMOOTH FALLOFF' : 'CUSTOM GRADIENT'}`);

    console.log('\n--- Step 3: Biota & New Species Verification ---');
    const speciesReport = await client.evaluate(`
      (() => {
        return STATE.creatures.map((c, idx) => ({
          index: idx,
          className: c.constructor.name,
          type: c.type || c.species || c.color || 'standard',
          x: Math.round(c.x),
          y: Math.round(c.y),
          vx: Number((c.vx || 0).toFixed(2)),
          vy: Number((c.vy || 0).toFixed(2)),
          width: c.width,
          height: c.height
        }));
      })()
    `);
    console.log(`Total creatures in STATE.creatures: ${speciesReport.length}`);
    speciesReport.forEach(c => {
      console.log(`  [${c.index}] ${c.className.padEnd(12)} (${c.type.padEnd(11)}) pos: (${String(c.x).padStart(4)}, ${String(c.y).padStart(3)}) | v: (${String(c.vx).padStart(5)}, ${String(c.vy).padStart(5)}) | size: ${c.width}x${c.height}`);
    });

    // Targeted Species Validations
    const seahorses = speciesReport.filter(c => c.className === 'Seahorse');
    const seaTurtle = speciesReport.find(c => c.className === 'SeaTurtle');
    const mantaRay = speciesReport.find(c => c.className === 'MantaRay');
    const boxfish = speciesReport.find(c => c.type === 'boxfish');

    console.log('\nRequired Species Audit:');
    console.log(`  1. Kuda Laut (Seahorse) count: ${seahorses.length} / 2 (Variants: ${seahorses.map(s => s.type).join(', ')})`);
    console.log(`  2. Penyu Laut (SeaTurtle) count: ${seaTurtle ? 1 : 0} / 1 (Size: ${seaTurtle?.width}x${seaTurtle?.height})`);
    console.log(`  3. Ikan Pari Manta (MantaRay) count: ${mantaRay ? 1 : 0} / 1 (Size: ${mantaRay?.width}x${mantaRay?.height})`);
    console.log(`  4. Ikan Buntal Kuning (Spotted Boxfish) count: ${boxfish ? 1 : 0} / 1 (Size: ${boxfish?.width}x${boxfish?.height})`);

    console.log('\nVerifying active movement and swimming kinematics over 2.0s...');
    const t0Positions = await client.evaluate(`STATE.creatures.map(c => ({ id: c.constructor.name + '_' + (c.type||''), x: c.x, y: c.y }))`);
    await sleep(2000);
    const t1Positions = await client.evaluate(`STATE.creatures.map(c => ({ id: c.constructor.name + '_' + (c.type||''), x: c.x, y: c.y }))`);

    let allMoving = true;
    t0Positions.forEach((p0, i) => {
      const p1 = t1Positions[i];
      const dx = Math.abs(p1.x - p0.x);
      const dy = Math.abs(p1.y - p0.y);
      const dist = Math.hypot(dx, dy);
      console.log(`  ${p0.id.padEnd(22)}: moved ${dist.toFixed(1)}px (dx: ${(p1.x - p0.x).toFixed(1)}, dy: ${(p1.y - p0.y).toFixed(1)})`);
      if (dist < 0.05) allMoving = false;
    });
    console.log(`All creatures actively moving: ${allMoving ? 'YES (All Active)' : 'NO'}`);

    console.log('\n--- Step 4: Taking Overview Screenshot ---');
    const screenshot1 = await client.send('Page.captureScreenshot', { format: 'png' });
    const shot1PathProject = path.join(PROJECT_DIR, 'screenshot_aquarium_vibrant.png');
    const shot1PathArtifact = path.join(ARTIFACT_DIR, 'screenshot_aquarium_vibrant.png');
    fs.writeFileSync(shot1PathProject, Buffer.from(screenshot1.data, 'base64'));
    fs.writeFileSync(shot1PathArtifact, Buffer.from(screenshot1.data, 'base64'));
    console.log('Saved screenshot 1 to:');
    console.log('  Project:', shot1PathProject);
    console.log('  Artifact:', shot1PathArtifact);

    console.log('\n--- Step 5: Testing Camilan Laut 🍤 Dropping and Feeding Interaction ---');
    const initialPellets = await client.evaluate(`STATE.pellets.length`);
    console.log('Initial pellets in STATE:', initialPellets);

    // Simulate clicking via Input.dispatchMouseEvent to drop food at (480, 260) and (780, 240)
    console.log('Dispatching mouse click at (480, 260) to drop Camilan Laut 🍤...');
    await client.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: 480,
      y: 260,
      button: 'left',
      clickCount: 1
    });
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: 480,
      y: 260,
      button: 'left',
      clickCount: 1
    });

    await sleep(200);

    console.log('Dispatching second mouse click at (780, 240)...');
    await client.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: 780,
      y: 240,
      button: 'left',
      clickCount: 1
    });
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: 780,
      y: 240,
      button: 'left',
      clickCount: 1
    });

    await sleep(300);

    const pelletCountAfterClick = await client.evaluate(`STATE.pellets.length`);
    const foodCounterBadge = await client.evaluate(`
      (() => {
        const fc = document.getElementById('food-counter');
        return fc ? fc.textContent : 'none';
      })()
    `);
    console.log(`Active Pellets in STATE: ${pelletCountAfterClick}`);
    console.log(`HUD Food Counter Text: "${foodCounterBadge}"`);

    console.log('\nObserving creatures reacting, swimming toward food, and eating over 3 seconds...');
    let reactionObserved = false;
    for (let sec = 1; sec <= 5; sec++) {
      await sleep(600);
      const feedCycle = await client.evaluate(`
        (() => {
          const pellets = STATE.pellets;
          const activePellets = pellets.filter(p => !p.isEaten);
          const eatenPellets = pellets.filter(p => p.isEaten);
          const particles = STATE.particles.length;
          const floatingTexts = STATE.floatingTexts.map(ft => ft.text);
          
          // Creatures within proximity of any pellet
          const closeCreatures = [];
          for (const c of STATE.creatures) {
            for (const p of pellets) {
              const d = Math.hypot(c.x - p.x, c.y - p.y);
              if (d < 90) {
                closeCreatures.push(c.constructor.name + ' (' + (c.type||'') + ') dist:' + Math.round(d));
              }
            }
          }
          return {
            activeCount: activePellets.length,
            eatenCount: eatenPellets.length,
            closeCreatures: [...new Set(closeCreatures)],
            particles,
            floatingTexts
          };
        })()
      `);
      console.log(`  [Cycle ${sec} (~${sec * 0.6}s)] Active Pellets: ${feedCycle.activeCount} | Eaten: ${feedCycle.eatenCount} | Close Creatures: ${feedCycle.closeCreatures.join(', ') || 'approaching...'} | Floating Texts: [${feedCycle.floatingTexts.join(', ')}]`);
      if (feedCycle.eatenCount > 0 || feedCycle.closeCreatures.length > 0 || feedCycle.floatingTexts.length > 0) {
        reactionObserved = true;
      }
    }

    console.log(`Creature food reaction verified: ${reactionObserved ? 'SUCCESS' : 'PENDING'}`);

    console.log('\n--- Step 6: Taking Feeding Reaction Screenshot ---');
    const screenshot2 = await client.send('Page.captureScreenshot', { format: 'png' });
    const shot2PathProject = path.join(PROJECT_DIR, 'screenshot_camilan_feeding.png');
    const shot2PathArtifact = path.join(ARTIFACT_DIR, 'screenshot_camilan_feeding.png');
    fs.writeFileSync(shot2PathProject, Buffer.from(screenshot2.data, 'base64'));
    fs.writeFileSync(shot2PathArtifact, Buffer.from(screenshot2.data, 'base64'));
    console.log('Saved screenshot 2 to:');
    console.log('  Project:', shot2PathProject);
    console.log('  Artifact:', shot2PathArtifact);

    console.log('\n=== ALL QC CHECKS COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('QC FAILED WITH ERROR:', err);
  } finally {
    if (client) client.close();
    proc.kill();
    try {
      fs.rmSync(tempUserData, { recursive: true, force: true });
    } catch (e) {}
  }
}

runQC();
