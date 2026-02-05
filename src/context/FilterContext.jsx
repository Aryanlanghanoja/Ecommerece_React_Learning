import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 1000],
    minRating: 0,
    isFavorite: false,
  });

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <FilterContext.Provider
      value={{ isFilterOpen, setIsFilterOpen, filters, updateFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
