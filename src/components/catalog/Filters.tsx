import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import GradeBadge from "@/components/GradeBadge";
import type { Grade } from "@/data/zhk";
import { cn } from "@/lib/utils";

export type FilterState = {
  budget: [number, number];
  rooms: number[];
  okrugs: string[];
  floorFrom: number;
  finish: string[];
  grades: Grade[];
  forest: boolean;
  west: boolean;
  reliable: boolean;
  cleanAir: boolean;
};

export const defaultFilters: FilterState = {
  budget: [5, 20],
  rooms: [],
  okrugs: [],
  floorFrom: 1,
  finish: [],
  grades: [],
  forest: false,
  west: false,
  reliable: false,
  cleanAir: false,
};

export const OKRUGS = ["Москва", "МО"];
const ROOMS = [
  { v: 0, l: "Студия" },
  { v: 1, l: "1" },
  { v: 2, l: "2" },
  { v: 3, l: "3" },
  { v: 4, l: "4+" },
];
const FINISH = ["Без отделки", "Предчистовая", "Чистовая"];

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-border py-4 last:border-b-0">
    <p className="mb-2.5 text-sm font-semibold">{title}</p>
    {children}
  </div>
);

const Filters = ({ value, onChange }: { value: FilterState; onChange: (v: FilterState) => void }) => {
  const set = (p: Partial<FilterState>) => onChange({ ...value, ...p });
  return (
    <div>
      <Group title="Эко-оценка">
        <div className="flex gap-2">
          {(["A", "B", "C", "D"] as Grade[]).map((g) => {
            const on = value.grades.length === 0 || value.grades.includes(g);
            return (
              <button key={g} onClick={() => set({ grades: toggle(value.grades, g) })} aria-pressed={value.grades.includes(g)} className="rounded-lg">
                <GradeBadge grade={g} size="md" dim={!on} className={cn(value.grades.includes(g) && "ring-2 ring-offset-2 ring-foreground/20")} />
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs leading-snug text-muted-foreground">A — рядом нет трасс и промзон, D — несколько факторов рядом</p>
      </Group>

      <div className="border-b border-border py-4">
        <label
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors",
            value.cleanAir ? "bg-grade-a/10 ring-1 ring-grade-a/40" : "bg-muted hover:bg-secondary",
          )}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-grade-a text-white">
            <Icon name="Wind" size={17} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold leading-tight">Воздух к окнам</span>
            <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">Чаще всего с леса, парка или воды</span>
          </span>
          <Switch checked={value.cleanAir} onCheckedChange={(v) => set({ cleanAir: v })} aria-label="Воздух к окнам с леса, парка или воды" />
        </label>
      </div>

      <Group title="Бюджет, млн ₽">
        <div className="num mb-3 flex justify-between text-sm">
          <span>от {value.budget[0]}</span>
          <span>до {value.budget[1]}</span>
        </div>
        <Slider min={5} max={20} step={0.5} value={value.budget} onValueChange={(v) => set({ budget: [v[0], v[1]] as [number, number] })} />
      </Group>

      <Group title="Комнат">
        <div className="flex flex-wrap gap-1.5">
          {ROOMS.map((r) => (
            <button
              key={r.v}
              onClick={() => set({ rooms: toggle(value.rooms, r.v) })}
              className={cn(
                "h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition-colors",
                value.rooms.includes(r.v) ? "bg-primary text-primary-foreground" : "bg-card shadow-line hover:bg-muted",
              )}
            >
              {r.l}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Где">
        <div className="space-y-2">
          {OKRUGS.map((o) => (
            <label key={o} className="flex items-center gap-2.5 text-sm">
              <Checkbox checked={value.okrugs.includes(o)} onCheckedChange={() => set({ okrugs: toggle(value.okrugs, o) })} />
              {o === "МО" ? "Московская область" : o}
            </label>
          ))}
        </div>
      </Group>

      <Group title="Этаж">
        <div className="flex flex-wrap gap-1.5">
          {[
            { v: 1, l: "Любой" },
            { v: 2, l: "Не первый" },
            { v: 5, l: "От 5-го" },
            { v: 10, l: "От 10-го" },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => set({ floorFrom: f.v })}
              className={cn(
                "h-9 rounded-lg px-3 text-sm font-medium transition-colors",
                value.floorFrom === f.v ? "bg-primary text-primary-foreground" : "bg-card shadow-line hover:bg-muted",
              )}
            >
              {f.l}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Отделка">
        <div className="space-y-2">
          {FINISH.map((f) => (
            <label key={f} className="flex items-center gap-2.5 text-sm">
              <Checkbox checked={value.finish.includes(f)} onCheckedChange={() => set({ finish: toggle(value.finish, f) })} />
              {f}
            </label>
          ))}
        </div>
      </Group>

      <Group title="Эко-фильтры">
        <div className="space-y-3">
          {[
            { k: "forest" as const, l: "Лес или парк до 500 м" },
            { k: "west" as const, l: "Окна на запад" },
            { k: "reliable" as const, l: "Застройщик без переносов" },
          ].map((f) => (
            <label key={f.k} className="flex items-center justify-between gap-3 text-sm">
              {f.l}
              <Switch checked={value[f.k]} onCheckedChange={(v) => set({ [f.k]: v } as Partial<FilterState>)} />
            </label>
          ))}
        </div>
      </Group>
    </div>
  );
};

export default Filters;
