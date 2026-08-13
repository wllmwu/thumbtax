import { Disclosure, DisclosurePanel } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { TableOfContents } from "#src/ui/table-of-contents/TableOfContents";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/table-of-contents/PageWithTableOfContents.module.css";

import type { TableOfContentsHeading } from "#src/ui/table-of-contents/tableOfContentsHeading";
import type React from "react";

type Props = {
  headings: TableOfContentsHeading[];
  children: React.ReactNode;
};

/** Lays out a page's content next to a collapsible table-of-contents sidebar linking to `headings`. */
export function PageWithTableOfContents({
  headings,
  children,
}: Props): React.ReactNode {
  const isExpanded = useStore((state) => state.uiState.tableOfContentsExpanded);
  const setTableOfContentsExpanded = useStore(
    (state) => state.setTableOfContentsExpanded,
  );

  return (
    <div className={styles.page}>
      <div className={styles.content}>{children}</div>
      <Disclosure
        className={racn(styles.sidebar)}
        isExpanded={isExpanded}
        onExpandedChange={setTableOfContentsExpanded}
      >
        <AriaButton slot="trigger">
          {isExpanded ? "Hide table of contents" : "Show table of contents"}
        </AriaButton>
        <DisclosurePanel className={racn(styles.sidebarPanel)}>
          <TableOfContents headings={headings} />
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
