import { useState } from "react";
import { getImageUrl } from "../types/artwork";
import type { Artwork } from "../types/artwork";
import styles from "./ArtworkImage.module.css";

interface Props {
  artwork: Artwork;
  className?: string;
  width?: number; // how wide an image to ask the server for
}

export default function ArtworkImage({
  artwork,
  className = "",
  width = 843,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!artwork.image_id) {
    return (
      <div className={`${styles.placeholder} ${className}`}>
        No image available
      </div>
    );
  }

  // Full image failed to load: show the low-res preview embedded in the API data
  if (failed) {
    return artwork.thumbnail_lqip ? (
      <img
        className={`${styles.preview} ${className}`}
        src={artwork.thumbnail_lqip}
        alt={artwork.title}
        title="Low-resolution preview (full image unavailable)"
      />
    ) : (
      <div className={`${styles.placeholder} ${className}`}>
        Image unavailable
      </div>
    );
  }

  return (
    <img
      className={className}
      src={getImageUrl(artwork.image_id, width)}
      alt={artwork.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
