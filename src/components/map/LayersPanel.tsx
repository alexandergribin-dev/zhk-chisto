import { useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { layerMeta, type LayerId } from "@/components/map/EcoLayers";

type Props = {
  layers: LayerId[];
  onToggle: (id: LayerId) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  radiusNote?: string;
};

const LayersPanel = ({
  layers,
  onToggle,
  open,
  onOpenChange,
  className,
  radiusNote = "Пунктир — 1 км вокруг выбранного ЖК",
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const ids = Object.keys(layerMeta) as LayerId[];

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        onOpenChange(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open, onOpenChange]);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-card/95 shadow-soft backdrop-blur transition-[width]",
        open ? "w-[min(220px,calc(100vw-6rem))]" : "w-auto",
        className,
      )}
    >
      <button
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-label={
          open
            ? "Свернуть слои карты"
            : `Слои карты: включено ${layers.length} из ${ids.length}`
        }
        title="Слои карты"
        className={cn(
          "flex items-center gap-2 text-sm font-semibold text-primary",
          open ? "w-full px-3 py-2.5" : "h-[34px] px-2.5",
        )}
      >
        <Icon name="Layers" size={16} className="shrink-0" />
        {open ? (
          <>
            Слои карты
            <Icon
              name="X"
              size={16}
              className="ml-auto text-muted-foreground"
            />
          </>
        ) : (
          <span className="flex items-center gap-1">
            {ids.map((id) => {
              const on = layers.includes(id);
              return (
                <span
                  key={id}
                  className="grid h-[22px] w-[22px] place-items-center rounded-md"
                  style={
                    on
                      ? { background: layerMeta[id].color, color: "#fff" }
                      : {
                          background: "hsl(var(--muted))",
                          color: "hsl(var(--muted-foreground))",
                          opacity: 0.6,
                        }
                  }
                >
                  <Icon name={layerMeta[id].icon} fallback="Circle" size={12} />
                </span>
              );
            })}
          </span>
        )}
      </button>
      {open && (
        <ul className="space-y-0.5 px-1.5 pb-1.5">
          {(Object.keys(layerMeta) as LayerId[]).map((id) => {
            const m = layerMeta[id];
            const on = layers.includes(id);
            return (
              <li key={id}>
                <button
                  role="switch"
                  aria-checked={on}
                  onClick={() => onToggle(id)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted"
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors"
                    style={
                      on
                        ? { background: m.color, color: "#fff" }
                        : {
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--muted-foreground))",
                          }
                    }
                  >
                    <Icon name={m.icon} fallback="Circle" size={15} />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span
                      className={cn(
                        "block text-[0.82rem] font-medium",
                        !on && "text-muted-foreground",
                      )}
                    >
                      {m.label}
                    </span>
                    <span className="block text-[0.7rem] text-muted-foreground">
                      {m.hint}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "relative h-4 w-7 shrink-0 rounded-full transition-colors",
                      on ? "bg-primary" : "bg-border",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
                        on ? "left-3.5" : "left-0.5",
                      )}
                    />
                  </span>
                </button>
              </li>
            );
          })}
          {layers.includes("noise") && (
            <li className="flex items-center gap-3 px-2 pt-1 text-[0.7rem] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span
                  className="h-2.5 w-3.5 rounded-sm"
                  style={{ background: "rgba(225,29,72,0.42)" }}
                />
                до 100 м
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="h-2.5 w-3.5 rounded-sm"
                  style={{ background: "rgba(225,29,72,0.16)" }}
                />
                до 300 м
              </span>
            </li>
          )}
          {layers.length > 0 && (
            <li className="flex items-center gap-1.5 px-2 pt-1 text-[0.7rem] text-muted-foreground">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-dashed border-primary" />
              {radiusNote}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default LayersPanel;
