import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchArtworks } from "../api/artworks";
import type { Artwork } from "../types/artwork";

interface ArtworkContextValue {
  artworks: Artwork[];
  loading: boolean;
  error: string;
}

// Default value used if a component is outside the provider
const ArtworkContext = createContext<ArtworkContextValue>({
  artworks: [],
  loading: true,
  error: "",
});

// Fetches the artworks once and shares them with every page
export function ArtworkProvider({ children }: { children: ReactNode }) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArtworks() {
      try {
        const data = await fetchArtworks();
        setArtworks(data);
      } catch (err) {
        console.error(err);
        setError("Could not load artworks. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadArtworks();
  }, []);

  return (
    <ArtworkContext.Provider value={{ artworks, loading, error }}>
      {children}
    </ArtworkContext.Provider>
  );
}

export function useArtworks() {
  return useContext(ArtworkContext);
}
