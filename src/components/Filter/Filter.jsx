import { useState, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./Filter.module.css";

function Filter({ products, onFilterChange, onClose }) {
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 1000],
    minRating: 0,
    isFavorite: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    category: false,
    price: false,
    rating: false,
    favorite: false,
  });

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];

    const newFilters = { ...filters, category: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = { ...filters, minRating: rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFavoriteChange = () => {
    const newFilters = { ...filters, isFavorite: !filters.isFavorite };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      category: [],
      priceRange: [0, maxPrice],
      minRating: 0,
      isFavorite: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.minRating > 0 ||
    filters.isFavorite;

  return (
    <aside className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h2 className={styles.filterTitle}>Filters</h2>
        <div className={styles.headerActions}>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection("category")}
        >
          <span>Category</span>
          <ChevronDown
            className={`${styles.chevron} ${expandedSections.category ? styles.expanded : ""}`}
          />
        </button>
        {expandedSections.category && (
          <div className={styles.sectionContent}>
            {categories.map((category) => (
              <label key={category} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.category.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className={styles.checkbox}
                />
                <span className={styles.categoryName}>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection("price")}
        >
          <span>Price Range</span>
          <ChevronDown
            className={`${styles.chevron} ${expandedSections.price ? styles.expanded : ""}`}
          />
        </button>
        {expandedSections.price && (
          <div className={styles.sectionContent}>
            <Box sx={{ px: 0.5 }}>
              <Slider
                value={filters.priceRange}
                onChange={(e, newValue) => {
                  const newFilters = {
                    ...filters,
                    priceRange: newValue,
                  };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                min={0}
                max={maxPrice}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
                sx={{
                  color: "var(--color-primary)",
                  "& .MuiSlider-valueLabelLabel": {
                    color: "white",
                  },
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "var(--color-primary)",
                  },
                }}
              />
            </Box>
            <div className={styles.priceDisplay}>
              ${filters.priceRange[0].toFixed(2)} - $
              {filters.priceRange[1].toFixed(2)}
            </div>
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection("rating")}
        >
          <span>Minimum Rating</span>
          <ChevronDown
            className={`${styles.chevron} ${expandedSections.rating ? styles.expanded : ""}`}
          />
        </button>
        {expandedSections.rating && (
          <div className={styles.sectionContent}>
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
                  {rating === 0 ? "All Ratings" : `${rating}+ Stars`}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection("favorite")}
        >
          <span>Favorites</span>
          <ChevronDown
            className={`${styles.chevron} ${expandedSections.favorite ? styles.expanded : ""}`}
          />
        </button>
        {expandedSections.favorite && (
          <div className={styles.sectionContent}>
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
    </aside>
  );
}

export default Filter;
