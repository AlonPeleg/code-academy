import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="logo">{'</>'}</span> Code Academy
      </Link>
      <nav>
        <NavLink to="/" end>Learn</NavLink>
        <NavLink to="/sandbox">Sandbox</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
    </header>
  );
}
