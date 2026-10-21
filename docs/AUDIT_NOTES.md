# ORBIT 0.8.0 — audit del prodotto e della comunicazione

Data: 21 ottobre 2026. Ambito: repository locale ORBIT; landing separata in `website/`.
Documento completo generato da queste note + `src/data/features.ts` tramite `node scripts/audit.mjs`.

## Fonti e criterio di verità

Esaminati README (ancora template), PROGRESS, docs/ARCHITECTURE, CONVERSIONS e WINDOWS-INTEGRATION;
registro Rust, dispatcher e provider, PDF, archivi, OCR, server LAN, modelli, worker/coda,
integrazione Shell, Tauri/Cargo e UI React (Wheel, present, tipi, Workspace, RadialMenu, Brand).
Esaminati audit, licenze, materiali e risultati dei test in promo/orbit-launch.
Il codice attuale prevale sui documenti superati: CONVERSIONS dice ancora che audio/video non sono
implementati, ARCHITECTURE contiene una precedente nota sul WebP, WINDOWS-INTEGRATION conserva
la vecchia esclusione della selezione Explorer. La landing non ripete queste informazioni obsolete.

“Implementata” significa percorso completo registro → dispatcher/provider → UI, con test disponibili;
non certificazione di ogni formato, PC o interazione Windows. Non è stata eseguita una nuova suite Rust
integrale in questa attività di sito. I test frontend dell'app sono stati rieseguiti: 14/14 passati.
`source-fingerprints.json` registra gli hash dei moduli: `npm run audit:check` rileva cambiamenti successivi.

## Inventario completo e copertura

46 ID operazione, inclusi i target generati dai cicli nel registro; 8 strumenti/workflow UI.
Tutte le 54 voci sono nel catalogo interattivo e nel catalogo HTML senza JavaScript.
Resize/qualità/preset/intervalli/limiti sono opzioni, non funzioni aggiuntive conteggiate artificialmente.
Le direzioni dei dati derivano da `data::targets`; nessuna promessa “qualsiasi formato verso qualsiasi altro”.
Batch significa selezione con operazioni comuni, coda sequenziale e annullamento; mai elaborazione parallela.

## Priorità editoriale

| Funzione | Valore distintivo | Rappresentazione |
|---|---|---|
| Menu contestuale a famiglie | Interazione originale e utile su Windows | Hero ad astrolabio + copia isolata di Wheel.tsx nel playground React |
| Invio al telefono | Passaggio fra dispositivi senza cloud | Scena prospettica PC/QR/telefono con arco legato allo scroll |
| Rimozione sfondo | Risultato immediatamente leggibile | Slider prima/dopo sugli output reali del worker già presenti nel promo |
| OCR | Riuso del contenuto, offline | Scansione autentica del fixture e testo realmente riconosciuto |
| SVG, PDF, media, dati, archivi | Profondità funzionale | Explorer consultabile e film originale di prodotto |

Le simulazioni non accedono ai file del visitatore, non eseguono Rust nel browser e non dichiarano
tempi o percentuali di risparmio reali. Il QR dimostrativo contiene solo `ORBIT - DEMO CINEMATOGRAFICA`.
Non mostra una URL LAN o un token reale. La scena telefono ricostruisce il flusso, senza inventare
una notifica di ricezione sul desktop. La demo sfondo mostra un vero output già generato dal motore.

## Evidenze dei test del prodotto (presenti nel repository)

`src-tauri/tests/engines.rs`: test raster/resize/SVG, vettorizzazione, PDF merge/split/rotate/ranges,
renderer Windows, archivi round-trip/repack/traversal, cancellazione/no-overwrite/limiti, LibreOffice,
OCR/searchable PDF, dati, QR generate/read, WebP/ICO/target-size, privacy/PDF compression, modelli sfondo,
video/MP3/GIF e server HTTP LAN con token e path non validi. Il test ISNet è condizionale alla presenza
del modello. PROGRESS e promo/qa registrano esecuzioni precedenti, non sostituite da un’affermazione
di nuova esecuzione in questa attività.

## Funzioni implementate ma condizionali / verifiche manuali aperte

- LibreOffice: PDF da documenti, TXT da DOCX; disabilitate dal registro se il provider non è rilevato.
- OCR: richiede almeno una lingua OCR Windows; nessun modello lingua distribuito dal sito.
- HEIC/HEIF/AVIF: codec Windows; test storico con payload PNG non prova file HEIC/AVIF reali.
- Video/audio: codec Windows; WebM, OGG/Opus, video lunghi e 4K da verificare. Nessuna promessa universale.
- Ritaglio: Windows ML CPU; U²-Netp incluso, ISNet facoltativo (178.648.008 byte, checksum verificato
  durante download). Capelli, peli e sfocature hanno risultati variabili; grandi batch non certificati.
- Shell: selezione Explorer/Desktop, hotkey e cattura implementate. Restano prove umane su schede
  Explorer, multiselezione nel menu contestuale, drag durante hotkey, multi-monitor e DPI.
- Telefono: server HTTP reale testato nel repository; scaricamento su telefono fisico e firewall da
  validare. Solo 1–50 file, no cartelle; rete LAN raggiungibile, PC acceso, token casuale, 600 secondi,
  Stop e una sessione attiva. HTTP locale, nessuna promessa di cifratura end-to-end.
- PDF: niente password; merge con moduli interattivi rifiutato. Compressione limitata alle immagini
  supportate, nessuna riduzione garantita. GIF/TIFF: solo primo frame/pagina nelle conversioni immagini.
- Metadati: JPEG orientati possono essere ruotati e ricodificati. Non promettere sempre zero ricompressione.

## Escluse perché assenti, non offerte o non verificate

RAR, PDF → DOCX, ODT → DOCX (trattenuta nel codice per fedeltà non validata), mantenimento generale dei
metadati/profili, app Android/iOS, sincronizzazione cloud, auto-update pubblico, versioni ARM,
conversioni universalmente lossless, cattura globale del trascinamento, shell extension moderna,
parallelo CPU/GPU, account, telemetria, pricing/licenza commerciale o gratuità permanente.
Non sono vendute come funzioni disponibili. Nessuna recensione, premio, benchmark o numero di utenti inventato.

## Distribuzione verificata

- `package.json`, Cargo.toml e tauri.conf.json concordano su **0.8.0**.
- `release/ORBIT_0.8.0_x64-setup.exe`: **10.244.343 byte**, NSIS x64, utente corrente.
- SHA-256: `f030381ad1dd16f9648302500b7bf10e59da19ef67c5e24018905762b12198e3`.
- Header MZ/PE verificati; hash coincidente con output `src-tauri/target/release/bundle/nsis`.
- Authenticode: **NotSigned**. Log build Tauri: EXIT 0, 21 ottobre 2026.
- Download effettivo dal browser locale confrontato con dimensione e hash; non solo click.
- Nessuna installazione nuova e nessuna certificazione clean-room eseguite.
- La cartella non è un repository Git: `git remote -v` restituisce “not a git repository”.
  Nessun GitHub remoto o asset pubblico può essere verificato da queste informazioni.
- Download locale dichiarato come tale; installer ignorato da Git; build pubblica predefinita
  rimuove il binario locale da dist. Pubblicazione non effettuata, come richiesto.
- Requisito esposto: Windows x64; API Windows 10/11, WebView2 e Windows ML. Nessun minimo RAM o
  compatibilità universale inventata. Modello sfondo su Windows pre-1809 non validato.

## Identità e materiali

Palette Pergamena `#ebe2cd`, superficie `#f6f0e1`, testo `#2f2012`, accento `#9c4326`;
Inchiostro `#17120d`, testo `#eee3c9`, accento `#d4734d`. Font di sistema Segoe UI e Palatino/Georgia,
nessun font commerciale redistribuito. Marchio attuale da `src/components/Brand.tsx`, non l’antica icona
verde in assets. Geometria e famiglie originali della ruota copiate in website e adattate solo
per stato dimostrativo, italiana, tastiera web; nessuna dipendenza dall'app o da Tauri a runtime.
Tazza, ritaglio, scansione, QR e film: provenienza originale nel promo, dettagli in ASSETS.md.

## Registro per funzione

La tabella seguente è generata dal dataset che alimenta la landing. I riferimenti sono relativi
alla radice ORBIT. Per ogni voce, eventuali condizioni o verifiche pendenti sono visibili anche al visitatore.
