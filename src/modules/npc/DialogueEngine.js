/**
 * DialogueEngine.js — Traverses a JSON dialogue tree.
 */
export class DialogueEngine {
  constructor(tree) { this.tree = tree; this.currentNodeId = 'start'; this.finished = false; }
  get currentNode() { return this.tree.nodes[this.currentNodeId] ?? null; }
  choose(index) {
    const c = this.currentNode?.choices?.[index];
    this.currentNodeId = c?.next ?? '__end__';
    if (this.currentNodeId === '__end__') this.finished = true;
  }
  reset() { this.currentNodeId = 'start'; this.finished = false; }
}
