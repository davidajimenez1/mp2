import { useState } from "react";
import { Link } from "react-router-dom";
import { useArtworks } from "../context/ArtworkContext";
import ArtworkImage from "../components/ArtworkImage";
import styles from "./ListView.module.css";

export default function ListView() {
  const { artworks, loading, error } = useArtworks();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.message}>{error}</p>;

  // Step 1: filter by the search text (title or artist)
  const text = search.toLowerCase();
  const results = artworks.filter((a) => {
    const title = a.title.toLowerCase();
    const artist = (a.artist_title || "").toLowerCase();
    return title.includes(text) || artist.includes(text);
  });

  // Step 2: sort the filtered results
  // (filter gives us a new array, so sorting it won't change the original)
  results.sort((a, b) => {
    let result = 0;
    if (sortBy === "title") {
      result = a.title.localeCompare(b.title);
    } else if (sortBy === "artist") {
      result = (a.artist_title || "").localeCompare(b.artist_title || "");
    } else if (sortBy === "year") {
      result = (a.date_start || 0) - (b.date_start || 0);
    }

    if (order === "desc") {
      result = -result;
    }
    return result;
  });

  // The ids in the order shown, so the detail page can step through them
  const ids = results.map((a) => a.id);

  function toggleOrder() {
    if (order === "asc") {
      setOrder("desc");
    } else {
      setOrder("asc");
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.controls}>
        <input
          type="search"
          placeholder="Search by title or artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.select}
        >
          <option value="title">Title</option>
          <option value="year">Year</option>
          <option value="artist">Artist</option>
        </select>

        <button onClick={toggleOrder} className={styles.button}>
          {order === "asc" ? "Ascending ↑" : "Descending ↓"}
        </button>
      </div>

      <p className={styles.count}>{results.length} results</p>

      <ul className={styles.list}>
        {results.map((a) => (
          <li key={a.id}>
            <Link
              to={`/artwork/${a.id}`}
              state={{ ids: ids }}
              className={styles.item}
            >
              <div className={styles.thumbBox}>
                <ArtworkImage
                  artwork={a}
                  width={200}
                  className={styles.thumb}
                />
              </div>
              <div>
                <span className={styles.title}>{a.title}</span>
                <span className={styles.meta}>
                  {a.artist_title || "Unknown artist"}
                  {a.date_start ? ` · ${a.date_start}` : ""}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
