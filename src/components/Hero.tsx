import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Braces, FileText, RotateCcw, X } from 'lucide-react';
import { Wheel } from './Wheel';
import { demoSets, features } from '../data/features';
import { groupActions, groupOf, look } from '../lib/present';
import type { Action } from '../lib/types';

/** The three files on the demo desktop; `set` points at the actions ORBIT offers for that kind. */
const files = [
  { set: 0, name: 'Tazza.png', thumb: '/assets/tazza.webp' },
  { set: 1, name: 'Idee.pdf', icon: 'pdf' },
  { set: 2, name: 'Dati.json', icon: 'json' },
] as const;

type Keys = { ctrl: boolean; alt: boolean; o: boolean };

/** Output name for the demo result, following the app's naming where the website knows it. */
function outputName(id: string, file: string): string {
  const base = file.replace(/\.[^.]+$/, '');
  const [domain, kind] = id.split(':');
  if (domain === 'image' && kind !== 'compress' && kind !== 'ico') return `${base}.${kind}`;
  if (id === 'bg:remove') return `${base} senza sfondo.png`;
  if (id === 'vector:svg') return `${base}.svg`;
  if (id === 'image:ico') return `${base}.ico`;
  if (id === 'share:phone') return 'QR sulla tua rete Wi-Fi';
  const example = features.find(f => f.id === id)?.example ?? '';
  return example.split('→').pop()?.trim() || file;
}

function FileGlyph({ icon, size = 34 }: { icon?: string; size?: number }) {
  return icon === 'json' ? <Braces size={size} strokeWidth={1.4}/> : <FileText size={size} strokeWidth={1.4}/>;
}

export default function Hero({ children }: { children?: ReactNode }) {
  const [file, setFile] = useState(0);
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [running, setRunning] = useState<{ id: string; p: number } | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [keys, setKeys] = useState<Keys>({ ctrl: false, alt: false, o: false });
  const [size, setSize] = useState(440);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const viaKeyboard = useRef(false);

  const current = files[file];
  const actions: Action[] = demoSets[current.set].ids.map(id => {
    const f = features.find(f => f.id === id)!;
    return { id, label: f.name, provider: f.category, enabled: true, note: f.condition || f.description };
  });
  const groups = groupActions(actions);

  // The wheel takes the stage width, like the app sizing it to the screen.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(270, Math.min(470, e.contentRect.width * 0.94)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function show() {
    cancelAnimationFrame(frame.current);
    setRunning(null); setResult(null); setHover(null); setGroup(null); setOpen(true);
  }
  function close() { setOpen(false); setGroup(null); setHover(null); }
  function choose(i: number) { cancelAnimationFrame(frame.current); setRunning(null); setResult(null); close(); setFile(i); }

  function run(id: string) {
    if (id === 'pdf:edit') { close(); document.getElementById('pdf')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 950);
      setRunning({ id, p });
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else frame.current = requestAnimationFrame(() => { setRunning(null); setResult(id); close(); });
    };
    frame.current = requestAnimationFrame(tick);
  }

  // The real gesture: Ctrl + Alt + O anywhere on the hero opens the wheel on the selected file.
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      const k = e.key === 'Control' ? 'ctrl' : e.key === 'Alt' || e.key === 'AltGraph' ? 'alt' : e.code === 'KeyO' ? 'o' : null;
      if (k) setKeys(prev => prev[k] === down ? prev : { ...prev, [k]: down });
    };
    const down = (e: KeyboardEvent) => {
      set(e, true);
      if (e.ctrlKey && e.altKey && e.code === 'KeyO') {
        e.preventDefault();
        viaKeyboard.current = true;
        show();
      } else if (e.key === 'Escape') close();
    };
    const up = (e: KeyboardEvent) => set(e, false);
    const blur = () => setKeys({ ctrl: false, alt: false, o: false });
    addEventListener('keydown', down); addEventListener('keyup', up); addEventListener('blur', blur);
    return () => { removeEventListener('keydown', down); removeEventListener('keyup', up); removeEventListener('blur', blur); };
  }, []);

  // Opened from the keyboard: focus the first family, as the app does.
  useEffect(() => {
    if (!open || !viaKeyboard.current) return;
    viaKeyboard.current = false;
    requestAnimationFrame(() => stage.current?.querySelector<SVGGElement>('.seg')?.focus());
  }, [open]);

  function pressKeys() {
    setKeys({ ctrl: true, alt: true, o: true });
    setTimeout(() => { setKeys({ ctrl: false, alt: false, o: false }); show(); }, 180);
  }

  const busy = running !== null;
  const hovered = hover ? actions.find(a => a.id === hover) ?? null : null;
  const hoveredGroup = hover ? groups.find(g => g.id === hover) : undefined;
  const label = hovered ? look(hovered).title : hoveredGroup ? `${hoveredGroup.title} · ${hoveredGroup.actions.length}` : null;
  const output = result ? outputName(result, current.name) : null;

  const centre = (state: 'idle' | 'result') => {
    if (state === 'result' && result === 'bg:remove') return <img className="stage-thumb is-cutout" src="/assets/tazza-cutout.webp" width="400" height="400" alt="Risultato: la tazza senza sfondo, su trasparenza"/>;
    if (state === 'result' && result === 'share:phone') return <img className="stage-thumb is-qr" src="/assets/qr-demo.svg" width="160" height="160" alt="Un QR code da inquadrare con il telefono"/>;
    if ('thumb' in current) return <img className="stage-thumb" src={current.thumb} width="400" height="400" alt="" draggable={false}/>;
    return <span className="stage-doc"><FileGlyph icon={current.icon} size={44}/><b>{current.name.split('.').pop()?.toUpperCase()}</b></span>;
  };

  return <MotionConfig reducedMotion="user">
    <div className="hero-grid">
      <div className="hero-copy">
        <a className="hero-news" href="#pdf"><span>NUOVO</span> Il tuo PDF, con le tue modifiche. <span aria-hidden="true">↗</span></a>
        <h1 id="hero-title">
          <span className="line">Seleziona un file.</span>
          <span className="line keys-line">Premi
            <button type="button" className="keys" onClick={pressKeys}>
              <kbd className={keys.ctrl ? 'is-down' : ''}>Ctrl</kbd><kbd className={keys.alt ? 'is-down' : ''}>Alt</kbd><kbd className={keys.o ? 'is-down' : ''}>O</kbd><span className="sr-only">: apri la ruota sul file</span>
            </button>
          </span>
        </h1>
        <p className="hero-lede">Modifica un PDF, oscura i dati riservati, togli lo sfondo a una foto. O converti, comprimi e manda al telefono. Tutto da una ruota, tutto sul tuo PC.</p>
        {children}
      </div>

      <div className="hero-stage">
        <div ref={stage} className={`stage ${open ? 'is-open' : ''} ${result ? 'has-result' : ''}`} onClick={e => { if (open && !busy && e.target === e.currentTarget) close(); }}>
          <svg className="stage-dial" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="97"/>
            <circle cx="100" cy="100" r="78" className="faint"/>
            <path d={Array.from({ length: 120 }, (_, i) => { const a = i * Math.PI / 60; const r2 = i % 10 === 0 ? 89 : 93; return `M${(100 + Math.cos(a) * 97).toFixed(2)} ${(100 + Math.sin(a) * 97).toFixed(2)}L${(100 + Math.cos(a) * r2).toFixed(2)} ${(100 + Math.sin(a) * r2).toFixed(2)}`; }).join('')}/>
          </svg>

          {files.map((f, i) => ({ f, i })).filter(({ i }) => i !== file).map(({ f, i }, k) =>
            <button key={f.name} type="button" className={`desk-icon spot-${k ? 'b' : 'a'}`} onClick={() => choose(i)} tabIndex={open ? -1 : 0} aria-label={`Seleziona ${f.name}`}>
              <span className="desk-icon-art">{'thumb' in f ? <img src={f.thumb} width="400" height="400" alt=""/> : <FileGlyph icon={f.icon}/>}</span>
              <span className="desk-icon-name">{f.name}</span>
            </button>)}

          <AnimatePresence mode="wait" initial={false}>
            {!open && <motion.button key={`file-${file}-${result ?? ''}`} type="button" className="desk-icon is-selected"
              initial={{ opacity: 0, scale: .86 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.12 }} transition={{ duration: .22 }}
              onClick={show} aria-expanded={false}>
              <span className="desk-icon-art" aria-hidden="true">{centre(result ? 'result' : 'idle')}</span>
              <span className="desk-icon-name">{output ?? current.name}<span className="sr-only">: apri la ruota di ORBIT</span></span>
            </motion.button>}
          </AnimatePresence>

          <AnimatePresence>
            {open && <motion.div key="wheel" className="stage-wheel" role="group" aria-label={`Ruota di ORBIT per ${current.name}`}
              initial={{ opacity: 0, scale: .55, rotate: -40 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: .8, rotate: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onKeyDown={e => { if (e.key === 'Escape') { close(); stage.current?.querySelector<HTMLButtonElement>('.keys')?.focus(); } }}>
              <Wheel size={size} actions={actions} center={centre('idle')} open={group} focused={hover ?? undefined}
                active={running?.id} progress={running ? running.p : null}
                onOpen={g => !busy && setGroup(g)} onHover={setHover}
                onPick={id => { if (busy) return; const g = groupOf(groups, id); setGroup(g && !g.direct ? g.id : null); run(id); }}/>
              <button type="button" className="stage-close" onClick={close} aria-label="Chiudi la ruota"><X size={16}/></button>
            </motion.div>}
          </AnimatePresence>
        </div>

        <div className="stage-status" aria-live="polite">
          {busy ? <p><span className="status-spin" aria-hidden="true"/>{look(actions.find(a => a.id === running!.id)!).title}…</p>
            : result ? <p className="is-done"><strong>Fatto.</strong> {output}<button type="button" onClick={() => setResult(null)}><RotateCcw size={14}/> Un’altra mossa</button></p>
            : open ? <p>{label ?? 'Scegli una famiglia, poi l’operazione.'} <span className="hint-esc">Esc per chiudere</span></p>
            : <p><span className="hint-pointer">Provalo qui: premi <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>O</kbd> sulla tastiera, o fai clic su {current.name}.</span><span className="hint-touch">Provalo qui: tocca {current.name}.</span></p>}
        </div>
      </div>
    </div>
  </MotionConfig>;
}
