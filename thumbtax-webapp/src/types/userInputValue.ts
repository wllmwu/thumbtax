export type UserInputValue =
  | {
      type: "number";
      value: number;
    }
  | {
      type: "predicted_number";
      value: number;
    }
  | {
      type: "labeled_list";
      value: Array<[string, number]>;
    };
