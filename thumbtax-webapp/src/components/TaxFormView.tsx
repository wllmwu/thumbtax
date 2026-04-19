import { useState } from "react";

import type { TaxFormRenderView } from "#src/types/taxFormRenderView";
import type {
  TaxFormBox,
  TaxFormBoxIdentifier,
  TaxFormSection,
} from "#src/types/taxFormSpecification";
import type { UserInputValue } from "#src/types/userInputValue";

interface TaxFormViewProps {
  view: TaxFormRenderView;
  onSetBoxValue: (
    formId: string,
    boxId: TaxFormBoxIdentifier,
    value: UserInputValue,
  ) => void;
}

interface BoxCellProps {
  box: TaxFormBox;
  value: UserInputValue;
  onBlur: (value: UserInputValue) => void;
}

function BoxCell({ box, value, onBlur }: BoxCellProps) {
  const vp = box.value;
  const numericValue =
    value.type === "number"
      ? value.value
      : value.value.reduce((s, [, v]) => s + v, 0);

  // localValue is only used while the input is focused; display falls back to
  // numericValue (from the service) when the field is not being edited.
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const displayValue = isFocused ? localValue : String(numericValue);

  if (typeof vp === "number" || typeof vp === "string") {
    return <>{numericValue}</>;
  }

  switch (vp.type) {
    case "number_input":
    case "list_amounts_input":
      return (
        <input
          type="number"
          value={displayValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => {
            setLocalValue(String(numericValue));
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            const parsed = parseFloat(localValue);
            const final = isNaN(parsed) ? 0 : parsed;
            onBlur({ type: "number", value: final });
          }}
        />
      );

    case "checkbox_input":
      return (
        <input
          type="checkbox"
          checked={numericValue !== 0}
          onChange={(e) =>
            onBlur({ type: "number", value: e.target.checked ? 1 : 0 })
          }
        />
      );

    case "unused":
      return <span aria-hidden>—</span>;

    case "unsupported":
      return <span>N/A</span>;

    default:
      return <>{numericValue}</>;
  }
}

interface SectionRowsProps {
  section: TaxFormSection;
  instances: TaxFormRenderView["instances"];
  colSpan: number;
  onSetBoxValue: (
    formId: string,
    boxId: TaxFormBoxIdentifier,
    value: UserInputValue,
  ) => void;
}

function SectionRows({
  section,
  instances,
  colSpan,
  onSetBoxValue,
}: SectionRowsProps) {
  return (
    <>
      {section.heading && (
        <tr>
          <th colSpan={colSpan}>{section.heading}</th>
        </tr>
      )}
      {section.lines.map((line) => (
        <tr key={line.index}>
          <td>{line.index}</td>
          <td>{line.description}</td>
          {instances.flatMap((inst) =>
            line.boxes.map((box) => (
              <td key={`${inst.id}-${box.identifier}`}>
                <BoxCell
                  box={box}
                  value={
                    inst.boxValues[box.identifier] ?? {
                      type: "number",
                      value: 0,
                    }
                  }
                  onBlur={(value) =>
                    onSetBoxValue(inst.id, box.identifier, value)
                  }
                />
              </td>
            )),
          )}
        </tr>
      ))}
    </>
  );
}

export function TaxFormView({ view, onSetBoxValue }: TaxFormViewProps) {
  const { specification: spec, instances } = view;
  const colSpan = 2 + instances.length;

  return (
    <article>
      <header>
        <h2>{spec.title}</h2>
        {spec.subtitle && <p>{spec.subtitle}</p>}
      </header>
      <table>
        <thead>
          <tr>
            <th>Line</th>
            <th>Description</th>
            {instances.map((inst) => (
              <th key={inst.id}>{inst.userLabel ?? inst.id}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.sections.map((section, i) => (
            <SectionRows
              key={i}
              section={section}
              instances={instances}
              colSpan={colSpan}
              onSetBoxValue={onSetBoxValue}
            />
          ))}
        </tbody>
      </table>
    </article>
  );
}
