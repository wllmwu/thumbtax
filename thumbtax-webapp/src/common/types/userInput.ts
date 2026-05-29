export type UserInput =
  | { type: "amount_list"; value: Array<{ label: string; amount: number }> }
  | { type: "number"; value: number }
  | { type: "override"; override: number | null }
  | { type: "selection"; selectedIndex: number };
