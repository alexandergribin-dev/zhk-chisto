import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ZhkCard from "@/components/ZhkCard";
import { developers, getDeveloper, reliabilityText, zhkList } from "@/data/zhk";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";

const shareColor = (s: number) => (s === 0 ? "bg-grade-a" : s <= 15 ? "bg-grade-c" : "bg-grade-d");

export const DevelopersList = () => {
  useSeo({ title: "Застройщики Москвы и МО — надёжность по данным ЕРЗ | ЖК.Чисто", description: "Доля объёма с переносом сроков у застройщиков Москвы и Московской области." });
  const sorted = [...developers].sort((a, b) => a.delayedShare - b.delayedShare);
  return (
    <Layout>
      <div className="mx-auto max-w-[1180px] px-4 pt-6 md:px-10">
        <nav className="text-sm text-muted-foreground"><Link to="/" className="hover:text-primary">Главная</Link> / <span className="text-foreground">Застройщики</span></nav>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary md:text-5xl">Застройщики</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Показываем, какая доля строящегося объёма уже сдвигалась по срокам. Без рейтингов и оценочных слов — только цифра из ЕРЗ.</p>
        <div className="mt-8 overflow-hidden rounded-xl bg-card shadow-line">
          {sorted.map((d) => (
            <Link key={d.slug} to={`/zastroyshchiki/${d.slug}`} className="num flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-muted">
              <span className="min-w-[140px] flex-1 text-lg font-semibold">{d.name}</span>
              <span className="text-sm text-muted-foreground">{d.objects} объектов</span>
              <span className="flex items-center gap-2 text-sm">
                <i className={cn("h-2.5 w-2.5 rounded-full", shareColor(d.delayedShare))} />
                {d.delayedShare}% с переносом
              </span>
              <span className="w-full text-sm text-muted-foreground sm:w-56">{reliabilityText(d.delayedShare)}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const DeveloperPage = () => {
  const { slug = "" } = useParams();
  const d = getDeveloper(slug);
  useSeo({ title: d ? `${d.name} — новостройки и надёжность | ЖК.Чисто` : "Застройщик не найден" });
  if (!d) return <DevelopersList />;
  const items = zhkList.filter((z) => z.developer === d.slug);
  return (
    <Layout>
      <div className="mx-auto max-w-[1180px] px-4 pt-6 md:px-10">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Главная</Link> / <Link to="/zastroyshchiki" className="hover:text-primary">Застройщики</Link> / <span className="text-foreground">{d.name}</span>
        </nav>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary md:text-5xl">{d.name}</h1>
        <div className="num mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Объектов в стройке", v: d.objects },
            { l: "Объём, тыс. м²", v: Math.round(d.volumeM2 / 1000).toLocaleString("ru-RU") },
            { l: "С переносом сроков", v: `${d.delayedShare}%` },
            { l: "На рынке с", v: d.since },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-card p-5 shadow-line">
              <p className="text-3xl font-semibold tracking-tight text-primary">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-secondary px-5 py-4 font-medium text-primary">{reliabilityText(d.delayedShare)}</p>
        <h2 className="mt-12 text-2xl font-semibold tracking-tight">ЖК застройщика в каталоге</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((z) => (
            <ZhkCard key={z.slug} z={z} wide />
          ))}
        </div>
      </div>
    </Layout>
  );
};
