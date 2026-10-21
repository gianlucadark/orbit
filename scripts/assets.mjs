import sharp from 'sharp';
await sharp('assets/tazza.png').resize(800).webp({quality:83}).toFile('public/assets/tazza.webp');
await sharp('assets/tazza-ritagliata.png').resize(800).webp({quality:85}).toFile('public/assets/tazza-cutout.webp');
// social.png: run scripts/social.mjs against a running site.
// film-poster-wide.webp: frame at 21.8 s of ../promo/orbit-launch/output/orbit-launch-landscape.mp4.
console.log('Optimized original ORBIT assets + OG preview generated.');
