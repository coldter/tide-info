import { useState } from "react";
import { MapPin, Star, Trash2, Plus, Search } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  searchLocation,
  getTideInfo,
  type SearchLocation,
} from "@/lib/forecast-client";
import { writeStoredLocation, type StoredLocation } from "@/lib/location-client";

const FAVORITES_KEY = "tide-info:favorites" as const;

export interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  state: string;
  addedAt: number;
}

function getFavorites(): FavoriteLocation[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteLocation[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

interface FavoriteLocationsProps {
  onLocationSelect?: (location: StoredLocation) => void;
}

export function FavoriteLocations({ onLocationSelect }: FavoriteLocationsProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchLocation[]>([]);

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      if (query.length < 3) {
        return [];
      }
      return await searchLocation(query);
    },
    onSuccess: (results) => {
      setSearchResults(results);
      setIsSearching(true);
    },
    onError: () => {
      toast.error("Failed to search locations");
      setSearchResults([]);
    },
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (location: SearchLocation) => {
      const favorites = getFavorites();
      const newFavorite: FavoriteLocation = {
        id: `${location.lat}-${location.lng}`,
        ...location,
        addedAt: Date.now(),
      };
      
      // Check if already exists
      if (favorites.some((f) => f.id === newFavorite.id)) {
        throw new Error("Location already in favorites");
      }
      
      // Limit to 5 favorites
      if (favorites.length >= 5) {
        throw new Error("Maximum 5 favorite locations allowed");
      }
      
      const updated = [...favorites, newFavorite];
      saveFavorites(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["favorites"], updated);
      toast.success("Added to favorites");
      setIsSearching(false);
      setSearchQuery("");
      setSearchResults([]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (id: string) => {
      const favorites = getFavorites();
      const updated = favorites.filter((f) => f.id !== id);
      saveFavorites(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["favorites"], updated);
      toast.success("Removed from favorites");
    },
  });

  const selectLocationMutation = useMutation({
    mutationFn: async (favorite: FavoriteLocation) => {
      // Get fresh tide data for this location
      const tideInfo = await getTideInfo({ lat: favorite.lat, lng: favorite.lng });
      
      const location: StoredLocation = {
        lat: favorite.lat,
        lng: favorite.lng,
        name: favorite.name,
        country: favorite.country,
        state: favorite.state,
        updatedAt: Date.now(),
      };
      
      writeStoredLocation(location);
      return { location, tideInfo };
    },
    onSuccess: ({ location }) => {
      queryClient.invalidateQueries({ queryKey: ["location"] });
      queryClient.invalidateQueries({ queryKey: ["tide"] });
      if (onLocationSelect) {
        onLocationSelect(location);
      }
      toast.success(`Switched to ${location.name}`);
    },
    onError: () => {
      toast.error("Failed to load location data");
    },
  });

  const favorites = favoritesQuery.data || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Favorite Locations
          </CardTitle>
          <Badge variant="secondary">{favorites.length}/5</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Section */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a coastal location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.length >= 3) {
                  searchMutation.mutate(searchQuery);
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => searchMutation.mutate(searchQuery)}
              disabled={searchQuery.length < 3 || searchMutation.isPending}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Results */}
          {isSearching && searchResults.length > 0 && (
            <div className="rounded-lg border bg-muted/20 p-2 space-y-1">
              <p className="text-muted-foreground text-xs mb-2">Search Results:</p>
              {searchResults.slice(0, 5).map((result, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md bg-background p-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{result.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {[result.state, result.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addFavoriteMutation.mutate(result)}
                    disabled={addFavoriteMutation.isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setIsSearching(false);
                  setSearchResults([]);
                }}
              >
                Close
              </Button>
            </div>
          )}
        </div>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <div className="space-y-2">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <button
                  type="button"
                  className="flex flex-1 items-start gap-3 text-left"
                  onClick={() => selectLocationMutation.mutate(favorite)}
                  disabled={selectLocationMutation.isPending}
                >
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{favorite.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {[favorite.state, favorite.country].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {favorite.lat.toFixed(4)}, {favorite.lng.toFixed(4)}
                    </p>
                  </div>
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFavoriteMutation.mutate(favorite.id)}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed py-6 text-center">
            <Star className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground text-sm">
              No favorite locations yet
            </p>
            <p className="text-muted-foreground text-xs">
              Search and add coastal locations for quick access
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}