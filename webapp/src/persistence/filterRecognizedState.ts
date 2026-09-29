import { absurd } from "@thumbtax/common";
import mapValues from "lodash/mapValues";

import type { FormClass } from "@thumbtax/common";
import type {
  FormSpecification,
  SpecificationRegistry,
  ValueProvider,
} from "@thumbtax/forms";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { UserInput } from "#src/common/types/userInput";
import type { ApplicationState } from "#src/state/types/applicationState";

type InputValueProvider = Extract<ValueProvider, { inputKey: string }>;

function collectInputProviders(
  specification: FormSpecification,
): Map<string, InputValueProvider> {
  const providers = new Map<string, InputValueProvider>();
  for (const section of specification.sections) {
    for (const line of section.lines) {
      const boxes = "box" in line ? [line.box] : line.boxes;
      // Input providers can only be the top-level value of a box, since
      // computed providers never contain them.
      for (const { value } of boxes) {
        if ("inputKey" in value) {
          providers.set(value.inputKey, value);
        }
      }
    }
  }
  return providers;
}

/**
 * Returns the recognized part of the input, or undefined if none of it is recognized.
 */
function filterRecognizedInput(
  input: UserInput,
  provider: InputValueProvider,
  instanceClasses: ReadonlyMap<FormInstanceId, FormClass>,
): UserInput | undefined {
  const providerType = provider.type;
  switch (providerType) {
    case "checkbox_input":
    case "date_input":
    case "number_input":
      return input.type === "number" ? input : undefined;
    case "list_amounts_input":
      return input.type === "amount_list" ? input : undefined;
    case "override_number_input":
      return input.type === "override" ? input : undefined;
    case "select_instance_boxes_input": {
      if (input.type !== "instance_box_selections") {
        return undefined;
      }
      const selected = input.selected.filter((address) => {
        const formClass = instanceClasses.get(address.instance);
        return provider.options.some(
          ({ form, box }) => form === formClass && box === address.box,
        );
      });
      return { ...input, selected };
    }
    case "select_value_input": {
      if (input.type !== "selection") {
        return undefined;
      }
      const isOption = provider.options.some(
        ({ key }) => key === input.selectedKey,
      );
      return isOption ? input : undefined;
    }
    default:
      return absurd(providerType);
  }
}

function filterRecognizedInstance(
  instance: FormInstance,
  specification: FormSpecification,
  instanceClasses: ReadonlyMap<FormInstanceId, FormClass>,
): FormInstance {
  const providers = collectInputProviders(specification);
  const inputs: FormInstance["inputs"] = {};
  for (const [inputKey, input] of Object.entries(instance.inputs)) {
    const provider = providers.get(inputKey);
    if (input === undefined || provider === undefined) {
      continue;
    }
    const recognizedInput = filterRecognizedInput(
      input,
      provider,
      instanceClasses,
    );
    if (recognizedInput !== undefined) {
      inputs[inputKey] = recognizedInput;
    }
  }
  return { ...instance, inputs };
}

/**
 * Returns a copy of the application state without the inputs that the given
 * specifications don't recognize:
 * - Inputs whose key has no input provider
 * - Inputs whose type doesn't match their provider
 * - Selections whose key isn't one of the provider's options
 * - Selected box addresses that aren't among the provider's options or whose instance doesn't exist
 */
export function filterRecognizedState(
  applicationState: ApplicationState,
  specifications: SpecificationRegistry,
): ApplicationState {
  const instanceClasses = new Map<FormInstanceId, FormClass>();
  for (const instances of Object.values(applicationState.formInstances)) {
    for (const instance of instances) {
      instanceClasses.set(instance.id, instance.class);
    }
  }

  return {
    ...applicationState,
    formInstances: mapValues(applicationState.formInstances, (instances) =>
      instances?.map((instance) =>
        filterRecognizedInstance(
          instance,
          specifications[instance.class],
          instanceClasses,
        ),
      ),
    ),
  };
}
