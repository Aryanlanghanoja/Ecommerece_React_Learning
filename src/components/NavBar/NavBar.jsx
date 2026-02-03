import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useTheme } from "../../context/ThemeContext";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import styles from "./NavBar.module.css";

function NavBar() {
  const { getCartItemCount } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const cartCount = getCartItemCount();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
  };

  const showSearch = location.pathname === "/";

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img className={styles.logoImage} src="/Logo.svg" alt="E-Commerce Logo" />
          <span>E-Commerce</span>
        </Link>

        {showSearch && (
          <div className={styles.searchContainer}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search products..."
              value={localSearch} 
              onChange={handleSearchChange}
            />
          </div>
        )}

        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Toggle light/dark theme"
        >
          {theme === "light" ? (
            <DarkModeIcon className={styles.themeIcon} />
          ) : (
            <LightModeIcon className={styles.themeIcon} />
          )}
        </button>

        <Link to="/cart" className={styles.cartButton}>
          <ShoppingCartIcon className={styles.cartIcon} />
          <span>My Cart</span>
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
