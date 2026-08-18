import React from "react";

import { Outlet, useLocation, useMatch } from "react-router";

import { ControlBar } from "#src/ui/control-bar/ControlBar";
import { NavigationMenu } from "#src/ui/navigation/NavigationMenu";
import styles from "#src/ui/pages/Layout.module.css";

export function Layout() {
  const location = useLocation();
  const mainPageMatch = useMatch({ path: "/", end: true });

  const topBarRef = React.useRef<HTMLDivElement>(null);

  // Scroll to top/targeted element when URL path/fragment changes
  React.useEffect(() => {
    if (!location.hash) {
      window.scroll(0, 0);
      return;
    }
    let frame: number;
    let attempts = 0;
    const tryScroll = () => {
      attempts++;
      const element = document.querySelector(location.hash);
      const topBarHeightVariable =
        document.documentElement.style.getPropertyValue(
          "--size-height-top-bar",
        );
      if (element && topBarHeightVariable) {
        element.scrollIntoView();
      } else if (attempts < 30) {
        frame = window.requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  // Set `--size-height-top-bar` on the root element
  React.useEffect(() => {
    const topBar = topBarRef.current;
    if (topBar === null) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
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
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <div ref={topBarRef} className={styles.topBar}>
        <NavigationMenu />
        {mainPageMatch !== null && <ControlBar />}
      </div>
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
