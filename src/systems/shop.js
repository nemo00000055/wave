function cloneState(s){ return JSON.parse(JSON.stringify(s)); }
function addToInventory(s,item){ (s.player?.inv?.items ??= []).push(item); }
function removeFromInventory(s,id){ const a=(s.player?.inv?.items)||[]; const i=a.findIndex(x=>x.id===id); if(i>=0)a.splice(i,1); return i>=0; }

export async function buyItem(state, item){
  try{
    const cost = item.cost ?? 0;
    const gold = state.player?.inv?.gold ?? state.gold ?? 0;
    if (gold < cost) return { ok:false, error:'insufficient_funds' };
    const next = cloneState(state);
    if (next.player?.inv) next.player.inv.gold = (next.player.inv.gold||0) - cost;
    else next.gold = (next.gold||0) - cost;
    addToInventory(next, item);
    return { ok:true, state: next };
  }catch(e){ return { ok:false, error:String(e) }; }
}

export async function sellItem(state, itemId, price){
  try{
    const next = cloneState(state);
    if (!removeFromInventory(next, itemId)) return { ok:false, error:'item_not_found' };
    if (next.player?.inv) next.player.inv.gold = (next.player.inv.gold||0) + (price||0);
    else next.gold = (next.gold||0) + (price||0);
    return { ok:true, state: next };
  }catch(e){ return { ok:false, error:String(e) }; }
}


export class Shop{
  constructor(){}
  async buy(state, item){ 
    const res = await (await import('./shop.js')).buyItem?.(state, item);
    return res || { ok:false, error:'buy_not_implemented' };
  }
  async sell(state, id, price){
    const res = await (await import('./shop.js')).sellItem?.(state, id, price);
    return res || { ok:false, error:'sell_not_implemented' };
  }
}
