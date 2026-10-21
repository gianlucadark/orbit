# Materiali e design system

- Marchio: geometria di `../src/components/Brand.tsx`; favicon e Mark.astro ne mantengono i tre elementi.
- Ruota: copia di `../src/components/Wheel.tsx`, `present.ts`, `types.ts`; adattatore di traduzione italiano locale.
- Palette/font: `../src/App.css`. Nessun webfont da terzi. I font di sistema non sono redistribuiti.
- `tazza.webp`: ottimizzazione di `../promo/orbit-launch/public/tazza.png`, scena Three.js originale del progetto.
- `tazza-cutout.webp`: output reale del worker ORBIT già presente come tazza-ritagliata.png nel promo.
- `scan-demo.png`: fixture originale dal promo; testo OCR verificabile in public/ocr-demo.txt.
- `qr-demo.svg`: encoder ORBIT, testo innocuo “ORBIT - DEMO CINEMATOGRAFICA”; non un trasferimento reale.
- `orbit-film.mp4`: copia di output/orbit-launch-muted.mp4 (9.948.602 byte), solo a richiesta con preload=none.
- `film-poster.webp`: cover originale del promo ottimizzata; nessuna preview di prodotti terzi.
- `social.png`: SVG originale rasterizzato per Open Graph via sharp; fonte in scripts/social.mjs, richiamata anche da scripts/assets.mjs.
- Icone Lucide ISC, Motion MIT, React MIT, Astro MIT, Tailwind MIT. GSAP secondo la licenza del pacchetto installato.
  Licenze complete incluse dai rispettivi pacchetti npm e lockfile. Per materiali promo vedi anche
  `../promo/orbit-launch/ASSETS-AND-LICENSES.md` e `licenses/`.

## Scelte di rendering — revisione 02

La nuova direzione usa inchiostro, arancio e crema del prodotto, con superfici piatte e
tipografia Segoe UI. La pergamena, i corsivi e l'astrolabio decorativo della prima versione
sono stati sostituiti da un'interazione diretta con un file dimostrativo.

Astro mantiene statici i contenuti. HeroDesk è una demo React con trascinamento tramite
Pointer Events, cattura del puntatore, annullamento del gesto e alternative a pulsante/tastiera.
I quattro comandi mostrano anteprime preparate: nessun provider nativo Windows viene eseguito
nel browser, e il QR non apre una condivisione reale. La ruota del playground resta quella
del prodotto, isolata dal codice desktop.

Le scene sono DOM, SVG e trasformazioni CSS con GSAP ScrollTrigger: nessun runtime WebGL.
Lo scroll rimane nativo. Il passaggio al telefono muove un file tra i due dispositivi; la scansione
OCR segue l'avanzamento della sezione. Il sito rispetta prefers-reduced-motion e offre un
comando per fermare i movimenti automatici della prima scena. Questi si fermano anche
quando escono dallo schermo. Nessun audio o video parte automaticamente.

Su mobile cambia la composizione del titolo e la demo precede il download nel DOM e nella
lettura visiva. I file rimangono locali, senza upload né servizi esterni.
