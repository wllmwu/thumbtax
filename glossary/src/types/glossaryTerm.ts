export const GLOSSARY_TERMS = ["test1", "test2"] as const;

export type GlossaryTerm = (typeof GLOSSARY_TERMS)[number];
