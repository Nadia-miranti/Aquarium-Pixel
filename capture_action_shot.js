const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ARTIFACT_DIR = 'C:\\Users\\Nadia\\.gemini\\antigravity\\brain\\969d87b2-76a8-453d-82d2-d90dd398a55a';
const PROJECT_DIR = 'C:\\Data Nadia\\01_Coding_Projects\\aquariumproject';

async function captureAction() {
  const tempUserData = path.join(os.tmpdir(), 'chrome_qc_snap_' + Date.now());
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    `--user-data-dir=${tempUserData}`,
    '--window-size=1280,800',
    'http://localhost:8080/'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9226/json/list');
  const pages = await res.json();
  const page = pages.find(p => p.url.includes('localhost:8080'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(r => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          r(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Dismiss splash screen completely
  await send('Runtime.evaluate', {
    expression: `
      if (typeof endSplashScreen === 'function') endSplashScreen();
      const splash = document.getElementById('splash-screen');
      if (splash) splash.remove();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // Drop food in multiple spots
  await send('Runtime.evaluate', {
    expression: `
      dropCamilanLaut(420, 260);
      dropCamilanLaut(650, 220);
      dropCamilanLaut(820, 280);
    `
  });
  
  // Wait 400ms so shrimp pellets and burst particles are mid-water
  await new Promise(r => setTimeout(r, 400));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot_camilan_falling_action.png'), Buffer.from(snap.data, 'base64'));
  fs.writeFileSync(path.join(PROJECT_DIR, 'screenshot_camilan_falling_action.png'), Buffer.from(snap.data, 'base64'));
  console.log('Action screenshot saved!');

  ws.close();
  proc.kill();
  try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch(e) {}
}
captureAction();
