import { useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { useSearch } from "../../context/SearchContext";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;

    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, searchQuery]);

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
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>
        <ShoppingBagIcon className={styles.headingIcon} />
        Products
        {searchQuery && (
          <span className={styles.searchResults}>
            ({filteredProducts.length} found)
          </span>
        )}
      </h1>

      {filteredProducts.length === 0 && searchQuery ? (
        <div className={styles.noResults}>
          <p>No products found matching &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
