import { useState } from 'react';
import { ArrowUpRight, Check, Eye, EyeOff, FilePenLine, PenLine, RotateCcw, ShieldCheck } from 'lucide-react';

const steps = [
  { title: 'Correggi', icon: FilePenLine, text: 'Un refuso non merita un altro giro di email. Cambia il testo direttamente nel PDF.', action: 'Correggi la data' },
  { title: 'Firma', icon: PenLine, text: 'Disegna la tua firma o scrivi il tuo nome. Puoi conservarla sul PC per il prossimo documento.', action: 'Aggiungi la firma' },
  { title: 'Oscura', icon: EyeOff, text: 'Scegli cosa tenere per te. Al salvataggio, ORBIT elimina il contenuto delle aree oscurate.', action: 'Oscura i dati di esempio' },
];

/** A deliberately bounded illustration: no user files, PDF processing or fake download. */
export default function PdfDemo() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState([false, false, false]);
  const [original, setOriginal] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const edited = done[0] && !original;
  const signed = done[1] && !original;
  const redacted = done[2] && !original;
  const complete = done.every(Boolean);
  const choose = (index: number) => { setStep(index); setOriginal(false); };
  const apply = () => {
    setDone(previous => previous.map((value, index) => index === step || value));
    setOriginal(false);
    setAnnouncement(['Data corretta: 24 ottobre 2026.', 'Firma di esempio aggiunta.', 'Email e telefono oscurati nella dimostrazione. Nell’app vengono rimossi dal PDF quando salvi.'][step]);
  };

  return <div className="pdf-demo">
    <div className="pdf-controls">
      <div className="pdf-steps" role="group" aria-label="Prova gli strumenti PDF">
        {steps.map((item, index) => <button type="button" key={item.title} aria-pressed={step === index} onClick={() => choose(index)}>
          <span className="pdf-step-number">{done[index] ? <Check size={15} aria-hidden="true"/> : `0${index + 1}`}</span>
          <item.icon size={19} strokeWidth={1.5} aria-hidden="true"/>
          <span>{item.title}</span>
          <ArrowUpRight size={18} aria-hidden="true"/>
        </button>)}
      </div>
      <div className="pdf-instruction">
        <p>{steps[step].text}</p>
        <button type="button" className="pdf-apply" onClick={apply} disabled={done[step]}>
          {done[step] ? <><Check size={17} aria-hidden="true"/> Fatto</> : <>{steps[step].action}<ArrowUpRight size={17} aria-hidden="true"/></>}
        </button>
        {done[step] && !complete && <button type="button" className="pdf-next" onClick={() => choose(done.findIndex(value => !value))}>Prova {steps[done.findIndex(value => !value)].title.toLowerCase()} →</button>}
      </div>
      <div className="pdf-detail"><ShieldCheck size={21} strokeWidth={1.4} aria-hidden="true"/><p><b>C’è anche lo scanner privacy.</b> Cerca email, telefoni, IBAN, carte, codici fiscali e partite IVA nel testo del PDF. Tu controlli i risultati e scegli cosa oscurare.</p></div>
    </div>

    <figure className={`pdf-workbench ${redacted ? 'is-redacted' : ''}`}>
      <div className="pdf-window-bar"><span><FilePenLine size={16} aria-hidden="true"/> Proposta.pdf</span><span>Modifica PDF</span></div>
      <div className="pdf-sheet-wrap">
        <div className="pdf-sheet">
          <div className="pdf-letterhead"><span>STUDIO<br/><b>FORMA</b></span><span>PROPOSTA<br/>N. 024 / 2026</span></div>
          <h3>Mettiamoci<br/>d’accordo.</h3>
          <p className="pdf-doc-intro">Un’identità visiva per il nuovo spazio.<br/>Dal primo schizzo all’ultimo dettaglio.</p>
          <dl className="pdf-document-fields">
            <div><dt>Consegna</dt><dd className={edited ? 'pdf-corrected' : step === 0 && !original ? 'pdf-target' : ''}>{edited ? '24 ottobre 2026' : '24 ottobre 2025'}{edited && <Check size={13} aria-hidden="true"/>}</dd></div>
            <div><dt>Email</dt><dd><span className={`pdf-sensitive ${step === 2 && !redacted && !original ? 'pdf-target' : ''}`} aria-label={redacted ? 'Email oscurata' : undefined}>{redacted ? <span className="pdf-blackout"/> : 'studio@example.com'}</span></dd></div>
            <div><dt>Telefono</dt><dd><span className={`pdf-sensitive ${step === 2 && !redacted && !original ? 'pdf-target' : ''}`} aria-label={redacted ? 'Telefono oscurato' : undefined}>{redacted ? <span className="pdf-blackout short"/> : '+39 000 000 0000'}</span></dd></div>
          </dl>
          <div className="pdf-sign-area"><span>Per accettazione</span><div className={`pdf-sign-line ${step === 1 && !signed && !original ? 'pdf-target' : ''}`}>
            {signed && <svg viewBox="0 0 240 65" role="img" aria-label="Firma dimostrativa"><path d="M9 49C34 2 56 0 38 35S11 70 33 47L58 18Q42 61 68 39Q82 25 70 47Q89 33 84 48Q106 18 98 45Q114 33 117 44L140 38M130 54Q163 -4 174 9T153 46Q170 34 178 43T196 38Q204 32 204 43L228 35M40 58L220 49"/></svg>}
          </div></div>
          <div className="pdf-doc-footer"><span>Documento di esempio</span><span>01</span></div>
        </div>
        <div className={`pdf-stamp ${redacted ? 'visible' : ''}`} aria-hidden="true"><ShieldCheck size={16}/> Dati oscurati</div>
      </div>
      <figcaption className="pdf-document-status"><span>{original ? 'Originale' : complete ? 'Pronto da salvare nell’app' : 'Prova sul documento di esempio'}</span><div>
        <button type="button" aria-pressed={original} aria-label="Confronta con l’originale" onClick={() => setOriginal(value => !value)}><Eye size={16}/><span>Originale</span></button>
        <button type="button" aria-label="Ricomincia la demo PDF" onClick={() => { setDone([false, false, false]); setOriginal(false); setStep(0); setAnnouncement('Dimostrazione ripristinata.'); }}><RotateCcw size={16}/></button>
      </div></figcaption>
    </figure>
    <p className="pdf-demo-note">Dimostrazione interattiva · Per modificare i tuoi file, aprili nell’app ORBIT.</p>
    <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
  </div>;
}
