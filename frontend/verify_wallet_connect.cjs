const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testWallet() {
  console.log('Testing Wallet Connection with injected Web3 provider...');
  const chrome = spawn('chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9226',
    '--window-size=1920,1080'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const targetRes = await fetch('http://localhost:9226/json/new?http://localhost:5173', { method: 'PUT' });
    const targetData = await targetRes.json();
    const ws = new WebSocket(targetData.webSocketDebuggerUrl);

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

    // Inject simulated MetaMask / Rabby provider before page scripts execute
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        window.ethereum = {
          isMetaMask: true,
          chainId: '0x279f',
          request: async ({ method, params }) => {
            console.log('[MockWeb3] RPC Request:', method, params);
            if (method === 'eth_requestAccounts') return ['0x71C836471a932F272379A5e840a1290384aF1029'];
            if (method === 'eth_accounts') return ['0x71C836471a932F272379A5e840a1290384aF1029'];
            if (method === 'eth_chainId') return '0x279f';
            if (method === 'wallet_switchEthereumChain') return null;
            if (method === 'wallet_addEthereumChain') return null;
            return null;
          },
          on: (event, handler) => {},
          removeListener: (event, handler) => {}
        };
      `
    });

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Navigating to http://localhost:5173...');
    await send('Page.navigate', { url: 'http://localhost:5173' });
    await new Promise(r => setTimeout(r, 2500));

    // Check if auto-connected
    const walletCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const pill = document.querySelector('header a[href*="monadscan.com/address"]');
        return {
          connectedPillFound: !!pill,
          pillText: pill ? pill.innerText.replace(/\\n+/g, ' ') : null,
          href: pill ? pill.href : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Wallet state on page load:', walletCheck?.result?.value);

    // Capture screenshot of connected header
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(__dirname, 'screenshot_wallet_connected.png'), Buffer.from(shot.data, 'base64'));
      console.log('✓ Saved screenshot_wallet_connected.png');
    }

    ws.close();
  } catch (err) {
    console.error('Wallet test error:', err);
  } finally {
    chrome.kill();
  }
}

testWallet();
