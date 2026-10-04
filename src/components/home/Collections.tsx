import { useState } from "react";
import { Link } from "react-router-dom";
import ZhkCard from "@/components/ZhkCard";
import GradeBadge from "@/components/GradeBadge";
import { collections, zhkList, type Grade } from "@/data/zhk";
import { cn } from "@/lib/utils";

const Collections = () => {
  const [active, setActive] = useState<(typeof collections)[number]["id"]>("clean12");
  const col = collections.find((c) => c.id === active)!;
  const items = zhkList.filter((z) => (z.tags as string[]).includes(active)).slice(0, 3);

  return (
    <section id="podborki" className="relative z-10 mx-auto mt-14 max-w-[1280px] scroll-mt-6 px-4 md:mt-20 md:px-10 lg:px-[84px]">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Подборки
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Готовые выборки по главным критериям</h2>
        </div>
      </div>

      <div className="grid overflow-hidden rounded-[18px] bg-card shadow-line md:grid-cols-[200px_1fr] lg:grid-cols-[210px_1fr_200px]">
        <div className="border-b border-border p-3 md:border-b-0 md:border-r">
          <p className="mx-1.5 mb-2 hidden text-xs font-semibold text-muted-foreground md:block">Подборки</p>
          <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 md:flex-col md:overflow-visible">
            {collections.map((c) => (
              <li key={c.id} className="shrink-0">
                <button
                  onClick={() => setActive(c.id)}
                  className={cn(
                    "w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors md:whitespace-normal",
                    active === c.id ? "bg-secondary font-semibold text-primary" : "hover:bg-muted",
                  )}
                >
                  {c.short}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-muted p-3 md:p-4">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {col.chips.map((ch) => (
              <span key={ch} className="rounded-full bg-card px-3 py-1 text-xs font-medium shadow-line">
                {ch}
              </span>
            ))}
            <Link to={`/novostroyki?podborka=${col.id}`} className="ml-auto text-sm font-semibold text-primary hover:underline">
              Смотреть все →
            </Link>
          </div>
          <div key={active} className="grid animate-fade-in gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((z) => (
              <ZhkCard key={z.slug} z={z} />
            ))}
          </div>
        </div>

        <div className="hidden border-l border-border p-4 lg:block">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Эко-оценка</p>
          <div className="flex gap-1.5">
            {(["A", "B", "C", "D"] as Grade[]).map((g) => (
              <GradeBadge key={g} grade={g} dim={g === "C" || g === "D"} />
            ))}
          </div>
          <p className="mt-2 text-xs leading-snug text-muted-foreground">A — рядом нет трасс и промзон, D — несколько факторов рядом</p>
          <p className="mb-2 mt-5 text-xs font-semibold text-muted-foreground">Бюджет</p>
          <div className="num mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>от 6 млн</span>
            <span>до 12 млн</span>
          </div>
          <div className="h-1 rounded bg-border">
            <i className="ml-[12%] block h-full w-[62%] rounded bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collections;
