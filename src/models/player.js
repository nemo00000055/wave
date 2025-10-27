export class Player{
  constructor(name, base){
    this.name = name || 'Hero';
    this.stats = { hp: base?.hp??30, maxHp: base?.hp??30, atk: base?.atk??5, def: base?.def??2, crit: base?.crit??0.1, speed: base?.speed??10 };
    this.eq = {};
    this.inv = { items:[], stash:[], gold:0 };
    this.lvl = 1;
    this.exp = 0;
    this.id = 'P1';
    this.kind = 'Hero';
  }
}
