import React from "react";

import { ProseContent } from "#src/ui/content/ProseContent";
import styles from "#src/ui/content/CommentaryDisplay.module.css";

import type { RenderableTreeNodes } from "@markdoc/markdoc";

type Props = {
  commentary: RenderableTreeNodes;
};

export function CommentaryDisplay({ commentary }: Props): React.ReactNode {
  return (
    <div className={styles.commentary}>
      <p className={styles.heading}>Commentary</p>
      <ProseContent nodes={commentary} />
    </div>
  );
}
