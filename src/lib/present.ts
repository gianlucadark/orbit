import { Archive, ArrowLeftRight, Eraser, FileOutput, FilePenLine, FileSearch, FileText, Images, List, Merge, PackageOpen, QrCode, RotateCw, ScanQrCode, ScanText, Scissors, Shrink, SlidersHorizontal, Smartphone, Type, WandSparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Action, FileInfo, Options } from './types';
import { language, t } from './i18n';

export type FileKind = 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'data' | 'archive' | 'folder' | 'other';

const KINDS: Record<string, FileKind> = {
  png: 'image', jpg: 'image', jpeg: 'image', webp: 'image', bmp: 'image', tif: 'image', tiff: 'image', gif: 'image', svg: 'image',
  heic: 'image', heif: 'image', avif: 'image',
  mp4: 'video', m4v: 'video', mov: 'video', wmv: 'video', avi: 'video', mkv: 'video', webm: 'video', '3gp': 'video', mts: 'video', m2ts: 'video',
  mp3: 'audio', wav: 'audio', m4a: 'audio', aac: 'audio', wma: 'audio', flac: 'audio', ogg: 'audio', opus: 'audio', amr: 'audio',
  pdf: 'pdf',
  docx: 'document', doc: 'document', odt: 'document', rtf: 'document', txt: 'document', xlsx: 'document', pptx: 'document', url: 'document',
  json: 'data', yaml: 'data', yml: 'data', toml: 'data', csv: 'data', tsv: 'data', xls: 'data', ods: 'data', md: 'data', markdown: 'data',
  zip: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive', tgz: 'archive',
};

export function fileKind(file: FileInfo): FileKind {
  return file.directory ? 'folder' : KINDS[file.extension.toLowerCase()] ?? 'other';
}

/** How an action is drawn on the crown: a short format tag or an icon, plus a one-word caption. */
export interface ActionLook { tag?: string; icon?: LucideIcon; caption: string; title: string; secondary: boolean }

/** Tools drawn with an icon: [icon, caption, title] (Italian source text, translated on use). */
const TOOLS: Record<string, [LucideIcon, string, string]> = {
  'pdf:edit': [FilePenLine, 'Editor', 'Modifica il PDF'],
  'pdf:images': [FileText, 'Crea PDF', 'Crea un PDF'],
  'pdf:merge': [Merge, 'Unisci', 'Unisci i PDF'],
  'pdf:split': [Scissors, 'Dividi', 'Dividi le pagine'],
  'pdf:extract': [FileOutput, 'Estrai', 'Estrai pagine'],
  'pdf:rotate': [RotateCw, 'Ruota', 'Ruota pagine'],
  'pdf:text': [Type, 'Testo', 'Estrai il testo'],
  'pdf:png': [Images, 'PNG', 'Pagine in PNG'],
  'pdf:jpg': [Images, 'JPG', 'Pagine in JPG'],
  'pdf:compress': [Shrink, 'Comprimi', 'Comprimi il PDF'],
  'image:compress': [Shrink, 'Comprimi', 'Comprimi sotto una dimensione'],
  'ocr:copy': [ScanText, 'Testo', 'Copia il testo (OCR)'],
  'ocr:pdf': [FileSearch, 'Ricercabile', 'PDF ricercabile (OCR)'],
  'qr:read': [ScanQrCode, 'Leggi QR', 'Leggi il QR code'],
  'qr:png': [QrCode, 'QR PNG', 'Crea un QR code (PNG)'],
  'qr:svg': [QrCode, 'QR SVG', 'Crea un QR code (SVG)'],
  'privacy:strip': [Eraser, 'Pulisci', 'Rimuovi i metadati'],
  'bg:remove': [WandSparkles, 'Sfondo', 'Rimuovi lo sfondo'],
  'share:phone': [Smartphone, 'Telefono', 'Invia al telefono'],
  'media:mp4': [Shrink, 'Comprimi', 'Comprimi il video'],
};

export function look(action: Action): ActionLook {
  const [domain, kind, format] = action.id.split(':');
  if (TOOLS[action.id]) {
    const [icon, caption, title] = TOOLS[action.id];
    return { icon, caption: t(caption), title: t(title), secondary: false };
  }
  if (domain === 'image') return { tag: kind.toUpperCase(), caption: t('Immagine'), title: t('Converti in {format}', { format: kind.toUpperCase() }), secondary: false };
  if (domain === 'data') return { tag: kind.toUpperCase(), caption: t('Dati'), title: t('Converti in {format}', { format: kind.toUpperCase() }), secondary: false };
  if (action.id === 'vector:svg') return { tag: 'SVG', caption: t('Vettoriale'), title: t('Vettorizza in SVG'), secondary: false };
  if (action.id === 'media:gif') return { tag: 'GIF', caption: t('Animata'), title: t('Crea una GIF animata'), secondary: false };
  if (action.id === 'media:mp3') return { tag: 'MP3', caption: t('Audio'), title: t('Converti in {format}', { format: 'MP3' }), secondary: false };
  if (domain === 'office') return { tag: kind.toUpperCase(), caption: t('Documento'), title: t('Converti in {format}', { format: kind.toUpperCase() }), secondary: false };
  if (domain === 'archive') {
    if (kind === 'extract') return { icon: PackageOpen, caption: t('Estrai'), title: t('Estrai archivio'), secondary: false };
    if (kind === 'list') return { icon: List, caption: t('Indice'), title: t('Elenca il contenuto'), secondary: false };
    const tag = format.toUpperCase().replace('TAR.GZ', 'TGZ');
    if (kind === 'repack') return { tag, caption: t('Converti'), title: t('Converti in {format}', { format: format.toUpperCase() }), secondary: false };
    return { tag, caption: t('Comprimi'), title: t('Comprimi in {format}', { format: format.toUpperCase() }), secondary: true };
  }
  return { icon: Archive, caption: t(action.label), title: t(action.label), secondary: false };
}

/** Primary actions first, then the generic "compress" ones, so they cluster on the same arc. */
export function crownOrder(actions: Action[]): Action[] {
  const secondary = (a: Action) => (look(a).secondary ? 1 : 0);
  return [...actions].sort((a, b) => secondary(a) - secondary(b));
}

/**
 * A wedge of the inner ring: a family of actions that opens an outer ring, or — when the family has
 * a single member, or the selection offers few actions — that action itself (`direct`).
 */
export interface ActionGroup { id: string; caption: string; title: string; icon?: LucideIcon; actions: Action[]; direct: boolean }

/** Families in ring order; an action belongs to the first that matches (anything else: "Modifica"). */
const FAMILIES: [string, string, string, LucideIcon, RegExp][] = [
  ['editor', 'Editor', 'Modifica il PDF', FilePenLine, /^pdf:edit$/],
  ['convert', 'Converti', 'Converti in un altro formato', ArrowLeftRight, /^(image:(png|jpg|webp|bmp|tiff|ico)|vector:|office:|data:|media:(mp3|gif)|pdf:(images|png|jpg)|archive:repack:)/],
  ['compress', 'Comprimi', 'Comprimi', Shrink, /^(image:compress|pdf:compress|media:mp4|archive:create:)/],
  ['text', 'Testo', 'Testo e QR code', ScanText, /^(ocr:|pdf:text|qr:)/],
  ['edit', 'Modifica', 'Modifica', SlidersHorizontal, /./],
  ['share', 'Condividi', 'Condividi', Smartphone, /^share:/],
];
/** Up to this many actions the wheel stays flat: one wedge each, nothing to open. */
export const FLAT_LIMIT = 6;

export function groupActions(actions: Action[]): ActionGroup[] {
  const ordered = crownOrder(actions);
  const single = (a: Action): ActionGroup => {
    const l = look(a);
    return { id: a.id, caption: l.caption, title: l.title, icon: l.icon, actions: [a], direct: true };
  };
  if (ordered.length <= FLAT_LIMIT) return ordered.map(single);
  const family = (a: Action) => FAMILIES.findIndex(([id, , , , test]) => id !== 'edit' && test.test(a.id));
  return FAMILIES.map(([id, caption, title, icon], index) => {
    const members = ordered.filter(a => { const f = family(a); return f === index || (f === -1 && id === 'edit'); });
    return members.length === 1 ? single(members[0]) : { id: `group:${id}`, caption: t(caption), title: t(title), icon, actions: members, direct: false };
  }).filter(g => g.actions.length > 0);
}
/** The wedge of the inner ring that holds this action. */
export function groupOf(groups: ActionGroup[], actionId: string | undefined): ActionGroup | undefined {
  return actionId ? groups.find(g => g.actions.some(a => a.id === actionId)) : undefined;
}

/**
 * Where a job's result goes: one file → "Salva come" dialog with a proposed name; several → a folder;
 * `clipboard`: no file at all, the result goes straight to the clipboard; `share`: no job, a QR for the phone.
 */
export type OutputPlan = { kind: 'file'; name: string; ext: string } | { kind: 'folder' } | { kind: 'clipboard' } | { kind: 'share' };

const baseName = (f: FileInfo) => f.directory ? f.name : f.name.replace(/\.(tar\.gz|[^.]+)$/i, '');

/** `options` matter only where they change the result's format (background fill). */
export function outputPlan(id: string, files: FileInfo[], options?: Pick<Options, 'bgFill'>): OutputPlan {
  const [domain, kind, format] = id.split(':');
  const stem = files[0] ? baseName(files[0]) : 'Orbit';
  const single = files.length === 1;
  const file = (name: string, ext: string): OutputPlan => ({ kind: 'file', name: `${name}.${ext}`, ext });
  if (id === 'ocr:copy' || id === 'qr:read') return { kind: 'clipboard' };
  if (id === 'share:phone') return { kind: 'share' };
  // The format of a compressed image is only known once it fits (JPEG, WebP or the original).
  if (id === 'image:compress') return { kind: 'folder' };
  if ((domain === 'image' || domain === 'vector' || domain === 'office' || domain === 'data') && single) return file(stem, kind);
  if (id === 'ocr:pdf') return file(files[0]?.extension === 'pdf' ? `${stem} ${t('ricercabile')}` : stem, 'pdf');
  if (id === 'pdf:compress') return file(`${stem} ${t('compresso')}`, 'pdf');
  if (id === 'media:mp4' && single) return file(`${stem} ${t('compresso')}`, 'mp4');
  if ((id === 'media:gif' || id === 'media:mp3') && single) return file(stem, kind);
  if (id === 'bg:remove' && single) return file(`${stem} ${t('senza sfondo')}`, options?.bgFill === 'white' ? 'jpg' : 'png');
  if (id === 'privacy:strip' && single) return file(`${stem} ${t('pulito')}`, files[0].extension);
  if ((id === 'qr:png' || id === 'qr:svg') && single) return file(`${stem} QR`, kind);
  if (id === 'pdf:images') return file(stem, 'pdf');
  if (id === 'pdf:merge') return file(`${stem} ${t('unito')}`, 'pdf');
  if (id === 'pdf:rotate') return file(`${stem} ${t('ruotato')}`, 'pdf');
  if (id === 'pdf:extract') return file(`${stem} ${t('estratto')}`, 'pdf');
  if (id === 'pdf:text') return file(stem, 'txt');
  if (id === 'archive:list') return file(`${stem} ${t('indice')}`, 'txt');
  if (domain === 'archive' && (kind === 'repack' || kind === 'create')) return file(single ? stem : t('Archivio'), format);
  return { kind: 'folder' };
}

export function relativeTime(seconds: number, now = Date.now() / 1000): string {
  const diff = Math.max(0, now - seconds);
  if (diff < 60) return t('adesso');
  if (diff < 3600) return t('{n} min fa', { n: Math.floor(diff / 60) });
  if (diff < 86400) return t('{n} h fa', { n: Math.floor(diff / 3600) });
  return new Date(seconds * 1000).toLocaleDateString(language() === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'short' });
}
