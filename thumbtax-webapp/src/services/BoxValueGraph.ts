type NodeData = {
  value: number;
  compute: () => number;
  deps: Set<string>;
  dependents: Set<string>;
};

export function makeBoxKey(formId: string, boxId: string): string {
  return `${formId}|${boxId}`;
}

export function parseBoxKey(key: string): { formId: string; boxId: string } {
  const idx = key.indexOf("|");
  return { formId: key.slice(0, idx), boxId: key.slice(idx + 1) };
}

export class BoxValueGraph {
  private nodes = new Map<string, NodeData>();

  // Registers a node with its deps and compute function. If the node already
  // exists (e.g. as a stub), its compute function and any new deps are added
  // while preserving existing dependents.
  addNode(key: string, deps: readonly string[], compute: () => number): void {
    for (const dep of deps) {
      if (!this.nodes.has(dep)) {
        this.nodes.set(dep, {
          value: 0,
          compute: () => 0,
          deps: new Set(),
          dependents: new Set(),
        });
      }
    }

    const existing = this.nodes.get(key);
    if (existing) {
      existing.compute = compute;
      for (const dep of deps) {
        if (!existing.deps.has(dep)) {
          existing.deps.add(dep);
          this.nodes.get(dep)!.dependents.add(key);
        }
      }
      existing.value = compute();
      this.propagate(existing.dependents);
    } else {
      const node: NodeData = {
        value: 0,
        compute,
        deps: new Set(deps),
        dependents: new Set(),
      };
      this.nodes.set(key, node);
      for (const dep of deps) {
        this.nodes.get(dep)!.dependents.add(key);
      }
      node.value = compute();
      this.propagate(node.dependents);
    }
  }

  // Removes a node, cleans up both directions of edges, and re-evaluates its
  // former dependents (since one of their deps was just removed).
  removeNode(key: string): void {
    const node = this.nodes.get(key);
    if (!node) return;

    const formerDependents = new Set(node.dependents);

    for (const dep of node.deps) {
      this.nodes.get(dep)?.dependents.delete(key);
    }
    for (const dependent of node.dependents) {
      this.nodes.get(dependent)?.deps.delete(key);
    }
    this.nodes.delete(key);

    this.propagate(formerDependents);
  }

  // Adds a dep edge from nodeKey to depKey and re-evaluates. Used to wire up
  // cross-form references when new form instances are added.
  addDep(nodeKey: string, depKey: string): void {
    const node = this.nodes.get(nodeKey);
    if (!node || node.deps.has(depKey)) return;

    if (!this.nodes.has(depKey)) {
      this.nodes.set(depKey, {
        value: 0,
        compute: () => 0,
        deps: new Set(),
        dependents: new Set(),
      });
    }

    node.deps.add(depKey);
    this.nodes.get(depKey)!.dependents.add(nodeKey);
    node.value = node.compute();
    this.propagate(node.dependents);
  }

  // Sets a value directly (for user-input leaf nodes) and propagates through
  // dependents in topological order.
  setInputValue(key: string, value: number): void {
    const node = this.nodes.get(key);
    if (!node) return;
    node.value = value;
    this.propagate(node.dependents);
  }

  getValue(key: string): number {
    return this.nodes.get(key)?.value ?? 0;
  }

  hasNode(key: string): boolean {
    return this.nodes.has(key);
  }

  private propagate(startKeys: Iterable<string>): void {
    // BFS to collect all transitively affected nodes.
    const affected = new Set<string>();
    const bfsQueue = [...startKeys];
    let i = 0;
    while (i < bfsQueue.length) {
      const k = bfsQueue[i++];
      if (!affected.has(k)) {
        affected.add(k);
        for (const dependent of this.nodes.get(k)?.dependents ?? []) {
          bfsQueue.push(dependent);
        }
      }
    }

    // Kahn's algorithm to determine topological evaluation order.
    const inDegree = new Map<string, number>();
    for (const k of affected) {
      let count = 0;
      for (const dep of this.nodes.get(k)?.deps ?? []) {
        if (affected.has(dep)) count++;
      }
      inDegree.set(k, count);
    }

    const sources: string[] = [];
    for (const [k, deg] of inDegree) {
      if (deg === 0) sources.push(k);
    }

    while (sources.length > 0) {
      const current = sources.shift()!;
      const node = this.nodes.get(current);
      if (node) node.value = node.compute();
      for (const dependent of this.nodes.get(current)?.dependents ?? []) {
        if (affected.has(dependent)) {
          const newDeg = (inDegree.get(dependent) ?? 0) - 1;
          inDegree.set(dependent, newDeg);
          if (newDeg === 0) sources.push(dependent);
        }
      }
    }
  }
}
