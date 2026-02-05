import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PaymentIcon from "@mui/icons-material/Payment";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";
import styles from "./Cart.module.css";

function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { searchQuery } = useSearch();
  const [viewMode, setViewMode] = useState("card");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const total = getCartTotal();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const filteredCart = cart.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedCart = [...filteredCart].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case "name":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "quantity":
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  if (cart.length === 0) {
    return (
      <div className={styles.cart}>
        <h1 className={styles.heading}>
          <ShoppingCartIcon className={styles.headingIcon} />
          Shopping Cart
        </h1>
        <div className={styles.emptyCart}>
          <ShoppingCartIcon className={styles.emptyCartIcon} />
          <p className={styles.emptyCartText}>Your cart is empty</p>
          <Link to="/" className={styles.emptyCartButton}>
            <ShoppingBagIcon />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <h1 className={styles.heading}>
        <ShoppingCartIcon className={styles.headingIcon} />
        Shopping Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
      </h1>

      <div className={styles.viewControls}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === "card" ? styles.active : ""}`}
            onClick={() => setViewMode("card")}
          >
            <ViewModuleIcon />
            Card View
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === "table" ? styles.active : ""}`}
            onClick={() => setViewMode("table")}
          >
            <ViewListIcon />
            Table View
          </button>
        </div>
        {viewMode === "table" && (
          <div className={styles.sortControls}>
            <SortIcon />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-");
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className={styles.sortSelect}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="quantity-asc">Quantity Low-High</option>
              <option value="quantity-desc">Quantity High-Low</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
            </select>
          </div>
        )}
      </div>

      <div className={styles.cartContent}>
        {viewMode === "card" ? (
          <div className={styles.cartItems}>
            {sortedCart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h2 className={styles.itemTitle}>{item.title}</h2>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <RemoveIcon />
                      </button>
                      <span className={styles.quantityValue}>
                        {item.quantity}
                      </span>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <AddIcon />
                      </button>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove item"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {sortedCart.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.itemNameCell}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={styles.tableItemImage}
                      />
                      <span>{item.title}</span>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className={styles.tableQuantityControl}>
                        <button
                          className={styles.quantityButton}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <RemoveIcon />
                        </button>
                        <span className={styles.quantityValue}>
                          {item.quantity}
                        </span>
                        <button
                          className={styles.quantityButton}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <AddIcon />
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemove(item.id)}
                        aria-label="Remove item"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Sub Total</span>
            <span className={styles.summaryValue}>${total.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Shipping</span>
            <span className={styles.summaryValue}>Free</span>
          </div>
          <div className={styles.summaryTotal}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>${total.toFixed(2)}</span>
          </div>
          <button className={styles.checkoutButton}>
            <PaymentIcon />
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
