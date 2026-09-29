import { parse, transform, validate } from "@markdoc/markdoc";
import { FORM_CLASSES, isTaxYear, TAX_YEARS } from "@thumbtax/common";
import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import * as prettier from "prettier";

import { mapFormSpecification } from "./build/mapFormSpecification";
import { mapGlossary } from "./build/mapGlossary";
import { validatePartialYears } from "./build/validatePartialYears";
import { config } from "./schema";

import type { Node } from "@markdoc/markdoc";
import type { TaxYear } from "@thumbtax/common";

const SRC_DIRECTORY = path.join(import.meta.dirname, "..", "src");
const DATA_DIRECTORY = path.join(SRC_DIRECTORY, "data");
const OUTPUT_DIRECTORY = path.join(SRC_DIRECTORY, "generated");
const GLOSSARY_DATA_SUBPATH = "glossary/glossary.mdoc";
const GLOSSARY_PATH = path.join(DATA_DIRECTORY, GLOSSARY_DATA_SUBPATH);
const GLOSSARY_OUTPUT_PATH = path.join(OUTPUT_DIRECTORY, "glossary.ts");

type BuildError = { lines: number[]; message: string };

function validateDocument(documentNode: Node): BuildError[] {
  return validate(documentNode, config)
    .filter(
      ({ error }) => error.level === "error" || error.level === "critical",
    )
    .map(({ error, lines }) => ({ lines, message: error.message }));
}

function reportBuildErrors(label: string, errors: BuildError[]): void {
  console.error(`Failed to validate ${label}:`);
  for (const { lines, message } of errors) {
    console.error(`  line ${lines.join(", ")}: ${message}`);
  }
}

async function buildForm(taxYear: TaxYear, fileName: string): Promise<void> {
  const dataSubpath = path.join(String(taxYear), fileName);
  const filePath = path.join(DATA_DIRECTORY, dataSubpath);
  const content = await fsPromises.readFile(filePath, "utf-8");
  const documentNode = parse(content, { file: dataSubpath });

  const validationErrors = [
    ...validateDocument(documentNode),
    ...validatePartialYears(documentNode, taxYear).map(
      ({ location, message }) => ({
        lines: location ? [location.start.line] : [],
        message,
      }),
    ),
  ];
  if (validationErrors.length > 0) {
    reportBuildErrors(dataSubpath, validationErrors);
    return;
  }

  const formSpecification = mapFormSpecification(
    transform(documentNode, config),
  );
  const outputPath = path.join(
    OUTPUT_DIRECTORY,
    String(taxYear),
    `${formSpecification.class}.ts`,
  );
  const rawContent = `import { defineFormSpecification } from "../../types/defineFormSpecification";

export const ${formSpecification.class} = defineFormSpecification(${JSON.stringify(formSpecification)});
`;
  const formattedContent = await prettier.format(rawContent, {
    filepath: outputPath,
  });
  await fsPromises.writeFile(outputPath, formattedContent);
}

async function buildSpecificationRegistry(taxYear: TaxYear): Promise<void> {
  const outputPath = path.join(OUTPUT_DIRECTORY, String(taxYear), "index.ts");
  const imports = FORM_CLASSES.map(
    (formClass) => `import { ${formClass} } from "./${formClass}";`,
  ).join("\n");
  const rawContent = `${imports}

import type { SpecificationRegistry } from "../../types/specificationRegistry";

export const specifications = {
  ${FORM_CLASSES.join(",\n  ")},
} satisfies SpecificationRegistry;
`;
  const formattedContent = await prettier.format(rawContent, {
    filepath: outputPath,
  });
  await fsPromises.writeFile(outputPath, formattedContent);
}

async function buildGlossary(): Promise<void> {
  const content = await fsPromises.readFile(GLOSSARY_PATH, "utf-8");
  const documentNode = parse(content, { file: GLOSSARY_PATH });

  const validationErrors = validateDocument(documentNode);
  if (validationErrors.length > 0) {
    reportBuildErrors("glossary", validationErrors);
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

/**
 * Maps each tax year to the form file names to build for it.
 * Form paths are relative to `data/`, such as `2025/f1040.mdoc`.
 * If `formPaths` is undefined, every form of every tax year is built.
 */
async function collectFormFiles(
  formPaths: string[] | undefined,
): Promise<Map<TaxYear, string[]>> {
  const fileNamesByYear = new Map<TaxYear, string[]>();

  if (formPaths === undefined) {
    for (const taxYear of TAX_YEARS) {
      const fileNames = await fsPromises.readdir(
        path.join(DATA_DIRECTORY, String(taxYear)),
      );
      fileNamesByYear.set(
        taxYear,
        fileNames.filter((fileName) => fileName.endsWith(".mdoc")),
      );
    }
    return fileNamesByYear;
  }

  for (const formPath of formPaths) {
    const [yearSegment, fileName, ...rest] = formPath.split("/");
    const taxYear = Number(yearSegment);
    if (!isTaxYear(taxYear) || fileName === undefined || rest.length > 0) {
      console.error(
        `Skipping ${formPath}: expected a path like {taxYear}/{fileName}.mdoc for a supported tax year`,
      );
      continue;
    }
    fileNamesByYear.set(taxYear, [
      ...(fileNamesByYear.get(taxYear) ?? []),
      fileName,
    ]);
  }
  return fileNamesByYear;
}

async function buildForms(): Promise<void> {
  const cliArguments = process.argv.slice(2);
  const fileNamesByYear = await collectFormFiles(
    cliArguments.length === 0
      ? undefined
      : cliArguments.filter((argument) => argument !== GLOSSARY_DATA_SUBPATH),
  );

  for (const [taxYear, fileNames] of fileNamesByYear) {
    await fsPromises.mkdir(path.join(OUTPUT_DIRECTORY, String(taxYear)), {
      recursive: true,
    });
    for (const fileName of fileNames) {
      await buildForm(taxYear, fileName);
    }
    await buildSpecificationRegistry(taxYear);
  }

  if (
    cliArguments.length === 0 ||
    cliArguments.includes(GLOSSARY_DATA_SUBPATH)
  ) {
    await buildGlossary();
  }
}

try {
  await buildForms();
} catch (error) {
  console.error(error);
}
