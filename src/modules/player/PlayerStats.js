/**
 * PlayerStats.js — Tracks all player statistics.
 */
export class PlayerStats {
  constructor() { this.energy = 100; this.stress = 0; this.gpa = 3.0; this.social = 50; this.money = 200; }
  static clamp(v, mn = 0, mx = 100) { return Math.max(mn, Math.min(mx, v)); }
  modifyEnergy(d) { this.energy = PlayerStats.clamp(this.energy + d); }
  modifyStress(d) { this.stress = PlayerStats.clamp(this.stress + d); }
  modifyGPA(d) { this.gpa = PlayerStats.clamp(this.gpa + d, 0, 4.0); }
  modifySocial(d) { this.social = PlayerStats.clamp(this.social + d); }
  modifyMoney(d) { this.money = Math.max(0, this.money + d); }
  isGameOver() { return this.energy <= 0 || this.stress >= 100; }
  serialize() { return { energy: this.energy, stress: this.stress, gpa: this.gpa, social: this.social, money: this.money }; }
  deserialize(d) { Object.assign(this, d); }
}
