import { $, $$ } from './dom.js';
import { HEROES, CREATURES } from '../systems/constants.js';

export function renderAll(state){
  // Populate selects if present
  const heroSel = $('#select-hero');
  const creatureSel = $('#select-creature');
  if (heroSel && heroSel.options.length === 0){
    heroSel.innerHTML = HEROES.map(h => `<option value="${h.id}">${h.name}</option>`).join('');
  }
  if (creatureSel && creatureSel.options.length === 0){
    creatureSel.innerHTML = CREATURES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }
  // HUD
  const hp = $('#stat-hp'); const atk = $('#stat-atk'); const def = $('#stat-def');
  if (state?.player){
    if (hp) hp.textContent = state.player.stats.hp;
    if (atk) atk.textContent = state.player.stats.atk;
    if (def) def.textContent = state.player.stats.def;
  }
  updateNextWavePreview(state);
}

export function updateNextWavePreview(state){
  const el = $('#next-wave-preview');
  if (!el) return;
  el.textContent = state?.meta ? `Wave ${state.meta.wave} — Theme: ${state.meta.theme||'—'}` : '—';
}

export function renderBattleHUD(){ /* no-op minimal */ }
