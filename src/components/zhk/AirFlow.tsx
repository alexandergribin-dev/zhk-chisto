import { useState } from "react";
import type { Factor, Zhk } from "@/data/zhk";
import { cn } from "@/lib/utils";

const C = 200;
const ENV: Factor["type"][] = ["forest", "park", "water", "highway", "rail", "industry"];
const KIND_LABEL: Record<string, string> = {
  forest: "Лес",
  park: "Парк",
  water: "Вода",
  highway: "Трасса",
  rail: "Ж/д",
  industry: "Промзона",
};
const WATER = "hsl(200 55% 62%)";

const dirOf = (angle: number) => Math.round((((angle % 360) + 360) % 360) / 45) % 8;
const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const at = (deg: number, r: number) => ({ x: C + r * Math.cos(rad(deg)), y: C + r * Math.sin(rad(deg)) });
const fmtDist = (m: number) => (m >= 1000 ? `${(m / 1000).toLocaleString("ru-RU")} км` : `${m} м`);

const ObjectShape = ({ f }: { f: Factor }) => {
  switch (f.type) {
    case "forest":
    case "park": {
      const big = f.type === "forest";
      const pts = big
        ? [[-18, -8, 13], [2, -14, 14], [18, -4, 12], [-8, 10, 12], [12, 12, 11]]
        : [[-10, -4, 10], [8, -6, 10], [0, 9, 9]];
      return (
        <g>
          {pts.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} className="fill-grade-a" opacity={0.75 + (i % 2) * 0.25} />
          ))}
        </g>
      );
    }
    case "water":
      return (
        <g>
          <ellipse rx="30" ry="15" fill={WATER} />
          <path d="M-14 -2 q5 -4 10 0 t10 0 M-6 6 q5 -4 10 0 t10 0" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
        </g>
      );
    case "highway":
      return (
        <g transform={`rotate(${f.angle})`}>
          <rect x="-60" y="-9" width="120" height="18" className="fill-foreground/80" />
          <line x1="-60" y1="0" x2="60" y2="0" stroke="white" strokeWidth="1.5" strokeDasharray="7 6" />
          <rect x="-34" y="-7" width="11" height="5" rx="1.5" className="fill-grade-c" />
          <rect x="20" y="2" width="11" height="5" rx="1.5" fill="white" />
        </g>
      );
    case "rail":
      return (
        <g transform={`rotate(${f.angle})`}>
          <rect x="-60" y="-7" width="120" height="14" className="fill-foreground/15" />
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={i} x1={-56 + i * 9.4} y1="-7" x2={-56 + i * 9.4} y2="7" className="stroke-foreground/50" strokeWidth="2" />
          ))}
          <line x1="-60" y1="-3.5" x2="60" y2="-3.5" className="stroke-foreground/80" strokeWidth="1.5" />
          <line x1="-60" y1="3.5" x2="60" y2="3.5" className="stroke-foreground/80" strokeWidth="1.5" />
        </g>
      );
    case "industry":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={8 + i * 2} cy={-22 - i * 5} r={4 + i * 1.5} className="smoke-up fill-foreground/25" style={{ animationDelay: `${i * 0.7}s` }} />
          ))}
          <path d="M-20 14 V-2 l10 -6 v6 l10 -6 v6 l10 -6 V-20 h7 V14 Z" className="fill-foreground/75" />
          <rect x="-15" y="3" width="5" height="5" className="fill-grade-c" />
          <rect x="-4" y="3" width="5" height="5" className="fill-grade-c" />
        </g>
      );
    default:
      return null;
  }
};

const AirFlow = ({ z }: { z: Zhk }) => {
  const objects = z.factors.filter((f) => ENV.includes(f.type));
  const [hover, setHover] = useState<string | null>(null);

  const placed = objects.map((f) => {
    const r = 105 + (Math.min(f.distance, 1500) / 1500) * 55;
    return { f, r, p: at(f.angle, r), share: z.wind[dirOf(f.angle)] };
  });
  const sorted = [...placed].sort((a, b) => b.share - a.share);
  const top = sorted[0];

  return (
    <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
      <div className="overflow-hidden rounded-[18px] bg-secondary/60">
        <svg viewBox="0 0 400 400" className="block h-auto w-full" role="img" aria-label="Откуда к окнам приходит воздух">
          <circle cx={C} cy={C} r="170" fill="none" className="stroke-primary/10" strokeDasharray="3 5" />
          <circle cx={C} cy={C} r="95" fill="none" className="stroke-primary/10" strokeDasharray="3 5" />

          {placed.map(({ f, r, share }) => {
            const plus = f.kind === "plus";
            const from = r - 26;
            const to = 40;
            const w = 2.5 + share / 4;
            const dim = hover && hover !== f.id;
            return (
              <g key={`flow-${f.id}`} className={cn("transition-opacity", dim && "opacity-15")}>
                {[-9, 0, 9].map((off, k) => {
                  const ox = off * Math.cos(rad(f.angle + 90));
                  const oy = off * Math.sin(rad(f.angle + 90));
                  const a = at(f.angle, from - (k === 1 ? 0 : 8));
                  const b = at(f.angle, to + (k === 1 ? 0 : 6));
                  return (
                    <line
                      key={k}
                      x1={a.x + ox}
                      y1={a.y + oy}
                      x2={b.x + ox}
                      y2={b.y + oy}
                      strokeWidth={k === 1 ? w : w * 0.7}
                      strokeLinecap="round"
                      className={cn("wind-flow", plus ? "stroke-grade-a" : "stroke-grade-d")}
                      style={{ animationDelay: `${k * 0.2}s`, animationDuration: `${Math.max(0.6, 1.8 - share / 20)}s` }}
                    />
                  );
                })}
              </g>
            );
          })}

          <g>
            <rect x={C - 22} y={C - 30} width="44" height="60" rx="4" className="fill-primary" />
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2].map((col) => (
                <rect key={`${row}${col}`} x={C - 15 + col * 11} y={C - 23 + row * 13} width="8" height="8" rx="1" className="fill-white/85" />
              )),
            )}
          </g>

          {placed.map(({ f, p, share }) => {
            const dim = hover && hover !== f.id;
            const lp = at(f.angle, Math.min(placed.find((x) => x.f.id === f.id)!.r + 34, 190));
            const lx = Math.max(40, Math.min(360, lp.x));
            const ly = Math.max(14, Math.min(388, lp.y));
            return (
              <g
                key={f.id}
                className={cn("cursor-pointer transition-opacity", dim && "opacity-40")}
                onMouseEnter={() => setHover(f.id)}
                onMouseLeave={() => setHover(null)}
              >
                <g transform={`translate(${p.x} ${p.y})`}>
                  <ObjectShape f={f} />
                </g>
                <g transform={`translate(${lx} ${ly})`}>
                  <rect x="-36" y="-9" width="72" height="18" rx="9" className="fill-card" style={{ filter: "drop-shadow(0 1px 2px rgb(0 0 0 / .12))" }} />
                  <text y="3.5" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">
                    {KIND_LABEL[f.type]} · {share}%
                  </text>
                </g>
              </g>
            );
          })}

          <g transform={`translate(${C} ${C + 44})`}>
            <rect x="-26" y="-8" width="52" height="16" rx="8" className="fill-primary" />
            <text y="3.5" textAnchor="middle" className="fill-white text-[9px] font-semibold">
              Ваш дом
            </text>
          </g>
          
        </svg>
      </div>

      <div>
        {top && (
          <p className="text-lg leading-relaxed">
            Чаще всего к окнам приходит воздух{" "}
            <b className={top.f.kind === "plus" ? "text-primary" : "text-grade-d"}>
              {top.f.kind === "plus" ? "от" : "со стороны"} «{top.f.title}»
            </b>{" "}
            — <span className="num">{top.share}%</span> времени.
          </p>
        )}
        <ul className="mt-5 space-y-2">
          {sorted.map(({ f, share }) => (
            <li
              key={f.id}
              onMouseEnter={() => setHover(f.id)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "rounded-lg px-3 py-2.5 transition-colors",
                hover === f.id ? "bg-secondary" : "bg-muted",
              )}
            >
              <div className="flex items-center gap-3 text-sm">
                <i className={cn("h-2.5 w-2.5 shrink-0 rounded-full", f.kind === "plus" ? "bg-grade-a" : "bg-grade-d")} />
                <span className="min-w-0 flex-1 truncate">
                  <b className="font-semibold">{f.title}</b>
                  <span className="text-muted-foreground"> · {fmtDist(f.distance)}</span>
                </span>
                <span className={cn("num shrink-0 font-semibold", f.kind === "plus" ? "text-primary" : "text-grade-d")}>{share}%</span>
              </div>
              <div className="ml-[22px] mt-1.5 h-1.5 overflow-hidden rounded-full bg-card">
                <i
                  className={cn("block h-full rounded-full", f.kind === "plus" ? "bg-grade-a" : "bg-grade-d")}
                  style={{ width: `${(share / Math.max(...z.wind)) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Процент — доля времени в году, когда ветер дует со стороны объекта. Чем толще поток на схеме, тем чаще.
        </p>
      </div>
    </div>
  );
};

export default AirFlow;
