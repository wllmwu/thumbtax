import type { FormClass } from "@thumbtax/common";

type NodePosition = { x: number; y: number };

export type UiState = {
  connectionsGraphNodePositions: Partial<Record<FormClass, NodePosition>>;
};
