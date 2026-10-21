import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { features, categories } from '../src/data/features.ts';
const paths=[...new Set(['src/components/Brand.tsx','src/components/Wheel.tsx','src/lib/present.ts','src/App.css','src-tauri/tauri.conf.json','src-tauri/src/converters/registry.rs','src-tauri/src/converters/mod.rs','src-tauri/src/commands/mod.rs','src-tauri/src/jobs/worker.rs','src-tauri/src/safety.rs','src-tauri/src/models.rs',...features.map(f=>f.source.startsWith('../src/')?f.source.slice(3):'src-tauri/src/'+f.source)])];
const fingerprints={};for(const p of paths) fingerprints[p]=createHash('sha256').update(await readFile(new URL('../../'+p,import.meta.url))).digest('hex');
if(process.argv.includes('--check')){
 const previous=JSON.parse(await readFile(new URL('../docs/source-fingerprints.json',import.meta.url)));
 const changed=paths.filter(p=>previous[p]!==fingerprints[p]);if(changed.length)throw new Error('Ripetere audit: sorgenti cambiati: '+changed.join(', '));
 console.log(`Audit: ${paths.length} sorgenti invariati, ${features.length} voci catalogate.`);
}else{
 await writeFile(new URL('../docs/source-fingerprints.json',import.meta.url),JSON.stringify(fingerprints,null,2));
 const header=await readFile(new URL('../docs/AUDIT_NOTES.md',import.meta.url),'utf8');
 const table=categories.map(c=>`\n## ${c}\n\n| ID / funzione | Modulo | Stato ed evidenza | Landing |\n|---|---|---|---|\n`+features.filter(f=>f.category===c).map(f=>`| \`${f.id}\` — ${f.name} | \`${f.source.startsWith('../src/')?f.source.slice(3):'src-tauri/src/'+f.source}\` | Implementata nel codice. ${f.condition || 'Nessuna dipendenza esterna aggiuntiva dichiarata dal registro.'} | Catalogo interattivo + accessibile. ${f.options} |`).join('\n')).join('\n');
 await writeFile(new URL('../docs/FEATURE_AUDIT.md',import.meta.url),header+'\n'+table+'\n');
 console.log('FEATURE_AUDIT.md e impronte sorgenti aggiornati.');
}
