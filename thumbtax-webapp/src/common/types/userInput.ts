import type { BoxAddress } from "#src/common/types/boxAddress";

export type UserInput =
  | { type: "amount_list"; value: Array<{ label: string; amount: number }> }
  | {
      type: "instance_box_selections";
      selected: BoxAddress[];
    }
  | { type: "number"; value: number }
  | { type: "override"; override: number | null }
  | { type: "selection"; selectedIndex: number };
