import { Link } from "react-router-dom";
import GradeBadge from "@/components/GradeBadge";
import Icon from "@/components/ui/icon";
import type { Grade } from "@/data/zhk";

const C = {
  pineDark: "#1F5E3D",
  pine: "#2E7A50",
  leaf: "#3F9D5A",
  leafLight: "#6DBA83",
  trunk: "#6B4F3A",
  facade: "hsl(var(--primary))",
  facadeSide: "#0A3A37",
  glass: "#E8F4EF",
  asphalt: "#2F3B3B",
  dirt: "#C9B8A4",
};

const Pine = ({
  x,
  base,
  h,
  back,
}: {
  x: number;
  base: number;
  h: number;
  back?: boolean;
}) => {
  const w = h * 0.52;
  const fill = back ? C.pine : C.pineDark;
  return (
    <g opacity={back ? 0.55 : 1}>
      <rect
        x={x - 1.2}
        y={base - h * 0.16}
        width={2.4}
        height={h * 0.16}
        fill={C.trunk}
      />
      <path
        d={`M${x} ${base - h} L${x + w * 0.32} ${base - h * 0.62} L${x - w * 0.32} ${base - h * 0.62}Z`}
        fill={fill}
      />
      <path
        d={`M${x} ${base - h * 0.8} L${x + w * 0.42} ${base - h * 0.38} L${x - w * 0.42} ${base - h * 0.38}Z`}
        fill={fill}
      />
      <path
        d={`M${x} ${base - h * 0.58} L${x + w * 0.5} ${base - h * 0.14} L${x - w * 0.5} ${base - h * 0.14}Z`}
        fill={fill}
      />
      <path
        d={`M${x} ${base - h} L${x + w * 0.5} ${base - h * 0.14} L${x} ${base - h * 0.14}Z`}
        fill="#000"
        opacity={0.12}
      />
    </g>
  );
};

const Oak = ({
  x,
  base,
  h,
  back,
}: {
  x: number;
  base: number;
  h: number;
  back?: boolean;
}) => {
  const r = h * 0.3;
  const cy = base - h + r * 1.1;
  return (
    <g opacity={back ? 0.55 : 1}>
      <rect
        x={x - 1.4}
        y={cy}
        width={2.8}
        height={base - cy}
        rx={1}
        fill={C.trunk}
      />
      <circle cx={x - r * 0.55} cy={cy + r * 0.25} r={r * 0.8} fill={C.leaf} />
      <circle cx={x + r * 0.55} cy={cy + r * 0.3} r={r * 0.78} fill={C.leaf} />
      <circle cx={x} cy={cy - r * 0.25} r={r} fill={C.leaf} />
      <circle
        cx={x - r * 0.35}
        cy={cy - r * 0.55}
        r={r * 0.42}
        fill={C.leafLight}
        opacity={0.75}
      />
      <path
        d={`M${x} ${cy - r * 1.25} A${r * 1.3} ${r * 1.3} 0 0 1 ${x + r * 1.3} ${cy + r * 0.6} L${x} ${cy + r * 0.6}Z`}
        fill="#000"
        opacity={0.1}
      />
    </g>
  );
};

const Car = ({
  x,
  y,
  color,
  truck,
}: {
  x: number;
  y: number;
  color: string;
  truck?: boolean;
}) =>
  truck ? (
    <g>
      <rect x={x} y={y - 13} width={20} height={11} rx={1.5} fill="#E6E2DA" />
      <path d={`M${x + 20} ${y - 10} h5 l3 4 v4 h-8z`} fill={color} />
      <rect
        x={x + 21}
        y={y - 9}
        width={3.4}
        height={3}
        rx={0.6}
        fill={C.glass}
      />
      <circle cx={x + 5} cy={y - 1.5} r={2.3} fill="#1B2222" />
      <circle cx={x + 14} cy={y - 1.5} r={2.3} fill="#1B2222" />
      <circle cx={x + 24} cy={y - 1.5} r={2.3} fill="#1B2222" />
    </g>
  ) : (
    <g>
      <path
        d={`M${x} ${y - 3} v-3.5 q0 -1.5 1.5 -1.5 h2.5 l3 -3.5 h6 l3 3.5 h1.5 q1.5 0 1.5 1.5 v3.5z`}
        fill={color}
      />
      <path
        d={`M${x + 5} ${y - 8.6} l2.3 -2.6 h2.6 v2.6z M${x + 11} ${y - 8.6} v-2.6 h2 l2.2 2.6z`}
        fill={C.glass}
      />
      <circle cx={x + 4.5} cy={y - 2} r={2} fill="#1B2222" />
      <circle cx={x + 14.5} cy={y - 2} r={2} fill="#1B2222" />
    </g>
  );

const Scene = ({ dirty }: { dirty?: boolean }) => {
  const uid = dirty ? "wd" : "wc";
  const GROUND = 124;
  const ROAD = 112;
  const streams = dirty
    ? [
        "M226 48 C206 44 192 56 168 50",
        "M226 66 C204 62 190 74 168 68",
        "M226 84 C206 80 192 92 168 86",
        "M226 102 C206 98 190 108 168 104",
      ]
    : [
        "M74 50 C88 44 102 56 114 50",
        "M78 68 C92 62 104 74 114 68",
        "M78 86 C92 80 104 92 114 86",
        "M74 104 C88 98 102 108 114 104",
      ];
  const stream = dirty ? "hsl(var(--grade-d))" : "hsl(var(--grade-a))";

  return (
    <svg
      viewBox="0 0 280 160"
      className="block h-auto w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dirty ? "#E9E4DA" : "#E3F1EA"} />
          <stop offset="1" stopColor={dirty ? "#F4F1EA" : "#F5FAF7"} />
        </linearGradient>
        <linearGradient id={`${uid}-front`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0F4A46" />
          <stop offset="1" stopColor={C.facade} />
        </linearGradient>
        <radialGradient id={`${uid}-haze`} cx="0.85" cy="0.55" r="0.75">
          <stop offset="0" stopColor="#8C7B6A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#8C7B6A" stopOpacity="0" />
        </radialGradient>
        <marker
          id={`${uid}-arr`}
          viewBox="0 0 8 8"
          refX="5"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path
            d="M1 1 L6 4 L1 7"
            fill="none"
            stroke={stream}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      <rect width="280" height="160" fill={`url(#${uid}-sky)`} />
      {dirty && <rect width="280" height="160" fill={`url(#${uid}-haze)`} />}

      <path
        d={`M0 ${GROUND - 14} C40 ${GROUND - 26} 80 ${GROUND - 8} 130 ${GROUND - 16} S220 ${GROUND - 24} 280 ${GROUND - 12} V${GROUND} H0Z`}
        fill={dirty ? "#DCD8CC" : "#D3E8DC"}
      />

      <g>
        <Pine x={14} base={GROUND - 4} h={52} back />
        <Oak x={34} base={GROUND - 4} h={46} back />
        <Pine x={54} base={GROUND - 4} h={58} back />
        <Pine x={70} base={GROUND - 2} h={40} back />
        <Oak x={6} base={GROUND + 2} h={44} />
        <Pine x={24} base={GROUND + 2} h={62} />
        <Oak x={44} base={GROUND + 2} h={50} />
        <Pine x={62} base={GROUND + 2} h={48} />
      </g>

      <rect
        x="0"
        y={GROUND}
        width="280"
        height={160 - GROUND}
        fill={dirty ? "#CFCABD" : "#C4DFCF"}
      />
      <rect
        x="0"
        y={GROUND}
        width="280"
        height="1.5"
        fill="#000"
        opacity="0.06"
      />

      <g>
        <ellipse
          cx="141"
          cy={GROUND + 1}
          rx="30"
          ry="3"
          fill="#000"
          opacity="0.12"
        />
        <path d={`M156 30 L166 34 V${GROUND} H156Z`} fill={C.facadeSide} />
        <rect
          x="120"
          y="30"
          width="36"
          height={GROUND - 30}
          fill={`url(#${uid}-front)`}
        />
        <rect x="118" y="27" width="40" height="4" rx="1" fill={C.facadeSide} />
        <path d="M158 27 L168 31 V35 L158 31Z" fill="#072B29" />
        {Array.from({ length: 7 }).map((_, r) =>
          [0, 1, 2, 3].map((c) => {
            const facing = dirty ? false : c === 0;
            return (
              <rect
                key={`${r}-${c}`}
                x={124 + c * 7.6}
                y={36 + r * 11.6}
                width={5}
                height={7.5}
                rx={0.8}
                fill={facing ? "#BFE6CD" : C.glass}
                opacity={facing ? 1 : 0.9}
              />
            );
          }),
        )}
        {Array.from({ length: 7 }).map((_, r) => (
          <path
            key={`s${r}`}
            d={`M158.5 ${37 + r * 11.6} l5 2 v6.5 l-5 -2z`}
            fill={dirty ? "#D9B9A0" : "#9FC9BD"}
            opacity={dirty ? 0.95 : 0.55}
          />
        ))}
        <rect
          x="133"
          y={GROUND - 9}
          width="10"
          height="9"
          rx="1"
          fill={C.glass}
          opacity="0.95"
        />
        <rect
          x="131"
          y={GROUND - 10.5}
          width="14"
          height="1.8"
          rx="0.9"
          fill={C.facadeSide}
        />
      </g>

      <g>
        <path
          d={`M190 ${GROUND} L204 ${ROAD + 4} H280 V${GROUND}Z`}
          fill={dirty ? "#B8AF9E" : "#B5CFC0"}
        />
        <rect x="202" y={ROAD} width="78" height="5" fill={C.asphalt} />
        <rect x="202" y={ROAD - 0.5} width="78" height="1" fill="#55625F" />
        {[210, 236, 262].map((x) => (
          <g key={x}>
            <rect x={x} y={ROAD - 30} width="1.4" height="30" fill="#7D8A87" />
            <path
              d={`M${x + 0.7} ${ROAD - 30} q0 -3 -6 -3`}
              fill="none"
              stroke="#7D8A87"
              strokeWidth="1.4"
            />
            <rect
              x={x - 8}
              y={ROAD - 33.6}
              width="4"
              height="1.6"
              rx="0.8"
              fill="#F2C94C"
            />
          </g>
        ))}
        <rect x="202" y={ROAD - 6} width="78" height="1" fill="#9AA6A2" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect
            key={i}
            x={204 + i * 8}
            y={ROAD - 6}
            width="1"
            height="6"
            fill="#9AA6A2"
          />
        ))}
        {dirty ? (
          <>
            <Car x={206} y={ROAD} color="#E0A42B" />
            <Car x={228} y={ROAD} color="#C0392B" truck />
            <Car x={262} y={ROAD} color="#F4F4F4" />
          </>
        ) : (
          <>
            <Car x={214} y={ROAD} color="#E0A42B" />
            <Car x={252} y={ROAD} color="#F4F4F4" />
          </>
        )}
      </g>

      {dirty ? (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle
              key={i}
              cx={214 + (i % 3) * 10}
              cy={54 + (i % 4) * 14}
              r={8 + (i % 3) * 2.5}
              fill="#8E8475"
              opacity="0.38"
              className="smoke"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <circle
              key={`e${i}`}
              cx={206 + i * 26}
              cy={ROAD - 6}
              r={3}
              fill="#8E8475"
              opacity="0.5"
              className="smoke-up"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </g>
      ) : (
        <g>
          {[0, 1].map((i) => (
            <circle
              key={i}
              cx={222 + i * 36}
              cy={ROAD - 8}
              r={3.5}
              fill="#9AA6A2"
              opacity="0.45"
              className="smoke-away"
              style={{ animationDelay: `${i * 0.9}s` }}
            />
          ))}
          {[
            { x: 78, y: 58, d: 0 },
            { x: 84, y: 92, d: 1.1 },
            { x: 72, y: 76, d: 2.1 },
          ].map((l, i) => (
            <path
              key={i}
              d={`M${l.x} ${l.y} q3 -3.5 6 0 q-3 3.5 -6 0z`}
              fill={C.leafLight}
              className="leaf-fly"
              style={{ animationDelay: `${l.d}s` }}
            />
          ))}
        </g>
      )}

      {streams.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={stream}
          strokeWidth="2.2"
          strokeLinecap="round"
          className="wind-stream"
          markerEnd={`url(#${uid}-arr)`}
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}

      <g transform={dirty ? "translate(218 10)" : "translate(10 10)"}>
        <rect width="52" height="16" rx="8" fill="#fff" opacity="0.92" />
        <path
          d={dirty ? "M19 8 H7 M10.5 4.8 L7 8 L10.5 11.2" : "M7 8 H19 M15.5 4.8 L19 8 L15.5 11.2"}
          fill="none"
          stroke={stream}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="23" y="10.8" className="text-[7.5px] font-semibold" fill={stream}>
          ветер
        </text>
      </g>

      {[
        { x: 40, t: "Лес", w: 28 },
        { x: 142, t: "Ваш дом", w: 48 },
        { x: 241, t: "Трасса", w: 40 },
      ].map((l) => (
        <g key={l.t}>
          <rect
            x={l.x - l.w / 2}
            y="139"
            width={l.w}
            height="15"
            rx="7.5"
            fill="#fff"
          />
          <text
            x={l.x}
            y="149.5"
            textAnchor="middle"
            className="fill-foreground text-[8.5px] font-semibold"
          >
            {l.t}
          </text>
        </g>
      ))}
    </svg>
  );
};

const cases: {
  grade: Grade;
  dirty?: boolean;
  title: string;
  share: string;
  note: string;
}[] = [
  {
    grade: "A",
    title: "Ветер с леса",
    share: "23%",
    note: "К окнам идёт лесной воздух",
  },
  {
    grade: "C",
    dirty: true,
    title: "Ветер с трассы",
    share: "31%",
    note: "Выхлоп и шум доходят до окон",
  },
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
          Само расстояние до трассы мало что говорит. Важно, откуда дует ветер.
          Для каждого ЖК мы считаем, сколько дней в году ветер несёт к окнам
          воздух от трасс и промзон.
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
          <div
            key={c.grade}
            className="overflow-hidden rounded-[14px] bg-card text-foreground"
          >
            <Scene dirty={c.dirty} />
            <div className="flex items-center gap-3 p-3.5">
              <GradeBadge grade={c.grade} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.95rem] font-semibold">
                  {c.title} ·{" "}
                  <span
                    className={
                      c.dirty ? "num text-grade-d" : "num text-primary"
                    }
                  >
                    {c.share} времени
                  </span>
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
