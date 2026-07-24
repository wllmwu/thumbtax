import { Link } from "react-router";

import styles from "#src/ui/navigation/NavigationMenu.module.css";

export function NavigationMenu() {
  return (
    <nav className={styles.navigationMenu}>
      <span className={styles.wordmark}>📌 Thumbtax</span>
      <ul>
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}
