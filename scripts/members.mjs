import { readdir, readFile } from 'node:fs/promises';
import { validateMembers } from '../public/lib.js';

export async function readMembers() {
  const files = (await readdir(new URL('../members/', import.meta.url))).filter(file => file.endsWith('.json')).sort();
  const members = await Promise.all(files.map(async file => {
    const data = JSON.parse(await readFile(new URL(`../members/${file}`, import.meta.url), 'utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data) || Object.hasOwn(data, 'id')) throw new Error(`${file}: use an object with name, year and url only.`);
    return { ...data, id: file.slice(0, -5) };
  }));
  return validateMembers(members);
}
