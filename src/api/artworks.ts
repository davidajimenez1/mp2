import axios from "axios";
import type { Artwork } from "../types/artwork";

const FIELDS =
  "id,title,artist_title,date_start,department_title,classification_title,place_of_origin,medium_display,image_id,thumbnail";

// What the API actually returns: same as Artwork, but with a nested thumbnail
type RawArtwork = Omit<Artwork, "thumbnail_lqip"> & {
  thumbnail?: { lqip?: string | null } | null;
};

export async function fetchArtworks(): Promise<Artwork[]> {
  const res = await axios.get("https://api.artic.edu/api/v1/artworks", {
    params: { limit: 100, fields: FIELDS },
  });

  return (res.data.data as RawArtwork[]).map(({ thumbnail, ...rest }) => ({
    ...rest,
    thumbnail_lqip: thumbnail?.lqip ?? null,
  }));
}
