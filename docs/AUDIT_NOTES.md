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
