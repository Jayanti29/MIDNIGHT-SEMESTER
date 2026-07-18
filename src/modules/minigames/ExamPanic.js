/**
 * ExamPanic.js — Mini-game: MCQ questions against the clock.
 */
export class ExamPanic {
  constructor({ questions = [], timeLimit = 60, onComplete = () => {} } = {}) {
    this.questions = questions; this.timeLimit = timeLimit; this.onComplete = onComplete;
    this.index = 0; this.score = 0; this.elapsed = 0; this.active = false;
  }
  init()   { this.index = 0; this.score = 0; this.elapsed = 0; this.active = true; }
  update(dt) { if (!this.active) return; this.elapsed += dt; if (this.elapsed >= this.timeLimit) this._end(); }
  answer(i) {
    const q = this.questions[this.index]; if (!q) return;
    if (i === q.correct) this.score++;
    this.index++; if (this.index >= this.questions.length) this._end();
  }
  _end()    { this.active = false; this.onComplete({ score: this.score, total: this.questions.length }); }
  destroy() { this.active = false; }
}
