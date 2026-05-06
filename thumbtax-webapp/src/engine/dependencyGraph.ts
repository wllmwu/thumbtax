class DependencyNode<TNodeData> {
  id: string;
  parents: string[];
  children: string[];
  data: TNodeData | undefined;
  postorderNumber: number;

  constructor(id: string) {
    this.id = id;
    this.parents = [];
    this.children = [];
    this.data = undefined;
    this.postorderNumber = -1;
  }
}

export class DependencyGraph<TNodeData> {
  private nodes: Map<string, DependencyNode<TNodeData>> = new Map();

  public upsertNode(id: string, data: TNodeData, parents: string[]) {
    const node: DependencyNode<TNodeData> =
      this.nodes.get(id) ?? new DependencyNode<TNodeData>(id);
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

  public removeNode(id: string) {
    const node = this.nodes.get(id);
    if (node) {
      const parentNodes = this.getNodes(node.parents);
      for (const parentNode of parentNodes) {
        parentNode.children = parentNode.children.filter(
          (childId) => childId !== id,
        );
      }

      const childNodes = this.getNodes(node.children);
      for (const childNode of childNodes) {
        childNode.children = childNode.children.filter(
          (parentId) => parentId !== id,
        );
      }

      this.nodes.delete(id);
    }
  }

  public getData(id: string): TNodeData | undefined {
    return this.nodes.get(id)?.data;
  }

  public setData(id: string, data: TNodeData) {
    const node = this.nodes.get(id);
    if (node) {
      node.data = data;
    }
  }

  public getTopologicalOrder(): string[] {
    let counter = 0;

    const depthFirstPostOrder = (
      node: DependencyNode<TNodeData>,
      startingCounter: number,
    ) => {
      if (node.postorderNumber > startingCounter) {
        throw new Error("Dependency cycle detected");
      } else if (node.postorderNumber !== -1) {
        return;
      }
      counter++;
      for (const child of this.getNodes(node.children)) {
        depthFirstPostOrder(child, startingCounter);
      }
      node.postorderNumber = counter;
      counter++;
    };

    for (const node of this.nodes.values()) {
      node.postorderNumber = -1;
    }

    for (const node of this.nodes.values()) {
      depthFirstPostOrder(node, counter);
    }

    return Array.from(this.nodes.values())
      .sort((a, b) => a.postorderNumber - b.postorderNumber)
      .map((n) => n.id);
  }

  private getNodes(ids: string[]): Array<DependencyNode<TNodeData>> {
    return ids.map((id) => this.nodes.get(id)).filter((n) => n !== undefined);
  }
}
