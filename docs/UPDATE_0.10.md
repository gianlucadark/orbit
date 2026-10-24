# Aggiornamento sito — ORBIT 0.10

24 ottobre 2026.

## Risultato

La nuova sezione PDF precede le altre funzioni. Titolo: “L’ultima modifica.
Prima di inviare.” Documento fittizio Studio Forma con tre azioni indipendenti:
correggere la data, aggiungere la firma, oscurare email e telefono. Il confronto
mostra l’originale senza perdere le modifiche; il reset ripristina la demo.
Gli oscuramenti sostituiscono il testo nella demo, non lo nascondono sotto un livello.
La demo resta esplicitamente illustrativa e non accetta file personali.

Hero, menu, ruota PDF, catalogo interattivo e HTML, FAQ, metadati, download e immagine
social sono aggiornati. 55 operazioni + 8 workflow; le opzioni editor non vengono
contate come nuove operazioni. Sono incluse anche le conversioni Office della 0.9.
Peso installer: 13,8 MB, calcolato dai byte del manifest. Data derivata da builtAt.

## Video

La scena PDF sostituisce il montage fra 15,5 e 19,5 secondi. Durata e audio restano
24 secondi / 30 fps. Nuovo sorgente: `../promo/orbit-launch/src/scenes/Pdf.tsx`.
Aggiornati film incorporato, poster, export 16:9, 9:16 e versione verticale muta.
Fotogrammi controllati: 490, 515, 550 e 575, in entrambi i formati.

## Verifica

- `npm run build`: 0 errori, warning o hint Astro/TypeScript; 3 pagine statiche.
- `npm test`: desktop 1920 e 1366; mobile 390 e 375. Correzione, firma, oscuramento,
  confronto e reset; ruota mouse/tocco/scorciatoia; ricerca e conteggio catalogo;
  FAQ, ancore e pagine secondarie. Nessun overflow orizzontale, errore console
  o violazione axe. Report macchina: `qa/verification.json`.
- Verifica visiva: corretta un’interferenza con la griglia delle vecchie scene;
  il test ora controlla anche larghezza del titolo e leggibilità del foglio desktop.
- `npm run audit:check`: 36 sorgenti registrati, 63 voci.
- Promo `npm run typecheck` e `npm run verify`: export H.264 720 fotogrammi,
  AAC stereo per i due film, nessun audio nella versione muta; decodifica completa.
  Report: `../promo/orbit-launch/qa/delivery-verification.json`.
- SHA-256 dell’installer locale coincide con release.json. Asset remoto non riscaricato.

Il browser e i renderer hanno richiesto accesso fuori dalla sandbox per le connessioni
loopback. Nessuna dipendenza aggiunta. Nessun codice desktop cambiato.
Nessun push o deploy remoto eseguito; output statico pronto in `dist/`.
