import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./ProductDisplay.module.css";

function ProductDisplay() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://fakestoreapi.com/products/${productId}`,
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress size={48} />
        <p>Loading product…</p>
      </div>
    );
  }

  if (error || !product) {
    return <Navigate to="/not-found" replace />;
  }

  const { title, price, description, image, rating, category } = product;
  const rate = rating?.rate ?? 0;
  const count = rating?.count ?? 0;

  const cartItem = cart.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleIncrement = () => {
    if (!cartItem) {
      addToCart(product);
    } else {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate("/")}
      >
        <ArrowBackIcon fontSize="small" />
        <span>Back</span>
      </button>

      <div className={styles.displayWrapper}>
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <img src={image} alt={title} className={styles.productImage} />
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.categoryBadge}>{category}</div>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.ratingSection}>
            <StarIcon className={styles.starIcon} />
            <span className={styles.ratingValue}>{rate}</span>
            <span className={styles.ratingCount}>({count} reviews)</span>
          </div>

          <div className={styles.priceSection}>
            <p className={styles.price}>${price.toFixed(2)}</p>
          </div>

          <div className={styles.descriptionSection}>
            <h2 className={styles.descriptionTitle}>Description</h2>
            <p className={styles.description}>{description}</p>
          </div>

          <div className={styles.cartSection}>
            {isInCart ? (
              <div className={styles.cartControls}>
                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    className={styles.quantityButton}
                    onClick={handleDecrement}
                    aria-label="Decrease quantity"
                  >
                    <RemoveIcon fontSize="small" />
                  </button>
                  <span className={styles.quantityValue}>
                    {cartItem.quantity}
                  </span>
                  <button
                    type="button"
                    className={styles.quantityButton}
                    onClick={handleIncrement}
                    aria-label="Increase quantity"
                  >
                    <AddIcon fontSize="small" />
                  </button>
                </div>
                <span className={styles.inCartLabel}>In Cart</span>
              </div>
            ) : (
              <button
                type="button"
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon className={styles.btnIcon} />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDisplay;
