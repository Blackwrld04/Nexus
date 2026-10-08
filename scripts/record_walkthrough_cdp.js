const puppeteer = require('/tmp/node_modules/puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const RAW_VIDEO_PATH = '/tmp/nexus_cdp_raw.mp4';
const AUDIO_PATH = '/tmp/nexus_voiceover_full.mp3';
const FINAL_OUTPUT_PATH = path.resolve(__dirname, '../Nexus_Monad_Demo_Walkthrough.mp4');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('=== [1/4] Initializing FFmpeg Image Pipe (1080p, 20 FPS) ===');
  
  if (fs.existsSync(RAW_VIDEO_PATH)) {
    fs.unlinkSync(RAW_VIDEO_PATH);
  }

  const FPS = 20;
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(FPS),
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p',
    RAW_VIDEO_PATH
  ]);

  ffmpeg.stderr.on('data', () => {});

  console.log(`=== [2/4] Launching Chromium to ${APP_URL} ===`);
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
      '--disable-infobars',
      '--disable-extensions'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to Nexus Web Application...');
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await sleep(1500);

  // Set up Chrome DevTools Protocol Screencast
  const client = await page.target().createCDPSession();
  let latestFrame = null;
  client.on('Page.screencastFrame', async (event) => {
    latestFrame = Buffer.from(event.data, 'base64');
    await client.send('Page.screencastFrameAck', { sessionId: event.sessionId });
  });

  await client.send('Page.startScreencast', { format: 'jpeg', quality: 85, everyNthFrame: 1 });

  // Wait for the first frame
  while (!latestFrame) {
    await sleep(50);
  }

  // Stream frames at exactly 20.00 FPS constant framerate
  let streaming = true;
  const frameIntervalMs = 1000 / FPS;
  const timer = setInterval(() => {
    if (streaming && latestFrame) {
      try {
        ffmpeg.stdin.write(latestFrame);
      } catch (e) {}
    }
  }, frameIntervalMs);

  console.log('=== [3/4] Executing Synced Choreography ===');

  // Scene 1: Header & Live Monad Telemetry (0s - 12s)
  console.log('Scene 1: Header & Live Monad Telemetry (0s - 12s)');
  await page.mouse.move(960, 40, { steps: 15 });
  await sleep(3000);
  await page.mouse.move(500, 300, { steps: 20 });
  await sleep(4000);
  await page.mouse.move(1400, 40, { steps: 20 });
  await sleep(5000);

  // Scene 2: Scroll to Agent Registry (12s - 25s)
  console.log('Scene 2: Agent Registry (12s - 25s)');
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy({ top: 18, behavior: 'instant' }));
    await sleep(50);
  }
  await sleep(3000);
  await page.mouse.move(600, 450, { steps: 15 });
  await sleep(3000);
  await page.mouse.move(1000, 450, { steps: 15 });
  await sleep(3000);
  await page.mouse.move(1400, 450, { steps: 15 });
  await sleep(3000);

  // Scene 3: Scroll to Mission Directive & Set Preset (25s - 37s)
  console.log('Scene 3: Mission Directive (25s - 37s)');
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy({ top: -18, behavior: 'instant' }));
    await sleep(50);
  }
  await sleep(2000);

  // Click on the preset button
  const presetBtn = await page.$('button::-p-text("Full Closed-Loop Audit")');
  if (presetBtn) {
    const box = await presetBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 15 });
      await sleep(1000);
      await presetBtn.click();
    }
  }
  await sleep(4000);

  // Scene 4: Launching Swarm Mission (37s - 45s)
  console.log('Scene 4: Launching Swarm (37s - 45s)');
  const launchBtn = await page.$('#launch-swarm-mission-btn');
  if (launchBtn) {
    const box = await launchBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 15 });
      await sleep(1500);
      await launchBtn.click();
      console.log('Clicked Launch Swarm Mission!');
    }
  }
  await sleep(4000);

  // Scene 5: Watching Live Topology & Console Reasoning (45s - 55s)
  console.log('Scene 5: Watching Live Topology & Console (45s - 55s)');
  for (let i = 0; i < 25; i++) {
    await page.evaluate(() => window.scrollBy({ top: 22, behavior: 'instant' }));
    await sleep(40);
  }
  await sleep(3000);
  await page.mouse.move(750, 500, { steps: 20 });
  await sleep(4000);
  await page.mouse.move(1150, 500, { steps: 20 });
  await sleep(3000);

  // Scene 6: Final Explainable Dossier & Settlement (55s - 67s)
  console.log('Scene 6: Final Dossier & Settlement (55s - 67s)');
  const viewDossierBtn = await page.$('#view-verified-dossier-btn');
  if (viewDossierBtn) {
    const box = await viewDossierBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 15 });
      await sleep(800);
      await viewDossierBtn.click();
      console.log('Opened Verified Dossier modal!');
    }
  } else {
    for (let i = 0; i < 25; i++) {
      await page.evaluate(() => window.scrollBy({ top: 25, behavior: 'instant' }));
      await sleep(40);
    }
  }
  await sleep(6000);

  // Hover over onchain proofs
  await page.mouse.move(960, 550, { steps: 20 });
  await sleep(5000);

  // Wrap up
  streaming = false;
  clearInterval(timer);
  await client.send('Page.stopScreencast');
  await browser.close();
  ffmpeg.stdin.end();

  await new Promise((resolve) => ffmpeg.on('close', resolve));
  console.log('Raw CDP video recording complete!');

  console.log('=== [4/4] Muxing Screen Recording with Neural Voiceover ===');
  const muxProcess = spawn('ffmpeg', [
    '-y',
    '-i', RAW_VIDEO_PATH,
    '-i', AUDIO_PATH,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    FINAL_OUTPUT_PATH
  ], { stdio: 'inherit' });

  muxProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`\n🎉 SUCCESS! Walkthrough video created at: ${FINAL_OUTPUT_PATH}`);
      const stats = fs.statSync(FINAL_OUTPUT_PATH);
      console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    } else {
      console.error(`Muxing failed with code ${code}`);
    }
  });
}

main().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
