import { Link } from "react-router";

export function NavigationMenu() {
  return (
    <nav>
      <ol>
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ol>
    </nav>
  );
}
