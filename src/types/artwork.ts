export interface Artwork {
  id: number;
  title: string;
  artist_title: string | null;
  date_start: number | null;
  department_title: string | null;
  classification_title: string | null;
  place_of_origin: string | null;
  medium_display: string | null;
  image_id: string | null;
  thumbnail_lqip: string | null;
}

export function getImageUrl(imageId: string, width = 843): string {
  return `https://www.artic.edu/iiif/2/${imageId}/full/${width},/0/default.jpg`;
}
