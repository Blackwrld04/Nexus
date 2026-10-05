const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
  const chrome = spawn('chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1920,1080'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const vRes = await fetch('http://localhost:9222/json/version');
    const vData = await vRes.json();
    const ws = new WebSocket(vData.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
    };

    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const curId = id++;
        callbacks.set(curId, resolve);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:5173' });
    await new Promise(r => setTimeout(r, 2000));

    const sections = [
      { id: '#overview', file: 'sec00_overview.png' },
      { id: '#topology', file: 'sec01_topology.png' },
      { id: '#execution', file: 'sec02_execution.png' },
      { id: '#contracts', file: 'sec03_contracts.png' }
    ];

    for (const sec of sections) {
      await send('Runtime.evaluate', {
        expression: `document.querySelector('${sec.id}').scrollIntoView({ block: 'start' });`
      });
      await new Promise(r => setTimeout(r, 600));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(sec.file, Buffer.from(shot.data, 'base64'));
      console.log(`Captured ${sec.file}`);
    }

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

main();
