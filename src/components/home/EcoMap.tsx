import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { zhkList, fmtMln, type Grade, type Zhk } from "@/data/zhk";
import { cn } from "@/lib/utils";

const gradeColor: Record<Grade, string> = {
  A: "hsl(var(--grade-a))",
  B: "hsl(var(--grade-b))",
  C: "hsl(var(--grade-c))",
  D: "hsl(var(--grade-d))",
};

const makeIcon = (g: Grade, active: boolean) =>
  L.divIcon({
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    tooltipAnchor: [0, -30],
    html: `<span class="eco-pin${active ? " eco-pin-active" : ""}" style="background:${gradeColor[g]}"><b>${g}</b></span>`,
  });

const icons = Object.fromEntries((Object.keys(gradeColor) as Grade[]).map((g) => [g, makeIcon(g, false)])) as Record<Grade, L.DivIcon>;
const activeIcons = Object.fromEntries((Object.keys(gradeColor) as Grade[]).map((g) => [g, makeIcon(g, true)])) as Record<Grade, L.DivIcon>;

const FitBounds = ({ items }: { items: Zhk[] }) => {
  const map = useMap();
  const key = items.map((z) => z.slug).join(",");
  useEffect(() => {
    if (!items.length) return;
    if (items.length === 1) {
      map.setView(items[0].coords, 12, { animate: true });
      return;
    }
    map.fitBounds(L.latLngBounds(items.map((z) => z.coords)), { padding: [50, 50], maxZoom: 12, animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  return null;
};

type Props = {
  className?: string;
  items?: Zhk[];
  fit?: boolean;
  scrollZoom?: boolean;
  selected?: string | null;
  onSelect?: (slug: string) => void;
};

const EcoMap = ({ className, items = zhkList, fit, scrollZoom, selected, onSelect }: Props) => {
  const navigate = useNavigate();
  return (
    <div className={cn("relative isolate h-full overflow-hidden rounded-[22px] bg-primary", className)}>
      <MapContainer
        center={[55.76, 37.6]}
        zoom={9}
        minZoom={8}
        maxZoom={16}
        scrollWheelZoom={!!scrollZoom}
        attributionControl={false}
        className="eco-map h-full w-full"
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" className="eco-tiles" />
        {fit && <FitBounds items={items} />}
        {items.map((z) => (
          <Marker
            key={z.slug}
            position={z.coords}
            icon={selected === z.slug ? activeIcons[z.grade] : icons[z.grade]}
            zIndexOffset={selected === z.slug ? 1000 : 0}
            eventHandlers={{ click: () => (onSelect ? onSelect(z.slug) : navigate(`/zhk/${z.slug}`)) }}
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
