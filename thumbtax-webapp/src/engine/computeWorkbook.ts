import { isEqual } from "lodash";

import { absurd } from "#src/common/utils/absurd";
import { DependencyGraph } from "#src/engine/dependencyGraph";

import type { BoxAddress } from "#src/common/types/boxAddress";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type {
  FormInstance,
  InstanceRegistry,
} from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { ResolvedBox, Workbook } from "#src/common/types/workbook";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

type NodeData = {
  address: BoxAddress;
  provider: ValueProvider;
  resolvedBox: ResolvedBox | undefined;
};

function resolveDependencies(
  address: BoxAddress,
  provider: ValueProvider,
  instanceRegistry: InstanceRegistry,
): BoxAddress[] {
  const traverse = (providers: ValueProvider[]): BoxAddress[] =>
    providers.flatMap((p) => resolveDependencies(address, p, instanceRegistry));

  const type = provider.type;
  switch (type) {
    case "box_reference":
      if (provider.form) {
        const instances = instanceRegistry[provider.form];
        return instances
          ? instances.map(({ id }) => ({ instance: id, box: provider.box }))
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
    case "non_negative_clamp":
    case "numerical_negation":
      return resolveDependencies(address, provider.value, instanceRegistry);
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
    case "override_number_input":
      return traverse([provider.computedValue]);
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

function resolveValue(
  address: BoxAddress,
  provider: ValueProvider,
  instances: Map<FormInstanceId, FormInstance>,
  instanceRegistry: InstanceRegistry,
  graph: DependencyGraph<NodeData>,
  filingStatus: FilingStatus,
): ResolvedBox {
  const resolveRecursive = (vp: ValueProvider) =>
    resolveValue(address, vp, instances, instanceRegistry, graph, filingStatus);

  const type = provider.type;
  switch (type) {
    case "absolute_value": {
      const { value, errors } = resolveRecursive(provider.value);
      return { value: Math.abs(value), errors };
    }
    case "box_reference": {
      if (provider.form) {
        const addresses = instanceRegistry[provider.form]?.map<BoxAddress>(
          ({ id }) => ({
            instance: id,
            box: provider.box,
          }),
        );

        if (!addresses || addresses.length === 0) {
          return {
            value: 0,
            errors: [],
          };
        }

        return addresses
          .map((a) => graph.getData(makeNodeId(a)))
          .reduce<ResolvedBox>(
            (acc, nodeData) => {
              const resolved = nodeData.resolvedBox;
              if (!resolved) {
                throw new Error(
                  `Node at ${nodeData.address} was not resolved before its dependent at ${address}`,
                );
              }

              acc.value += resolved.value;
              if (resolved.errors.length > 0) {
                acc.errors.push({
                  type: "upstream",
                  sourceAddress: nodeData.address,
                });
              }

              return acc;
            },
            { value: 0, errors: [] },
          );
      } else {
        const nodeData = graph.getData(
          makeNodeId({ instance: address.instance, box: provider.box }),
        );
        const resolved = nodeData.resolvedBox;
        if (!resolved) {
          throw new Error(
            `Node at ${nodeData.address} was not resolved before its dependent at ${address}`,
          );
        }

        return {
          value: resolved.value,
          errors:
            resolved.errors.length > 0
              ? [{ type: "upstream", sourceAddress: nodeData.address }]
              : [],
        };
      }
    }
    case "checkbox_input": {
      const formInstance = instances.get(address.instance);
      const userInput = formInstance?.inputs[address.box];
      if (userInput && userInput.type === "number") {
        const value = userInput.value === 0 ? 0 : 1;
        return { value, errors: [] };
      }
      return { value: 0, errors: [] };
    }
    case "comparison": {
      const resolved = resolveRecursive(provider.value);
      const errors = [...resolved.errors];
      let inBounds = true;

      if (provider.minimum !== undefined) {
        const min = resolveRecursive(provider.minimum);
        errors.push(...min.errors);
        inBounds =
          inBounds &&
          (provider.strict
            ? resolved.value > min.value
            : resolved.value >= min.value);
      }

      if (provider.maximum !== undefined) {
        const max = resolveRecursive(provider.maximum);
        errors.push(...max.errors);
        inBounds =
          inBounds &&
          (provider.strict
            ? resolved.value < max.value
            : resolved.value <= max.value);
      }

      return { value: inBounds ? 1 : 0, errors };
    }
    case "conditional": {
      const condition = resolveRecursive(provider.condition);
      const branch =
        condition.value !== 0 ? provider.trueValue : provider.falseValue;
      const result = resolveRecursive(branch);
      return {
        value: result.value,
        errors: [...condition.errors, ...result.errors],
      };
    }
    case "difference": {
      const minuend = resolveRecursive(provider.minuend);
      const subtrahend = resolveRecursive(provider.subtrahend);
      return {
        value: minuend.value - subtrahend.value,
        errors: [...minuend.errors, ...subtrahend.errors],
      };
    }
    case "filing_status_map": {
      const matchedProvider = provider.values[filingStatus] ?? provider.default;
      if (matchedProvider === undefined) {
        return { value: 0, errors: [] };
      }
      return resolveRecursive(matchedProvider);
    }
    case "form_instance_count": {
      const count = instanceRegistry[provider.form]?.length ?? 0;
      return { value: count, errors: [] };
    }
    case "list_amounts_input": {
      const formInstance = instances.get(address.instance);
      const userInput = formInstance?.inputs[address.box];
      if (userInput && userInput.type === "amount_list") {
        const total = userInput.value.reduce(
          (sum, { amount }) => sum + amount,
          0,
        );
        return { value: total, errors: [] };
      }
      return { value: 0, errors: [] };
    }
    case "logical_negation": {
      const { value, errors } = resolveRecursive(provider.value);
      return { value: value === 0 ? 1 : 0, errors };
    }
    case "maximum": {
      const resolved = provider.values.map(resolveRecursive);
      if (resolved.length === 0) {
        return { value: 0, errors: [] };
      }
      return {
        value: Math.max(...resolved.map((r) => r.value)),
        errors: resolved.flatMap((r) => r.errors),
      };
    }
    case "minimum": {
      const resolved = provider.values.map(resolveRecursive);
      if (resolved.length === 0) {
        return { value: 0, errors: [] };
      }
      return {
        value: Math.min(...resolved.map((r) => r.value)),
        errors: resolved.flatMap((r) => r.errors),
      };
    }
    case "non_negative_clamp": {
      const { value, errors } = resolveRecursive(provider.value);
      return { value: Math.max(0, value), errors };
    }
    case "number_constant": {
      return { value: provider.value, errors: [] };
    }
    case "number_input": {
      const formInstance = instances.get(address.instance);
      const userInput = formInstance?.inputs[address.box];
      if (userInput && userInput.type === "number") {
        return { value: userInput.value, errors: [] };
      }
      return { value: 0, errors: [] };
    }
    case "numerical_negation": {
      const { value, errors } = resolveRecursive(provider.value);
      return { value: -value, errors };
    }
    case "override_number_input": {
      const formInstance = instances.get(address.instance);
      const userInput = formInstance?.inputs[address.box];
      if (
        userInput &&
        userInput.type === "override" &&
        userInput.override !== null
      ) {
        return { value: userInput.override, errors: [] };
      }
      return resolveRecursive(provider.computedValue);
    }
    case "product": {
      const resolved = provider.values.map(resolveRecursive);
      if (resolved.length === 0) {
        return { value: 0, errors: [] };
      }
      return {
        value: resolved.reduce((acc, r) => acc * r.value, 1),
        errors: resolved.flatMap((r) => r.errors),
      };
    }
    case "quotient": {
      const dividend = resolveRecursive(provider.dividend);
      const divisor = resolveRecursive(provider.divisor);
      const errors = [...dividend.errors, ...divisor.errors];
      if (divisor.value === 0) {
        return { value: 0, errors: [...errors, { type: "divide_by_zero" }] };
      }
      const quotient = dividend.value / divisor.value;
      const value =
        provider.round === "down"
          ? Math.floor(quotient)
          : provider.round === "up"
            ? Math.ceil(quotient)
            : quotient;
      return { value, errors };
    }
    case "selection_input": {
      const formInstance = instances.get(address.instance);
      const userInput = formInstance?.inputs[address.box];
      if (userInput && userInput.type === "selection") {
        const option = provider.options[userInput.selectedIndex];
        if (option) {
          return resolveRecursive(option.value);
        }
      }
      return { value: 0, errors: [] };
    }
    case "sum": {
      const resolved = provider.values.map(resolveRecursive);
      return {
        value: resolved.reduce((acc, r) => acc + r.value, 0),
        errors: resolved.flatMap((r) => r.errors),
      };
    }
    case "unsupported":
    case "unused":
      return { value: 0, errors: [] };
    default:
      absurd(type);
  }
}

class WorkbookBuilder {
  private workbook: Workbook;
  private dirtyInstances: Set<FormInstanceId>;

  constructor(
    oldWorkbook: Workbook,
    liveInstanceIds: Iterable<FormInstanceId>,
  ) {
    this.workbook = {};
    for (const id of liveInstanceIds) {
      if (id in oldWorkbook) {
        this.workbook[id] = oldWorkbook[id];
      }
    }
    this.dirtyInstances = new Set();
  }

  public upsertBox(address: BoxAddress, resolvedBox: ResolvedBox) {
    const { instance, box } = address;

    if (
      instance in this.workbook &&
      box in this.workbook[instance] &&
      isEqual(this.workbook[instance][box], resolvedBox)
    ) {
      return;
    }

    if (instance in this.workbook) {
      if (!this.dirtyInstances.has(instance)) {
        this.workbook[instance] = { ...this.workbook[instance] };
      }
      this.workbook[instance][box] = resolvedBox;
    } else {
      this.workbook[instance] = { [box]: resolvedBox };
    }

    this.dirtyInstances.add(instance);
  }

  public build(): Workbook {
    return this.workbook;
  }
}

export function computeWorkbook(
  specificationRegistry: SpecificationRegistry,
  instanceRegistry: InstanceRegistry,
  filingStatus: FilingStatus,
  currentWorkbook: Workbook,
): Workbook {
  const instances = Object.values(instanceRegistry).reduce<
    Map<FormInstanceId, FormInstance>
  >((acc, curr) => {
    for (const instance of curr) {
      acc.set(instance.id, instance);
    }
    return acc;
  }, new Map());
  const graph = new DependencyGraph<NodeData>();

  for (const instance of instances.values()) {
    const specification = specificationRegistry[instance.class];

    for (const section of specification.sections) {
      for (const line of section.lines) {
        const boxes = "box" in line ? [line.box] : line.boxes;
        for (const box of boxes) {
          const address: BoxAddress = {
            instance: instance.id,
            box: box.identifier,
          };
          const provider = box.value;
          const dependencies = resolveDependencies(
            address,
            box.value,
            instanceRegistry,
          );

          const nodeId = makeNodeId(address);
          const parentIds = dependencies.map(makeNodeId);

          graph.addNode(
            nodeId,
            { address, provider, resolvedBox: undefined },
            parentIds,
          );
        }
      }
    }
  }

  return graph
    .getTopologicalOrder()
    .reduce<WorkbookBuilder>(
      (builder, nodeId) => {
        const nodeData = graph.getData(nodeId);
        const { address, provider } = nodeData;

        const resolvedBox = resolveValue(
          address,
          provider,
          instances,
          instanceRegistry,
          graph,
          filingStatus,
        );

        nodeData.resolvedBox = resolvedBox;
        builder.upsertBox(address, resolvedBox);

        return builder;
      },
      new WorkbookBuilder(currentWorkbook, instances.keys()),
    )
    .build();
}
