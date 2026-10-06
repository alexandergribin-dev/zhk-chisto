import { useCallback, useEffect, useState } from "react";
import { layerMeta, type LayerId } from "@/components/map/EcoLayers";

const PREFIX = "eco-map-layers:";
const valid = Object.keys(layerMeta) as LayerId[];

const read = (key: string, fallback: LayerId[]): LayerId[] => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    const on: unknown[] = Array.isArray(parsed) ? parsed : parsed?.on;
    if (!Array.isArray(on)) return fallback;
    const known: unknown[] = Array.isArray(parsed?.known)
      ? parsed.known
      : ["green", "industry", "roads", "metro"];
    return valid.filter((id) =>
      known.includes(id) ? on.includes(id) : fallback.includes(id),
    );
  } catch {
    return fallback;
  }
};

const useStoredLayers = (key: string, fallback: LayerId[]) => {
  const [layers, setLayers] = useState<LayerId[]>(() => read(key, fallback));

  useEffect(() => {
    try {
      localStorage.setItem(
        PREFIX + key,
        JSON.stringify({ on: layers, known: valid }),
      );
    } catch {
      /* хранилище недоступно — просто не запоминаем */
    }
  }, [key, layers]);

  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === PREFIX + key) setLayers(read(key, fallback));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key, fallback]);

  const toggle = useCallback(
    (id: LayerId) =>
      setLayers((l) =>
        l.includes(id) ? l.filter((x) => x !== id) : [...l, id],
      ),
    [],
  );

  return [layers, toggle] as const;
};

export default useStoredLayers;
