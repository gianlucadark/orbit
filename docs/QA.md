# Verifica della consegna — revisione visiva 02

Eseguita il 21 ottobre 2026 sulla build statica locale, con Chrome e Playwright.
Evidenze riproducibili: `qa/verification.json`, `qa/production.json` e `qa/hero-interactions.json`.

## Esiti

| Controllo | Esito |
| --- | --- |
| Build Astro e controllo TypeScript | Completati senza errori |
| Responsive 1920×1080, 1366×768, 390×844, 375×667 | Nessuno scorrimento orizzontale |
| axe WCAG 2 A/AA e 2.1 AA, quattro viewport | Zero violazioni rilevate |
| Console JavaScript | Nessun errore |
| Richieste nella verifica della build | Nessun fallimento |
| Hero: quattro comandi, reset e tastiera | Verificati |
| Trascinamento del file nella hero | Mouse desktop e touch mobile emulato verificati |
| Pausa e ripresa del movimento | Verificate |
| CTA desktop nel primo schermo | Verificata |
| Quattro file demo, selezione e risultato | Verificati |
| Ruota: puntatore, touch emulato, tastiera e OCR | Verificati |
| Ricerca, filtri, stato vuoto, FAQ | Verificati |
| Catalogo completo senza JavaScript | Verificato |
| Confronto immagini, estremi da tastiera | Verificato |
| Video MP4: riproduzione effettiva e pausa | Verificati |
| Installer: download nel browser, dimensione e SHA-256 | Verificati |
| Audit del prodotto | 54 voci; 28 sorgenti dell'app invariati |

Il download restituisce `ORBIT_0.8.0_x64-setup.exe`, 10.241.862 byte,
SHA-256 `e6fb71c87e58fd35527b3ddf0cd05f2df353301272858b9d4645e55b1080e980`.
È stata verificata anche l'esclusione dell'installer dalla build pubblica standard.
La build lasciata in anteprima include invece il download locale esplicitamente etichettato.

## Evidenze visive

La cartella `qa/` contiene immagini hero, playground, telefono, explorer e pagina intera
per ciascuna delle quattro larghezze. I file PNG sono locali e ignorati da Git.
La composizione desktop e quella mobile sono state anche ispezionate visivamente.
Le prove con animazioni attive controllano anche che la larghezza del documento rimanga
uguale al viewport: verificato a 1366 e 390 px. L’ordine dei controlli nel DOM segue
la composizione mobile, senza salti di focus tra download e demo.

## Prestazioni osservate

Misure locali senza limitazione di rete o CPU, non punteggi Lighthouse né Core Web Vitals sul campo:

| Larghezza | LCP | CLS |
| --- | --- | --- |
| 1366 px | 616 ms | 0 |
| 390 px | 88 ms | 0 |

Immagine hero circa 10 KB; filmato senza preload o autoplay.
Il report di produzione contiene dimensioni dei bundle e richieste osservate.
Questi numeri non rappresentano prestazioni garantite su rete mobile o dispositivi meno potenti.

## Ripetere i controlli

Con dipendenze installate, download preparato e server locale attivo:

```powershell
npm test
node scripts/check-production.mjs
node scripts/check-hero.mjs
npm run audit:check
```

## Verifiche ancora esterne al sito

I controlli automatici non sostituiscono una revisione con screen reader o dispositivi fisici.
Il playground usa esempi dimostrativi: non esegue i provider nativi Windows nel browser.
Non è stata eseguita un'installazione su Windows pulito, né un trasferimento con telefono fisico
e firewall reale. L'installer è privo di firma Authenticode. I limiti dei provider, codec e lingue
OCR sono elencati in `FEATURE_AUDIT.md`.

Nessun deploy pubblico è stato effettuato. Dominio e URL HTTPS dell'installer devono essere
configurati e verificati seguendo `DEPLOY.md` prima della pubblicazione.
