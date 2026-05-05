import { absurd } from "#src/common/utils/absurd";
import { DependencyGraph } from "#src/engine/dependencyGraph";

import type { BoxAddress } from "#src/common/types/boxAddress";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { ResolvedBox, Workbook } from "#src/common/types/workbook";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

type NodeData = {
  address: BoxAddress;
  resolvedBox: ResolvedBox | undefined;
};

function resolveDependencies(
  address: BoxAddress,
  provider: ValueProvider,
  instancesByClass: Map<FormClass, FormInstanceId[]>,
): BoxAddress[] {
  const traverse = (providers: ValueProvider[]): BoxAddress[] =>
    providers.flatMap((p) => resolveDependencies(address, p, instancesByClass));

  const type = provider.type;
  switch (type) {
    case "box_reference":
      if (provider.form) {
        const instanceIds = instancesByClass.get(provider.form);
        return instanceIds
          ? instanceIds.map((id) => ({ instance: id, box: provider.box }))
          : [];
      } else {
        return [{ instance: address.instance, box: provider.box }];
      }
    case "maximum":
    case "minimum":
    case "product":
    case "sum":
      return traverse(provider.values);
    case "difference":
      return traverse([provider.minuend, provider.subtrahend]);
    case "quotient":
      return traverse([provider.dividend, provider.divisor]);
    case "absolute_value":
    case "logical_negation":
    case "non_negative":
    case "numerical_negation":
      return resolveDependencies(address, provider.value, instancesByClass);
    case "selection_input":
      return traverse(provider.options.map(({ value }) => value));
    case "conditional":
      return traverse([
        provider.condition,
        provider.falseValue,
        provider.trueValue,
      ]);
    case "comparison":
      return traverse(
        [provider.value, provider.maximum, provider.minimum].filter(
          (vp) => vp !== undefined,
        ),
      );
    case "filing_status_map":
      return traverse(
        [...Object.values(provider.values), provider.default].filter(
          (vp) => vp !== undefined,
        ),
      );
    case "checkbox_input":
    case "form_instance_count":
    case "list_amounts_input":
    case "number_constant":
    case "number_input":
    case "unsupported":
    case "unused":
      return [];
    default:
      absurd(type);
  }
}

function makeNodeId(address: BoxAddress): string {
  return `${address.instance};${address.box}`;
}

export function computeWorkbook(
  specifications: SpecificationRegistry,
  instances: Map<FormInstanceId, FormInstance>,
  currentWorkbook: Workbook,
): Workbook {
  const instancesByClass = Array.from(instances.values()).reduce<
    Map<FormClass, FormInstanceId[]>
  >((acc, instance) => {
    const array = acc.get(instance.class) ?? [];
    array.push(instance.id);
    acc.set(instance.class, array);
    return acc;
  }, new Map());
  const graph = new DependencyGraph<NodeData>();

  for (const instance of instances.values()) {
    const specification = specifications[instance.class];

    for (const section of specification.sections) {
      for (const line of section.lines) {
        for (const box of line.boxes) {
          const address: BoxAddress = {
            instance: instance.id,
            box: box.identifier,
          };
          const dependencies = resolveDependencies(
            address,
            box.value,
            instancesByClass,
          );

          const nodeId = makeNodeId(address);
          const parentIds = dependencies.map(makeNodeId);

          graph.upsertNode(
            nodeId,
            { address, resolvedBox: undefined },
            parentIds,
          );
        }
      }
    }
  }
}
