import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import EcoMap from "@/components/home/EcoMap";
import EcoLayers, { layerMeta, type LayerId } from "@/components/map/EcoLayers";
import Icon from "@/components/ui/icon";
import ZhkCard from "@/components/ZhkCard";
import GradeBadge from "@/components/GradeBadge";
import { fmtMln, type Zhk } from "@/data/zhk";
import { cn } from "@/lib/utils";

const CatalogMap = ({ items }: { items: Zhk[] }) => {
  const [layers, setLayers] = useState<LayerId[]>(["green", "industry", "roads"]);
  const [panelOpen, setPanelOpen] = useState(true);
  const toggle = (id: LayerId) => setLayers((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const [selected, setSelected] = useState<string | null>(items[0]?.slug ?? null);
  const listRef = useRef<HTMLUListElement>(null);
  const cur = items.find((z) => z.slug === selected) ?? null;

  useEffect(() => {
    if (!items.some((z) => z.slug === selected)) setSelected(items[0]?.slug ?? null);
  }, [items, selected]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setPanelOpen(false);
  }, []);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-slug="${selected}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="relative h-[460px] md:h-[600px]">
        <EcoMap items={items} fit scrollZoom selected={selected} onSelect={setSelected}>
          <EcoLayers layers={layers} focus={cur?.coords} />
        </EcoMap>
        <div className="absolute left-14 top-3 z-[600] w-[min(220px,calc(100%-4.5rem))] rounded-xl bg-card/95 shadow-soft backdrop-blur">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-semibold text-primary"
          >
            <Icon name="Layers" size={16} />
            Слои карты
            <span className="num ml-auto rounded-full bg-secondary px-1.5 text-xs text-foreground">{layers.length}</span>
            <Icon name={panelOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
          </button>
          {panelOpen && (
            <ul className="space-y-0.5 px-1.5 pb-1.5">
              {(Object.keys(layerMeta) as LayerId[]).map((id) => {
                const m = layerMeta[id];
                const on = layers.includes(id);
                return (
                  <li key={id}>
                    <button
                      role="switch"
                      aria-checked={on}
                      onClick={() => toggle(id)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted"
                    >
                      <span
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors"
                        style={on ? { background: m.color, color: "#fff" } : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                      >
                        <Icon name={m.icon} fallback="Circle" size={15} />
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className={cn("block text-[0.82rem] font-medium", !on && "text-muted-foreground")}>{m.label}</span>
                        <span className="block text-[0.7rem] text-muted-foreground">{m.hint}</span>
                      </span>
                      <span className={cn("relative h-4 w-7 shrink-0 rounded-full transition-colors", on ? "bg-primary" : "bg-border")}>
                        <span className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all", on ? "left-3.5" : "left-0.5")} />
                      </span>
                    </button>
                  </li>
                );
              })}
              {layers.length > 0 && (
                <li className="flex items-center gap-1.5 px-2 pt-1 text-[0.7rem] text-muted-foreground">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-dashed border-primary" />
                  Пунктир — 1 км вокруг выбранного ЖК
                </li>
              )}
            </ul>
          )}
        </div>
        {cur && (
          <Link
            key={cur.slug}
            to={`/zhk/${cur.slug}`}
            className="absolute inset-x-3 bottom-12 z-[600] flex animate-fade-in items-center gap-3 rounded-xl bg-card p-2 shadow-soft lg:hidden"
          >
            <img src={cur.photo} alt={cur.name} style={{ objectPosition: cur.photoPos }} className="h-16 w-20 shrink-0 rounded-lg object-cover" />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <b className="truncate text-sm font-semibold">{cur.name}</b>
                <GradeBadge grade={cur.grade} />
              </span>
              <span className="num mt-0.5 block text-sm font-semibold">{fmtMln(cur.priceFrom)}–{fmtMln(cur.priceTo)} млн ₽</span>
              <span className="block truncate text-xs text-muted-foreground">{cur.district} · {cur.deadline}</span>
            </span>
            <Icon name="ChevronRight" size={18} className="shrink-0 text-muted-foreground" />
          </Link>
        )}
      </div>

      <div className="hidden lg:block">
        {cur && <ZhkCard key={cur.slug} z={cur} wide className="animate-fade-in" />}
        <ul ref={listRef} className="mt-3 max-h-[290px] space-y-1 overflow-y-auto rounded-xl bg-card p-1.5 shadow-line">
          {items.map((z) => (
            <li key={z.slug} data-slug={z.slug}>
              <button
                onClick={() => setSelected(z.slug)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  selected === z.slug ? "bg-secondary" : "hover:bg-muted",
                )}
              >
                <GradeBadge grade={z.grade} />
                <span className="min-w-0 flex-1 truncate font-medium">{z.name}</span>
                <span className="num shrink-0 text-xs text-muted-foreground">от {fmtMln(z.priceFrom)} млн</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CatalogMap;
