import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useLead } from "@/components/LeadDialog";
import { fmtRub, type Zhk } from "@/data/zhk";
import { cn } from "@/lib/utils";

const roomLabel = (r: number) => (r === 0 ? "Студия" : `${r}-комн.`);

const LotsTable = ({ z }: { z: Zhk }) => {
  const { open } = useLead();
  const [rooms, setRooms] = useState<number | null>(null);
  const [westOnly, setWestOnly] = useState(false);

  const lots = useMemo(
    () =>
      z.lots
        .filter((l) => rooms === null || l.rooms === rooms || (rooms === 4 && l.rooms >= 4))
        .filter((l) => !westOnly || l.windows.toLowerCase().includes("запад"))
        .sort((a, b) => a.price - b.price),
    [z.lots, rooms, westOnly],
  );

  if (!z.lots.length) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-line">
        <p className="text-lg font-semibold">Актуальные квартиры уточняйте у застройщика</p>
        <p className="mt-1 text-muted-foreground">Застройщик пока не публикует лоты в открытом виде. Оставьте заявку — передадим её в отдел продаж.</p>
        <Button className="mt-5" onClick={() => open({ zhkName: z.name, zhkSlug: z.slug })}>
          Узнать квартиры и цены
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {[null, 0, 1, 2, 3, 4].map((r) => (
          <button
            key={String(r)}
            onClick={() => setRooms(r)}
            className={cn(
              "h-9 rounded-lg px-3 text-sm font-medium transition-colors",
              rooms === r ? "bg-primary text-primary-foreground" : "bg-card shadow-line hover:bg-muted",
            )}
          >
            {r === null ? "Все" : r === 0 ? "Студии" : r === 4 ? "4+" : r}
          </button>
        ))}
        <button
          onClick={() => setWestOnly((v) => !v)}
          className={cn(
            "ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
            westOnly ? "bg-primary text-primary-foreground" : "bg-card shadow-line hover:bg-muted",
          )}
        >
          <Icon name="Sunset" size={15} /> Окна на запад
        </button>
      </div>

      {/* desktop */}
      <div className="hidden overflow-hidden rounded-xl bg-card shadow-line md:block">
        <table className="num w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Квартира</th>
              <th className="px-4 py-3 text-right font-semibold">Площадь</th>
              <th className="px-4 py-3 text-right font-semibold">Этаж</th>
              <th className="px-4 py-3 font-semibold">Окна на</th>
              <th className="px-4 py-3 font-semibold">Отделка</th>
              <th className="px-4 py-3 text-right font-semibold">Цена</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {lots.map((l) => (
              <tr key={l.id} className="border-t border-border transition-colors hover:bg-muted/60">
                <td className="px-4 py-3 font-semibold">{roomLabel(l.rooms)}</td>
                <td className="px-4 py-3 text-right">{l.area.toLocaleString("ru-RU")} м²</td>
                <td className="px-4 py-3 text-right">{l.floor} из {l.floors}</td>
                <td className="px-4 py-3">{l.windows}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.finish}</td>
                <td className="px-4 py-3 text-right">
                  <div className="font-semibold">{fmtRub(l.price)}</div>
                  <div className="text-xs text-muted-foreground">{Math.round(l.price / l.area / 1000)} тыс/м²</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    onClick={() =>
                      open({ zhkName: z.name, zhkSlug: z.slug, lotId: l.id, lotLabel: `${roomLabel(l.rooms)}, ${l.area} м², ${l.floor} этаж` })
                    }
                  >
                    Заявка
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <div className="space-y-2 md:hidden">
        {lots.map((l) => (
          <div key={l.id} className="num rounded-xl bg-card p-4 shadow-line">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {roomLabel(l.rooms)}, {l.area.toLocaleString("ru-RU")} м²
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {l.floor} из {l.floors} этаж · окна: {l.windows.toLowerCase()} · {l.finish.toLowerCase()}
                </p>
              </div>
              <p className="whitespace-nowrap font-semibold">{fmtRub(l.price)}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() =>
                open({ zhkName: z.name, zhkSlug: z.slug, lotId: l.id, lotLabel: `${roomLabel(l.rooms)}, ${l.area} м², ${l.floor} этаж` })
              }
            >
              Оставить заявку
            </Button>
          </div>
        ))}
      </div>
      {!lots.length && <p className="rounded-xl bg-card p-6 text-center text-muted-foreground shadow-line">Под этот фильтр квартир сейчас нет.</p>}
      <p className="mt-3 text-xs text-muted-foreground">Цены и наличие — по данным застройщика на сегодня, обновляются ежедневно.</p>
    </div>
  );
};

export default LotsTable;
