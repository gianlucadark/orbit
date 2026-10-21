import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Archive } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Action } from '../lib/types';
import { sectorPath } from '../lib/types';
import { groupActions, look } from '../lib/present';
import type { ActionGroup } from '../lib/present';

interface WheelProps {
  size: number;
  actions: Action[];
  center: ReactNode;
  /** Filled segment (the chosen action); its family is shown as chosen too. */
  active?: string;
  /** Outlined segment (keyboard/hover focus): an action id or a group id. */
  focused?: string;
  /** The family whose actions fan out on the outer ring. */
  open?: string | null;
  hideSegments?: boolean;
  progress?: number | null;
  glow?: boolean;
  onPick: (id: string) => void;
  onRun?: (id: string) => void;
  onHover?: (id: string | null) => void;
  onOpen?: (group: string | null) => void;
}

/** Astrolabe graduation: a short tick every 5°, a longer one every 30°. */
export function ticks(cx: number, cy: number, r: number, short = 4, long = 9): string {
  return Array.from({ length: 72 }, (_, i) => {
    const a = (i * 5 * Math.PI) / 180;
    const l = i % 6 === 0 ? long : short;
    const [sin, cos] = [Math.sin(a), Math.cos(a)];
    return `M${(cx + cos * r).toFixed(2)} ${(cy + sin * r).toFixed(2)}L${(cx + cos * (r - l)).toFixed(2)} ${(cy + sin * (r - l)).toFixed(2)}`;
  }).join('');
}

/** Widest angle one action may take on the outer ring, so short families stay a compact fan. */
const FAN_STEP = (46 * Math.PI) / 180;

interface Slice { key: string; a0: number; a1: number; r0: number; r1: number; icon?: LucideIcon; label?: string; title: string; note?: string | null;
  state: string; secondary?: boolean; disabled?: boolean; count?: number; delay: number }

/**
 * The orbit around the selected file. Few actions: one wedge each. Many: an inner ring of families
 * (Converti, Comprimi, Testo, …); the open family fans its actions out on an outer, concentric ring
 * centred on it. A family with a single member is that action directly.
 */
export function Wheel({ size, actions, center, active, focused, open, hideSegments, progress, glow, onPick, onRun, onHover, onOpen }: WheelProps) {
  const c = size / 2;
  const outer = c - 5;
  const groups = groupActions(actions);
  const nested = groups.some(g => !g.direct);
  // Flat: one thick ring. Nested: families inside, their actions on the outer band.
  const ringIn = Math.round(outer * (nested ? 0.34 : 0.42));
  const ringOut = nested ? Math.round(outer * 0.64) : outer;
  const fanIn = ringOut + 5;
  const hole = ringIn - 5;
  const ring = hole - 3;
  const circumference = 2 * Math.PI * ring;
  const small = size < 240 || nested;
  const step = (Math.PI * 2) / Math.max(1, groups.length);
  const start = -Math.PI / 2 - step / 2;
  const openGroup = groups.find(g => g.id === open && !g.direct);

  const groupSlice = (g: ActionGroup, i: number): Slice => {
    const action = g.direct ? g.actions[0] : undefined;
    const l = action ? look(action) : undefined;
    const chosen = g.actions.some(a => a.id === active);
    const state = chosen && (g.direct || !openGroup) ? 'active' : g.id === focused || (action && action.id === focused) ? 'focused' : g.id === openGroup?.id ? 'open' : chosen ? 'chosen' : '';
    return { key: g.id, a0: start + i * step, a1: start + (i + 1) * step, r0: ringIn + 3, r1: ringOut - 3,
      icon: l ? l.icon ?? (l.secondary ? Archive : undefined) : g.icon, label: l ? (l.icon ? l.caption : l.tag) : g.caption,
      title: g.title, note: action?.note, state, secondary: l?.secondary, disabled: action ? !action.enabled : false,
      count: g.direct ? undefined : g.actions.length, delay: i * 0.018 };
  };
  const fan: Slice[] = [];
  if (openGroup) {
    const index = groups.indexOf(openGroup);
    const n = openGroup.actions.length;
    const each = Math.min(FAN_STEP, (Math.PI * 2) / n);
    const centre = start + (index + 0.5) * step;
    // Small families fan out symmetrically; big ones read clockwise starting at their family.
    const from = each * n > Math.PI ? centre - each / 2 : centre - (each * n) / 2;
    openGroup.actions.forEach((a, k) => {
      const l = look(a);
      fan.push({ key: a.id, a0: from + k * each, a1: from + (k + 1) * each, r0: fanIn + 3, r1: outer - 3,
        icon: l.icon ?? (l.secondary ? Archive : undefined), label: l.icon ? l.caption : l.tag, title: l.title, note: a.note,
        state: a.id === active ? 'active' : a.id === focused ? 'focused' : '', secondary: l.secondary, disabled: !a.enabled, delay: k * 0.02 });
    });
  }
  const groupFor = (key: string) => groups.find(g => g.id === key);
  const draw = (s: Slice, kind: 'group' | 'fan') => {
    const mid = (s.r0 + s.r1) / 2;
    const a = (s.a0 + s.a1) / 2;
    // Round trig coordinates: Node and Chromium may differ at the last floating-point bit.
    // Stable SSR markup prevents React hydration warnings without suppressing diagnostics.
    const [x, y] = [c + Math.cos(a) * mid, c + Math.sin(a) * mid].map(n => +n.toFixed(3));
    const Icon = s.icon;
    const group = kind === 'group' ? groupFor(s.key) : undefined;
    const isAction = kind === 'fan' || group?.direct;
    const id = isAction ? (group ? group.actions[0].id : s.key) : s.key;
    // Families open on hover or click; actions are picked by click, run by double click.
    const activate = () => {
      if (s.disabled) return;
      if (isAction) onPick(id);
      // Hover has already opened the family on desktop. Click must not immediately close it.
      else onOpen?.(s.key);
    };
    return <motion.g key={s.key} className={`seg ${kind} ${s.secondary ? 'secondary' : ''} ${s.state} ${s.disabled ? 'disabled' : ''}`}
      role="button" data-action-id={s.key} tabIndex={s.disabled ? -1 : 0} aria-label={s.title} aria-pressed={s.state === 'active'} aria-expanded={isAction ? undefined : open === s.key}
      aria-disabled={s.disabled} initial={{ opacity: 0, scale: kind === 'fan' ? 0.94 : 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
      style={{ transformOrigin: `${c}px ${c}px` }} transition={{ duration: 0.16, delay: s.delay }}
      onClick={activate} onDoubleClick={() => isAction && !s.disabled && onRun?.(id)}
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); activate(); if (e.key === 'Enter' && isAction && !s.disabled) onRun?.(id); }
        if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
          e.preventDefault(); e.stopPropagation();
          const items = kind === 'fan' ? fan : groups.map(groupSlice);
          const direction = ['ArrowLeft','ArrowUp'].includes(e.key) ? -1 : 1;
          const next = items[(items.findIndex(item => item.key === s.key) + direction + items.length) % items.length];
          e.currentTarget.closest('svg')?.querySelector<SVGGElement>(`[data-action-id="${next.key}"]`)?.focus();
        }
      }}
      onMouseEnter={() => { onHover?.(id); if (kind === 'group') onOpen?.(isAction ? null : s.key); }} onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(id)} onBlur={() => onHover?.(null)}>
      <title>{s.note ? `${s.title} — ${s.note}` : s.title}</title>
      <path d={sectorPath(c, c, s.r0, s.r1, s.a0, s.a1, 5)}/>
      {Icon && <Icon x={x - 7} y={y - (small ? 13 : 15)} width={14} height={14} strokeWidth={1.8} className="seg-icon" aria-hidden="true"/>}
      <text x={x} y={Icon ? y + (small ? 7 : 8) : y} className={Icon ? 'seg-caption' : 'seg-tag'} textAnchor="middle" dominantBaseline="central">{s.label}</text>
      {s.count && <text x={+(c + Math.cos(s.a1 - 0.16) * (s.r1 - 7)).toFixed(3)} y={+(c + Math.sin(s.a1 - 0.16) * (s.r1 - 7)).toFixed(3)} className="seg-count" textAnchor="middle" dominantBaseline="central">{s.count}</text>}
    </motion.g>;
  };
  return <div className={`wheel ${glow ? 'glow' : ''} ${nested ? 'nested' : ''}`} style={{ width: size, height: size }}>
    <svg className="wheel-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle className="wheel-plate" cx={c} cy={c} r={outer + 3}/>
      <path className="wheel-ticks" d={ticks(c, c, outer + 3, 2, 4)} aria-hidden="true"/>
      {nested && <circle className="wheel-orbit" cx={c} cy={c} r={(fanIn + outer) / 2} aria-hidden="true"/>}
      {!hideSegments && groups.map((g, i) => draw(groupSlice(g, i), 'group'))}
      <AnimatePresence>{!hideSegments && fan.map(s => draw(s, 'fan'))}</AnimatePresence>
      <circle className="wheel-hole" cx={c} cy={c} r={hole}/>
      {progress != null && <>
        <circle className="wheel-progress-track" cx={c} cy={c} r={ring}/>
        <motion.circle className="wheel-progress" cx={c} cy={c} r={ring} strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference * (1 - Math.max(0.03, progress)) }}
          transform={`rotate(-90 ${c} ${c})`}/>
      </>}
    </svg>
    <div className="wheel-center" style={{ width: hole * 2 - 10, height: hole * 2 - 10, left: c - hole + 5, top: c - hole + 5 }}>{center}</div>
  </div>;
}
