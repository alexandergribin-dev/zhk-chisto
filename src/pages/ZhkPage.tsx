import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import GradeBadge from "@/components/GradeBadge";
import SurroundingsMap from "@/components/zhk/SurroundingsMap";
import WindRose from "@/components/zhk/WindRose";
import LotsTable from "@/components/zhk/LotsTable";
import ZhkCard from "@/components/ZhkCard";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLead } from "@/components/LeadDialog";
import { fmtMln, getDeveloper, getZhk, gradeText, reliabilityText, zhkList } from "@/data/zhk";
import { useSeo } from "@/hooks/use-seo";

const Section = ({ id, title, children, sub }: { id: string; title: string; sub?: string; children: React.ReactNode }) => (
  <section id={id} className="mt-14 scroll-mt-20 md:mt-20">
    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
    {sub && <p className="mt-1.5 text-muted-foreground">{sub}</p>}
    <div className="mt-6">{children}</div>
  </section>
);

const ZhkPage = () => {
  const { slug = "" } = useParams();
  const z = getZhk(slug);
  const { open } = useLead();
  const dev = z ? getDeveloper(z.developer) : undefined;

  useSeo({
    title: z ? `${z.name} — эко-оценка ${z.grade}, цены от застройщика | ЖК.Чисто` : "ЖК не найден",
    description: z ? `${z.name}, ${z.district}: эко-оценка ${z.grade}, срок сдачи ${z.deadline}, цены ${fmtMln(z.priceFrom)}–${fmtMln(z.priceTo)} млн ₽.` : undefined,
    jsonLd: z
      ? [
          {
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: z.name,
            url: `https://jkchisto.ru/zhk/${z.slug}`,
            address: { "@type": "PostalAddress", addressLocality: z.district, addressRegion: z.okrug.startsWith("МО") ? "Московская область" : "Москва" },
            offers: { "@type": "AggregateOffer", priceCurrency: "RUB", lowPrice: z.priceFrom * 1e6, highPrice: z.priceTo * 1e6 },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://jkchisto.ru/" },
              { "@type": "ListItem", position: 2, name: "Новостройки", item: "https://jkchisto.ru/novostroyki" },
              { "@type": "ListItem", position: 3, name: z.name },
            ],
          },
        ]
      : undefined,
  });

  if (!z || !dev)
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-2xl font-semibold text-primary">Такого ЖК в каталоге нет</p>
          <p className="mt-2 text-muted-foreground">Возможно, ссылка устарела.</p>
          <Link to="/novostroyki" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">
            Открыть каталог
          </Link>
        </div>
      </Layout>
    );

  const diff = z.aggregatorPerM2 - z.pricePerM2;
  const similar = zhkList.filter((x) => x.slug !== z.slug && Math.abs(x.priceFrom - z.priceFrom) < 3).slice(0, 3);

  return (
    <Layout>
      <div className="mx-auto max-w-[1180px] px-4 pt-6 md:px-10">
        <nav className="text-sm text-muted-foreground" aria-label="Хлебные крошки">
          <Link to="/" className="hover:text-primary">Главная</Link> / <Link to="/novostroyki" className="hover:text-primary">Новостройки</Link> /{" "}
          <span className="text-foreground">{z.name}</span>
        </nav>

        {/* header */}
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-4">
              <GradeBadge grade={z.grade} size="lg" />
              <div>
                <p className="text-sm text-muted-foreground">Эко-оценка</p>
                <p className="font-medium leading-snug">{gradeText[z.grade]}</p>
              </div>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-primary md:text-6xl">{z.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {z.district}, {z.okrug} · {z.metro}
            </p>
          </div>
          <div className="num grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border shadow-line">
            <div className="bg-card p-4">
              <p className="text-xs text-muted-foreground">От</p>
              <p className="mt-1 text-xl font-semibold md:text-2xl">{fmtMln(z.priceFrom)} млн</p>
            </div>
            <div className="bg-card p-4">
              <p className="text-xs text-muted-foreground">За м²</p>
              <p className="mt-1 text-xl font-semibold md:text-2xl">{z.pricePerM2} тыс</p>
            </div>
            <div className="bg-card p-4">
              <p className="text-xs text-muted-foreground">Сдача</p>
              <p className="mt-1 text-xl font-semibold md:text-2xl">{z.deadline}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.6fr_1fr]">
          <div className="h-56 overflow-hidden rounded-xl bg-secondary md:h-72">
            <img src={z.photo} alt={z.name} style={{ objectPosition: z.photoPos }} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-between rounded-xl bg-card p-5 shadow-line">
            <div>
              <p className="text-sm text-muted-foreground">Застройщик</p>
              <p className="mt-1 text-xl font-semibold">{dev.name}</p>
              <p className="mt-1 text-sm">{reliabilityText(dev.delayedShare)}</p>
            </div>
            <div className="mt-5 space-y-2">
              <Button className="h-12 w-full text-base" onClick={() => open({ zhkName: z.name, zhkSlug: z.slug })}>
                Оставить заявку застройщику
              </Button>
              <a href="#kvartiry" className="block py-2 text-center text-sm font-semibold text-primary hover:underline">
                Смотреть квартиры
              </a>
            </div>
          </div>
        </div>

        {/* quick nav */}
        <nav className="sticky top-0 z-20 -mx-4 mt-8 flex gap-1 overflow-x-auto border-b border-border bg-background/90 px-4 py-2 backdrop-blur md:mx-0 md:px-0">
          {[
            ["okruzhenie", "Что рядом"],
            ["veter", "Роза ветров"],
            ["zastroyshchik", "Застройщик"],
            ["kvartiry", "Квартиры"],
            ["cena", "Цена"],
          ].map(([id, l]) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium hover:bg-secondary hover:text-primary">
              {l}
            </a>
          ))}
        </nav>

        <Section id="okruzhenie" title="Что рядом" sub="Кольца 300 м и 1 км от дома. Нажмите на точку, чтобы узнать подробности.">
          <SurroundingsMap z={z} />
        </Section>

        <Section id="veter" title="Роза ветров" sub="Откуда чаще дует ветер и что он приносит к окнам.">
          <div className="rounded-xl bg-card p-5 shadow-line md:p-8">
            <WindRose z={z} />
          </div>
        </Section>

        <Section id="zastroyshchik" title="Надёжность застройщика" sub="По данным ЕРЗ — единого реестра застройщиков.">
          <div className="num grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { l: "Объектов в стройке", v: dev.objects },
              { l: "Объём, тыс. м²", v: Math.round(dev.volumeM2 / 1000).toLocaleString("ru-RU") },
              { l: "Объём с переносом сроков", v: `${dev.delayedShare}%` },
              { l: "На рынке с", v: dev.since },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-card p-5 shadow-line">
                <p className="text-3xl font-semibold tracking-tight text-primary">{s.v}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-secondary px-5 py-4">
            <Icon name="Info" size={18} className="shrink-0 text-primary" />
            <p className="font-medium text-primary">{reliabilityText(dev.delayedShare)}</p>
            <Link to={`/zastroyshchiki/${dev.slug}`} className="ml-auto whitespace-nowrap text-sm font-semibold text-primary hover:underline">
              Все ЖК →
            </Link>
          </div>
        </Section>

        <Section id="kvartiry" title="Квартиры" sub={z.lots.length ? `${z.lots.length} лотов в продаже напрямую от застройщика` : undefined}>
          <LotsTable z={z} />
        </Section>

        <Section id="cena" title="Цена у застройщика и на агрегаторе" sub="Средняя цена за квадратный метр, тыс. ₽">
          <div className="num rounded-xl bg-card p-5 shadow-line md:p-8">
            {[
              { l: "У застройщика", v: z.pricePerM2, main: true },
              { l: "На ЦИАН", v: z.aggregatorPerM2 },
            ].map((r) => (
              <div key={r.l} className="mb-4 last:mb-0">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">{r.l}</span>
                  <span className="font-semibold">{r.v} тыс ₽/м²</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className={r.main ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-muted-foreground/40"} style={{ width: `${(r.v / z.aggregatorPerM2) * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="mt-5 text-lg">
              Разница — <b className="text-primary">{diff} тыс ₽ за м²</b>, на квартире 60 м² это около{" "}
              <b className="text-primary">{fmtMln((diff * 60) / 1000)} млн ₽</b>.
            </p>
          </div>
        </Section>

        <Section id="ne-proveryaem" title="Что мы не проверяем дистанционно">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: "Volume2", t: "Шум в квартире", d: "Зависит от окон и этажа — послушайте вечером и в будний день." },
              { i: "Wind", t: "Запахи", d: "Приезжайте в безветренную погоду и при ветре со стороны промзоны." },
              { i: "Hammer", t: "Качество стройки", d: "Нужна приёмка с инженером после выдачи ключей." },
              { i: "FileText", t: "Договор", d: "Проверьте ДДУ и эскроу-счёт у юриста или в банке." },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-dashed border-border bg-card/60 p-5">
                <Icon name={c.i} size={20} className="text-muted-foreground" />
                <p className="mt-3 font-semibold">{c.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </Section>

        {similar.length > 0 && (
          <Section id="pohozhie" title="Похожие по цене">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <ZhkCard key={s.slug} z={s} wide />
              ))}
            </div>
          </Section>
        )}
      </div>
    </Layout>
  );
};

export default ZhkPage;
