import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import ZhkCard from "@/components/ZhkCard";
import EcoMap from "@/components/home/EcoMap";
import { collections, inCollection, zhkList } from "@/data/zhk";
import { cn } from "@/lib/utils";

const Hero = () => {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<(typeof collections)[number]["id"]>("clean12");
  const navigate = useNavigate();
  const matched = zhkList.filter((z) => inCollection(z, active));
  const items = matched.slice(0, 3);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/novostroyki?q=${encodeURIComponent(q.trim())}` : "/novostroyki");
  };

  return (
    <section
      id="podborki"
      className="relative z-10 mx-auto grid max-w-[1280px] scroll-mt-6 gap-4 px-4 pt-6 md:px-10 md:pt-8 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[auto_1fr_auto] lg:gap-5 lg:px-[56px]"
    >
      <div className="animate-fade-in lg:pr-4 lg:pt-6">
        <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-primary sm:text-[54px] xl:text-[64px]">
          Новостройки,
          <br />
          проверенные чисто
        </h1>
        <form
          onSubmit={submit}
          role="search"
          className="shadow-soft mt-7 flex h-[56px] items-center gap-2.5 rounded-full bg-card pl-5 pr-1.5"
        >
          <Icon name="Search" size={18} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            aria-label="Поиск"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Район, метро, ЖК или застройщик"
            className="min-w-0 flex-1 bg-transparent text-[0.98rem] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="btn-action-shadow inline-flex h-11 shrink-0 items-center rounded-full bg-action px-5 text-[0.94rem] font-semibold text-action-foreground"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="h-[260px] animate-fade-in [animation-delay:120ms] sm:h-[320px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-auto lg:min-h-[420px]">
        <div className="relative h-full">
          <EcoMap items={matched} fit />
          <span
            key={active}
            className="pointer-events-none absolute left-14 top-3 z-[600] inline-flex h-10 animate-fade-in items-center rounded-full bg-primary/90 px-3.5 text-[0.82rem] font-medium text-white"
          >
            <b className="num mr-1">{matched.length}</b> ЖК на карте
          </span>
          <Link
            to={`/novostroyki?vid=karta&podborka=${active}`}
            title={`Открыть подборку «${collections.find((c) => c.id === active)?.title}» на карте`}
            className="absolute right-3 top-3 z-[600] inline-flex h-10 items-center gap-2 rounded-full bg-card px-4 text-[0.9rem] font-semibold text-primary shadow-soft transition-transform hover:-translate-y-px"
          >
            <Icon name="Map" size={16} />
            Открыть на карте
          </Link>
        </div>
      </div>

      <div className="dot-grid min-w-0 animate-fade-in lg:col-start-1 lg:row-span-2 lg:row-start-2 rounded-[22px] bg-primary p-3 [animation-delay:200ms] md:p-4">
        <ul className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-3">
          {collections.map((c) => (
            <li key={c.id} className="shrink-0">
              <button
                onClick={() => setActive(c.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors",
                  active === c.id ? "bg-white text-primary" : "bg-white/10 text-white/85 hover:bg-white/20",
                )}
              >
                {c.id === "air" && <Icon name="Wind" size={13} className="-ml-0.5 mr-1 inline-block align-[-2px]" />}
                {c.short}
              </button>
            </li>
          ))}
        </ul>
        <div key={active} className="grid animate-fade-in gap-2.5 sm:grid-cols-3">
          {items.map((z) => (
            <ZhkCard key={z.slug} z={z} />
          ))}
        </div>
        <Link
          to={`/novostroyki?podborka=${active}`}
          className="mt-3 inline-flex items-center gap-1.5 px-1 text-sm font-semibold text-white/90 hover:text-white"
        >
          Вся подборка <Icon name="ArrowRight" size={14} />
        </Link>
      </div>

      <div className="flex animate-fade-in flex-col justify-center gap-5 pb-1 pt-2 lg:col-start-2 lg:row-start-3 [animation-delay:260ms] lg:pl-4">
        <p className="max-w-[440px] text-[1.1rem] leading-[1.4] md:text-[1.2rem]">
          Проверяем экологию, сроки и реальную цену каждой новостройки Москвы и области.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/novostroyki"
            className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-[0.94rem] font-semibold text-primary-foreground transition-transform hover:-translate-y-px"
          >
            Смотреть все ЖК
          </Link>
          <Link
            to="/kak-my-proveryaem"
            className="inline-flex h-11 items-center rounded-full border border-primary/30 bg-card px-5 text-[0.94rem] font-semibold text-primary hover:border-primary"
          >
            Как считаем оценку
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;