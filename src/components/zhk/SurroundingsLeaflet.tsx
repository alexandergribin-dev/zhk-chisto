import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Tooltip,
  useMap,
} from "react-leaflet";
import Icon from "@/components/ui/icon";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import EcoLayers, { type LayerId } from "@/components/map/EcoLayers";
import LayersPanel from "@/components/map/LayersPanel";
import NoiseStatus from "@/components/map/NoiseStatus";
import useStoredLayers from "@/components/map/useStoredLayers";
import FactorHighlight from "@/components/map/FactorHighlight";
import type { Factor, Zhk } from "@/data/zhk";

const gradeVar = {
  A: "--grade-a",
  B: "--grade-b",
  C: "--grade-c",
  D: "--grade-d",
} as const;

const ZHK_DEFAULT: LayerId[] = [
  "green",
  "industry",
  "roads",
  "rail",
  "noise",
  "metro",
];

const ResetView = ({
  center,
  signal,
}: {
  center: [number, number];
  signal: number;
}) => {
  const map = useMap();
  useEffect(() => {
    if (signal) map.flyTo(center, 14, { duration: 0.8 });
  }, [signal, center, map]);
  return null;
};

type Props = {
  z: Zhk;
  factor?: Factor | null;
  zoomTo?: boolean;
  onReset?: () => void;
  resetSignal?: number;
};

const SurroundingsLeaflet = ({
  z,
  factor = null,
  zoomTo = false,
  onReset,
  resetSignal = 0,
}: Props) => {
  const [layers, toggle] = useStoredLayers("zhk", ZHK_DEFAULT);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (factor) setOpen(false);
  }, [factor]);

  const icon = L.divIcon({
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    tooltipAnchor: [0, -30],
    html: `<span class="eco-pin eco-pin-active" style="background:hsl(var(${gradeVar[z.grade]}))"><b>${z.grade}</b></span>`,
  });

  return (
    <div className="relative isolate h-[420px] overflow-hidden rounded-xl bg-muted shadow-line md:h-[480px]">
      <MapContainer
        key={z.slug}
        center={z.coords}
        zoom={14}
        minZoom={10}
        maxZoom={17}
        scrollWheelZoom={false}
        attributionControl={false}
        className="eco-map h-full w-full"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="eco-tiles"
        />
        <EcoLayers layers={layers} detailAround={z.coords} />
        <Circle
          center={z.coords}
          radius={1000}
          interactive={false}
          pathOptions={{
            color: "#0f3d33",
            weight: 1.5,
            dashArray: "5 6",
            fill: false,
          }}
        />
        <Circle
          center={z.coords}
          radius={300}
          interactive={false}
          pathOptions={{
            color: "#0f3d33",
            weight: 1.5,
            fillColor: "#0f3d33",
            fillOpacity: 0.08,
          }}
        />
        <ResetView center={z.coords} signal={resetSignal} />
        <FactorHighlight factor={factor} home={z.coords} zoomTo={zoomTo} />
        <Marker position={z.coords} icon={icon} zIndexOffset={1000}>
          <Tooltip direction="top" className="eco-tip">
            <b>{z.name}</b>
          </Tooltip>
        </Marker>
      </MapContainer>
      <LayersPanel
        layers={layers}
        onToggle={toggle}
        open={open}
        onOpenChange={setOpen}
        radiusNote="Круги — 300 м и 1 км от дома"
        className="absolute left-14 top-3 z-[600]"
      />
      {layers.includes("noise") && (
        <NoiseStatus
          home={z.coords}
          className="absolute right-3 top-3 z-[600] max-w-[min(240px,calc(100%-8rem))]"
        />
      )}
      {factor && onReset && (
        <button
          onClick={onReset}
          className="absolute bottom-3 left-3 z-[600] inline-flex h-9 items-center gap-1.5 rounded-full bg-card px-3.5 text-sm font-semibold text-primary shadow-soft hover:bg-muted"
        >
          <Icon name="Undo2" fallback="RotateCcw" size={15} />
          Весь район
        </button>
      )}
      <span className="pointer-events-none absolute bottom-1 right-2 z-[500] text-[9px] text-primary/60">
        © OpenStreetMap
      </span>
    </div>
  );
};

export default SurroundingsLeaflet;
