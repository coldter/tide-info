import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { searchLocation } from "@/lib/forecast-client";
import {
  readStoredLocation,
  writeStoredLocation,
  clearStoredLocation,
} from "@/lib/location-client";

export function SearchLocation() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchLocation>>>([]);
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: runSearch, isPending } = useMutation({
    mutationFn: async (q: string) => await searchLocation({ q }),
    onSuccess: (data) => setResults(data),
  });

  const stored = readStoredLocation();

  return (
    <Card className="bg-card p-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search location (min 3 chars)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="button"
          disabled={query.trim().length < 3 || isPending}
          onClick={() => runSearch(query.trim())}
        >
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            clearStoredLocation();
            setResults([]);
            queryClient.invalidateQueries({ queryKey: ["location"] }).catch(() => {});
            queryClient.invalidateQueries({ queryKey: ["tide"] }).catch(() => {});
          }}
        >
          Clear saved
        </Button>
      </div>
      <div className="mt-3">
        {isPending || busy ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <ul className="max-h-56 space-y-2 overflow-y-auto">
            {results.map((r) => (
              <li key={`${r.lat}-${r.lng}`} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-foreground text-sm">{r.name}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {r.state}, {r.country}
                  </p>
                </div>
                <Button
                  size="sm"
                  type="button"
                  onClick={() => {
                    setBusy(true);
                    writeStoredLocation({
                      lat: r.lat,
                      lng: r.lng,
                      name: r.name,
                      state: r.state,
                      country: r.country,
                    });
                    setBusy(false);
                    queryClient.setQueryData(["location"], {
                      lat: r.lat,
                      lng: r.lng,
                      name: r.name,
                      state: r.state,
                      country: r.country,
                      updatedAt: Date.now(),
                    });
                    queryClient.invalidateQueries({ queryKey: ["tide"] }).catch(() => {});
                  }}
                >
                  Use
                </Button>
              </li>
            ))}
            {!results.length && stored && (
              <li className="text-muted-foreground text-xs">Using saved location</li>
            )}
          </ul>
        )}
      </div>
    </Card>
  );
}

