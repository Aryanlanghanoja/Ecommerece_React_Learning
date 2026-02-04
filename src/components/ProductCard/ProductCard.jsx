import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styles from "./ProductCard.module.css";

function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite = () => {},
}) {
  const navigate = useNavigate();
  const { title, price, description, image, rating, category } = product;
  const rate = rating?.rate ?? 0;
  const count = rating?.count ?? 0;
  const { addToCart, updateQuantity, cart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

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

  const toggleFavorite = () => {
    onToggleFavorite();
  };

  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <article className={styles.card} onClick={handleCardClick}>
        <div className={styles.cardHeader} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`${styles.iconButton} ${isFavorite ? styles.iconButtonActive : ""}`}
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remove from favourites" : "Mark as favourite"
            }
          >
            {isFavorite ? (
              <FavoriteIcon className={styles.favoriteIconFilled} />
            ) : (
              <FavoriteBorderIcon className={styles.favoriteIcon} />
            )}
          </button>

          <button
            type="button"
            className={styles.iconButton}
            onClick={openDetails}
            aria-label="View product details"
          >
            <InfoOutlinedIcon className={styles.infoIcon} />
          </button>
        </div>

        <div className={styles.imageWrapper}>
          <img
            src={image}
            alt={title}
            className={styles.image}
            loading="lazy"
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <p className={styles.price}>${price.toFixed(2)}</p>
          <div className={styles.rating}>
            <StarIcon className={styles.starIcon} />
            <span className={styles.ratingValue}>{rate}</span>
            <span className={styles.ratingCount}>({count} reviews)</span>
          </div>

          {isInCart ? (
            <div className={styles.cartControlsRow}>
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
      </article>

      {showDetails && (
        <div className={styles.modalBackdrop} onClick={closeDetails}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <button
                type="button"
                className={styles.modalCloseButton}
                onClick={closeDetails}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalImageWrapper}>
                <img src={image} alt={title} className={styles.modalImage} />
              </div>
              <div className={styles.modalInfo}>
                <p className={styles.modalCategory}>{category}</p>
                <p className={styles.modalPrice}>${price.toFixed(2)}</p>
                <div className={styles.modalRating}>
                  <StarIcon className={styles.starIcon} />
                  <span>{rate} / 5</span>
                  <span className={styles.ratingCount}>({count} reviews)</span>
                </div>
                <p className={styles.modalDescription}>{description}</p>

                <div className={styles.modalActions}>
                  {isInCart ? (
                    <div className={styles.modalCartControls}>
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
                      className={styles.modalAddToCartBtn}
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
        </div>
      )}
    </>
  );
}

export default ProductCard;
