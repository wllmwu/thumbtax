import type { FormClass } from "@thumbtax/common";

export type ConnectionsGraph = {
  nodes: ConnectionsNode[];
  edges: ConnectionsEdge[];
};

export type ConnectionsNode = {
  formClass: FormClass;
  instanceCount: number;
};

export type ConnectionsEdge = {
  source: FormClass;
  target: FormClass;
};
