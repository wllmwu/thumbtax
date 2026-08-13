import { Link } from "#src/ui/primitives/Link";
import styles from "#src/ui/table-of-contents/TableOfContents.module.css";

import type { TableOfContentsHeading } from "#src/ui/table-of-contents/tableOfContentsHeading";
import type React from "react";

type Props = {
  headings: TableOfContentsHeading[];
};

/** A plain list of links to a page's headings. Doesn't handle its own positioning or collapsing. */
export function TableOfContents({ headings }: Props): React.ReactNode {
  return (
    <nav aria-label="Table of contents">
      <ul className={styles.tableOfContents}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link href={`#${heading.id}`}>{heading.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
