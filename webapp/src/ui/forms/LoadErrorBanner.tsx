import React from "react";

import { CircleAlertIcon, XIcon } from "lucide-react";

import { useStore } from "#src/state/useStore";
import { formatLoadError } from "#src/ui/formatting/formatLoadError";
import { IconButton } from "#src/ui/primitives/IconButton";
import styles from "#src/ui/forms/LoadErrorBanner.module.css";

export function LoadErrorBanner(): React.ReactNode {
  const loadErrors = useStore((state) => state.loadErrors);
  const clearLoadErrors = useStore((state) => state.clearLoadErrors);

  const focusAndScrollIntoView = React.useCallback(
    (banner: HTMLDivElement | null) => {
      if (banner) {
        banner.scrollIntoView();
        banner.focus();
      }
    },
    [],
  );

  if (loadErrors.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.banner}
      ref={focusAndScrollIntoView}
      role="alert"
      tabIndex={-1}
    >
      <div className={styles.heading}>
        <CircleAlertIcon aria-hidden="true" />
        <h2>There was a problem loading your data</h2>
        <IconButton icon={XIcon} label="Dismiss" onPress={clearLoadErrors} />
      </div>
      <ul className={styles.errors}>
        {loadErrors.map((error, index) => {
          const formatted = formatLoadError(error);
          return (
            <li key={index}>
              {formatted.message}
              {formatted.details && (
                <ul className={styles.details}>
                  {formatted.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
