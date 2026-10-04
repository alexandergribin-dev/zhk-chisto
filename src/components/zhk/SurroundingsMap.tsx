import { useState } from "react";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { Factor, Zhk } from "@/data/zhk";

const iconFor: Record<Factor["type"], string> = {
  forest: "Trees",
  park: "TreeDeciduous",
  water: "Waves",
  highway: "Car",
  rail: "TrainFront",
  industry: "Factory",
  school: "School",
  metro: "TramFront",
};

// масштаб: 1000 м = 150 px, всё дальше 1000 м выносится на край
const R1000 = 150;
const R300 = 45;
const C = 200;

const pos = (f: Factor) => {
  const r = Math.min(f.distance, 1250) * (R1000 / 1000);
  const a = ((f.angle - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};

const SurroundingsMap = ({ z }: { z: Zhk }) => {
  const [active, setActive] = useState<string>(z.factors[0]?.id ?? "");
  const cur = z.factors.find((f) => f.id === active);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div className="relative overflow-hidden rounded-xl bg-muted shadow-line">
        <svg viewBox="0 0 400 400" className="block h-auto w-full" role="img" aria-label="Схема окружения ЖК">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" className="stroke-border" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#grid)" />
          {z.factors.map((f) => {
            const p = pos(f);
            const area = f.type === "forest" || f.type === "park" || f.type === "water";
            return area ? (
              <circle
                key={"a" + f.id}
                cx={p.x}
                cy={p.y}
                r={f.type === "water" ? 26 : 38}
                className={f.type === "water" ? "fill-[hsl(207_60%_80%)]" : "fill-grade-a/25"}
              />
            ) : null;
          })}
          {z.factors
            .filter((f) => f.type === "highway" || f.type === "rail")
            .map((f) => {
              const p = pos(f);
              const a = (f.angle * Math.PI) / 180;
              const dx = Math.cos(a) * 220;
              const dy = Math.sin(a) * 220;
              return (
                <line
                  key={"l" + f.id}
                  x1={p.x - dx}
                  y1={p.y - dy}
                  x2={p.x + dx}
                  y2={p.y + dy}
                  className="stroke-grade-d/50"
                  strokeWidth={f.type === "rail" ? 3 : 6}
                  strokeDasharray={f.type === "rail" ? "8 5" : undefined}
                  strokeLinecap="round"
                />
              );
            })}
          <circle cx={C} cy={C} r={R1000} fill="none" className="stroke-primary/40" strokeWidth="1.2" strokeDasharray="4 4" />
          <circle cx={C} cy={C} r={R300} className="fill-primary/10 stroke-primary/60" strokeWidth="1.2" />
          <text x={C + R300 + 4} y={C - 4} className="fill-primary text-[10px] font-semibold">300 м</text>
          <text x={C + R1000 * 0.72} y={C - R1000 * 0.72 - 4} className="fill-primary text-[10px] font-semibold">1 км</text>
          <rect x={C - 9} y={C - 9} width="18" height="18" rx="3" className="fill-primary" />
          <text x="388" y="22" textAnchor="end" className="fill-muted-foreground text-[11px] font-semibold">С ↑</text>
        </svg>
        {z.factors.map((f) => {
          const p = pos(f);
          return (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 400) * 100}%` }}
              aria-label={f.title}
              className={cn(
                "absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-md transition-transform hover:scale-110",
                f.kind === "plus" ? "bg-grade-a" : "bg-grade-d",
                active === f.id && "scale-125 ring-4 ring-card",
              )}
            >
              <Icon name={iconFor[f.type]} size={15} />
            </button>
          );
        })}
        <p className="absolute bottom-2 left-3 text-[10px] text-muted-foreground">Схема по данным © OpenStreetMap contributors</p>
      </div>

      <div>
        {cur && (
          <div key={cur.id} className="animate-fade-in rounded-xl bg-card p-5 shadow-line">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-white",
                cur.kind === "plus" ? "bg-grade-a" : "bg-grade-d",
              )}
            >
              {cur.kind === "plus" ? "Плюс" : "Минус"}
            </span>
            <h3 className="mt-3 text-xl font-semibold">{cur.title}</h3>
            <p className="num mt-1 text-sm text-muted-foreground">{cur.distance.toLocaleString("ru-RU")} м от дома</p>
            <p className="mt-3 leading-relaxed">{cur.note}</p>
          </div>
        )}
        <ul className="mt-4 space-y-1.5">
          {z.factors.map((f) => (
            <li key={f.id}>
              <button
                onClick={() => setActive(f.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  active === f.id ? "bg-secondary" : "hover:bg-muted",
                )}
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", f.kind === "plus" ? "bg-grade-a" : "bg-grade-d")} />
                <span className="flex-1 font-medium">{f.title}</span>
                <span className="num text-muted-foreground">{f.distance.toLocaleString("ru-RU")} м</span>
              </button>
            </li>
          ))}
        </ul>
        {!z.ecoFull && (
          <p className="mt-4 rounded-lg bg-secondary px-3 py-2.5 text-sm text-primary">
            По данным кадастра: детальной эко-информации по этому ЖК пока мало, показываем то, что подтверждено.
          </p>
        )}
      </div>
    </div>
  );
};

export default SurroundingsMap;
