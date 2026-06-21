import type { FormClass } from "#src/common/types/formClass";

type NodePosition = { x: number; y: number };

export type UiState = {
  connectionsGraphNodePositions: Partial<Record<FormClass, NodePosition>>;
};
