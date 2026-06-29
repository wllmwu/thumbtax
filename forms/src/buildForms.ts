import { parse, validate } from "@markdoc/markdoc";
import * as fs from "node:fs";
import * as path from "node:path";

import { mapFormSpecification } from "./build/mapFormSpecification";
import { config } from "./schema";

const SRC_DIRECTORY = path.join(import.meta.dirname, "..", "src");
const DATA_DIRECTORY = path.join(SRC_DIRECTORY, "data");
const OUTPUT_DIRECTORY = path.join(SRC_DIRECTORY, "generated");

function buildForm(fileName: string): void {
  const filePath = path.join(DATA_DIRECTORY, fileName);
  const content = fs.readFileSync(filePath, "utf-8");
  const documentNode = parse(content, { file: fileName });

  const validationErrors = validate(documentNode, config).filter(
    ({ error }) => error.level === "error" || error.level === "critical",
  );
  if (validationErrors.length > 0) {
    console.error(`Failed to validate ${fileName}:`);
    for (const { error, lines } of validationErrors) {
      console.error(`  line ${lines.join(", ")}: ${error.message}`);
    }
    return;
  }

  const formSpecification = mapFormSpecification(documentNode, config);
  const outputPath = path.join(
    OUTPUT_DIRECTORY,
    `${formSpecification.class}.ts`,
  );
  const fileContent = `import type { FormSpecification } from "../types/formSpecification";

export const ${formSpecification.class}: FormSpecification = ${JSON.stringify(formSpecification, null, 2)};
`;
  fs.writeFileSync(outputPath, fileContent);
}

function buildForms(): void {
  fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
  const fileNames = fs
    .readdirSync(DATA_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".mdoc"));
  for (const fileName of fileNames) {
    buildForm(fileName);
  }
}

buildForms();
