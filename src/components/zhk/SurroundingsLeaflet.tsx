import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import EcoLayers, { type LayerId } from "@/components/map/EcoLayers";
import LayersPanel from "@/components/map/LayersPanel";
import type { Zhk } from "@/data/zhk";

const gradeVar = { A: "--grade-a", B: "--grade-b", C: "--grade-c", D: "--grade-d" } as const;

const SurroundingsLeaflet = ({ z }: { z: Zhk }) => {
  const [layers, setLayers] = useState<LayerId[]>(["green", "industry", "roads", "metro"]);
  const [open, setOpen] = useState(true);
  const toggle = (id: LayerId) => setLayers((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setOpen(false);
  }, []);

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
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" className="eco-tiles" />
        <EcoLayers layers={layers} detailAround={z.coords} />
        <Circle center={z.coords} radius={1000} interactive={false} pathOptions={{ color: "#0f3d33", weight: 1.5, dashArray: "5 6", fill: false }} />
        <Circle center={z.coords} radius={300} interactive={false} pathOptions={{ color: "#0f3d33", weight: 1.5, fillColor: "#0f3d33", fillOpacity: 0.08 }} />
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
      <span className="pointer-events-none absolute bottom-1 right-2 z-[500] text-[9px] text-primary/60">© OpenStreetMap</span>
    </div>
  );
};

export default SurroundingsLeaflet;
