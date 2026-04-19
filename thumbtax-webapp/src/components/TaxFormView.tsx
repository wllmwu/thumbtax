import type { TaxFormRenderView } from "#src/types/taxFormRenderView";
import type { TaxFormBox, TaxFormSection } from "#src/types/taxFormSpecification";
import type { ReactNode } from "react";

interface TaxFormViewProps {
  view: TaxFormRenderView;
}

function renderBox(box: TaxFormBox): ReactNode {
  const vp = box.value;

  if (typeof vp === "number" || typeof vp === "string") {
    return 0;
  }

  switch (vp.type) {
    case "number_input":
    case "list_amounts_input":
      return <input type="number" />;
    case "checkbox_input":
      return <input type="checkbox" />;
    case "unused":
      return <span aria-hidden>—</span>;
    case "unsupported":
      return <span>N/A</span>;
    default:
      return 0;
  }
}

interface SectionRowsProps {
  section: TaxFormSection;
  instanceCount: number;
  colSpan: number;
}

function SectionRows({ section, instanceCount, colSpan }: SectionRowsProps) {
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
          {Array.from({ length: instanceCount }, (_, i) =>
            line.boxes.map((box) => (
              <td key={`${i}-${box.identifier}`}>{renderBox(box)}</td>
            )),
          )}
        </tr>
      ))}
    </>
  );
}

export function TaxFormView({ view }: TaxFormViewProps) {
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
              instanceCount={instances.length}
              colSpan={colSpan}
            />
          ))}
        </tbody>
      </table>
    </article>
  );
}
