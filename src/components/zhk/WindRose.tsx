import type { Zhk } from "@/data/zhk";

const DIRS = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
const C = 140;
const MAX_R = 100;

const WindRose = ({ z }: { z: Zhk }) => {
  const max = Math.max(...z.wind);
  const sources = z.factors.filter((f) => f.kind === "minus" && f.distance <= 1500);
  const sourceDirs = new Set(sources.map((s) => Math.round(((s.angle % 360) / 45)) % 8));

  const petal = (i: number) => {
    const r = (z.wind[i] / max) * MAX_R;
    const a = ((i * 45 - 90) * Math.PI) / 180;
    const w = (18 * Math.PI) / 180;
    const p1 = [C + r * Math.cos(a - w), C + r * Math.sin(a - w)];
    const p2 = [C + r * Math.cos(a + w), C + r * Math.sin(a + w)];
    return `M${C} ${C} L${p1[0]} ${p1[1]} A${r} ${r} 0 0 1 ${p2[0]} ${p2[1]} Z`;
  };

  const dominant = z.wind.indexOf(max);
  const riskyWind = [...sourceDirs].reduce((s, d) => s + z.wind[d], 0);

  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
      <svg viewBox="0 0 280 280" className="mx-auto block h-auto w-full max-w-[320px]" role="img" aria-label="Роза ветров">
        {[0.33, 0.66, 1].map((k) => (
          <circle key={k} cx={C} cy={C} r={MAX_R * k} fill="none" className="stroke-border" strokeWidth="1.2" />
        ))}
        {DIRS.map((_, i) => {
          const a = ((i * 45 - 90) * Math.PI) / 180;
          return <line key={i} x1={C} y1={C} x2={C + (MAX_R + 6) * Math.cos(a)} y2={C + (MAX_R + 6) * Math.sin(a)} className="stroke-border" />;
        })}
        {DIRS.map((_, i) => (
          <path key={i} d={petal(i)} className={sourceDirs.has(i) ? "fill-grade-d/70" : "fill-primary/70"} />
        ))}
        {DIRS.map((d, i) => {
          const a = ((i * 45 - 90) * Math.PI) / 180;
          return (
            <text
              key={d}
              x={C + (MAX_R + 22) * Math.cos(a)}
              y={C + (MAX_R + 22) * Math.sin(a) + 4}
              textAnchor="middle"
              className="fill-foreground text-[12px] font-semibold"
            >
              {d}
            </text>
          );
        })}
        <rect x={C - 6} y={C - 6} width="12" height="12" rx="2" className="fill-foreground" />
      </svg>
      <div>
        <p className="text-lg leading-relaxed">
          Чаще всего ветер дует с направления <b className="text-primary">{DIRS[dominant]}</b> — <span className="num">{max}%</span> времени.
        </p>
        {sources.length ? (
          <p className="mt-3 leading-relaxed text-muted-foreground">
            С тех сторон, где есть трассы или промзоны (красные лепестки), ветер дует{" "}
            <b className="num text-foreground">{riskyWind}%</b> времени.{" "}
            {riskyWind <= 15 ? "Это редко — большую часть года воздух идёт с чистых сторон." : "Это заметная доля — стоит приехать и проверить запах и шум в разную погоду."}
          </p>
        ) : (
          <p className="mt-3 leading-relaxed text-muted-foreground">Источников загрязнения в радиусе 1,5 км нет — ветер с любой стороны приносит чистый воздух.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-primary/70" /> Чистое направление</span>
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-grade-d/70" /> Есть источник загрязнения</span>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Данные реанализа за 5 лет, точность на уровне района.</p>
      </div>
    </div>
  );
};

export default WindRose;
