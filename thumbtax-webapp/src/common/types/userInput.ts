export type UserInput =
  | { type: "number"; value: number }
  | { type: "amount_list"; value: Array<{ label: string; amount: number }> }
  | { type: "selection"; selectedIndex: number };
