import { float01, split } from './rng.js';
export function rollLoot(table, prng, modifiers = {}) {
  const rolls = Math.max(0, Math.floor(modifiers.rolls ?? 1));
  const rng = split(prng, `loot:r=${rolls}`);
  if (!table?.length || rolls === 0) return [];
  const totalW = table.reduce((s, e) => s + (e.weight||0), 0);
  const out = [];
  for (let r = 0; r < rolls; r++) {
    let t = float01(rng) * totalW;
    for (const entry of table) {
      t -= (entry.weight||0);
      if (t <= 0) { out.push(entry.make ? entry.make(rng) : entry); break; }
    }
  }
  return out;
}
export function makeGoldRoll([min,max], prng) {
  const rng = split(prng, 'loot:gold');
  const range = Math.max(0, max - min);
  return Math.floor(min + float01(rng) * range);
}

export function createLoot(state){ return []; }
