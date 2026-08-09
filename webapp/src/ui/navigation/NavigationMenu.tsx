import { NavLink } from "react-router";

import styles from "#src/ui/navigation/NavigationMenu.module.css";

export function NavigationMenu() {
  return (
    <nav className={styles.navigationMenu}>
      <span className={styles.wordmark}>📌 Thumbtax</span>
      <ul>
        <li>
          <NavLink to="/">Main</NavLink>
        </li>
        <li>
          <NavLink to="/glossary">Glossary</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
    </nav>
  );
}
