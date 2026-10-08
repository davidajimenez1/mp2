import { useState } from "react";
import { Link } from "react-router-dom";
import { useArtworks } from "../context/ArtworkContext";
import ArtworkImage from "../components/ArtworkImage";
import styles from "./GalleryView.module.css";

export default function GalleryView() {
  const { artworks, loading, error } = useArtworks();
  const [selected, setSelected] = useState<string[]>([]);

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.message}>{error}</p>;

  // A gallery needs pictures, so skip artworks without an image
  const withImages = artworks.filter((a) => a.image_id !== null);

  // Build a list of every department (no repeats) for the filter buttons
  const departments: string[] = [];
  withImages.forEach((a) => {
    if (a.department_title && !departments.includes(a.department_title)) {
      departments.push(a.department_title);
    }
  });
  departments.sort();

  // If nothing is selected show everything,
  // otherwise show artworks in ANY of the selected departments
  const visible = withImages.filter((a) => {
    if (selected.length === 0) {
      return true;
    }
    return a.department_title !== null && selected.includes(a.department_title);
  });

  // The ids in the order shown, so the detail page can step through them
  const ids = visible.map((a) => a.id);

  function toggleDepartment(dept: string) {
    if (selected.includes(dept)) {
      setSelected(selected.filter((d) => d !== dept));
    } else {
      setSelected([...selected, dept]);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.filters}>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => toggleDepartment(dept)}
            className={
              selected.includes(dept)
                ? `${styles.chip} ${styles.active}`
                : styles.chip
            }
          >
            {dept}
          </button>
        ))}
        {selected.length > 0 && (
          <button className={styles.clear} onClick={() => setSelected([])}>
            Clear filters
          </button>
        )}
      </div>

      <p className={styles.count}>{visible.length} artworks</p>

      {visible.length === 0 ? (
        <p className={styles.message}>No artworks match these filters.</p>
      ) : (
        <ul className={styles.grid}>
          {visible.map((a) => (
            <li key={a.id}>
              <Link
                to={`/artwork/${a.id}`}
                state={{ ids: ids }}
                className={styles.card}
              >
                <ArtworkImage artwork={a} className={styles.image} />
                <span className={styles.caption}>{a.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
