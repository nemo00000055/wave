const toUint32 = (x) => x >>> 0;
const strHash = (s) => { let h = 0x811c9dc5; for (let i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = Math.imul(h,0x01000193);} return toUint32(h); };
const mulberry32 = (a) => () => { a = toUint32(a + 0x6D2B79F5); let t = Math.imul(a ^ (a>>>15), 1|a); t ^= t + Math.imul(t ^ (t>>>7), 61|t); return ((t ^ (t>>>14))>>>0)/4294967296; };
export function createPRNG(seed){ const s = typeof seed==='number'?String(seed>>>0):String(seed??'0'); const next = mulberry32(strHash(s)); return { next, seed:s }; }
export function split(prng,label=''){ return createPRNG(`${prng.seed}|${label}`); }
export const float01 = (prng)=> prng.next();
export const int = (prng,min,max)=> Math.floor(float01(prng)*(max-min+1))+min;
export function pick(prng,arr){ return arr[int(prng,0,arr.length-1)]; }
export function shuffle(prng,arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=int(prng,0,i); [a[i],a[j]]=[a[j],a[i]];} return a; }
