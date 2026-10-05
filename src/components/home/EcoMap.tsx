import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { zhkList, fmtMln, type Grade } from "@/data/zhk";
import { cn } from "@/lib/utils";

const gradeColor: Record<Grade, string> = {
  A: "hsl(var(--grade-a))",
  B: "hsl(var(--grade-b))",
  C: "hsl(var(--grade-c))",
  D: "hsl(var(--grade-d))",
};

const icons = Object.fromEntries(
  (Object.keys(gradeColor) as Grade[]).map((g) => [
    g,
    L.divIcon({
      className: "",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      tooltipAnchor: [0, -30],
      html: `<span class="eco-pin" style="background:${gradeColor[g]}"><b>${g}</b></span>`,
    }),
  ]),
) as Record<Grade, L.DivIcon>;

const EcoMap = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <div className={cn("relative isolate h-full overflow-hidden rounded-[22px] bg-primary", className)}>
      <MapContainer
        center={[55.76, 37.6]}
        zoom={9}
        minZoom={8}
        maxZoom={15}
        scrollWheelZoom={false}
        attributionControl={false}
        className="eco-map h-full w-full"
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" className="eco-tiles" />
        {zhkList.map((z) => (
          <Marker
            key={z.slug}
            position={z.coords}
            icon={icons[z.grade]}
            eventHandlers={{ click: () => navigate(`/zhk/${z.slug}`) }}
          >
            <Tooltip direction="top" className="eco-tip">
              <b>{z.name}</b>
              <br />
              {z.district} · {fmtMln(z.priceFrom)}–{fmtMln(z.priceTo)} млн ₽
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex gap-2.5 rounded-lg bg-primary/90 px-2.5 py-1.5 text-[11px] font-medium text-white">
        {(Object.keys(gradeColor) as Grade[]).map((g) => (
          <span key={g} className="flex items-center gap-1">
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: gradeColor[g] }} />
            {g}
          </span>
        ))}
      </div>
      <span className="pointer-events-none absolute bottom-1 right-2 z-[500] text-[9px] text-primary/60">© OpenStreetMap</span>
    </div>
  );
};

export default EcoMap;
