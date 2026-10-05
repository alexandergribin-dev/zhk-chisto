import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ZhkCard from "@/components/ZhkCard";
import CatalogMap from "@/components/catalog/CatalogMap";
import Filters, { defaultFilters, type FilterState } from "@/components/catalog/Filters";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { collections, getDeveloper, mainAirSource, zhkList, type Zhk } from "@/data/zhk";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";

const PER_PAGE = 6;
const gradeOrder = { A: 0, B: 1, C: 2, D: 3 };

const initialFrom = (podborka: string | null): FilterState => {
  const f = { ...defaultFilters };
  if (podborka === "clean12") return { ...f, budget: [5, 12], grades: ["A", "B"] };
  if (podborka === "forest") return { ...f, forest: true };
  if (podborka === "west") return { ...f, west: true };
  if (podborka === "reliable") return { ...f, reliable: true };
  if (podborka === "air") return { ...f, cleanAir: true };
  return f;
};

const apply = (list: Zhk[], f: FilterState, q: string) =>
  list.filter((z) => {
    const dev = getDeveloper(z.developer);
    if (q) {
      const s = q.toLowerCase();
      const hay = [z.name, z.district, z.okrug, z.metro, dev?.name ?? ""].join(" ").toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (z.priceTo < f.budget[0] || z.priceFrom > f.budget[1]) return false;
    if (f.grades.length && !f.grades.includes(z.grade)) return false;
    if (f.okrugs.length) {
      const isMo = z.okrug.startsWith("МО");
      if (!f.okrugs.includes(isMo ? "МО" : "Москва")) return false;
    }
    if (f.finish.length && !z.finishOptions.some((x) => f.finish.includes(x))) return false;
    if (z.lots.length) {
      if (f.rooms.length && !z.lots.some((l) => f.rooms.includes(l.rooms))) return false;
      if (f.floorFrom > 1 && !z.lots.some((l) => l.floor >= f.floorFrom)) return false;
    }
    if (f.forest && !z.tags.includes("forest")) return false;
    if (f.west && !z.tags.includes("west")) return false;
    if (f.reliable && !z.tags.includes("reliable")) return false;
    if (f.cleanAir && !mainAirSource(z)?.plus) return false;
    return true;
  });

const Catalog = () => {
  const [params, setParams] = useSearchParams();
  const podborka = params.get("podborka");
  const [filters, setFilters] = useState<FilterState>(() => initialFrom(podborka));
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState("grade");
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const view = params.get("vid") === "karta" ? "map" : "list";
  const setView = (v: "list" | "map") => {
    const n = new URLSearchParams(params);
    if (v === "map") n.set("vid", "karta");
    else n.delete("vid");
    n.delete("page");
    setParams(n, { replace: true });
  };
  const col = collections.find((c) => c.id === podborka);

  useEffect(() => {
    setFilters(initialFrom(podborka));
  }, [podborka]);

  useEffect(() => {
    const qp = params.get("q");
    if (qp !== null) setQ(qp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("q")]);

  useSeo({
    title: `${col ? col.title + " — " : "Новостройки Москвы и МО — "}каталог ЖК.Чисто`,
    description: "Каталог новостроек Москвы и области с фильтрами по бюджету, комнатности, отделке и эко-оценке A–D.",
    canonical: "/novostroyki",
  });

  const result = useMemo(() => {
    const r = apply(zhkList, filters, q.trim());
    return [...r].sort((a, b) => {
      if (sort === "price") return a.pricePerM2 - b.pricePerM2;
      if (sort === "deadline") return a.deadlineSort - b.deadlineSort;
      return gradeOrder[a.grade] - gradeOrder[b.grade] || a.pricePerM2 - b.pricePerM2;
    });
  }, [filters, q, sort]);

  const pages = Math.max(1, Math.ceil(result.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = result.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goPage = (p: number) => {
    const n = new URLSearchParams(params);
    if (p === 1) n.delete("page");
    else n.set("page", String(p));
    setParams(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const update = (f: FilterState) => {
    setFilters(f);
    if (params.get("page")) goPage(1);
  };

  const reset = () => {
    setFilters(defaultFilters);
    setQ("");
    setParams(new URLSearchParams());
  };

  return (
    <Layout>
      <div className="mx-auto max-w-[1280px] px-4 pt-6 md:px-10 lg:px-[84px]">
        <nav className="text-sm text-muted-foreground" aria-label="Хлебные крошки">
          <Link to="/" className="hover:text-primary">Главная</Link> / <span className="text-foreground">Новостройки</span>
        </nav>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary md:text-5xl">
          {col ? col.title : "Новостройки Москвы и области"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          <span className="num font-semibold text-foreground">{result.length}</span> ЖК по вашим параметрам · цены от застройщика
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-4 rounded-xl bg-card px-5 py-2 shadow-line">
              <Filters value={filters} onChange={update} />
              <button onClick={reset} className="mb-3 mt-1 text-sm font-medium text-primary hover:underline">
                Сбросить фильтры
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-11 min-w-0 flex-1 basis-full items-center gap-2 rounded-lg bg-card px-3 shadow-line sm:basis-auto">
                <Icon name="Search" size={16} className="text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Район, метро, ЖК или застройщик"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {q && (
                  <button onClick={() => setQ("")} aria-label="Очистить">
                    <Icon name="X" size={16} className="text-muted-foreground" />
                  </button>
                )}
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 flex-1 bg-card sm:flex-none lg:hidden">
                    <Icon name="SlidersHorizontal" size={16} /> Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
                  <SheetTitle>Фильтры</SheetTitle>
                  <Filters value={filters} onChange={update} />
                  <div className="sticky bottom-0 -mx-6 mt-2 flex gap-2 border-t border-border bg-background px-6 py-3">
                    <Button variant="outline" onClick={reset} className="flex-1">Сбросить</Button>
                    <SheetClose asChild>
                      <Button className="flex-1">Показать {result.length}</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex h-11 flex-1 rounded-lg bg-card p-1 shadow-line sm:flex-none" role="tablist" aria-label="Вид">
                {([
                  { v: "list", l: "Список", i: "LayoutGrid" },
                  { v: "map", l: "Карта", i: "Map" },
                ] as const).map((o) => (
                  <button
                    key={o.v}
                    role="tab"
                    aria-selected={view === o.v}
                    onClick={() => setView(o.v)}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors",
                      view === o.v ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon name={o.i} size={15} />
                    {o.l}
                  </button>
                ))}
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 flex-1 bg-card sm:w-52 sm:flex-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade">По эко-оценке</SelectItem>
                  <SelectItem value="price">По цене за м²</SelectItem>
                  <SelectItem value="deadline">По сроку сдачи</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {result.length && view === "map" ? (
              <CatalogMap items={result} />
            ) : shown.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((z) => (
                  <ZhkCard key={z.slug} z={z} wide />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-card p-10 text-center shadow-line">
                <p className="text-lg font-semibold">Под эти параметры ЖК не нашлось</p>
                <p className="mt-1 text-muted-foreground">Попробуйте расширить бюджет или снять часть эко-фильтров.</p>
                <Button variant="outline" className="mt-5" onClick={reset}>Сбросить фильтры</Button>
              </div>
            )}

            {view === "list" && pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1.5">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goPage(p)}
                    className={cn(
                      "num h-10 w-10 rounded-lg text-sm font-semibold",
                      p === current ? "bg-primary text-primary-foreground" : "bg-card shadow-line hover:bg-muted",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;