import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import GradeBadge from "@/components/GradeBadge";
import { gradeText, type Grade } from "@/data/zhk";

const checks = [
  { icon: "Map", title: "Карта окружения", text: "Трассы, железная дорога, промзоны, лес и вода в кольцах 300 и 1000 метров от дома." },
  { icon: "Wind", title: "Роза ветров", text: "Откуда чаще дует ветер и попадает ли дым от трассы или промзоны к окнам." },
  { icon: "ShieldCheck", title: "Надёжность застройщика", text: "Какая доля объёма сдана с переносом сроков — по данным ЕРЗ, без оценочных слов." },
  { icon: "Scale", title: "Реальная цена", text: "Цена у застройщика рядом с ценой на агрегаторе — видно, сколько составляет накрутка." },
];

const HowWeCheck = () => (
  <section className="relative z-10 mx-auto mt-20 max-w-[1280px] px-4 md:mt-28 md:px-10 lg:px-[84px]">
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <div>
        <span className="inline-block rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Как мы проверяем
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Одна буква вместо часа на картах</h2>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
          Каждому ЖК присваиваем эко-оценку от A до D. Цвет бейджа читается без подписи — зелёный значит спокойно, красный значит стоит разобраться.
        </p>
        <div className="mt-7 space-y-3">
          {(["A", "B", "C", "D"] as Grade[]).map((g) => (
            <div key={g} className="flex items-center gap-3">
              <GradeBadge grade={g} size="md" />
              <span className="text-[0.95rem]">{gradeText[g]}</span>
            </div>
          ))}
        </div>
        <Link to="/kak-my-proveryaem" className="mt-7 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
          Как считаем оценку <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {checks.map((c) => (
          <div key={c.title} className="rounded-xl bg-card p-5 shadow-line">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
              <Icon name={c.icon} size={20} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowWeCheck;
