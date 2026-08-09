import { parse, transform, validate } from "@markdoc/markdoc";
import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import * as prettier from "prettier";

import { config } from "./schema";

const SRC_DIRECTORY = path.join(import.meta.dirname, "..", "src");
const CONTENT_DIRECTORY = path.join(SRC_DIRECTORY, "content");
const OUTPUT_DIRECTORY = path.join(SRC_DIRECTORY, "generated");

const CONTENT_FILE_NAME = "glossary.mdoc";
const OUTPUT_FILE_NAME = "glossary.ts";

async function buildGlossary(): Promise<void> {
  const filePath = path.join(CONTENT_DIRECTORY, CONTENT_FILE_NAME);
  const content = await fsPromises.readFile(filePath, "utf-8");
  const documentNode = parse(content, { file: CONTENT_FILE_NAME });

  const validationErrors = validate(documentNode, config).filter(
    ({ error }) => error.level === "error" || error.level === "critical",
  );
  if (validationErrors.length > 0) {
    console.error(`Failed to validate ${CONTENT_FILE_NAME}:`);
    for (const { error, lines } of validationErrors) {
      console.error(`  line ${lines.join(", ")}: ${error.message}`);
    }
    return;
  }

  const glossary = transform(documentNode, config);
  const outputPath = path.join(OUTPUT_DIRECTORY, OUTPUT_FILE_NAME);
  const rawContent = `export const glossary = ${JSON.stringify(glossary)};
`;
  const formattedContent = await prettier.format(rawContent, {
    filepath: outputPath,
  });
  await fsPromises.writeFile(outputPath, formattedContent);
}

await buildGlossary();
