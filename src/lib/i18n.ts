// Italian-only presentation adapter. No dependency on the desktop app or IPC.
export const language = (): string => 'it';
export const t = (text: string, values: Record<string, string | number> = {}) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? key));
