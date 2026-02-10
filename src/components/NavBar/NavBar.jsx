import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useTheme } from "../../context/ThemeContext";
import { useFilter } from "../../context/FilterContext";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ChevronDown } from "lucide-react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import styles from "./NavBar.module.css";

function NavBar() {
  const { getCartItemCount } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const { theme, toggleTheme } = useTheme();
  const { filters, updateFilters } = useFilter();
  const [localSearch, setLocalSearch] = useState(searchQuery);   
  const [expandedSections, setExpandedSections] = useState({
    category: false,
    price: false,
    rating: false,
    favorite: false,
  });
  const [allProducts, setAllProducts] = useState([]);
  const cartCount = getCartItemCount();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hideCartButton = location.pathname === "/cart";
  const showSearch = isHome || location.pathname === "/cart";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    if (isHome && allProducts.length === 0) {
      loadProducts();
    }
  }, [isHome, allProducts.length]);

  const categories = useMemo(() => {
    if (allProducts.length === 0) return [];
    const uniqueCategories = [...new Set(allProducts.map((p) => p.category))];
    return uniqueCategories.sort();
  }, [allProducts]);

  const maxPrice = useMemo(() => {
    if (allProducts.length === 0) return 1000;
    return Math.ceil(Math.max(...allProducts.map((p) => p.price)));
  }, [allProducts]);

  const isCategoryActive = filters.category.length > 0;
  const isPriceActive = filters.priceRange[0] !== 0 || filters.priceRange[1] !== maxPrice;
  const isRatingActive = filters.minRating > 0;
  const isFavoriteActive = filters.isFavorite;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev[section];
      return {
        category: false,
        price: false,
        rating: false,
        favorite: false,
        [section]: !isCurrentlyOpen,
      };
    });
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];

    const newFilters = { ...filters, category: newCategories };
    updateFilters(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = { ...filters, minRating: rating };
    updateFilters(newFilters);
  };

  const handlePriceChange = (e, newValue) => {
    const newFilters = {
      ...filters,
      priceRange: newValue,
    };
    updateFilters(newFilters);
  };

  const handleFavoriteChange = () => {
    const newFilters = { ...filters, isFavorite: !filters.isFavorite };
    updateFilters(newFilters);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logo}>
          <img
            className={styles.logoImage}
            src="/Logo.svg"
            alt="E-Commerce Logo"
          />
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
        {isHome && (
          <>
            <div className={styles.filterDropdown}>
              <button
                type="button"
                className={styles.filterDropdownButton}
                onClick={() => toggleSection("category")}
              >
                {isCategoryActive && <FilterAltIcon className={styles.filterIcon} />}
                <span>Category</span>
                <ChevronDown
                  className={`${styles.chevron} ${
                    expandedSections.category ? styles.expanded : ""
                  }`}
                  size={14}
                />
              </button>
              {expandedSections.category && (
                <div className={styles.dropdownMenu}>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <label key={category} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={filters.category.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className={styles.checkbox}
                        />
                        <span className={styles.categoryName}>{category}</span>
                      </label>
                    ))
                  ) : (
                    <div className={styles.emptyMessage}>
                      Loading categories...
                    </div>
                  )}
                  
                </div>
              )}
            </div>

            <div className={styles.filterDropdown}>
              <button
                type="button"
                className={styles.filterDropdownButton}
                onClick={() => toggleSection("price")}
              >
                {isPriceActive && <FilterAltIcon className={styles.filterIcon} />}
                <span>Price</span>
                <ChevronDown
                  className={`${styles.chevron} ${
                    expandedSections.price ? styles.expanded : ""
                  }`}
                  size={14}
                />
              </button>
              {expandedSections.price && (
                <div className={styles.dropdownMenu}>
                  {allProducts.length > 0 ? (
                    <>
                      <Box sx={{ px: 1, py: 0.5 }}>
                        <Slider
                          value={filters.priceRange}
                          onChange={handlePriceChange}
                          min={0}
                          max={maxPrice}
                          step={1}
                          valueLabelDisplay="on"
                          valueLabelFormat={(value) => `$${value}`}
                          sx={{
                            color: "var(--color-primary)",
                            "& .MuiSlider-valueLabelLabel": {
                              color: "white",
                            },
                            "& .MuiSlider-valueLabel": {
                              backgroundColor: "var(--color-primary)",
                              top: "24px",
                              transform: "translateX(-50%)",
                            },
                          }}
                        />
                      </Box>
                      <div className={styles.priceDisplay}>
                        ${filters.priceRange[0].toFixed(0)} - $
                        {filters.priceRange[1].toFixed(0)}
                      </div>
                    </>
                  ) : (
                    <div className={styles.emptyMessage}>Loading prices...</div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.filterDropdown}>
              <button
                type="button"
                className={styles.filterDropdownButton}
                onClick={() => toggleSection("rating")}
              >
                {isRatingActive && <FilterAltIcon className={styles.filterIcon} />}
                <span>Rating</span>
                <ChevronDown
                  className={`${styles.chevron} ${
                    expandedSections.rating ? styles.expanded : ""
                  }`}
                  size={14}
                />
              </button>
              {expandedSections.rating && (
                <div className={styles.dropdownMenu}>
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <label key={rating} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.minRating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className={styles.radio}
                      />
                      <span className={styles.ratingOption}>
                        {rating === 0 ? "All" : `${rating}+`}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.filterDropdown}>
              <button
                type="button"
                className={styles.filterDropdownButton}
                onClick={() => toggleSection("favorite")}
              >
                {isFavoriteActive && <FilterAltIcon className={styles.filterIcon} />}
                <span>Favorites</span>
                <ChevronDown
                  className={`${styles.chevron} ${
                    expandedSections.favorite ? styles.expanded : ""
                  }`}
                  size={14}
                />
              </button>
              {expandedSections.favorite && (
                <div className={styles.dropdownMenu}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.isFavorite}
                      onChange={handleFavoriteChange}
                      className={styles.checkbox}
                    />
                    <span>Show Favorites Only</span>
                  </label>
                </div>
              )}
            </div>
          </>
        )}

        <div className={styles.navActions}>
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

          {!hideCartButton && (
            <Link to="/cart" className={styles.cartButton}>
              <ShoppingCartIcon className={styles.cartIcon} />
              <span>My Cart</span>
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
