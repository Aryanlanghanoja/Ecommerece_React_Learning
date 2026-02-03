import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import styles from './NavBar.module.css';

function NavBar() {
  const { getCartItemCount } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const cartCount = getCartItemCount();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
  };

  // Only show search on home page
  const showSearch = location.pathname === '/';

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <StoreIcon />
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
