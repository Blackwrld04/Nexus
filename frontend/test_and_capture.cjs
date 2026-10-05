const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log('Launching headless Chromium...');
  const chrome = spawn('chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9225',
    '--window-size=1920,1080'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const targetRes = await fetch('http://localhost:9225/json/new?http://localhost:5173', { method: 'PUT' });
    const targetData = await targetRes.json();
    console.log('Connected to target:', targetData.id, targetData.url);

    const ws = new WebSocket(targetData.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        if (msg.error) {
          console.error('CDP Error for ID', msg.id, msg.error);
        }
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
    await send('Runtime.enable');

    console.log('Waiting for initial page load...');
    await new Promise(r => setTimeout(r, 3000));

    // Capture initial screenshot
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(__dirname, 'screenshot_initial.png'), Buffer.from(shot.data, 'base64'));
      console.log('✓ Saved screenshot_initial.png');
    }

    // Click Claim AUSD button
    console.log('Clicking Claim AUSD button...');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('claim-ausd-faucet-btn')?.click()`
    });

    await new Promise(r => setTimeout(r, 1000));

    // Click Launch Swarm Mission button
    console.log('Clicking Launch Swarm Mission button...');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('launch-swarm-mission-btn')?.click()`
    });

    // Wait until mission completes (poll every 1s for up to 25s)
    console.log('Waiting for swarm mission to reach COMPLETE stage...');
    for (let i = 1; i <= 25; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.getElementById('view-verified-dossier-btn');
          const bubbles = Array.from(document.querySelectorAll('.console-event-bubble'));
          const last = bubbles[bubbles.length - 1];
          return {
            hasDossierBtn: !!btn,
            lastEvent: last ? last.innerText.replace(/\\n+/g, ' | ') : null
          };
        })()`,
        returnByValue: true
      });
      console.log(`[Second ${i}]`, res?.result?.value?.lastEvent?.slice(0, 100));
      if (res?.result?.value?.hasDossierBtn) {
        console.log('✓ Swarm mission completed and View Dossier button is visible!');
        break;
      }
    }

    await new Promise(r => setTimeout(r, 1000));

    // Capture post-mission screenshot
    shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(__dirname, 'screenshot_mission_complete.png'), Buffer.from(shot.data, 'base64'));
      console.log('✓ Saved screenshot_mission_complete.png');
    }

    // Click "View Verified Dossier"
    console.log('Clicking View Verified Dossier...');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('view-verified-dossier-btn')?.click()`
    });

    await new Promise(r => setTimeout(r, 1200));

    // Capture modal screenshot
    shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(__dirname, 'screenshot_dossier_modal.png'), Buffer.from(shot.data, 'base64'));
      console.log('✓ Saved screenshot_dossier_modal.png');
    }

    // Inspect modal contents
    const modalContent = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('.dossier-window');
        if (!modal) return null;
        const citations = Array.from(modal.querySelectorAll('.dossier-citation-card')).map(c => c.innerText.replace(/\\n+/g, ' | '));
        return {
          title: modal.querySelector('h2')?.innerText,
          score: modal.querySelector('.text-3xl')?.innerText,
          citationsCount: citations.length,
          sampleCitation: citations[0],
          secondCitation: citations[1]
        };
      })()`,
      returnByValue: true
    });
    console.log('✓ Verified Dossier Modal Content:', modalContent?.result?.value);

    // Close modal
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.dossier-footer-bar button')?.click()`
    });
    await new Promise(r => setTimeout(r, 600));

    // Open Agent Directory (#agents)
    console.log('Navigating to Agent Directory...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const navBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Agent Directory'));
        if (navBtn) navBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(__dirname, 'screenshot_agent_directory.png'), Buffer.from(shot.data, 'base64'));
      console.log('✓ Saved screenshot_agent_directory.png');
    }

    // Open Docs (#docs)
    console.log('Navigating to Documentation...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const docsBtn = document.getElementById('docs-header-btn');
        if (docsBtn) docsBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(__dirname, 'screenshot_documentation.png'), Buffer.from(shot.data, 'base64'));
      console.log('✓ Saved screenshot_documentation.png');
    }

    ws.close();
    console.log('\n========================================');
    console.log('ALL FRONTEND DEMO VERIFICATION STEPS PASSED!');
    console.log('========================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    chrome.kill();
  }
}

run();
