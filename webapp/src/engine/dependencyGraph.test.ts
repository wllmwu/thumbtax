import { describe, expect, it } from "vitest";

import { DependencyGraph } from "#src/engine/dependencyGraph";

type TestData = { value: number };
const TestGraph = DependencyGraph<TestData>;

describe("DependencyGraph", () => {
  describe("addNode", () => {
    it("adds a single node with no dependencies", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, []);
      expect(graph.getData("A")).toEqual({ value: 1 });
    });

    it("adds multiple nodes with no dependencies", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, []);
      graph.addNode("B", { value: 2 }, []);
      graph.addNode("C", { value: 3 }, []);
      expect(graph.getData("A")).toEqual({ value: 1 });
      expect(graph.getData("B")).toEqual({ value: 2 });
      expect(graph.getData("C")).toEqual({ value: 3 });
    });

    it("adds a single node with dependencies", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, ["B", "C"]);
      expect(graph.getData("A")).toEqual({ value: 1 });
    });

    it("adds multiple nodes with dependencies", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, []);
      graph.addNode("B", { value: 2 }, ["A", "D"]);
      graph.addNode("C", { value: 3 }, ["B", "E"]);
      expect(graph.getData("A")).toEqual({ value: 1 });
      expect(graph.getData("B")).toEqual({ value: 2 });
      expect(graph.getData("C")).toEqual({ value: 3 });
    });

    it("adds a node after adding its child", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, ["B", "C"]);
      graph.addNode("B", { value: 2 }, ["C", "D"]);
      graph.addNode("C", { value: 3 }, []);
      expect(graph.getData("A")).toEqual({ value: 1 });
      expect(graph.getData("B")).toEqual({ value: 2 });
      expect(graph.getData("C")).toEqual({ value: 3 });
    });

    it("throws exception when adding a node twice", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, []);
      expect(() => graph.addNode("A", { value: 2 }, ["B"])).toThrow(
        "Node A was already added",
      );
    });
  });

  describe("getData", () => {
    it("returns a node's data", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, []);
      graph.addNode("B", { value: 2 }, ["A", "C"]);
      graph.addNode("C", { value: 3 }, []);
      expect(graph.getData("A")).toEqual({ value: 1 });
      expect(graph.getData("B")).toEqual({ value: 2 });
      expect(graph.getData("C")).toEqual({ value: 3 });
    });

    it("uses the object reference", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, []);
      expect(graph.getData("A")).toBe(data);
    });

    it("throws exception when querying a node that has not been added", () => {
      const graph = new TestGraph();
      expect(() => graph.getData("A")).toThrow("Data is not set on node A");
      graph.addNode("A", { value: 1 }, ["B"]);
      expect(() => graph.getData("B")).toThrow("Data is not set on node B");
      expect(() => graph.getData("C")).toThrow("Data is not set on node C");
    });
  });

  describe("getTopologicalOrder", () => {
    const expectNodePrecedesChildren = (
      nodes: string[],
      node: string,
      children: string[],
    ) => {
      const nodeIndex = nodes.indexOf(node);
      expect(nodeIndex).toBeGreaterThanOrEqual(0);
      const nodesBefore = nodes.slice(0, nodeIndex);
      const nodesAfter = nodes.slice(nodeIndex + 1);
      for (const child of children) {
        expect(nodesBefore).not.toContain(child);
      }
      expect(nodesAfter).toEqual(expect.arrayContaining(children));
    };

    it("handles empty graph", () => {
      const graph = new TestGraph();
      expect(graph.getTopologicalOrder()).toEqual([]);
    });

    it("handles graph with one node", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, []);
      expect(graph.getTopologicalOrder()).toEqual(["A"]);
    });

    it("handles graph with only unconnected nodes", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, []);
      graph.addNode("B", data, []);
      graph.addNode("C", data, []);

      const result = graph.getTopologicalOrder();
      expect(result).toHaveLength(3);
      expect(result).toContain("A");
      expect(result).toContain("B");
      expect(result).toContain("C");
    });

    it("handles chain graph", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, []);
      graph.addNode("B", data, ["A"]);
      graph.addNode("C", data, ["B"]);
      graph.addNode("D", data, ["C"]);

      const result = graph.getTopologicalOrder();
      expect(result).toEqual(["A", "B", "C", "D"]);
    });

    it("handles tree graph", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, []);
      graph.addNode("B", data, ["A"]);
      graph.addNode("C", data, ["A"]);
      graph.addNode("D", data, ["B"]);
      graph.addNode("E", data, ["C"]);
      graph.addNode("F", data, ["C"]);
      graph.addNode("G", data, ["A"]);
      graph.addNode("H", data, ["C"]);
      graph.addNode("I", data, ["D"]);
      graph.addNode("J", data, ["I"]);

      const result = graph.getTopologicalOrder();
      expect(result).toHaveLength(10);
      expect(result).toEqual(
        expect.arrayContaining([
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
        ]),
      );
      expect(result[0]).toEqual("A");
      expectNodePrecedesChildren(result, "B", ["D", "I", "J"]);
      expectNodePrecedesChildren(result, "C", ["E", "F", "H"]);
      expectNodePrecedesChildren(result, "D", ["I", "J"]);
      expectNodePrecedesChildren(result, "I", ["J"]);
    });

    it("handles reverse tree graph", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, ["B", "C", "G"]);
      graph.addNode("B", data, ["D"]);
      graph.addNode("C", data, ["E", "F", "H"]);
      graph.addNode("D", data, ["I"]);
      graph.addNode("E", data, []);
      graph.addNode("F", data, []);
      graph.addNode("G", data, []);
      graph.addNode("H", data, []);
      graph.addNode("I", data, ["J"]);
      graph.addNode("J", data, []);

      const result = graph.getTopologicalOrder();
      expect(result).toHaveLength(10);
      expect(result).toEqual(
        expect.arrayContaining([
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
        ]),
      );
      expect(result[result.length - 1]).toEqual("A");
      expectNodePrecedesChildren(result, "B", ["A"]);
      expectNodePrecedesChildren(result, "C", ["A"]);
      expectNodePrecedesChildren(result, "D", ["A", "B"]);
      expectNodePrecedesChildren(result, "E", ["A", "C"]);
      expectNodePrecedesChildren(result, "F", ["A", "C"]);
      expectNodePrecedesChildren(result, "G", ["A"]);
      expectNodePrecedesChildren(result, "H", ["A", "C"]);
      expectNodePrecedesChildren(result, "I", ["A", "B", "D"]);
      expectNodePrecedesChildren(result, "J", ["A", "B", "D", "I"]);
    });

    it("handles long and short path", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, []);
      graph.addNode("B", data, ["A", "E"]);
      graph.addNode("C", data, ["A"]);
      graph.addNode("D", data, ["C"]);
      graph.addNode("E", data, ["D"]);

      const result = graph.getTopologicalOrder();
      expect(result).toHaveLength(5);
      expect(result).toEqual(expect.arrayContaining(["A", "B", "C", "D", "E"]));
      expect(result[0]).toEqual("A");
      expectNodePrecedesChildren(result, "C", ["B", "D", "E"]);
      expectNodePrecedesChildren(result, "D", ["B", "E"]);
      expectNodePrecedesChildren(result, "E", ["B"]);
      expect(result[4]).toEqual("B");
    });

    it("handles layered DAG", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, []);
      graph.addNode("B", data, []);
      graph.addNode("C", data, []);
      graph.addNode("D", data, ["G", "H", "I"]);
      graph.addNode("E", data, ["G", "H", "I"]);
      graph.addNode("F", data, ["G", "H", "I"]);
      graph.addNode("G", data, ["A", "B", "C"]);
      graph.addNode("H", data, ["A", "B", "C"]);
      graph.addNode("I", data, ["A", "B", "C"]);

      const result = graph.getTopologicalOrder();
      expect(result).toHaveLength(9);
      expect(result).toEqual(
        expect.arrayContaining(["A", "B", "C", "D", "E", "F", "G", "H", "I"]),
      );
      expectNodePrecedesChildren(result, "A", ["D", "E", "F", "G", "H", "I"]);
      expectNodePrecedesChildren(result, "B", ["D", "E", "F", "G", "H", "I"]);
      expectNodePrecedesChildren(result, "C", ["D", "E", "F", "G", "H", "I"]);
      expectNodePrecedesChildren(result, "G", ["D", "E", "F"]);
      expectNodePrecedesChildren(result, "H", ["D", "E", "F"]);
      expectNodePrecedesChildren(result, "I", ["D", "E", "F"]);
    });

    it("handles multiple connected components", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, []);
      graph.addNode("B", data, ["A"]);
      graph.addNode("C", data, ["B"]);
      graph.addNode("D", data, ["A", "B"]);
      graph.addNode("E", data, []);
      graph.addNode("F", data, ["I"]);
      graph.addNode("G", data, ["F", "H"]);
      graph.addNode("H", data, ["F"]);
      graph.addNode("I", data, []);

      const result = graph.getTopologicalOrder();
      expect(result).toHaveLength(9);
      expect(result).toEqual(
        expect.arrayContaining(["A", "B", "C", "D", "E", "F", "G", "H", "I"]),
      );
      expectNodePrecedesChildren(result, "A", ["B", "C", "D"]);
      expectNodePrecedesChildren(result, "B", ["C", "D"]);
      expectNodePrecedesChildren(result, "F", ["G", "H"]);
      expectNodePrecedesChildren(result, "H", ["G"]);
      expectNodePrecedesChildren(result, "I", ["F"]);
    });

    it("includes nodes implicitly added as parents", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, ["C"]);
      graph.addNode("B", data, ["A", "C", "D"]);

      const result = graph.getTopologicalOrder();
      expect(result).toHaveLength(4);
      expect(result).toEqual(expect.arrayContaining(["A", "B", "C", "D"]));
      expectNodePrecedesChildren(result, "A", ["B"]);
      expectNodePrecedesChildren(result, "C", ["A", "B"]);
      expectNodePrecedesChildren(result, "D", ["B"]);
    });

    it("computes new ordering after adding more nodes", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, ["E"]);
      graph.addNode("B", data, ["A"]);
      graph.addNode("C", data, ["B"]);
      graph.addNode("D", data, []);

      const result1 = graph.getTopologicalOrder();
      expect(result1).toHaveLength(5);
      expect(result1).toEqual(
        expect.arrayContaining(["A", "B", "C", "D", "E"]),
      );

      graph.addNode("E", data, ["D"]);

      const result2 = graph.getTopologicalOrder();
      expect(result2).toHaveLength(5);
      expect(result2).toEqual(
        expect.arrayContaining(["A", "B", "C", "D", "E"]),
      );
      expectNodePrecedesChildren(result2, "A", ["B", "C"]);
      expectNodePrecedesChildren(result2, "B", ["C"]);
      expectNodePrecedesChildren(result2, "D", ["A", "B", "C", "E"]);
      expectNodePrecedesChildren(result2, "E", ["A", "B", "C"]);
    });

    it("ignores a node depending on itself", () => {
      const graph = new TestGraph();
      graph.addNode("A", { value: 1 }, ["A"]);
      expect(graph.getTopologicalOrder()).toEqual(["A"]);
    });

    it("throws exception when there is a small cycle", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, []);
      graph.addNode("B", data, ["A"]);
      graph.addNode("C", data, ["A", "B", "D"]);
      graph.addNode("D", data, ["A", "B", "C"]);

      expect(() => graph.getTopologicalOrder()).toThrow(
        "Dependency cycle detected",
      );
    });

    it("throws exception when there is a long cycle", () => {
      const graph = new TestGraph();
      const data: TestData = { value: 1 };
      graph.addNode("A", data, ["E"]);
      graph.addNode("B", data, ["A"]);
      graph.addNode("C", data, ["B"]);
      graph.addNode("D", data, ["C"]);
      graph.addNode("E", data, ["D"]);

      expect(() => graph.getTopologicalOrder()).toThrow(
        "Dependency cycle detected",
      );
    });
  });
});
