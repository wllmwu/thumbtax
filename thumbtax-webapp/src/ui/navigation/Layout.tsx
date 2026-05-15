import { Outlet } from "react-router";

import { NavigationMenu } from "#src/ui/navigation/NavigationMenu";

export function Layout() {
  return (
    <div>
      <NavigationMenu />
      <Outlet />
    </div>
  );
}
