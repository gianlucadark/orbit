export interface FileInfo { path: string; name: string; extension: string; size: number; directory: boolean }
export interface Action { id: string; label: string; provider: string; enabled: boolean; note: string | null }
export interface Options { quality: number; width: number | null; height: number | null; pages: string; rotation: number; maxFiles: number; maxBytes: number; targetKb: number; bgModel: '' | 'fast' | 'quality'; bgFill: '' | 'white'; videoKb: number; gifSeconds: number; gifWidth: number; vectorPreset: '' | 'bw' | 'photo' }
/** `language`: '' follows Windows. */
export interface Settings { theme: 'light' | 'dark'; shortcut: string; captureShortcut: string; outputDir: string; quickSave: boolean; language: '' | 'it' | 'en' }
/** An optional AI model and whether it is on disk. */
/** A page on the local network for the phone: link, its QR code (SVG) and expiry (Unix seconds). */
export interface Share { url: string; qr: string; expires: number; files: number }
export interface ModelStatus { id: string; installed: boolean; bytes: number }
export interface Job { id: string; action: string; names: string[]; status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'interrupted'; progress: number; message: string; outputs: string[]; created: number; inputBytes: number; outputBytes: number }
export const defaults: Options = { quality: 85, width: null, height: null, pages: '', rotation: 90, maxFiles: 10000, maxBytes: 1073741824, targetKb: 1024, bgModel: '', bgFill: '', videoKb: 10240, gifSeconds: 6, gifWidth: 480, vectorPreset: '' };
export const defaultSettings: Settings = { theme: 'light', shortcut: 'Ctrl+Alt+O', captureShortcut: 'Ctrl+Alt+S', outputDir: '', quickSave: false, language: '' };
export function parentDirectory(path: string): string { return path.replace(/[\\/][^\\/]+[\\/]?$/, ''); }
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}
/** Size change of a finished job in whole percent (negative = smaller), or null when it isn't meaningful. */
export function sizeDelta(job: Pick<Job, 'status' | 'action' | 'inputBytes' | 'outputBytes'>): number | null {
  if (job.status !== 'completed' || !job.inputBytes || !job.outputBytes) return null;
  if (/^(archive:(extract|list)|pdf:(split|text|png|jpg)|ocr:copy)/.test(job.action)) return null;
  return Math.round((job.outputBytes / job.inputBytes - 1) * 100);
}
export function mergeJobs(jobs: Job[], incoming: Job): Job[] {
  return jobs.some(j => j.id === incoming.id) ? jobs.map(j => j.id === incoming.id ? incoming : j) : [...jobs, incoming];
}
/**
 * Annular sector between radii r0 < r1 and angles a0 < a1 (radians), with edges pulled in by `gap`
 * pixels on each side so neighbouring wedges stay parallel-spaced at every radius.
 */
export function sectorPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number, gap = 0): string {
  const pt = (r: number, a: number) => `${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`;
  const [o0, o1] = [a0 + Math.asin(Math.min(1, gap / r1)), a1 - Math.asin(Math.min(1, gap / r1))];
  const [i0, i1] = [a0 + Math.asin(Math.min(1, gap / r0)), a1 - Math.asin(Math.min(1, gap / r0))];
  const large = (span: number) => (span > Math.PI ? 1 : 0);
  return `M${pt(r1, o0)}A${r1} ${r1} 0 ${large(o1 - o0)} 1 ${pt(r1, o1)}L${pt(r0, i1)}A${r0} ${r0} 0 ${large(i1 - i0)} 0 ${pt(r0, i0)}Z`;
}
/** Loose match for the command palette: every word of the query must appear somewhere in the haystack. */
export function matches(query: string, haystack: string): boolean {
  const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const text = fold(haystack);
  return fold(query).split(/\s+/).filter(Boolean).every(word => text.includes(word));
}
/** Windows paths pasted as text (e.g. "Copia come percorso"), quotes stripped. */
export function pastedPaths(text: string): string[] {
  return text.split(/\r?\n/).map(l => l.trim().replace(/^"(.*)"$/, '$1')).filter(l => /^([A-Za-z]:\\|\\\\)/.test(l));
}
