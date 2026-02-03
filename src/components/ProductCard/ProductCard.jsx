import { useCart } from '../../context/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  const { title, price, description, image, rating } = product;
  const rate = rating?.rate ?? 0;
  const count = rating?.count ?? 0;
  const { addToCart, cart } = useCart();
  
  const cartItem = cart.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <article className={styles.card}>
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
        <button
          className={`${styles.addToCartBtn} ${isInCart ? styles.inCart : ''}`}
          onClick={handleAddToCart}
        >
          {isInCart ? (
            <>
              <CheckCircleIcon className={styles.btnIcon} />
              <span>In Cart ({cartItem.quantity})</span>
            </>
          ) : (
            <>
              <ShoppingCartIcon className={styles.btnIcon} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
