import { Link } from "#src/ui/primitives/Link";
import styles from "#src/ui/table-of-contents/TableOfContents.module.css";

import type { TableOfContentsHeading } from "#src/ui/table-of-contents/types/tableOfContentsHeading";
import type React from "react";

type Props = {
  headings: TableOfContentsHeading[];
};

export function TableOfContents({ headings }: Props): React.ReactNode {
  return (
    <nav aria-labelledby="table-of-contents-title">
      <p id="table-of-contents-title">Contents</p>
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
