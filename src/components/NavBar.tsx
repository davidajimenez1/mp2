import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>Art Explorer</span>
      <NavLink to="/" end className={styles.link}>List</NavLink>
      <NavLink to="/gallery" className={styles.link}>Gallery</NavLink>
    </nav>
  );
}
