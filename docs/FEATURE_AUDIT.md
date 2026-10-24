# ORBIT 0.10.0 — audit del sito

Aggiornamento: 24 ottobre 2026. Ambito: comunicazione, catalogo, demo web e film.
Il codice dell’app desktop non è stato modificato in questa attività.

## Fonti e verifica

La base 0.8 è stata confrontata con le impronte già registrate. I provider invariati
mantengono i limiti documentati nel catalogo. Riesaminati i percorsi cambiati:
registro e presentazione della ruota, dispatcher, comandi, worker, integrazione Windows,
configurazione Tauri e conversioni Office. Il nuovo editor è stato esaminato nei suoi
modelli, strumenti UI, firma, ricerca, oscuramento, riscrittura e salvataggio PDFium.
Le nuove impronte includono UI editor, surgery/content e provider Microsoft Office.

Questo è un audit delle affermazioni del sito rispetto al codice, non una certificazione
forense né una nuova esecuzione completa dei test Rust o dell’installer su Windows pulito.
Le verifiche browser e dei film sono descritte in UPDATE_0.10.md.

## Editor PDF

- `pdf:edit` è offerto per un singolo PDF; apre una finestra editor, non un job di conversione.
- Correzione del testo e trova/sostituisci. Il font incorporato è riutilizzato quando
  contiene i caratteri necessari; può servire un font locale alternativo.
- Testo, immagini, disegno, evidenziatore, gomma. Firma disegnata o digitata, con memoria
  locale facoltativa. Non viene descritta come firma digitale certificata.
- Riordino, rotazione, eliminazione e inserimento di pagine vuote; confronto con l’originale.
- Ricerca privacy: email, telefoni, IBAN, carte, codice fiscale e partita IVA.
  Alcuni tipi vengono validati tramite checksum. Nessuna promessa di rilevamento completo.
- La ricerca usa il testo della pagina. Una scansione può essere oscurata manualmente;
  il sito non promette modifica diretta o scansione privacy automatica del testo fotografato.
- L’oscuramento rimuove i contenuti selezionati al salvataggio. Il motore riscrive il contenuto,
  sostituisce le parti raster interessate e ripulisce gli oggetti non referenziati; se la
  pulizia fallisce con oscuramenti presenti, il salvataggio fallisce. Sono possibili fallback
  raster. Non si promette conservazione universale di tutti i font, vettori o strutture PDF.
- Si salva una copia; l’originale resta intatto. Il sito ricorda di condividere la nuova copia.
- La demo è una ricostruzione HTML con dati fittizi, dichiarata come dimostrazione.
  Nessun upload, elaborazione di PDF personali o falso salvataggio dal browser.

## Office e catalogo

63 voci: 55 operazioni, incluso l’editor come singola operazione, e 8 workflow Windows.
Le opzioni dell’editor non gonfiano il conteggio delle operazioni.
I target Office sono ricavati da `office::targets`: PDF, TXT, DOCX, XLSX, PPTX,
ODT, ODS, ODP, RTF ed EPUB. I formati in ingresso sono dichiarati per target.
Microsoft Office o LibreOffice devono essere installati; EPUB richiede LibreOffice.
PDF → Word può cambiare impaginazione: Word ricostruisce il flusso, LibreOffice usa caselle.
I PDF cifrati restano esclusi dalle conversioni tradizionali; l’editor ha un proprio
percorso di apertura con password. Il catalogo non estende le sue capacità alle altre operazioni.

## Distribuzione

La configurazione app e release.json indicano 0.10.0. Il file locale
`release/ORBIT_0.10.0_x64-setup.exe` è di 13.779.135 byte (13,8 MB decimali).
SHA-256 ricalcolato: `36ed5da2f78d976dd9026369cd6276b4c36eaf6c3b75c309798c4c119983a110`.
Il sito usa peso e data dal manifest, eliminando i valori fissi della 0.8.
URL GitHub e stato NotSigned già presenti nel manifest sono conservati.
Non è stato riscaricato né reinstallato l’asset remoto in questa attività.
Il repository Git del sito è in website/, con remoto gianlucadark/orbit.
Nessun push o deploy è incluso nella verifica locale.

## Limiti che restano validi

OCR: lingue Windows; HEIC/AVIF e media: codec installati. Sfondo: Windows ML,
modello qualità opzionale da 178,6 MB. GIF/TIFF: primo frame/pagina nelle conversioni.
Unione PDF: moduli interattivi esclusi. Compressione PDF: immagini compatibili,
nessuna riduzione garantita. LAN: stessa rete, PC acceso, collegamento temporaneo;
nessuna promessa di cifratura end-to-end. Batch sequenziale, non parallelo.
Nessuna nuova certificazione su telefono fisico, DPI, shell, grandi video o clean install.

## Identità e materiali

Palette carta/inchiostro e font di sistema conservati. Nuovo documento fittizio
Studio Forma, firma vettoriale dimostrativa e oscuramenti costruiti in React/CSS/SVG.
La stessa scena compare nel film, a 15,5–19,5 secondi, al posto del precedente montage.
Durata 24 s, 30 fps e colonna sonora conservate. Nessun nuovo asset generato con IA.

## Registro per funzione

La tabella seguente deriva dallo stesso dataset del catalogo interattivo e di quello HTML.


## Immagini

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `image:png` — Converti in PNG | `src-tauri/src/converters/images.rs` | Implementata nel codice. HEIC/HEIF/AVIF richiedono le estensioni HEIF e HEVC (o AV1) del Microsoft Store. | Catalogo interattivo + accessibile. Larghezza / altezza. Qualità JPG e WebP; WebP 100 senza perdita. GIF e TIFF: primo frame/pagina. |
| `image:jpg` — Converti in JPG | `src-tauri/src/converters/images.rs` | Implementata nel codice. HEIC/HEIF/AVIF richiedono le estensioni HEIF e HEVC (o AV1) del Microsoft Store. | Catalogo interattivo + accessibile. Larghezza / altezza. Qualità JPG e WebP; WebP 100 senza perdita. GIF e TIFF: primo frame/pagina. |
| `image:webp` — Converti in WEBP | `src-tauri/src/converters/images.rs` | Implementata nel codice. HEIC/HEIF/AVIF richiedono le estensioni HEIF e HEVC (o AV1) del Microsoft Store. | Catalogo interattivo + accessibile. Larghezza / altezza. Qualità JPG e WebP; WebP 100 senza perdita. GIF e TIFF: primo frame/pagina. |
| `image:bmp` — Converti in BMP | `src-tauri/src/converters/images.rs` | Implementata nel codice. HEIC/HEIF/AVIF richiedono le estensioni HEIF e HEVC (o AV1) del Microsoft Store. | Catalogo interattivo + accessibile. Larghezza / altezza. Qualità JPG e WebP; WebP 100 senza perdita. GIF e TIFF: primo frame/pagina. |
| `image:tiff` — Converti in TIFF | `src-tauri/src/converters/images.rs` | Implementata nel codice. HEIC/HEIF/AVIF richiedono le estensioni HEIF e HEVC (o AV1) del Microsoft Store. | Catalogo interattivo + accessibile. Larghezza / altezza. Qualità JPG e WebP; WebP 100 senza perdita. GIF e TIFF: primo frame/pagina. |
| `image:compress` — Comprimi a una dimensione | `src-tauri/src/converters/images.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. 200 KB–10 MB o valore personalizzato; può ridurre la risoluzione. |
| `image:ico` — Crea icone Windows | `src-tauri/src/converters/images.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Da 16 a 256 px, centrato su trasparenza. |
| `vector:svg` — Vettorizza SVG | `src-tauri/src/converters/vector.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Logo (fino a 16 colori), Bianco e nero, Foto. Le linee grigie sottili possono perdersi nel preset Logo. |
| `bg:remove` — Rimuovi sfondo | `src-tauri/src/converters/background.rs` | Implementata nel codice. Windows ML (Windows 10 1809 o successivo); qualità variabile sul soggetto. | Catalogo interattivo + accessibile. U²-Netp incluso. ISNet opzionale: download di 178,6 MB. |

## PDF

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `pdf:edit` — Modifica PDF | `src-tauri/src/editor/mod.rs` | Implementata nel codice. Il font originale viene usato se contiene i caratteri necessari. Nelle scansioni puoi aggiungere testo, firmare e oscurare; ricerca e scanner privacy richiedono testo leggibile. Controlla i dati rilevati prima di salvare. I contenuti oscurati vengono rimossi al salvataggio. | Catalogo interattivo + accessibile. Trova e sostituisci; testo, disegno, evidenziatore e gomma; firma disegnata o digitata; riordino, rotazione, eliminazione e pagine vuote. Scanner privacy per email, telefoni, IBAN, carte, codici fiscali e partite IVA. |
| `pdf:images` — Immagini in un PDF | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Trasparenza su fondo bianco. |
| `pdf:merge` — Unisci PDF | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Ordine della selezione. Moduli interattivi e PDF cifrati esclusi. |
| `pdf:split` — Dividi pagine | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. PDF cifrati non supportati. | Catalogo interattivo + accessibile. Tutte le pagine. |
| `pdf:extract` — Estrai pagine | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. PDF cifrati non supportati. | Catalogo interattivo + accessibile. Intervalli, per esempio 1–3, 5. |
| `pdf:rotate` — Ruota pagine | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. PDF cifrati non supportati. | Catalogo interattivo + accessibile. 90°, 180°, 270° e intervallo pagine. |
| `pdf:text` — Estrai testo | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. PDF cifrati non supportati. | Catalogo interattivo + accessibile. Per scansioni usa Copia testo (OCR). |
| `pdf:png` — Pagine in PNG | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. PDF cifrati non supportati. | Catalogo interattivo + accessibile. Intervallo pagine; lato lungo massimo 2000 px. |
| `pdf:jpg` — Pagine in JPG | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. PDF cifrati non supportati. | Catalogo interattivo + accessibile. Intervallo pagine e qualità. Lato lungo massimo 2000 px. |
| `pdf:compress` — Comprimi PDF | `src-tauri/src/pdf/mod.rs` | Implementata nel codice. PDF cifrati non supportati. | Catalogo interattivo + accessibile. JPEG qualità 70, lato lungo ≤ 2000 px. Solo immagini compatibili; riduzione non garantita. |

## Testo e QR

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `ocr:copy` — Copia testo (OCR) | `src-tauri/src/ocr.rs` | Implementata nel codice. Richiede una lingua OCR installata in Windows. | Catalogo interattivo + accessibile. Elaborazione locale; legge anche PDF con testo selezionabile. |
| `ocr:pdf` — PDF ricercabile | `src-tauri/src/ocr.rs` | Implementata nel codice. Richiede una lingua OCR installata in Windows. | Catalogo interattivo + accessibile. Aggiunge uno strato di testo invisibile mantenendo l’aspetto. |
| `qr:read` — Leggi QR code | `src-tauri/src/converters/qr.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Testo dei codici riconosciuti. |
| `qr:png` — Genera QR PNG | `src-tauri/src/converters/qr.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Payload fino a 2331 byte; correzione M. |
| `qr:svg` — Genera QR SVG | `src-tauri/src/converters/qr.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Payload fino a 2331 byte; correzione M. |

## Condivisione

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `share:phone` — Al telefono | `src-tauri/src/share.rs` | Implementata nel codice. Firewall e isolamento Wi-Fi possono impedire il collegamento. Test HTTP presenti; telefono fisico da validare. | Catalogo interattivo + accessibile. Stessa rete locale, PC acceso, link di 10 minuti, arresto manuale. |

## Dati

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `data:json` — Converti in JSON | `src-tauri/src/converters/data.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limite 64 MiB. Per CSV/XLSX da JSON/YAML serve un elenco di oggetti. Un CSV per foglio. |
| `data:yaml` — Converti in YAML | `src-tauri/src/converters/data.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limite 64 MiB. Per CSV/XLSX da JSON/YAML serve un elenco di oggetti. Un CSV per foglio. |
| `data:toml` — Converti in TOML | `src-tauri/src/converters/data.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limite 64 MiB. Per CSV/XLSX da JSON/YAML serve un elenco di oggetti. Un CSV per foglio. |
| `data:csv` — Converti in CSV | `src-tauri/src/converters/data.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limite 64 MiB. Per CSV/XLSX da JSON/YAML serve un elenco di oggetti. Un CSV per foglio. |
| `data:xlsx` — Converti in Excel XLSX | `src-tauri/src/converters/data.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limite 64 MiB. Per CSV/XLSX da JSON/YAML serve un elenco di oggetti. Un CSV per foglio. |
| `data:html` — Converti in HTML | `src-tauri/src/converters/data.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Tabelle, task list e note. |

## Archivi

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `archive:extract` — Estrai archivio | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limiti predefiniti: 10.000 elementi e 1 GiB; niente link simbolici. |
| `archive:list` — Elenca contenuto | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Indice locale senza estrarre i contenuti finali. |
| `archive:create:zip` — Crea ZIP | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limiti di elementi e dimensione configurabili; 7Z non solid. |
| `archive:repack:zip` — Archivio in ZIP | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Estrazione intermedia controllata; archivi annidati non espansi. |
| `archive:create:7z` — Crea 7Z | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limiti di elementi e dimensione configurabili; 7Z non solid. |
| `archive:repack:7z` — Archivio in 7Z | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Estrazione intermedia controllata; archivi annidati non espansi. |
| `archive:create:tar` — Crea TAR | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limiti di elementi e dimensione configurabili; 7Z non solid. |
| `archive:repack:tar` — Archivio in TAR | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Estrazione intermedia controllata; archivi annidati non espansi. |
| `archive:create:tar.gz` — Crea TAR.GZ | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Limiti di elementi e dimensione configurabili; 7Z non solid. |
| `archive:repack:tar.gz` — Archivio in TAR.GZ | `src-tauri/src/archives/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Estrazione intermedia controllata; archivi annidati non espansi. |

## Audio e video

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `media:mp4` — Comprimi video | `src-tauri/src/converters/media.rs` | Implementata nel codice. Codec Windows necessari: sulle edizioni N serve il Media Feature Pack. WebM/OGG/Opus possono richiedere estensioni. Filmati lunghi e 4K non validati. | Catalogo interattivo + accessibile. 10 / 16 / 25 / 50 / 100 / 500 MB o personalizzato. |
| `media:gif` — Crea GIF animate | `src-tauri/src/converters/media.rs` | Implementata nel codice. Codec Windows necessari: sulle edizioni N serve il Media Feature Pack. WebM/OGG/Opus possono richiedere estensioni. Filmati lunghi e 4K non validati. | Catalogo interattivo + accessibile. Primi 3–15 secondi, 10 fps, 320–640 px. |
| `media:mp3` — Estrai o converti audio | `src-tauri/src/converters/media.rs` | Implementata nel codice. Codec Windows necessari: sulle edizioni N serve il Media Feature Pack. WebM/OGG/Opus possono richiedere estensioni. Filmati lunghi e 4K non validati. | Catalogo interattivo + accessibile. 192 kbps. |

## Documenti

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `office:pdf` — Documenti in PDF | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede l’app Microsoft Office corrispondente o LibreOffice installato. | Catalogo interattivo + accessibile. Scegli la suite se ne hai più di una. La fedeltà del layout dipende dal documento e dalla suite. |
| `office:txt` — Documenti in testo | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede Microsoft Word o LibreOffice installato. | Catalogo interattivo + accessibile. Solo il testo, senza impaginazione. |
| `office:docx` — Converti in Word DOCX | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede l’app Microsoft Office corrispondente o LibreOffice installato. | Catalogo interattivo + accessibile. Word ricostruisce paragrafi e tabelle dal PDF; LibreOffice usa caselle di testo. I layout complessi possono cambiare. PDF cifrati esclusi. |
| `office:xlsx` — Converti in Excel XLSX | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede l’app Microsoft Office corrispondente o LibreOffice installato. | Catalogo interattivo + accessibile. Conversione tramite la suite installata. |
| `office:pptx` — Converti in PowerPoint PPTX | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede l’app Microsoft Office corrispondente o LibreOffice installato. | Catalogo interattivo + accessibile. Conversione tramite la suite installata. |
| `office:odt` — Converti in OpenDocument ODT | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede l’app Microsoft Office corrispondente o LibreOffice installato. | Catalogo interattivo + accessibile. LibreOffice ha la precedenza quando disponibile. |
| `office:ods` — Converti in OpenDocument ODS | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede l’app Microsoft Office corrispondente o LibreOffice installato. | Catalogo interattivo + accessibile. LibreOffice ha la precedenza quando disponibile. |
| `office:odp` — Converti in OpenDocument ODP | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede l’app Microsoft Office corrispondente o LibreOffice installato. | Catalogo interattivo + accessibile. LibreOffice ha la precedenza quando disponibile. |
| `office:rtf` — Converti in Rich Text RTF | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede l’app Microsoft Office corrispondente o LibreOffice installato. | Catalogo interattivo + accessibile. Conservazione della formattazione dipendente dalla suite. |
| `office:epub` — Converti in eBook EPUB | `src-tauri/src/converters/office.rs` | Implementata nel codice. Richiede LibreOffice installato. | Catalogo interattivo + accessibile. Esportazione tramite LibreOffice. |

## Privacy

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `privacy:strip` — Rimuovi metadati | `src-tauri/src/converters/privacy.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Nessuna ricompressione salvo JPEG con orientamento EXIF, ruotati e ricodificati. |

## Windows

| ID / funzione | Modulo | Stato ed evidenza | Landing |
|---|---|---|---|
| `ui:selection` — Seleziona e apri la ruota | `src-tauri/src/windows/shell.rs` | Implementata nel codice. Multi-monitor, DPI e schede Explorer richiedono verifica manuale. | Catalogo interattivo + accessibile. Ctrl+Alt+O configurabile; drag & drop nella finestra ORBIT. |
| `ui:capture` — Cattura schermo | `src-tauri/src/windows/mod.rs` | Implementata nel codice. Flusso implementato; cattura interattiva da verificare manualmente. | Catalogo interattivo + accessibile. Ctrl+Alt+S configurabile; anche da tray e palette. |
| `ui:paste` — Incolla in ORBIT | `src-tauri/src/windows/shell.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Ctrl+V; JSON riconosciuto come .json, altro testo come .txt. |
| `ui:context` — Apri con ORBIT | `src-tauri/src/windows/shell.rs` | Implementata nel codice. Selezioni multiple da verificare nella shell reale. | Catalogo interattivo + accessibile. Opt-in in Preferenze; menu classico, Altre opzioni su Windows 11. |
| `ui:palette` — Palette comandi | `src/components/CommandPalette.tsx` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Ctrl+K; navigazione tastiera. |
| `ui:jobs` — Batch, coda e cronologia | `src-tauri/src/jobs/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Worker sequenziale, annullamento e ultimi 100 lavori. |
| `ui:save` — Salva come vuoi | `src-tauri/src/jobs/mod.rs` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Shift+Enter inverte la preferenza; nomi liberi per evitare collisioni. |
| `ui:settings` — Il tuo ambiente | `src/features/settings/Settings.tsx` | Implementata nel codice. Nessuna dipendenza esterna aggiuntiva dichiarata dal registro. | Catalogo interattivo + accessibile. Tema, lingua, scorciatoie e salvataggio; sincronizzazione delle finestre. |
