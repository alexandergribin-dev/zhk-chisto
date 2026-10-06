import { useEffect, useState } from "react";
import { Pane, Polyline, useMap, useMapEvents } from "react-leaflet";
import {
  loadGeo,
  type LatLng,
  type Rail,
  type Road,
} from "@/components/map/geo";

export const NOISE_COLOR = "#e11d48";
export const NOISE_BANDS = [
  { m: 300, opacity: 0.13 },
  { m: 100, opacity: 0.22 },
] as const;

const metersPerPixel = (lat: number, zoom: number) =>
  (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;

const NoiseZones = () => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [lines, setLines] = useState<LatLng[][] | null>(null);
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  useEffect(() => {
    Promise.all([loadGeo<Road[]>("roads"), loadGeo<Rail[]>("rail")]).then(
      ([r, w]) => setLines([...r.map((x) => x.c), ...w.map((x) => x.c)]),
    );
  }, []);

  if (!lines) return null;
  const mpp = metersPerPixel(map.getCenter().lat, zoom);

  return (
    <>
      {NOISE_BANDS.map((b, i) => (
        <Pane
          key={b.m}
          name={`noise-${b.m}`}
          style={{ zIndex: 380 + i, opacity: b.opacity, pointerEvents: "none" }}
        >
          <Polyline
            positions={lines}
            interactive={false}
            pathOptions={{
              color: NOISE_COLOR,
              weight: Math.max(2, (b.m * 2) / mpp),
              opacity: 1,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </Pane>
      ))}
    </>
  );
};

export default NoiseZones;
