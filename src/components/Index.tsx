import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { categories, features } from '../data/features';
import { matches } from '../lib/types';

/** The full list of operations, typeset like the index at the back of a book. */
export default function Index() {
  const [category, setCategory] = useState<string | null>('PDF');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>('pdf:edit');
  const visible = features.filter(f => query ? matches(query, `${f.name} ${f.formats} ${f.description} ${f.category}`) : !category || f.category === category);
  return <div className="index">
    <div className="index-tools">
      <div className="index-cats" role="group" aria-label="Filtra per categoria">
        <button type="button" aria-pressed={!query && !category} onClick={() => { setCategory(null); setQuery(''); }}>Tutte<sup>{features.length}</sup></button>
        {categories.map(c => <button type="button" key={c} aria-pressed={!query && c === category} onClick={() => { setCategory(c); setQuery(''); }}>{c}<sup>{features.filter(f => f.category === c).length}</sup></button>)}
      </div>
      <label className="index-search"><Search size={16} aria-hidden="true"/><input type="search" aria-label="Cerca un’operazione o un formato" placeholder="Cerca: pdf, testo, zip…" value={query} onChange={e => setQuery(e.target.value)}/></label>
    </div>
    <p className="sr-only" role="status">{visible.length} operazioni</p>
    <ol className="index-list">
      {visible.map(f => {
        const expanded = open === f.id;
        const id = `voce-${f.id.replace(/[^a-z0-9]+/gi, '-')}`;
        return <li key={f.id} className={expanded ? 'is-open' : ''}>
          <button type="button" className="index-row" aria-expanded={expanded} aria-controls={id} onClick={() => setOpen(expanded ? null : f.id)}>
            <span className="index-name">{f.name}</span><span className="index-dots" aria-hidden="true"/><span className="index-formats">{f.formats}</span><Plus className="index-plus" size={16} aria-hidden="true"/>
          </button>
          <div id={id} className="index-detail" hidden={!expanded}>
            <p>{f.description}</p>
            <p><span>Opzioni</span>{f.options}</p>
            {f.condition && <p><span>Serve</span>{f.condition}</p>}
            <code>{f.example}</code>
          </div>
        </li>;
      })}
      {!visible.length && <li className="index-empty">Niente con “{query}”. Prova con PDF, testo o ZIP.</li>}
    </ol>
  </div>;
}
