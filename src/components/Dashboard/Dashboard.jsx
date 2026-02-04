import { useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { useSearch } from "../../context/SearchContext";
import ProductCard from "../ProductCard/ProductCard";
import Filter from "../Filter/Filter";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 1000],
    minRating: 0,
    isFavorite: false,
  });
  const { searchQuery } = useSearch();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    console.log("Reload Called");

    loadProducts();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (filters.category.length > 0) {
      result = result.filter((p) => filters.category.includes(p.category));
    }

    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    const rate = (p) => p.rating?.rate ?? 0;
    result = result.filter((p) => rate(p) >= filters.minRating);

    if (filters.isFavorite) {
      result = result.filter((p) => favorites.has(p.id));
    }

    return result;
  }, [products, searchQuery, filters, favorites]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress size={48} />
        <p>Loading products…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <ErrorOutlineIcon className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      {isFilterOpen && (
        <Filter
          products={products}
          onFilterChange={handleFilterChange}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      <div
        className={`${styles.dashboard} ${!isFilterOpen ? styles.dashboardFull : ""}`}
      >
        <div className={styles.dashboardHeader}>
          {!isFilterOpen && (
            <button
              type="button"
              className={styles.filterToggleButton}
              onClick={() => setIsFilterOpen(true)}
              aria-label="Open filters"
            >
              ☰ Filters
            </button>
          )}
          <h1 className={styles.heading}>
            {searchQuery && (
              <span className={styles.searchResults}>
                ({filteredProducts.length} found)
              </span>
            )}
            {!searchQuery &&
            filters.category.length === 0 &&
            filters.minRating === 0 &&
            filters.isFavorite === false &&
            filters.priceRange[0] === 0 &&
            filters.priceRange[1] >= 1000 ? null : (
              <span className={styles.searchResults}>
                ({filteredProducts.length} results)
              </span>
            )}
          </h1>
        </div>

        {filteredProducts.length === 0 ? (
          <div className={styles.noResults}>
            {searchQuery ? (
              <p>No products found matching &quot;{searchQuery}&quot;</p>
            ) : (
              <p>No products match the selected filters</p>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.has(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
