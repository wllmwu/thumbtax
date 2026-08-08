import { useEffect, useRef } from "react";

import { Outlet, useMatch } from "react-router";

import { ControlBar } from "#src/ui/control-bar/ControlBar";
import { NavigationMenu } from "#src/ui/navigation/NavigationMenu";
import styles from "#src/ui/pages/Layout.module.css";

export function Layout() {
  const mainPageMatch = useMatch({ path: "/", end: true });

  const topBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topBar = topBarRef.current;
    if (topBar === null) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry === undefined) {
        return;
      }
      document.documentElement.style.setProperty(
        "--size-height-top-bar",
        `${entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height}px`,
      );
    });
    resizeObserver.observe(topBar);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div>
      <div ref={topBarRef} className={styles.topBar}>
        <NavigationMenu />
        {mainPageMatch !== null && <ControlBar />}
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
