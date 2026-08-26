import { parse, transform, validate } from "@markdoc/markdoc";
import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import * as prettier from "prettier";

import { mapFormSpecification } from "./build/mapFormSpecification";
import { mapGlossary } from "./build/mapGlossary";
import { config } from "./schema";

const SRC_DIRECTORY = path.join(import.meta.dirname, "..", "src");
const DATA_DIRECTORY = path.join(SRC_DIRECTORY, "data");
const OUTPUT_DIRECTORY = path.join(SRC_DIRECTORY, "generated");
const GLOSSARY_DATA_SUBPATH = "glossary/glossary.mdoc";
const GLOSSARY_PATH = path.join(DATA_DIRECTORY, GLOSSARY_DATA_SUBPATH);
const GLOSSARY_OUTPUT_PATH = path.join(OUTPUT_DIRECTORY, "glossary.ts");

async function buildForm(fileName: string): Promise<void> {
  const filePath = path.join(DATA_DIRECTORY, fileName);
  const content = await fsPromises.readFile(filePath, "utf-8");
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

  const formSpecification = mapFormSpecification(
    transform(documentNode, config),
  );
  const outputPath = path.join(
    OUTPUT_DIRECTORY,
    `${formSpecification.class}.ts`,
  );
  const rawContent = `import type { FormSpecification } from "../types/formSpecification";

export const ${formSpecification.class}: FormSpecification = ${JSON.stringify(formSpecification)};
`;
  const formattedContent = await prettier.format(rawContent, {
    filepath: outputPath,
  });
  await fsPromises.writeFile(outputPath, formattedContent);
}

async function buildGlossary(): Promise<void> {
  const content = await fsPromises.readFile(GLOSSARY_PATH, "utf-8");
  const documentNode = parse(content, { file: GLOSSARY_PATH });

  const validationErrors = validate(documentNode, config).filter(
    ({ error }) => error.level === "error" || error.level === "critical",
  );
  if (validationErrors.length > 0) {
    console.error(`Failed to validate glossary:`);
    for (const { error, lines } of validationErrors) {
      console.error(`  line ${lines.join(", ")}: ${error.message}`);
    }
    return;
  }

  const glossary = mapGlossary(transform(documentNode, config));
  const rawContent = `import type { GlossaryEntry } from "../types/glossaryEntry";
import type { GlossaryTerm } from "../types/glossaryTerm";

export const glossary: Record<GlossaryTerm, GlossaryEntry> = ${JSON.stringify(glossary)};
`;
  const formattedContent = await prettier.format(rawContent, {
    filepath: GLOSSARY_OUTPUT_PATH,
  });
  await fsPromises.writeFile(GLOSSARY_OUTPUT_PATH, formattedContent);
}

async function buildForms(): Promise<void> {
  await fsPromises.mkdir(OUTPUT_DIRECTORY, { recursive: true });
  const cliArguments = process.argv.slice(2);
  const argsIncludeGlossary = cliArguments.includes(GLOSSARY_DATA_SUBPATH);
  const filePaths =
    cliArguments.length > 0
      ? cliArguments.filter((fileName) => fileName !== GLOSSARY_DATA_SUBPATH)
      : (await fsPromises.readdir(DATA_DIRECTORY)).filter((fileName) =>
          fileName.endsWith(".mdoc"),
        );
  for (const filePath of filePaths) {
    await buildForm(filePath);
  }
  if (cliArguments.length === 0 || argsIncludeGlossary) {
    await buildGlossary();
  }
}

try {
  await buildForms();
} catch (error) {
  console.error(error);
}
