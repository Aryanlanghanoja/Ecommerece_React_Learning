import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FilterProvider } from "./context/FilterContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import ProductDisplay from "./pages/ProductDisplay/ProductDisplay";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <SearchProvider>
            <FilterProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/product/:productId"
                    element={<ProductDisplay />}
                  />
                  <Route path="/not-found" element={<NotFound />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </FilterProvider>
          </SearchProvider>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
