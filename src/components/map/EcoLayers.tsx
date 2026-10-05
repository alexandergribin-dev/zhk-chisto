import { useEffect, useState } from "react";
import {
  loadGeo,
  type Area,
  type FileId,
  type Road,
  type Station,
} from "@/components/map/geo";
import {
  Polygon,
  Polyline,
  CircleMarker,
  Circle,
  Tooltip,
} from "react-leaflet";

export type LayerId = "metro" | "green" | "industry" | "roads";
export const layerMeta: Record<
  LayerId,
  { label: string; icon: string; color: string; hint: string }
> = {
  green: {
    label: "Парки и леса",
    icon: "Trees",
    color: "#3f9d5a",
    hint: "Плюс к оценке",
  },
  industry: {
    label: "Промзоны",
    icon: "Factory",
    color: "#c2410c",
    hint: "Минус к оценке",
  },
  roads: {
    label: "Крупные трассы",
    icon: "Route",
    color: "#dc2626",
    hint: "Минус к оценке",
  },
  metro: {
    label: "Станции метро",
    icon: "TramFront",
    color: "#1d4ed8",
    hint: "Транспорт",
  },
};

const metroColors: Record<string, string> = {
  red: "#d6083b",
  green: "#029a55",
  blue: "#0078be",
  lightblue: "#00bfff",
  brown: "#745c2f",
  orange: "#f07e24",
  purple: "#8b3c96",
  yellow: "#ffd702",
  grey: "#999999",
  gray: "#999999",
  lime: "#a1b30a",
  teal: "#79cdcd",
  pink: "#de64a1",
  cyan: "#03795f",
};

const useLayer = <T,>(id: FileId, on: boolean) => {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    if (on && !data) loadGeo<T>(id).then(setData);
  }, [id, on, data]);
  return on ? data : null;
};

const near = (c: [number, number][][], p: [number, number]) =>
  Math.abs(c[0][0][0] - p[0]) < 0.03 && Math.abs(c[0][0][1] - p[1]) < 0.05;

type Props = {
  layers: LayerId[];
  focus?: [number, number] | null;
  detailAround?: [number, number];
};

const EcoLayers = ({ layers, focus, detailAround }: Props) => {
  const green = useLayer<Area[]>("green", layers.includes("green"));
  const detailAll = useLayer<Area[]>(
    "green-detail",
    !!detailAround && layers.includes("green"),
  );
  const detail =
    detailAround && detailAll
      ? detailAll.filter((a) => near(a.c, detailAround))
      : null;
  const industry = useLayer<Area[]>("industry", layers.includes("industry"));
  const roads = useLayer<Road[]>("roads", layers.includes("roads"));
  const metro = useLayer<Station[]>("metro", layers.includes("metro"));

  return (
    <>
      {focus && layers.length > 0 && (
        <Circle
          center={focus}
          radius={1000}
          interactive={false}
          pathOptions={{
            color: "#0f3d33",
            weight: 1.5,
            dashArray: "5 6",
            fillColor: "#0f3d33",
            fillOpacity: 0.05,
          }}
        />
      )}
      {green?.map((a, i) => (
        <Polygon
          key={`g${i}`}
          positions={a.c}
          pathOptions={{
            stroke: false,
            fillColor: layerMeta.green.color,
            fillOpacity: 0.38,
          }}
        >
          {a.n && (
            <Tooltip sticky className="eco-tip">
              {a.n} ·{" "}
              <span className="num">{a.ha.toLocaleString("ru-RU")}</span> га
            </Tooltip>
          )}
        </Polygon>
      ))}
      {detail?.map((a, i) => (
        <Polygon
          key={`gd${i}`}
          positions={a.c}
          pathOptions={{
            stroke: false,
            fillColor: layerMeta.green.color,
            fillOpacity: 0.38,
          }}
        >
          {a.n && (
            <Tooltip sticky className="eco-tip">
              {a.n} ·{" "}
              <span className="num">{a.ha.toLocaleString("ru-RU")}</span> га
            </Tooltip>
          )}
        </Polygon>
      ))}
      {industry?.map((a, i) => (
        <Polygon
          key={`i${i}`}
          positions={a.c}
          pathOptions={{
            color: layerMeta.industry.color,
            weight: 1,
            opacity: 0.6,
            fillColor: layerMeta.industry.color,
            fillOpacity: 0.3,
          }}
        >
          <Tooltip sticky className="eco-tip">
            {a.n ?? "Промзона"}
          </Tooltip>
        </Polygon>
      ))}
      {roads?.map((r, i) => (
        <Polyline
          key={`r${i}`}
          positions={r.c}
          pathOptions={{
            color: layerMeta.roads.color,
            weight: 3.5,
            opacity: 0.75,
            lineCap: "round",
          }}
        >
          {r.n && (
            <Tooltip sticky className="eco-tip">
              {r.n}
            </Tooltip>
          )}
        </Polyline>
      ))}
      {metro?.map((s, i) => (
        <CircleMarker
          key={`m${i}`}
          center={s.c}
          radius={4.5}
          pathOptions={{
            color: "#fff",
            weight: 1.5,
            fillColor:
              (s.col && (metroColors[s.col] ?? s.col)) || layerMeta.metro.color,
            fillOpacity: 1,
          }}
        >
          <Tooltip direction="top" className="eco-tip">
            м. {s.n}
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
};

export default EcoLayers;
