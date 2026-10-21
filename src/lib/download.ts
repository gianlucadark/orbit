import release from '../data/release.json';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const configured = import.meta.env.PUBLIC_DOWNLOAD_URL || release.publicUrl;
if (configured && !/^https:\/\//.test(configured)) throw new Error('PUBLIC_DOWNLOAD_URL must be a verified HTTPS installer URL');
// Astro bundles server modules before prerendering; import.meta.url no longer points into src/.
const local = (import.meta.env.DEV || import.meta.env.PUBLIC_LOCAL_DOWNLOAD === '1') && existsSync(resolve('public/downloads', release.file));
export const download = { ...release, url: configured || (local ? `/downloads/${release.file}` : null), local: !configured && local, size: '9,8 MB', available: !!configured || local };
