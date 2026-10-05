import { Link } from "react-router-dom";
import GradeBadge from "@/components/GradeBadge";
import Icon from "@/components/ui/icon";
import type { Grade } from "@/data/zhk";

const Tree = ({ x, y, r, o = 1 }: { x: number; y: number; r: number; o?: number }) => (
  <circle cx={x} cy={y} r={r} className="fill-grade-a" opacity={o} />
);

const Scene = ({ dirty }: { dirty?: boolean }) => {
  const rows = [52, 72, 92, 112];
  return (
    <svg viewBox="0 0 280 160" className="block h-auto w-full" aria-hidden="true">
      <rect width="280" height="160" className="fill-secondary/60" />

      <g>
        <Tree x={22} y={30} r={13} o={0.85} />
        <Tree x={46} y={48} r={15} />
        <Tree x={20} y={66} r={14} o={0.9} />
        <Tree x={44} y={88} r={13} o={0.8} />
        <Tree x={22} y={104} r={15} />
        <Tree x={46} y={122} r={12} o={0.85} />
      </g>

      <rect x="236" y="0" width="30" height="160" className="fill-foreground/80" />
      <line x1="251" y1="0" x2="251" y2="160" stroke="white" strokeWidth="1.5" strokeDasharray="8 7" />
      <rect x="240" y="18" width="8" height="14" rx="2" className="fill-grade-c" />
      <rect x="254" y="70" width="8" height="14" rx="2" className="fill-white" />
      <rect x="240" y="118" width="8" height="14" rx="2" className="fill-white/70" />

      {dirty &&
        [0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={226}
            cy={52 + (i % 4) * 20}
            r={7 + (i % 3) * 2}
            className="smoke fill-foreground/25"
            style={{ animationDelay: `${i * 0.55}s` }}
          />
        ))}

      {rows.map((y, i) =>
        dirty ? (
          <path
            key={y}
            d={`M226 ${y} L168 ${y}`}
            className="wind-flow stroke-grade-d"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ) : (
          <path
            key={y}
            d={`M64 ${y} L112 ${y}`}
            className="wind-flow stroke-grade-a"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ),
      )}
      {dirty ? (
        <path d="M172 76 l-9 6 l9 6" fill="none" className="stroke-grade-d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M108 76 l9 6 l-9 6" fill="none" className="stroke-grade-a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}

      <g>
        <rect x="122" y="44" width="36" height="78" rx="3" className="fill-primary" />
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={128 + c * 9}
              y={52 + r * 13}
              width="6"
              height="8"
              rx="1"
              className={dirty && c === 2 ? "fill-grade-d/70" : !dirty && c === 0 ? "fill-grade-a" : "fill-white/85"}
            />
          )),
        )}
      </g>

      {[
        { x: 34, t: "Лес", w: 26 },
        { x: 140, t: "Ваш дом", w: 46 },
        { x: 251, t: "Трасса", w: 38 },
      ].map((l) => (
        <g key={l.t}>
          <rect x={l.x - l.w / 2} y="140" width={l.w} height="15" rx="7.5" className="fill-card" />
          <text x={l.x} y="150.5" textAnchor="middle" className="fill-foreground text-[9px] font-semibold">
            {l.t}
          </text>
        </g>
      ))}
    </svg>
  );
};

const cases: { grade: Grade; dirty?: boolean; title: string; share: string; note: string }[] = [
  { grade: "A", title: "Ветер с леса", share: "23%", note: "К окнам идёт лесной воздух" },
  { grade: "C", dirty: true, title: "Ветер с трассы", share: "31%", note: "Выхлоп и шум доходят до окон" },
];

const WindPromo = () => (
  <section className="dot-grid relative overflow-hidden rounded-[22px] bg-primary p-5 text-primary-foreground md:p-8 lg:p-10">
    <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.5fr] lg:gap-10">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/85">
          <Icon name="Wind" size={13} />
          Новое · роза ветров
        </span>
        <h2 className="mt-4 text-[28px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[36px]">
          Трасса в 500 метрах — а воздух разный
        </h2>
        <p className="mt-4 text-[1rem] leading-relaxed text-white/80">
          Само расстояние до трассы мало что говорит. Важно, откуда дует ветер. Для каждого ЖК мы считаем, сколько дней в году ветер несёт к окнам воздух от трасс и промзон.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            to="/zhk/promenad#veter"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.94rem] font-semibold text-primary transition-transform hover:-translate-y-px"
          >
            Посмотреть на примере
            <Icon name="ArrowRight" size={15} />
          </Link>
          <Link
            to="/kak-my-proveryaem#rosa"
            className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-[0.94rem] font-semibold text-white hover:border-white"
          >
            Как читать
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {cases.map((c) => (
          <div key={c.grade} className="overflow-hidden rounded-[14px] bg-card text-foreground">
            <Scene dirty={c.dirty} />
            <div className="flex items-center gap-3 p-3.5">
              <GradeBadge grade={c.grade} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.95rem] font-semibold">
                  {c.title} · <span className={c.dirty ? "num text-grade-d" : "num text-primary"}>{c.share} времени</span>
                </p>
                <p className="text-[0.84rem] text-muted-foreground">{c.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WindPromo;
