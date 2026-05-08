class DependencyNode<TNodeData extends object> {
  id: string;
  parents: string[];
  children: string[];
  data: TNodeData | undefined;
  preorderNumber: number;
  postorderNumber: number;

  constructor(id: string) {
    this.id = id;
    this.parents = [];
    this.children = [];
    this.data = undefined;
    this.preorderNumber = -1;
    this.postorderNumber = -1;
  }

  public clearMetadata() {
    this.preorderNumber = -1;
    this.postorderNumber = -1;
  }
}

export class DependencyGraph<TNodeData extends object> {
  private nodes: Map<string, DependencyNode<TNodeData>> = new Map();

  public addNode(id: string, data: TNodeData, parents: string[]) {
    const existingNode = this.nodes.get(id);
    if (existingNode && existingNode.data !== undefined) {
      throw new Error(`Node ${id} was already added`);
    }

    const node: DependencyNode<TNodeData> =
      existingNode ?? new DependencyNode<TNodeData>(id);
    node.data = data;

    for (const parentId of parents) {
      const parentNode =
        this.nodes.get(parentId) ?? new DependencyNode<TNodeData>(parentId);
      parentNode.children.push(id);
      node.parents.push(parentId);
      this.nodes.set(parentId, parentNode);
    }

    this.nodes.set(id, node);
  }

  public getData(id: string): TNodeData {
    const data = this.nodes.get(id)?.data;
    if (!data) {
      throw new Error(`Data is not set on node ${id}`);
    }
    return data;
  }

  public getTopologicalOrder(): string[] {
    let counter = 0;

    const depthFirstPostOrder = (node: DependencyNode<TNodeData>) => {
      if (node.postorderNumber !== -1) {
        return;
      } else if (node.preorderNumber !== -1) {
        throw new Error(`Dependency cycle detected at node ${node.id}`);
      }
      node.preorderNumber = counter;
      counter++;
      for (const child of this.getNodes(node.children)) {
        depthFirstPostOrder(child);
      }
      node.postorderNumber = counter;
      counter++;
    };

    for (const node of this.nodes.values()) {
      node.clearMetadata();
    }

    for (const node of this.nodes.values()) {
      depthFirstPostOrder(node);
    }

    return Array.from(this.nodes.values())
      .sort((a, b) => b.postorderNumber - a.postorderNumber)
      .map((n) => n.id);
  }

  private getNodes(ids: string[]): Array<DependencyNode<TNodeData>> {
    return ids.map((id) => {
      const node = this.nodes.get(id);
      if (!node) {
        throw new Error(`Node ${id} does not exist`);
      }
      return node;
    });
  }
}
