/**
 * Shop system — deterministic, no throws. All functions return { ok, state } or { ok:false, error }.
 */
function deepClone(v){ return JSON.parse(JSON.stringify(v)); }
function ensureInv(state){
  state.player = state.player || {};
  state.player.inv = state.player.inv || { items:[], stash:[], gold:0 };
  state.player.inv.items = state.player.inv.items || [];
  state.player.inv.stash = state.player.inv.stash || [];
  state.player.inv.gold = state.player.inv.gold || 0;
  return state;
}

function addToInventory(s, item){
  (s.player.inv.items).push(item);
}
function removeFromInventory(s, itemId){
  const arr = s.player.inv.items;
  const idx = arr.findIndex(i => i.id === itemId);
  if (idx >= 0) { arr.splice(idx, 1); return true; }
  return false;
}

export async function buyItem(state, item){
  try{
    const cost = (item && item.cost) ? Number(item.cost) : 0;
    const base = ensureInv(deepClone(state));
    if (base.player.inv.gold < cost) return { ok:false, error:'insufficient_funds' };
    base.player.inv.gold -= cost;
    addToInventory(base, item);
    return { ok:true, state: base };
  }catch(e){ return { ok:false, error: String(e && e.message || e) }; }
}

export async function sellItem(state, itemId, price){
  try{
    const amount = Number(price||0);
    const base = ensureInv(deepClone(state));
    if (!removeFromInventory(base, itemId)) return { ok:false, error:'item_not_found' };
    base.player.inv.gold += amount;
    return { ok:true, state: base };
  }catch(e){ return { ok:false, error: String(e && e.message || e) }; }
}

/** Convenience OO wrapper used by some UIs */
export class Shop{
  async buy(state, item){ return buyItem(state, item); }
  async sell(state, id, price){ return sellItem(state, id, price); }
}
