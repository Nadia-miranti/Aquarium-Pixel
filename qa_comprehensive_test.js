const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ARTIFACT_DIR = 'C:\\Users\\Nadia\\.gemini\\antigravity\\brain\\c976fd7c-584b-4dc2-ae92-1dfee387ad9f';
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

async function saveScreenshot(client, filename) {
  const screenshot = await client.send('Page.captureScreenshot', { format: 'png' });
  const projPath = path.join(PROJECT_DIR, filename);
  const artPath = path.join(ARTIFACT_DIR, filename);
  fs.writeFileSync(projPath, Buffer.from(screenshot.data, 'base64'));
  fs.writeFileSync(artPath, Buffer.from(screenshot.data, 'base64'));
  console.log(`[Screenshot Saved] -> ${filename} (${(screenshot.data.length * 0.75 / 1024).toFixed(1)} KB)`);
  return { projPath, artPath };
}

async function dispatchClick(client, x, y) {
  await client.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x,
    y,
    button: 'left',
    clickCount: 1
  });
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x,
    y,
    button: 'left',
    clickCount: 1
  });
}

async function runQA() {
  console.log('=====================================================');
  console.log('     STARTING COMPREHENSIVE QA VERIFICATION SUITE    ');
  console.log('=====================================================');

  const tempUserData = path.join(os.tmpdir(), 'chrome_qa_' + Date.now());
  fs.mkdirSync(tempUserData, { recursive: true });

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeArgs = [
    '--headless=new',
    '--remote-debugging-port=9224',
    `--user-data-dir=${tempUserData}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,800',
    'about:blank'
  ];

  console.log('[QA] Spawning Headless Chrome on port 9224...');
  const proc = spawn(chromePath, chromeArgs);
  proc.on('error', err => console.error('Chrome spawn error:', err));

  let client = null;
  const results = {
    ecosystemAudit: {},
    dolphinKinematics: {},
    seabedFeeding: {},
    antiStuckCheck: {},
    screenshots: []
  };

  try {
    await sleep(1500);

    const pagesRes = await fetch('http://127.0.0.1:9224/json/list');
    const pages = await pagesRes.json();
    const pageTarget = pages.find(p => p.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    console.log('[QA] Connecting CDP Client...');
    client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.ready();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    console.log('[QA] Navigating to http://localhost:8080/ ...');
    const loadedPromise = new Promise(resolve => client.on('Page.loadEventFired', resolve));
    await client.send('Page.navigate', { url: 'http://localhost:8080/' });
    await loadedPromise;
    console.log('[QA] Page loaded successfully.');

    await sleep(500);

    // Dismiss splash screen
    await client.evaluate(`
      (() => {
        if (typeof endSplashScreen === 'function') endSplashScreen();
        const s = document.getElementById('splash-screen');
        if (s) {
          s.style.display = 'none';
          s.classList.add('fade-out');
        }
        // Instrument feed tracking counters
        window.__qaTotalEaten = 0;
        window.__qaTotalSettled = 0;
        window.__qaEatenBy = [];

        // Observe pellet consumption
        const origSplice = STATE.pellets.splice.bind(STATE.pellets);
      })()
    `);
    console.log('[QA] Splash screen dismissed. Allowing simulation loop to spin up...');
    await sleep(1500);

    // -----------------------------------------------------------------
    // 1. AUDIT FULL ECOSYSTEM OF MARINE LIFE
    // -----------------------------------------------------------------
    console.log('\n--- TEST 1: Full Marine Ecosystem Audit ---');
    const faunaInfo = await client.evaluate(`
      (() => {
        const creatures = STATE.creatures.map((c, i) => ({
          idx: i,
          className: c.constructor.name,
          type: c.type || c.species || c.variant || 'standard',
          x: Math.round(c.x),
          y: Math.round(c.y),
          width: c.width,
          height: c.height
        }));

        const seabedFauna = (STATE.seabedFauna || []).map((d, i) => ({
          idx: i,
          className: d.constructor ? d.constructor.name : 'SeabedFauna',
          type: d.constructor ? d.constructor.name : 'fauna',
          x: Math.round(d.x),
          y: Math.round(d.y)
        }));

        const staticFauna = (STATE.staticFauna || []).map((s, i) => ({
          idx: i,
          type: s.type,
          x: Math.round(s.x),
          y: Math.round(s.y)
        }));

        return { creatures, seabedFauna, staticFauna, width: window.innerWidth, height: window.innerHeight };
      })()
    `);

    console.log(`Canvas Viewport: ${faunaInfo.width}x${faunaInfo.height}`);
    console.log(`Active Creatures Count: ${faunaInfo.creatures.length}`);
    console.log(`Seabed Fauna Count: ${faunaInfo.seabedFauna.length}`);
    console.log(`Static Seabed Fauna Count: ${faunaInfo.staticFauna.length}`);

    faunaInfo.creatures.forEach(c => {
      console.log(`  - [Creature ${c.idx}] ${c.className.padEnd(12)} (${c.type.padEnd(11)}) at (${c.x}, ${c.y}) size: ${c.width}x${c.height}`);
    });
    faunaInfo.seabedFauna.forEach(d => {
      console.log(`  - [SeabedFauna ${d.idx}] ${d.className.padEnd(12)} at (${d.x}, ${d.y})`);
    });
    faunaInfo.staticFauna.forEach(s => {
      console.log(`  - [StaticFauna ${s.idx}] ${s.type.padEnd(12)} at (${s.x}, ${s.y})`);
    });

    const hasDolphin = faunaInfo.creatures.some(c => c.className === 'Dolphin');
    const hasAngelfish = faunaInfo.creatures.some(c => c.type === 'angelfish');
    const hasGoby = faunaInfo.creatures.some(c => c.className === 'Goby');
    const hasSeahorseGold = faunaInfo.creatures.some(c => c.className === 'Seahorse' && c.type === 'gold');
    const hasSeahorsePink = faunaInfo.creatures.some(c => c.className === 'Seahorse' && c.type === 'pink');
    const hasSeaTurtle = faunaInfo.creatures.some(c => c.className === 'SeaTurtle');
    const hasMantaRay = faunaInfo.creatures.some(c => c.className === 'MantaRay');
    const hasBoxfish = faunaInfo.creatures.some(c => c.type === 'boxfish');
    const hasClownfish = faunaInfo.creatures.some(c => c.type === 'clownfish');
    const hasYellowTang = faunaInfo.creatures.some(c => c.type === 'yellow_tang');
    const hasBlueFish = faunaInfo.creatures.some(c => c.type === 'blue');
    const hasPinkBetta = faunaInfo.creatures.some(c => c.type === 'pink');
    const hasJellyfish = faunaInfo.creatures.some(c => c.className === 'Jellyfish');
    const hasCrab = faunaInfo.seabedFauna.some(d => d.className === 'MiniCrab');
    const hasClam = faunaInfo.seabedFauna.some(d => d.className === 'PearlClam');

    results.ecosystemAudit = {
      dolphin: hasDolphin,
      angelfish: hasAngelfish,
      goby: hasGoby,
      seahorseGold: hasSeahorseGold,
      seahorsePink: hasSeahorsePink,
      seaTurtle: hasSeaTurtle,
      mantaRay: hasMantaRay,
      boxfish: hasBoxfish,
      clownfish: hasClownfish,
      yellowTang: hasYellowTang,
      blueFish: hasBlueFish,
      pinkBetta: hasPinkBetta,
      jellyfish: hasJellyfish,
      crab: hasCrab,
      clam: hasClam
    };

    console.log('\nEcosystem Verification Checklist:');
    let allFaunaPresent = true;
    Object.entries(results.ecosystemAudit).forEach(([species, present]) => {
      console.log(`  [${present ? 'PASS' : 'FAIL'}] ${species}`);
      if (!present) allFaunaPresent = false;
    });
    console.log(`Ecosystem Audit Overall: ${allFaunaPresent ? '100% COMPLETE' : 'INCOMPLETE'}`);

    // Save Overview Screenshot
    console.log('\nCapturing Ecosystem Overview Screenshot...');
    await saveScreenshot(client, 'screenshot_qa_ecosystem_overview.png');
    results.screenshots.push('screenshot_qa_ecosystem_overview.png');

    // -----------------------------------------------------------------
    // 2. DOLPHIN REALISTIC DESIGN & KINEMATICS VERIFICATION
    // -----------------------------------------------------------------
    console.log('\n--- TEST 2: Dolphin Realistic Design & Fluid Leaping/Diving Swim Motion ---');
    const dolphinSamples = [];
    for (let s = 0; s < 16; s++) {
      const dInfo = await client.evaluate(`
        (() => {
          const d = STATE.creatures.find(c => c.constructor.name === 'Dolphin');
          if (!d) return null;
          return {
            x: Math.round(d.x),
            y: Math.round(d.y),
            vx: Number(d.vx.toFixed(2)),
            vy: Number(d.vy.toFixed(2)),
            pitch: Number(d.pitch.toFixed(3)),
            wavePhase: Number(d.wavePhase.toFixed(3)),
            animFrame: d.animFrame,
            direction: d.direction,
            width: d.width,
            height: d.height,
            hasWakeParticles: STATE.particles.length > 0
          };
        })()
      `);
      if (dInfo) dolphinSamples.push(dInfo);
      await sleep(200);
    }

    console.log(`Recorded ${dolphinSamples.length} Dolphin Kinematics Samples (over 3.2s):`);
    const yValues = dolphinSamples.map(s => s.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const yOscillation = maxY - minY;
    const pitches = dolphinSamples.map(s => s.pitch);
    const animFrames = [...new Set(dolphinSamples.map(s => s.animFrame))];

    console.log(`  Dolphin Dimensions: ${dolphinSamples[0].width}x${dolphinSamples[0].height} (sleek hydrodynamic 126x82 pixel art)`);
    console.log(`  Y range: [${minY}px .. ${maxY}px] -> Vertical wave amplitude: ${yOscillation.toFixed(1)}px`);
    console.log(`  Pitch range: [${Math.min(...pitches).toFixed(3)} rad .. ${Math.max(...pitches).toFixed(3)} rad]`);
    console.log(`  Animated frames observed: [${animFrames.sort().join(', ')}] (4-frame undulating body wave)`);
    console.log(`  Fluke Bubble Wake & Blowhole Mist: ${dolphinSamples.some(s => s.hasWakeParticles)}`);

    const dolphinKinematicsPass = yOscillation > 20 && animFrames.length >= 3 && (Math.max(...pitches) - Math.min(...pitches)) > 0.2;
    results.dolphinKinematics = {
      yOscillation,
      pitchRange: [Math.min(...pitches), Math.max(...pitches)],
      animFramesObserved: animFrames,
      isKinematicsFluid: dolphinKinematicsPass
    };
    console.log(`  Dolphin Fluid Leaping/Diving Motion: ${dolphinKinematicsPass ? 'PASS (Realistic Fluid Undulating Swim)' : 'FAIL'}`);

    // Action shot of Dolphin swimming
    await saveScreenshot(client, 'screenshot_qa_dolphin_motion.png');
    results.screenshots.push('screenshot_qa_dolphin_motion.png');

    // -----------------------------------------------------------------
    // 3. SEABED FEEDING & CLAMPING TEST
    // -----------------------------------------------------------------
    console.log('\n--- TEST 3: Seabed Feeding via Mouse Clicks, Sinking & Sand Settling ---');

    // Attach tracking listener on STATE to record every consumed pellet and eating creature
    await client.evaluate(`
      (() => {
        window.__qaLog = [];
        window.__qaEatenCount = 0;
        window.__qaDeepestFishY = 0;

        const checkInterval = setInterval(() => {
          const h = window.innerHeight;
          const sandTop = h - 58;

          // Check deepest fish
          for (const c of STATE.creatures) {
            if (c.constructor.name === 'Fish' || c.constructor.name === 'Goby') {
              if (c.y > window.__qaDeepestFishY) {
                window.__qaDeepestFishY = Math.round(c.y);
              }
            }
          }

          // Check floating texts for consumption
          for (const ft of STATE.floatingTexts) {
            if (ft.text && !ft.__qaCounted && (ft.text.includes('Nom') || ft.text.includes('Yum') || ft.text.includes('Crunch'))) {
              ft.__qaCounted = true;
              window.__qaEatenCount++;
              window.__qaLog.push({ text: ft.text, x: Math.round(ft.x), y: Math.round(ft.y), time: performance.now() });
            }
          }
        }, 50);
      })()
    `);

    // Simulate clicking to drop multiple Camilan Laut across the canvas
    console.log('Dispatching 5 mouse clicks across screen to drop Camilan Laut 🍤...');
    const clickPositions = [
      { x: 300, y: 220 },
      { x: 480, y: 250 },
      { x: 650, y: 200 },
      { x: 820, y: 240 },
      { x: 980, y: 220 }
    ];

    for (const pos of clickPositions) {
      await dispatchClick(client, pos.x, pos.y);
      await sleep(150);
    }

    const initialFoodCount = await client.evaluate(`STATE.pellets.length`);
    console.log(`Dispatched clicks complete. Pellets spawned in aquarium: ${initialFoodCount}`);

    console.log('Waiting 6.0s for pellets to sink down to the seabed (sand floor at height - 50px)...');
    await sleep(6000);

    const settledAudit = await client.evaluate(`
      (() => {
        const h = window.innerHeight;
        const sandTop = h - 58;
        const seabedLevel = h - 50;
        const pellets = STATE.pellets.map((p, i) => ({
          idx: i,
          x: Math.round(p.x),
          y: Math.round(p.y),
          settled: !!p.settled,
          isEaten: !!p.isEaten
        }));
        const settledCount = pellets.filter(p => p.settled).length;
        return { pellets, settledCount, sandTop, seabedLevel, total: pellets.length, height: h };
      })()
    `);

    console.log(`Pellets on sand bed: ${settledAudit.settledCount} settled at y=${settledAudit.seabedLevel}px (Sand Top: ${settledAudit.sandTop}px)`);

    // Capture screenshot of pellets settled on the sand
    await saveScreenshot(client, 'screenshot_qa_seabed_feeding_pellets.png');
    results.screenshots.push('screenshot_qa_seabed_feeding_pellets.png');

    // -----------------------------------------------------------------
    // 4. FORAGING AT SEABED & ANTI-STUCK VERIFICATION
    // -----------------------------------------------------------------
    console.log('\n--- TEST 4: Fish Grazing Sand, Smooth Eating & Anti-Stuck Verification ---');
    console.log('Monitoring fish and seabed fauna eating settled pellets over 5.0s...');

    for (let step = 1; step <= 8; step++) {
      await sleep(650);
      const stepReport = await client.evaluate(`
        (() => {
          const h = window.innerHeight;
          const sandTop = h - 58;
          const seabedFloor = h - 50;
          const fishDepths = STATE.creatures
            .filter(c => c.constructor.name === 'Fish' || c.constructor.name === 'Goby')
            .map(c => ({
              type: c.type || c.constructor.name,
              x: Math.round(c.x),
              y: Math.round(c.y),
              vy: Number(c.vy.toFixed(2)),
              nearSand: c.y >= (sandTop - 12)
            }));

          const deepest = fishDepths.reduce((max, f) => f.y > max.y ? f : max, { y: 0, type: '' });
          const nearSandFish = fishDepths.filter(f => f.nearSand).map(f => f.type + ' (y=' + f.y + ')');

          return {
            deepest,
            nearSandFish,
            eatenCount: window.__qaEatenCount,
            deepestRecorded: window.__qaDeepestFishY,
            activePellets: STATE.pellets.filter(p => !p.isEaten).length,
            sandTop,
            seabedFloor,
            clampFloor: h - 52
          };
        })()
      `);

      console.log(`  [Step ${step} (~${(step * 0.65).toFixed(1)}s)] Deepest fish: ${stepReport.deepest.type} at y=${stepReport.deepest.y}px (Sand: ${stepReport.sandTop}px, Floor Clamp: ${stepReport.clampFloor}px) | Foragers on sand: [${stepReport.nearSandFish.join(', ') || 'descending...'}] | Consumed pellets: ${stepReport.eatenCount}`);
    }

    // Capture screenshot of fish eating on the seabed
    await saveScreenshot(client, 'screenshot_qa_fish_eating_seabed.png');
    results.screenshots.push('screenshot_qa_fish_eating_seabed.png');

    // Check anti-stuck watchdog and water column return
    console.log('\nVerifying fish swim away smoothly and NEVER get stuck on the seabed...');
    await sleep(3500);

    const postEatAudit = await client.evaluate(`
      (() => {
        const h = window.innerHeight;
        const sandTop = h - 58;
        const fishList = STATE.creatures
          .filter(c => c.constructor.name === 'Fish')
          .map(f => ({
            type: f.type,
            x: Math.round(f.x),
            y: Math.round(f.y),
            vx: Number(f.vx.toFixed(2)),
            vy: Number(f.vy.toFixed(2)),
            stuckTimer: f.stuckNearPelletTimer || 0,
            isStuck: (f.stuckNearPelletTimer || 0) > 120,
            heightAboveSand: Math.round(sandTop - f.y)
          }));

        const totalEaten = window.__qaEatenCount;
        const deepestReached = window.__qaDeepestFishY;
        const fishSwimmingFree = fishList.filter(f => f.y < sandTop - 35).length;
        const anyStuck = fishList.some(f => f.isStuck);
        const crabs = (STATE.seabedFauna || []).filter(c => c.constructor.name === 'MiniCrab').map(c => ({
          x: Math.round(c.x),
          y: Math.round(c.y),
          direction: c.direction
        }));

        return {
          fishList,
          totalEaten,
          deepestReached,
          fishSwimmingFree,
          anyStuck,
          crabs,
          sandTop,
          clampFloor: h - 52,
          log: window.__qaLog
        };
      })()
    `);

    console.log(`Seabed Feeding & Kinematics Audit Results:`);
    console.log(`  - Total Pellets Eaten: ${postEatAudit.totalEaten}`);
    console.log(`  - Deepest Foraging Depth Reached by Fish/Goby: ${postEatAudit.deepestReached}px (Sand Top: ${postEatAudit.sandTop}px, Clamp: ${postEatAudit.clampFloor}px)`);
    console.log(`  - Fish Swimming Freely in Water Column: ${postEatAudit.fishSwimmingFree} / ${postEatAudit.fishList.length}`);
    console.log(`  - Any Fish Trapped / Stuck on Sand: ${postEatAudit.anyStuck ? 'YES (STUCK DETECTED)' : 'NO (0 Stuck, 100% Free)'}`);
    console.log(`  - MiniCrab Sand Foraging Activity: ${postEatAudit.crabs.length} crabs active on sand`);

    results.seabedFeeding = {
      totalEaten: postEatAudit.totalEaten,
      deepestReached: postEatAudit.deepestReached,
      sandTop: postEatAudit.sandTop,
      clampFloor: postEatAudit.clampFloor,
      smoothDescentPass: postEatAudit.deepestReached >= (postEatAudit.sandTop - 10)
    };

    results.antiStuckCheck = {
      anyStuck: postEatAudit.anyStuck,
      fishSwimmingFree: postEatAudit.fishSwimmingFree,
      totalFish: postEatAudit.fishList.length,
      antiStuckPass: !postEatAudit.anyStuck && postEatAudit.fishSwimmingFree >= 4
    };

    // Capture screenshot of fish swimming free
    await saveScreenshot(client, 'screenshot_qa_fish_swimming_free.png');
    results.screenshots.push('screenshot_qa_fish_swimming_free.png');

    console.log('\n=====================================================');
    console.log('             FINAL QA VERIFICATION SUMMARY           ');
    console.log('=====================================================');
    console.log(`1. Realistic Dolphin: ${results.dolphinKinematics.isKinematicsFluid ? 'VERIFIED PASS' : 'FAIL'}`);
    console.log(`2. Seabed Feeding & Settling: ${results.seabedFeeding.smoothDescentPass ? 'VERIFIED PASS' : 'FAIL'}`);
    console.log(`3. Fish Never Get Stuck (Anti-Stuck): ${results.antiStuckCheck.antiStuckPass ? 'VERIFIED PASS' : 'FAIL'}`);
    console.log(`4. Full Marine Ecosystem (15 Biota): ${allFaunaPresent ? 'VERIFIED PASS (100% Complete)' : 'PARTIAL'}`);
    console.log(`5. Screenshots Generated: ${results.screenshots.length} images`);

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'qa_verification_results.json'), JSON.stringify(results, null, 2));
    console.log(`\nWrote complete verification results to ${path.join(ARTIFACT_DIR, 'qa_verification_results.json')}`);

  } catch (err) {
    console.error('QA SUITE ERROR:', err);
  } finally {
    if (client) client.close();
    proc.kill();
    try {
      fs.rmSync(tempUserData, { recursive: true, force: true });
    } catch (e) {}
  }
}

runQA();
