import { useEffect, useRef, useState } from "react";
import {
  Polygon,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Factor } from "@/data/zhk";
import { findTarget, type LatLng, type Target } from "@/components/map/geo";

const KX = Math.cos((55.75 * Math.PI) / 180) * 111320;
const dist = (a: LatLng, b: LatLng) =>
  Math.hypot((a[0] - b[0]) * 111320, (a[1] - b[1]) * KX);

const FactorHighlight = ({
  factor,
  home,
  zoomTo,
}: {
  factor: Factor | null;
  home: LatLng;
  zoomTo: boolean;
}) => {
  const map = useMap();
  const [target, setTarget] = useState<{ id: string; t: Target } | null>(null);
  const reqId = useRef(0);

  useEffect(() => {
    if (!factor) {
      setTarget(null);
      return;
    }
    const id = ++reqId.current;
    findTarget(factor, home).then((t) => {
      if (id === reqId.current) setTarget({ id: factor.id, t });
    });
  }, [factor, home]);

  useEffect(() => {
    if (!target || !zoomTo) return;
    const t = target.t;
    const pts: LatLng[] =
      t.kind === "area"
        ? t.geo.c[0]
        : t.kind === "line"
          ? t.geo.flat()
          : [t.geo];
    const near = pts.filter(
      (p) => dist(home, p) < Math.max(3000, dist(home, t.anchor) * 2),
    );
    const b = L.latLngBounds([home, t.anchor, ...(near.length ? near : pts)]);
    map.flyToBounds(b, {
      padding: [70, 70],
      maxZoom: t.kind === "point" ? 15 : 16,
      duration: 0.8,
    });
  }, [target, zoomTo, map, home]);

  if (!factor || !target || target.id !== factor.id) return null;
  const t = target.t;
  const color =
    factor.kind === "plus" ? "hsl(var(--grade-a))" : "hsl(var(--grade-d))";
  const label = (
    <>
      <b>{factor.title}</b>
      <br />
      <span className="num">{factor.distance.toLocaleString("ru-RU")}</span> м
      от дома
      {t.kind === "point" && t.approx && " · место примерное"}
    </>
  );

  return (
    <>
      <Polyline
        positions={[home, t.anchor]}
        interactive={false}
        pathOptions={{
          color,
          weight: 2,
          dashArray: "2 7",
          lineCap: "round",
          opacity: 0.9,
        }}
      />
      {t.kind === "area" && (
        <Polygon
          key={target.id}
          positions={t.geo.c}
          pathOptions={{
            color,
            weight: 3,
            fillColor: color,
            fillOpacity: 0.28,
            className: "eco-hl",
          }}
        >
          <Tooltip permanent direction="top" className="eco-tip">
            {label}
          </Tooltip>
        </Polygon>
      )}
      {t.kind === "line" && (
        <>
          <Polyline
            positions={t.geo}
            interactive={false}
            pathOptions={{
              color: "#fff",
              weight: 11,
              opacity: 0.9,
              lineCap: "round",
            }}
          />
          <Polyline
            key={target.id}
            positions={t.geo}
            pathOptions={{
              color,
              weight: 6,
              lineCap: "round",
              className: "eco-hl",
            }}
          />
          <CircleMarker
            center={t.anchor}
            radius={1}
            pathOptions={{ opacity: 0, fillOpacity: 0 }}
          >
            <Tooltip permanent direction="top" className="eco-tip">
              {label}
            </Tooltip>
          </CircleMarker>
        </>
      )}
      {t.kind === "point" && (
        <>
          {t.approx && (
            <CircleMarker
              center={t.geo}
              radius={26}
              interactive={false}
              pathOptions={{
                color,
                weight: 1.5,
                dashArray: "4 4",
                fillColor: color,
                fillOpacity: 0.12,
              }}
            />
          )}
          <CircleMarker
            key={target.id}
            center={t.geo}
            radius={9}
            pathOptions={{
              color: "#fff",
              weight: 3,
              fillColor: color,
              fillOpacity: 1,
              className: "eco-hl",
            }}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, -8]}
              className="eco-tip"
            >
              {label}
            </Tooltip>
          </CircleMarker>
        </>
      )}
    </>
  );
};

export default FactorHighlight;
