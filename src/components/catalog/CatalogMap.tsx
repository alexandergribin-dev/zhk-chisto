import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import EcoMap from "@/components/home/EcoMap";
import EcoLayers, { type LayerId } from "@/components/map/EcoLayers";
import LayersPanel from "@/components/map/LayersPanel";
import useStoredLayers from "@/components/map/useStoredLayers";
import Icon from "@/components/ui/icon";
import ZhkCard from "@/components/ZhkCard";
import GradeBadge from "@/components/GradeBadge";
import { fmtMln, type Zhk } from "@/data/zhk";
import { cn } from "@/lib/utils";

const CATALOG_DEFAULT: LayerId[] = ["green", "industry", "roads", "rail"];

const CatalogMap = ({ items }: { items: Zhk[] }) => {
  const [layers, toggle] = useStoredLayers("catalog", CATALOG_DEFAULT);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(
    items[0]?.slug ?? null,
  );
  const listRef = useRef<HTMLUListElement>(null);
  const cur = items.find((z) => z.slug === selected) ?? null;

  useEffect(() => {
    if (!items.some((z) => z.slug === selected))
      setSelected(items[0]?.slug ?? null);
  }, [items, selected]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-slug="${selected}"]`,
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="relative h-[460px] md:h-[600px]">
        <EcoMap
          items={items}
          fit
          scrollZoom
          selected={selected}
          onSelect={setSelected}
        >
          <EcoLayers layers={layers} focus={cur?.coords} />
        </EcoMap>
        <LayersPanel
          layers={layers}
          onToggle={toggle}
          open={panelOpen}
          onOpenChange={setPanelOpen}
          className="absolute left-14 top-3 z-[600]"
        />
        {cur && (
          <Link
            key={cur.slug}
            to={`/zhk/${cur.slug}`}
            className="absolute inset-x-3 bottom-12 z-[600] flex animate-fade-in items-center gap-3 rounded-xl bg-card p-2 shadow-soft lg:hidden"
          >
            <img
              src={cur.photo}
              alt={cur.name}
              style={{ objectPosition: cur.photoPos }}
              className="h-16 w-20 shrink-0 rounded-lg object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <b className="truncate text-sm font-semibold">{cur.name}</b>
                <GradeBadge grade={cur.grade} />
              </span>
              <span className="num mt-0.5 block text-sm font-semibold">
                {fmtMln(cur.priceFrom)}–{fmtMln(cur.priceTo)} млн ₽
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {cur.district} · {cur.deadline}
              </span>
            </span>
            <Icon
              name="ChevronRight"
              size={18}
              className="shrink-0 text-muted-foreground"
            />
          </Link>
        )}
      </div>

      <div className="hidden lg:block">
        {cur && (
          <ZhkCard key={cur.slug} z={cur} wide className="animate-fade-in" />
        )}
        <ul
          ref={listRef}
          className="mt-3 max-h-[290px] space-y-1 overflow-y-auto rounded-xl bg-card p-1.5 shadow-line"
        >
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
                <span className="min-w-0 flex-1 truncate font-medium">
                  {z.name}
                </span>
                <span className="num shrink-0 text-xs text-muted-foreground">
                  от {fmtMln(z.priceFrom)} млн
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CatalogMap;
