// End-to-end check of the landing in local Chrome: layout at four widths, the hero wheel
// (keyboard shortcut, mouse and touch), the index, anchors, accessibility (axe) and the installer bytes.
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const base = process.env.TEST_URL || 'http://127.0.0.1:4321';
const release = JSON.parse(await readFile(new URL('../src/data/release.json', import.meta.url)));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('qa', { recursive: true });
const report = { at: new Date().toISOString(), base, viewports: [], errors: [], failedRequests: [] };
const step = async (name, fn) => { try { await fn(); } catch (e) { e.message = `${name}: ${e.message}`; throw e; } };
try {
  for (const [width, height] of [[1920, 1080], [1366, 768], [390, 844], [375, 667]]) {
    const touch = width < 800;
    const context = await browser.newContext({ viewport: { width, height }, isMobile: touch, hasTouch: touch, acceptDownloads: true });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(`${width}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') report.errors.push(`${width}: ${m.text()}`); });
    page.on('response', r => { if (r.status() >= 400) report.failedRequests.push({ url: r.url(), status: r.status() }); });
    const result = { width };
    assert.equal((await page.goto(base, { waitUntil: 'networkidle' })).status(), 200);
    await page.locator('astro-island[component-url*="Hero"]:not([ssr])').waitFor({ state: 'attached' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `qa/hero-${width}.png` });

    await step('no horizontal scroll', async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width));
    await step('anchors resolve', async () => assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"],a[href^="/#"]')].map(a => a.getAttribute('href').replace(/^\//, '')).filter(h => h === '#' || !document.getElementById(h.slice(1)))), []));

    await step('hero wheel', async () => {
      if (touch) await page.getByRole('button', { name: /^Tazza\.png\s*: apri la ruota/ }).tap();
      else { await page.mouse.move(5, 300); await page.keyboard.press('Control+Alt+KeyO'); }
      const wheel = page.getByRole('group', { name: 'Ruota di ORBIT per Tazza.png' });
      await wheel.waitFor();
      if (!touch) assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('seg')), true, 'shortcut focuses the first family');
      await wheel.getByRole('button', { name: 'Modifica' }).click();
      await wheel.getByRole('button', { name: 'Rimuovi lo sfondo' }).click();
      await page.getByText('Fatto.', { exact: true }).waitFor();
      await page.getByText('Tazza senza sfondo.png').first().waitFor();
      await page.screenshot({ path: `qa/hero-result-${width}.png` });
      await page.getByRole('button', { name: 'Seleziona Idee.pdf' }).click();
      await page.getByRole('button', { name: /^Idee\.pdf\s*: apri la ruota/ }).click();
      await page.getByRole('group', { name: 'Ruota di ORBIT per Idee.pdf' }).waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('group', { name: 'Ruota di ORBIT per Idee.pdf' }).waitFor({ state: 'detached' });
    });

    await step('index', async () => {
      await page.locator('#funzioni').scrollIntoViewIfNeeded();
      await page.locator('astro-island[component-url*="Index"]:not([ssr])').waitFor({ state: 'attached' });
      await page.getByRole('searchbox', { name: 'Cerca un’operazione o un formato' }).fill('pdf ricercabile');
      await page.getByRole('button', { name: /PDF ricercabile/ }).click();
      await page.getByText('Niente con').waitFor({ state: 'detached' });
      await page.getByRole('button', { name: /^Tutte/ }).click();
      result.indexRows = await page.locator('.index-list > li').count();
      assert.equal(result.indexRows, 54);
    });

    await step('faq', async () => {
      await page.locator('#domande summary').first().click();
      assert.equal(await page.locator('#domande details[open]').count(), 1);
    });

    await page.screenshot({ path: `qa/full-${width}.png`, fullPage: true });
    const axe = await new AxeBuilder({ page }).analyze();
    result.axe = axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target.join(' ')).slice(0, 6) }));
    if (axe.violations.length) console.log(width, JSON.stringify(result.axe, null, 1));
    assert.deepEqual(axe.violations.filter(v => ['serious', 'critical'].includes(v.impact)).map(v => v.id), [], 'no serious or critical axe violations');

    if (width === 1366) await step('download', async () => {
      const href = await page.locator('.finale .download-button').getAttribute('href');
      result.download = href;
      if (href.startsWith('/downloads/')) {
        const [download] = await Promise.all([page.waitForEvent('download'), page.locator('.finale .download-button').click()]);
        const bytes = await readFile(await download.path());
        assert.equal(download.suggestedFilename(), release.file);
        assert.equal(bytes.length, release.bytes);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), release.sha256);
        await page.getByText('Download avviato.').waitFor();
        result.downloadVerified = true;
      }
      for (const path of ['/download/', '/funzionalita/', '/robots.txt']) assert.equal((await page.goto(base + path)).status(), 200, path);
    });
    report.viewports.push(result);
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failedRequests, []);
  report.ok = true;
} catch (e) {
  report.ok = false; report.failure = e.message; process.exitCode = 1; console.error(e);
} finally {
  await browser.close();
  await writeFile('qa/verification.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: report.ok, viewports: report.viewports, errors: report.errors.slice(0, 5), failure: report.failure }, null, 2));
}
