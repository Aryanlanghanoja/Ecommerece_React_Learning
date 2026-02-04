import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ErrorOutlineIcon className={styles.icon} />
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.message}>
          Sorry, the page you're looking for doesn't exist. It might have been
          removed or the link might be incorrect.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.homeButton}
            onClick={() => navigate("/")}
          >
            <span>Go to Home</span>
          </button>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon fontSize="small" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
