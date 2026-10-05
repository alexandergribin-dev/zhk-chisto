import { Link } from "react-router-dom";
import { collections } from "@/data/zhk";
import WindPromo from "@/components/home/WindPromo";

const labels: Record<string, string> = {
  clean12: "самых чистых ЖК",
  forest: "у леса",
  west: "с окнами на запад",
  reliable: "надёжных застройщика",
};

const NewsAndStats = () => (
  <div className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-10 lg:px-[56px]">
    <div className="mt-12 animate-fade-in [animation-delay:240ms] md:mt-16">
      <WindPromo />
    </div>

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