import { useState } from "react";
import type { Zhk } from "@/data/zhk";
import { cn } from "@/lib/utils";

const DIRS = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
const DIRS_FULL = ["севера", "северо-востока", "востока", "юго-востока", "юга", "юго-запада", "запада", "северо-запада"];
const C = 160;
const MAX_R = 112;
const SRC_LABEL: Record<string, string> = { highway: "Трасса", rail: "Ж/д", industry: "Промзона" };

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const pt = (deg: number, r: number) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const;

const WindRose = ({ z }: { z: Zhk }) => {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...z.wind);
  const scale = Math.ceil(max / 4) * 4;
  const sources = z.factors.filter((f) => f.kind === "minus" && f.distance <= 1500);
  const dirOf = (angle: number) => Math.round((((angle % 360) + 360) % 360) / 45) % 8;
  const sourceDirs = new Set(sources.map((s) => dirOf(s.angle)));
  const dominant = z.wind.indexOf(max);
  const riskyWind = [...sourceDirs].reduce((s, d) => s + z.wind[d], 0);
  const cleanWind = 100 - riskyWind;
  const active = hover ?? dominant;
  const rings = [0.25, 0.5, 0.75, 1];

  const petal = (i: number) => {
    const r = Math.max((z.wind[i] / scale) * MAX_R, 8);
    const [x1, y1] = pt(i * 45 - 19, r);
    const [x2, y2] = pt(i * 45 + 19, r);
    return `M${C} ${C} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };

  const radar = z.wind.map((v, i) => pt(i * 45, (v / scale) * MAX_R).join(",")).join(" ");

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,360px)_1fr]">
      <div className="relative mx-auto w-full max-w-[360px]">
        <svg viewBox="0 0 320 320" className="block h-auto w-full" role="img" aria-label="Роза ветров">
          <defs>
            <radialGradient id="wr-clean" cx={C} cy={C} r={MAX_R} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
              <stop offset="1" stopColor="hsl(var(--grade-a))" stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="wr-risk" cx={C} cy={C} r={MAX_R} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="hsl(var(--grade-d))" stopOpacity="0.95" />
              <stop offset="1" stopColor="hsl(var(--grade-c))" stopOpacity="0.65" />
            </radialGradient>
            <radialGradient id="wr-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="hsl(var(--card))" />
              <stop offset="1" stopColor="hsl(var(--secondary))" />
            </radialGradient>
          </defs>

          <circle cx={C} cy={C} r={MAX_R + 30} fill="url(#wr-bg)" className="stroke-border" />

          {Array.from({ length: 72 }).map((_, k) => {
            const long = k % 9 === 0;
            const [x1, y1] = pt(k * 5, MAX_R + 30);
            const [x2, y2] = pt(k * 5, MAX_R + (long ? 21 : 25));
            return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-foreground/25" strokeWidth={long ? 1.4 : 0.8} />;
          })}

          {rings.map((k) => (
            <circle key={k} cx={C} cy={C} r={MAX_R * k} fill="none" className="stroke-foreground/15" strokeDasharray={k === 1 ? undefined : "3 4"} />
          ))}
          {DIRS.map((_, i) => {
            const [x, y] = pt(i * 45, MAX_R);
            return <line key={i} x1={C} y1={C} x2={x} y2={y} className="stroke-foreground/10" />;
          })}

          {[...sourceDirs].map((d) => {
            const [x1, y1] = pt(d * 45 - 22.5, MAX_R);
            const [x2, y2] = pt(d * 45 + 22.5, MAX_R);
            return <path key={d} d={`M${C} ${C} L${x1} ${y1} A${MAX_R} ${MAX_R} 0 0 1 ${x2} ${y2} Z`} className="fill-grade-d/[0.08]" />;
          })}

          {DIRS.map((_, i) => (
            <path
              key={i}
              d={petal(i)}
              fill={sourceDirs.has(i) ? "url(#wr-risk)" : "url(#wr-clean)"}
              stroke="white"
              strokeWidth="1.5"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setHover(i)}
              className={cn("rose-petal cursor-pointer transition-opacity duration-200", hover !== null && hover !== i && "opacity-35")}
              style={{ transformOrigin: `${C}px ${C}px`, animationDelay: `${i * 60}ms` }}
            />
          ))}

          <polygon points={radar} fill="none" className="pointer-events-none stroke-foreground/45" strokeWidth="1.2" strokeDasharray="2 3" />

          {rings.map((k) => (
            <text key={k} x={C + 4} y={C - MAX_R * k + 11} className="pointer-events-none fill-muted-foreground text-[9px] font-medium">
              {Math.round(scale * k)}%
            </text>
          ))}

          {sources.map((s) => {
            const [x, y] = pt(s.angle, MAX_R - 4);
            return <circle key={s.id} cx={x} cy={y} r="5" className="pointer-events-none fill-grade-d stroke-white" strokeWidth="1.5" />;
          })}

          {DIRS.map((d, i) => {
            const [x, y] = pt(i * 45, MAX_R + 12);
            const on = i === active;
            return (
              <g key={d} className="cursor-pointer" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <circle cx={x} cy={y} r="11.5" className={on ? "fill-primary" : "fill-card stroke-border"} />
                <text x={x} y={y + 3.8} textAnchor="middle" className={cn("text-[10.5px] font-bold", on ? "fill-white" : "fill-foreground")}>
                  {d}
                </text>
              </g>
            );
          })}

          <circle cx={C} cy={C} r="16" className="fill-card stroke-border" />
          <path d={`M${C} ${C - 8} l6 7 h-3.5 v8 h-5 v-8 h-3.5 Z`} className="fill-primary" />
        </svg>

        <div className="mx-auto mt-3 flex w-fit items-baseline gap-2 rounded-full bg-muted px-4 py-1.5">
          <p className="text-sm text-muted-foreground">Ветер с {DIRS_FULL[active]}</p>
          <p className={cn("num text-base font-semibold", sourceDirs.has(active) ? "text-grade-d" : "text-primary")}>{z.wind[active]}% времени</p>
        </div>
      </div>

      <div>
        <p className="text-lg leading-relaxed">
          Чаще всего ветер дует с <b className="text-primary">{DIRS_FULL[dominant]}</b> — <span className="num">{max}%</span> времени.
        </p>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between gap-3 text-sm">
            <span className="font-medium text-primary">Чистый воздух · {cleanWind}%</span>
            {riskyWind > 0 && <span className="font-medium text-grade-d">От источников · {riskyWind}%</span>}
          </div>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
            <i className="block h-full bg-primary" style={{ width: `${cleanWind}%` }} />
            <i className="block h-full bg-grade-d" style={{ width: `${riskyWind}%` }} />
          </div>
        </div>

        {sources.length ? (
          <>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {riskyWind <= 15
                ? "Это редко — большую часть года воздух идёт с чистых сторон."
                : "Это заметная доля — стоит приехать и проверить запах и шум в разную погоду."}
            </p>
            <ul className="mt-4 space-y-2">
              {sources.map((s) => {
                const d = dirOf(s.angle);
                return (
                  <li
                    key={s.id}
                    onMouseEnter={() => setHover(d)}
                    onMouseLeave={() => setHover(null)}
                    className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    <i className="h-2.5 w-2.5 shrink-0 rounded-full bg-grade-d" />
                    <span className="min-w-0 flex-1 truncate">
                      <b className="font-semibold">{SRC_LABEL[s.type] ?? "Источник"}</b> · {s.title}
                    </span>
                    <span className="num shrink-0 text-muted-foreground">
                      {DIRS[d]} · {s.distance >= 1000 ? `${(s.distance / 1000).toLocaleString("ru-RU")} км` : `${s.distance} м`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Источников загрязнения в радиусе 1,5 км нет — ветер с любой стороны приносит чистый воздух.
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-primary" /> Чистое направление</span>
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-grade-d" /> Есть источник загрязнения</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Наведите на лепесток, чтобы увидеть долю ветра. Данные реанализа за 5 лет, точность на уровне района.</p>
      </div>
    </div>
  );
};

export default WindRose;
