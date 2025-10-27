import { createPRNG } from './rng.js';
const LATEST = 2;
export function serialize(state) {
  const meta = state.meta ?? { wave:1, theme:'Plains', auto:{running:false,speedMs:800}, shopBuyback:[] };
  return { __ma_save__:1, version:2, ts:Date.now(), rngSeed: state.rngSeed || String(Date.now()), player: state.player, meta: { ...meta, shopBuyback: meta.shopBuyback ?? [] } };
}
export function deserialize(blob) {
  if (!blob || blob.__ma_save__ !== 1 || !blob.version) throw new Error('bad_blob');
  const b = migrate(blob);
  return { rng: createPRNG(b.rngSeed), rngSeed: b.rngSeed, player: b.player, meta: b.meta };
}
export function migrate(b) {
  if (b.version === 2) return b;
  if (b.version === 1) {
    const rngSeed = String((b.ts>>>0) ^ (b.player?.id?.length||13));
    return { __ma_save__:1, version:2, ts:b.ts, rngSeed, player:b.player, meta:{ ...b.meta, shopBuyback: [] } };
  }
  throw new Error('unsupported_version');
}
export function saveToStorage(key, state) {
  try { const blob = serialize(state); localStorage.setItem(key, JSON.stringify(blob)); return { ok:true }; }
  catch(e){ return { ok:false, error:String(e?.message||e) }; }
}
export function loadFromStorage(key) {
  try { const raw = localStorage.getItem(key); if (!raw) return { ok:false, error:'not_found' }; const blob = JSON.parse(raw); const state = deserialize(blob); return { ok:true, state }; }
  catch(e){ return { ok:false, error:String(e?.message||e) }; }
}
