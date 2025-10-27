import { split, float01 } from './rng.js';
const clamp = (x,min,max)=> x<min?min:x>max?max:x;
function calcDamage(att, def, prng) {
  const base = Math.max(1, (att.atk||0) - (def.def||0));
  const blocked = float01(prng) < Math.min(0.25, (def.def||0)/100);
  const afterBlock = blocked ? Math.ceil(base * 0.7) : base;
  const crit = float01(prng) < Math.max(0, Math.min(0.95, att.crit||0));
  const dmg = Math.max(1, Math.floor(afterBlock * (crit ? 1.5 : 1)));
  return { dmg, crit, blocked };
}
export function startBattle(player, waveCfg, prng) {
  const rng = split(prng, 'combat:init');
  const enemies = (waveCfg.enemies||[]).map((e, i) => ({ id:`E${i}`, name:e.name, ...(e.stats||{}) }));
  return { turn:0, enemies, player, log:[] };
}
export function stepBattle(state, prng) {
  const rng = split(prng, `combat:turn:${state.turn}`);
  const events = [];
  const player = state.player;
  const targetIdx = state.enemies.findIndex(e => (e.hp||0) > 0);
  if (targetIdx === -1) return { state, events };
  const target = state.enemies[targetIdx];
  const { dmg:pd, crit:pc, blocked:pb } = calcDamage(player.stats, target, rng);
  target.hp = clamp((target.hp||0) - pd, 0, target.maxHp ?? Number.MAX_SAFE_INTEGER);
  pb && events.push({ t:'block', source:player.name, target:target.name, value:pd });
  pc && events.push({ t:'crit',  source:player.name, target:target.name, value:pd });
  events.push({ t:'hit', source:player.name, target:target.name, value:pd });
  if (target.hp === 0) events.push({ t:'death', source:player.name, target:target.name, value:0 });
  for (const e of state.enemies) {
    if ((e.hp||0) <= 0) continue;
    const { dmg, crit, blocked } = calcDamage(e, player.stats, rng);
    player.stats.hp = clamp((player.stats.hp||0) - dmg, 0, player.stats.maxHp||0);
    blocked && events.push({ t:'block', source:e.name, target:player.name, value:dmg });
    crit && events.push({ t:'crit',  source:e.name, target:player.name, value:dmg });
    events.push({ t:'hit', source:e.name, target:player.name, value:dmg });
    if ((player.stats.hp||0) === 0) { events.push({ t:'death', source:e.name, target:player.name, value:0 }); break; }
  }
  const next = { ...state, turn: state.turn + 1, enemies: state.enemies, player, log: state.log.concat(events) };
  return { state: next, events };
}
export function resolveWaveOutcome(state) {
  const playerDead = (state.player.stats.hp||0) <= 0;
  const allDead = state.enemies.every(e => (e.hp||0) <= 0);
  if (playerDead) return 'loss';
  if (allDead) return 'win';
  return 'running';
}
if (typeof window !== 'undefined') { window.startBattle = window.startBattle || startBattle; }
