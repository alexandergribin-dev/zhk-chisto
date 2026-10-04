import { Link } from "react-router-dom";
import { collections } from "@/data/zhk";

const Rose = () => (
  <svg viewBox="0 0 120 120" width="78" height="78" aria-hidden="true">
    <g fill="none" className="stroke-border" strokeWidth="1.5">
      <circle cx="60" cy="60" r="46" />
      <circle cx="60" cy="60" r="30" />
      <circle cx="60" cy="60" r="14" />
      <path d="M60 8v104M8 60h104" />
    </g>
    <path className="fill-primary/70" d="M60 60 52 20 68 22Z M60 60 98 46 96 66Z M60 60 70 84 52 86Z M60 60 30 70 28 52Z M60 60 84 30 92 40Z" />
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
      <div className="hidden w-[150px] shrink-0 place-items-center border-r border-border sm:grid">
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
