import { Minimize2Icon, TableOfContentsIcon } from "lucide-react";
import { Disclosure, DisclosurePanel } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { TableOfContents } from "#src/ui/table-of-contents/TableOfContents";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/pages/Page.module.css";

import type { TableOfContentsHeading } from "#src/ui/table-of-contents/types/tableOfContentsHeading";
import type React from "react";

type Props = {
  headings: TableOfContentsHeading[];
  header: React.ReactNode;
  children: React.ReactNode;
};

export function Page({ headings, header, children }: Props): React.ReactNode {
  const isExpanded = useStore((state) => state.uiState.tableOfContentsExpanded);
  const setTableOfContentsExpanded = useStore(
    (state) => state.setTableOfContentsExpanded,
  );

  return (
    <div className={styles.page}>
      <div>{header}</div>
      <aside className={styles.sidebar}>
        <Disclosure
          className={racn(styles.sidebarDisclosure)}
          isExpanded={isExpanded}
          onExpandedChange={setTableOfContentsExpanded}
        >
          <AriaButton
            aria-label={isExpanded ? "Hide sidebar" : "Show sidebar"}
            className={racn(styles.toggleButton)}
            slot="trigger"
          >
            {isExpanded ? <Minimize2Icon /> : <TableOfContentsIcon />}
          </AriaButton>
          <DisclosurePanel>
            <TableOfContents headings={headings} />
          </DisclosurePanel>
        </Disclosure>
      </aside>
      <div>{children}</div>
    </div>
  );
}
