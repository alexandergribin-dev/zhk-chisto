import { Link } from "react-router-dom";
import { collections } from "@/data/zhk";

const WIND = [9, 6, 7, 10, 12, 18, 23, 15];
const RISK = new Set([5]);
const RC = 60;
const RMAX = 42;
const rp = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [RC + r * Math.cos(a), RC + r * Math.sin(a)] as const;
};
const sector = (deg: number, r: number, w: number) => {
  const [x1, y1] = rp(deg - w, r);
  const [x2, y2] = rp(deg + w, r);
  return `M${RC} ${RC} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`;
};

const Rose = () => (
  <svg viewBox="0 0 120 120" width="96" height="96" aria-hidden="true" className="overflow-visible">
    <defs>
      <radialGradient id="mr-clean" cx={RC} cy={RC} r={RMAX} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="hsl(var(--primary))" />
        <stop offset="1" stopColor="hsl(var(--grade-a))" stopOpacity="0.7" />
      </radialGradient>
      <radialGradient id="mr-risk" cx={RC} cy={RC} r={RMAX} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="hsl(var(--grade-d))" />
        <stop offset="1" stopColor="hsl(var(--grade-c))" stopOpacity="0.75" />
      </radialGradient>
      <radialGradient id="mr-bg" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="hsl(var(--card))" />
        <stop offset="1" stopColor="hsl(var(--secondary))" />
      </radialGradient>
    </defs>
    <circle cx={RC} cy={RC} r="54" fill="url(#mr-bg)" className="stroke-border" />
    {Array.from({ length: 36 }).map((_, k) => {
      const [x1, y1] = rp(k * 10, 54);
      const [x2, y2] = rp(k * 10, k % 9 === 0 ? 47 : 50);
      return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-foreground/25" strokeWidth={k % 9 === 0 ? 1.3 : 0.7} />;
    })}
    {[RMAX / 2, RMAX].map((r) => (
      <circle key={r} cx={RC} cy={RC} r={r} fill="none" className="stroke-foreground/15" strokeDasharray="2 3" />
    ))}
    {[...RISK].map((i) => (
      <path key={i} d={sector(i * 45, RMAX, 22.5)} className="fill-grade-d/10" />
    ))}
    {WIND.map((v, i) => (
      <path
        key={i}
        d={sector(i * 45, Math.max((v / 24) * RMAX, 6), 18)}
        fill={RISK.has(i) ? "url(#mr-risk)" : "url(#mr-clean)"}
        stroke="white"
        strokeWidth="1"
      />
    ))}
    <polygon
      points={WIND.map((v, i) => rp(i * 45, (v / 24) * RMAX).join(",")).join(" ")}
      fill="none"
      className="stroke-foreground/40"
      strokeWidth="0.8"
      strokeDasharray="1.5 2"
    />
    {(() => {
      const [x, y] = rp(225, RMAX + 1);
      return <circle cx={x} cy={y} r="3" className="fill-grade-d stroke-white" strokeWidth="1" />;
    })()}
    <circle cx={RC} cy={RC} r="7" className="fill-card stroke-border" />
    <path d={`M${RC} ${RC - 4} l3 4 h-2 v4 h-2 v-4 h-2 Z`} className="fill-primary" />
    <text x={RC} y="17" textAnchor="middle" className="fill-foreground text-[8px] font-bold">
      С
    </text>
  </svg>
);

const labels: Record<string, string> = {
  clean12: "самых чистых ЖК",
  forest: "у леса",
  west: "с окнами на запад",
  reliable: "надёжных застройщика",
};

const NewsAndStats = () => (
  <div className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-10 lg:px-[84px]">
    <aside className="mx-auto mt-12 flex max-w-[704px] animate-fade-in overflow-hidden rounded-[10px] bg-card shadow-line [animation-delay:240ms] md:mt-16">
      <div className="hidden w-[150px] shrink-0 place-items-center border-r border-border bg-muted py-3 sm:grid">
        <Rose />
      </div>
      <div className="self-center px-5 py-4 md:px-6">
        <p className="text-[0.96rem] font-semibold">Новое в Чисто: роза ветров для каждого ЖК</p>
        <p className="mt-1 text-[0.88rem] leading-[1.45]">
          Видно, принесёт ли ветер к окнам воздух от трассы или промзоны.{" "}
          <Link to="/kak-my-proveryaem#rosa" className="border-b border-muted-foreground font-medium hover:text-primary">
            Как читать
          </Link>
        </p>
      </div>
    </aside>

    <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-4">
      {collections.map((c, i) => (
        <Link
          to={`/novostroyki?podborka=${c.id}`}
          key={c.id}
          style={{ animationDelay: `${300 + i * 80}ms` }}
          className="group animate-fade-in rounded-xl border-l-[3px] border-primary bg-card p-4 shadow-line transition-shadow hover:shadow-soft md:p-5"
        >
          <p className="num text-4xl font-semibold tracking-tight text-primary md:text-5xl">{c.count}</p>
          <p className="mt-1 text-[0.95rem] leading-snug text-foreground">{labels[c.id]}</p>
        </Link>
      ))}
    </div>
  </div>
);

export default NewsAndStats;