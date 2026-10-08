const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const puppeteer = require('/tmp/node_modules/puppeteer-core');

const APP_URL = process.env.APP_URL || 'https://nexus-sand-seven-45.vercel.app/';
const RAW_VIDEO_PATH = '/tmp/nexus_raw_screen.mp4';
const AUDIO_PATH = '/tmp/nexus_voiceover_full.mp3';
const FINAL_OUTPUT_PATH = path.resolve(__dirname, '../Nexus_Monad_Demo_Walkthrough.mp4');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('=== [1/4] Starting FFmpeg X11 Display Capture on :99 ===');
  
  if (fs.existsSync(RAW_VIDEO_PATH)) {
    fs.unlinkSync(RAW_VIDEO_PATH);
  }

  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'x11grab',
    '-draw_mouse', '1',
    '-framerate', '30',
    '-video_size', '1920x1080',
    '-i', ':99.0',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p',
    RAW_VIDEO_PATH
  ], {
    stdio: ['pipe', 'inherit', 'inherit']
  });

  // Give ffmpeg a second to initialize the grabber
  await sleep(1500);

  console.log(`=== [2/4] Launching Chromium with Puppeteer to ${APP_URL} ===`);
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
      '--start-maximized',
      '--disable-infobars',
      '--disable-extensions'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to Nexus Web Application...');
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await sleep(2000);

  console.log('Scene 1: Introducing Header & Live Monad Telemetry (0s - 12s)');
  // Gently move mouse across header
  await page.mouse.move(960, 40, { steps: 25 });
  await sleep(2000);
  await page.mouse.move(300, 40, { steps: 20 });
  await sleep(3000);
  await page.mouse.move(1600, 40, { steps: 25 });
  await sleep(4000);

  console.log('Scene 2: Scrolling to Agent Registry (12s - 25s)');
  await page.evaluate(() => {
    window.scrollBy({ top: 350, behavior: 'smooth' });
  });
  await sleep(3000);
  // Hover over agent cards
  await page.mouse.move(600, 450, { steps: 20 });
  await sleep(3000);
  await page.mouse.move(1000, 450, { steps: 20 });
  await sleep(3000);
  await page.mouse.move(1400, 450, { steps: 20 });
  await sleep(3000);

  console.log('Scene 3: Focusing Mission Directive & Setting Target (25s - 37s)');
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await sleep(2500);

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

  console.log('Scene 4: Launching Swarm Mission (37s - 45s)');
  const launchBtn = await page.$('#launch-swarm-mission-btn');
  if (launchBtn) {
    const box = await launchBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 20 });
      await sleep(1500);
      await launchBtn.click();
      console.log('Clicked Launch Swarm Mission!');
    }
  }
  await sleep(4000);

  console.log('Scene 5: Watching Live Topology & Console Reasoning (45s - 65s)');
  // Scroll down to watch the visualizer and console
  await page.evaluate(() => {
    window.scrollBy({ top: 400, behavior: 'smooth' });
  });
  await sleep(5000);

  // Mouse over active stages
  await page.mouse.move(700, 600, { steps: 25 });
  await sleep(6000);
  await page.mouse.move(1100, 600, { steps: 25 });
  await sleep(7000);

  console.log('Scene 6: Inspecting Dossier & Onchain Settlement (65s - 78s)');
  // Look for View Verified Dossier button or modal
  const viewDossierBtn = await page.$('#view-verified-dossier-btn');
  if (viewDossierBtn) {
    const box = await viewDossierBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 20 });
      await sleep(1000);
      await viewDossierBtn.click();
      console.log('Opened Verified Dossier modal!');
    }
  } else {
    // If inline, scroll down to dossier
    await page.evaluate(() => {
      window.scrollBy({ top: 350, behavior: 'smooth' });
    });
  }
  await sleep(8000);

  // Hover over onchain citations
  await page.mouse.move(960, 550, { steps: 20 });
  await sleep(5000);

  console.log('=== [3/4] Finishing Recording & Closing Browser ===');
  await browser.close();

  // Gracefully stop ffmpeg
  ffmpeg.stdin.write('q');
  await sleep(2000);
  ffmpeg.kill('SIGINT');
  await sleep(2000);

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
