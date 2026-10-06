import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";
import {
  lineDist,
  loadGeo,
  type LatLng,
  type Rail,
  type Road,
} from "@/components/map/geo";

type Near = { road: number; rail: number; roadName: string | null };

const NoiseStatus = ({
  home,
  className,
}: {
  home: LatLng;
  className?: string;
}) => {
  const [near, setNear] = useState<Near | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([loadGeo<Road[]>("roads"), loadGeo<Rail[]>("rail")]).then(
      ([roads, rails]) => {
        let road = Infinity;
        let roadName: string | null = null;
        for (const r of roads) {
          const d = lineDist(home, r.c);
          if (d < road) {
            road = d;
            roadName = r.n;
          }
        }
        const rail = Math.min(...rails.map((r) => lineDist(home, r.c)));
        if (alive) setNear({ road, rail, roadName });
      },
    );
    return () => {
      alive = false;
    };
  }, [home]);

  if (!near) return null;
  const min = Math.min(near.road, near.rail);
  const level = min <= 100 ? "high" : min <= 300 ? "mid" : "low";
  const src =
    near.road <= near.rail ? (near.roadName ?? "трасса") : "железная дорога";
  const fmt = (m: number) =>
    m < 10000 ? `${Math.round(m / 10) * 10} м` : "> 10 км";

  return (
    <div
      className={cn(
        "rounded-xl bg-card/95 px-3 py-2 text-xs shadow-soft backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 font-semibold">
        <Icon
          name={level === "low" ? "VolumeX" : "Volume2"}
          size={14}
          className={level === "low" ? "text-grade-a" : "text-grade-d"}
        />
        {level === "high"
          ? "Дом в шумной полосе 100 м"
          : level === "mid"
            ? "Дом в полосе 300 м"
            : "Вне шумных полос"}
      </div>
      <p className="mt-0.5 text-muted-foreground">
        {level === "low" ? "Ближайший источник: " : "Источник: "}
        {src}, <span className="num">{fmt(min)}</span>
      </p>
      <p className="num mt-1 text-[0.7rem] text-muted-foreground">
        Трасса {fmt(near.road)} · ж/д {fmt(near.rail)}
      </p>
    </div>
  );
};

export default NoiseStatus;
