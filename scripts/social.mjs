// Open Graph image: the current hero with the PDF editor selected. Needs a running site (TEST_URL).
import { chromium } from '@playwright/test';
const base = process.env.TEST_URL || 'http://127.0.0.1:4321';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
await page.goto(base, { waitUntil: 'networkidle' });
await page.locator('astro-island[component-url*="Hero"]:not([ssr])').waitFor({ state: 'attached' });
await page.addStyleTag({ content: '.site-header nav,.site-header .download-button,.hero-lede,.hero-cta,.stage-status,.stage-close{display:none!important}.hero{padding:0 64px!important;min-height:630px!important}.hero h1{font-size:74px!important}.site-header{padding:0 64px!important;height:96px!important}.stage{width:540px!important}' });
await page.getByRole('button', { name: 'Seleziona Idee.pdf' }).click();
await page.keyboard.press('Control+Alt+KeyO');
await page.getByRole('group', { name: /Ruota di ORBIT/ }).getByRole('button', { name: 'Modifica il PDF' }).hover();
await page.mouse.move(0, 0);
await page.waitForTimeout(600);
await page.screenshot({ path: 'public/assets/social.png' });
await browser.close();
console.log('public/assets/social.png');
