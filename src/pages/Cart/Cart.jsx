import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentIcon from '@mui/icons-material/Payment';
import styles from './Cart.module.css';

function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const total = getCartTotal();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

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
        Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
      </h1>
      
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cart.map((item) => (
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
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <RemoveIcon />
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
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

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Subtotal</span>
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
