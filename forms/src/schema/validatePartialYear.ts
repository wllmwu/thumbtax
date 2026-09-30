import type { Node, ValidationError } from "@markdoc/markdoc";

export function validatePartialYear(node: Node): ValidationError[] {
  const documentPath = node.location?.file;
  const taxYear = documentPath?.split("/")[0];
  if (taxYear === undefined) {
    return [];
  }

  const { file } = node.attributes;
  const expectedPrefix = `${taxYear}/`;
  if (typeof file === "string" && file.startsWith(expectedPrefix)) {
    return [];
  }

  return [
    {
      id: "partial-wrong-year",
      level: "error",
      message: `Partial "${String(file)}" is not from tax year ${taxYear}`,
      location: node.location,
    },
  ];
}
