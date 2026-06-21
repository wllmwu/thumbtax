import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type {
  FormInstance,
  InstanceRegistry,
} from "#src/common/types/formInstance";
import type { ResolvedBox } from "#src/common/types/workbook";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";
import type {
  ComputedValueProvider,
  ValueProvider,
} from "#src/specifications/types/valueProvider";

export function makeInstanceFixture(
  overrides?: Partial<FormInstance>,
): FormInstance {
  return {
    id: "instance-1",
    class: "fW2",
    label: "",
    inputs: {},
    ...overrides,
  };
}

export type ValueProviderFixture = {
  description: string;
  provider?: ValueProvider;
  specificationRegistry?: SpecificationRegistry;
  filingStatus?: FilingStatus;
  instanceRegistry?: InstanceRegistry;
  expected: ResolvedBox;
};

export const TEST_CLASS: FormClass = "fW2";
export const TEST_INSTANCE_ID = "instance-1";
export const BOX_UNDER_TEST_ID = "box-under-test";

export const ERROR_PROVIDER: ComputedValueProvider = {
  type: "quotient",
  dividend: { type: "number_constant", value: 1 },
  divisor: { type: "number_constant", value: 0 },
};
