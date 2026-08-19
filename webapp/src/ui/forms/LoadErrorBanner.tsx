import React from "react";

import { absurd } from "@thumbtax/common";
import { CircleAlertIcon, XIcon } from "lucide-react";

import { useStore } from "#src/state/useStore";
import { IconButton } from "#src/ui/primitives/IconButton";
import styles from "#src/ui/forms/LoadErrorBanner.module.css";

import type { LoadError } from "#src/persistence/types/loadError";

function formatLoadError(error: LoadError): string {
  switch (error.type) {
    case "not_an_object":
      return "Expected JSON object";
    case "missing_schema_version":
      return "Missing schema version";
    case "unsupported_schema_version":
      return `Unsupported schema version: ${error.saved}`;
    case "validation_failed":
      return "Invalid data:";
    case "migration_failed":
      return `Failed to migrate to current schema: ${error.reason}`;
    case "invalid_json":
      return "Expected JSON object";
    case "tax_year_mismatch":
      return `Expected tax year ${error.current}, received ${error.saved}`;
    default:
      return absurd(error);
  }
}

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
        <span>
          <CircleAlertIcon aria-hidden="true" />
          Couldn't load data
        </span>
        <IconButton icon={XIcon} label="Dismiss" onPress={clearLoadErrors} />
      </div>
      <ul>
        {loadErrors.map((error, index) => {
          const formattedMessage = formatLoadError(error);
          return (
            <li key={index}>
              {formattedMessage}
              {error.type === "validation_failed" && (
                <ul>
                  {error.issues.map(({ message, path }, issueIndex) => (
                    <li
                      key={issueIndex}
                    >{`${path || "(root)"}: ${message}`}</li>
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
