import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import styles from "./Layout.module.css";

function Layout() {
  return (
    <div className={styles.layoutContainer}>
      <NavBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
