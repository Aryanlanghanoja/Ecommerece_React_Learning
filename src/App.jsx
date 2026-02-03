import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import styles from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SearchProvider>
          <NavBar />
          <div className={styles.app}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </SearchProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
