import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Hero = () => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/novostroyki?q=${encodeURIComponent(q.trim())}` : "/novostroyki");
  };

  return (
    <section className="relative z-10 mx-auto grid max-w-[1280px] gap-8 px-4 pt-10 md:px-10 md:pt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-10 lg:px-[84px] lg:pt-[110px]">
      <h1 className="animate-fade-in text-[42px] font-semibold leading-[1.04] tracking-[-0.03em] text-primary sm:text-[56px] lg:-mt-1.5 lg:whitespace-nowrap lg:text-[56px] xl:text-[66px]">
        Новостройки,
        <br />
        проверенные чисто.
      </h1>
      <div className="max-w-[500px] animate-fade-in pt-1 [animation-delay:120ms]">
        <p className="text-[1.15rem] leading-[1.38] tracking-[-0.005em] md:text-[1.3rem]">
          Проверяем экологию, сроки и реальную цену каждой новостройки Москвы и области.
        </p>
        <form
          onSubmit={submit}
          role="search"
          className="shadow-soft mt-6 flex h-[58px] items-center gap-2.5 rounded-[14px] bg-card pl-4 pr-1.5"
        >
          <Icon name="Search" size={18} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            aria-label="Поиск"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => {}}
            placeholder="Район, метро, ЖК или застройщик"
            className="min-w-0 flex-1 bg-transparent text-[0.98rem] outline-none placeholder:text-muted-foreground"
          />
          <span className="ring-gradient rounded-[13px] p-[3px]">
            <button
              type="submit"
              className="btn-action-shadow inline-flex h-10 items-center gap-2 rounded-[10px] bg-action px-4 text-[0.94rem] font-semibold text-action-foreground"
            >
              Найти
              <Icon name="ArrowRight" size={15} />
            </button>
          </span>
        </form>
        <p className="mt-4 text-[0.92rem] text-muted-foreground">Без накруток агрегатора — цены от застройщика</p>
      </div>
    </section>
  );
};

export default Hero;
