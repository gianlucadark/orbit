# Distribuzione e SEO

## Vercel

1. Creare o usare un repository autorizzato contenente website. Impostare **Root Directory: website**.
2. Framework Astro, Node 24, install `npm ci`, build `npm run build`, output `dist`.
3. Impostare `SITE_URL` all’origine HTTPS effettiva (nessun dominio inventato).
4. Impostare `PUBLIC_DOWNLOAD_URL` all’URL diretto HTTPS dell’asset installer verificato.
5. In alternativa al punto 4, l’installer può essere servito dal sito stesso: `npm run prepare:download`,
   poi build con `PUBLIC_LOCAL_DOWNLOAD=1` e pubblicazione della cartella dist (es. `vercel deploy --prebuilt`).
   Senza questa variabile il guard della build standard rimuove
   il binario locale; public/downloads è esclusa da Git. Nessun installer copiato incidentalmente.
6. Controllare preview, /download, /funzionalita, robots.txt, sitemap-index.xml, metadati e download
   prima della pubblicazione. La pubblicazione su account remoti richiede autorizzazione dell’utente.

`vercel.json` definisce build/output e header. Non serve un backend né un adapter SSR.
Il sito non interroga GitHub a runtime: un’interruzione dell’API non spezza un link noto.

## Preparare una release pubblica

Non è disponibile un repository Git remoto in questa cartella. L’installer esistente è locale.
Dopo aver definito il repository/hosting e autorizzato la pubblicazione:

1. Eseguire build Tauri e prove dell'installer su Windows pulito; valutare firma Authenticode.
2. Ricalcolare dimensione e SHA-256. Aggiornare release.json **insieme** a versione e audit.
3. Creare una release GitHub sul repository autorizzato e caricare l’asset esatto, oppure un hosting
   HTTPS adatto ai binari. Non ricostruire un URL dal nome presunto di un repository o di un tag.
4. Copiare il browser_download_url effettivo dell’asset pubblicato. Scaricare i byte, controllare
   status HTTP, dimensione e hash (HEAD da solo non certifica il contenuto).
5. Inserire l’URL verificato in PUBLIC_DOWNLOAD_URL o nel campo publicUrl di release.json.
6. Ricostruire il sito; provare il download finale su desktop e comunicare Windows x64 sul mobile.

Non allegare i binari alla storia Git. L’URL predefinito non fa finta di essere pubblico.
La CTA senza binario va a /download/ con stato esplicito, non a # o a una pagina GitHub generica.

## SEO senza dominio inventato

Con SITE_URL: canonical per pagina, og:url, immagini social assolute, sitemap Astro e robots Allow.
Senza SITE_URL: nessun canonical inventato, robots Disallow e sitemap omessa. È corretto per anteprime.
SoftwareApplication dichiara solo nome, categoria utility, Windows, versione e funzionalità;
nessun prezzo, recensione o requisito minimo non verificato. OG/Twitter usano social.png 1200×630.

## Rete e dati

Il sito non usa account, analytics, font remoti, upload o API di conversione. Le simulazioni
usano solo asset dimostrativi. Il video viene caricato su azione dell’utente, non automaticamente.
Il download è un link diretto: il feedback “richiesto” non pretende di conoscere l’esito del browser.
La conferma automatizzata del vero download è documentata nel report QA tramite SHA-256.
