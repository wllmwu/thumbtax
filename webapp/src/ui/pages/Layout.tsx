import { Outlet, useMatch } from "react-router";

import { ControlBar } from "#src/ui/control-bar/ControlBar";
import { NavigationMenu } from "#src/ui/navigation/NavigationMenu";
import styles from "#src/ui/pages/Layout.module.css";

export function Layout() {
  const mainPageMatch = useMatch({ path: "/", end: true });

  return (
    <div>
      <div className={styles.controls}>
        <NavigationMenu />
        {mainPageMatch !== null && <ControlBar />}
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
