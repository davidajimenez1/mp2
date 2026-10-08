import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useArtworks } from "../context/ArtworkContext";
import ArtworkImage from "../components/ArtworkImage";
import styles from "./DetailView.module.css";

export default function DetailView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { artworks, loading, error } = useArtworks();

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.message}>{error}</p>;

  // Find the artwork that matches the id in the URL
  const artwork = artworks.find((a) => a.id === Number(id));

  if (!artwork) {
    return (
      <div className={styles.message}>
        <p>Artwork not found.</p>
        <Link to="/">Back to list</Link>
      </div>
    );
  }

  // The list of ids that Previous / Next move through.
  // If we came from the list or gallery, they sent us their current order.
  // If someone opened this URL directly, use every artwork instead.
  let ids = artworks.map((a) => a.id);
  if (location.state && location.state.ids) {
    if (location.state.ids.includes(artwork.id)) {
      ids = location.state.ids;
    }
  }

  const index = ids.indexOf(artwork.id);

  // Wrap around: Previous on the first goes to the last, and vice versa
  let prevId = ids[index - 1];
  if (index === 0) {
    prevId = ids[ids.length - 1];
  }
  let nextId = ids[index + 1];
  if (index === ids.length - 1) {
    nextId = ids[0];
  }

  // Keep passing the same list along so Previous / Next keep following it
  function goTo(newId: number) {
    navigate(`/artwork/${newId}`, { state: { ids: ids } });
  }

  return (
    <section className={styles.container}>
      <div className={styles.nav}>
        <button className={styles.arrow} onClick={() => goTo(prevId)}>
          ← Previous
        </button>
        <span className={styles.position}>
          {index + 1} of {ids.length}
        </span>
        <button className={styles.arrow} onClick={() => goTo(nextId)}>
          Next →
        </button>
      </div>

      <h1 className={styles.title}>{artwork.title}</h1>

      {/* key makes the image reset when we move to another artwork */}
      <ArtworkImage
        key={artwork.id}
        artwork={artwork}
        className={styles.image}
      />

      <dl className={styles.details}>
        <div className={styles.row}>
          <dt>Artist</dt>
          <dd>{artwork.artist_title || "Unknown"}</dd>
        </div>
        <div className={styles.row}>
          <dt>Year</dt>
          <dd>{artwork.date_start || "Unknown"}</dd>
        </div>
        <div className={styles.row}>
          <dt>Department</dt>
          <dd>{artwork.department_title || "Unknown"}</dd>
        </div>
        <div className={styles.row}>
          <dt>Classification</dt>
          <dd>{artwork.classification_title || "Unknown"}</dd>
        </div>
        <div className={styles.row}>
          <dt>Origin</dt>
          <dd>{artwork.place_of_origin || "Unknown"}</dd>
        </div>
        <div className={styles.row}>
          <dt>Medium</dt>
          <dd>{artwork.medium_display || "Unknown"}</dd>
        </div>
      </dl>
    </section>
  );
}
