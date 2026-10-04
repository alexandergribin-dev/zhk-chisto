import Icon from "@/components/ui/icon";
import { SubscribeButton } from "@/components/Header";

const BotCta = () => (
  <section className="relative z-10 mx-auto mt-20 max-w-[1280px] px-4 md:mt-28 md:px-10 lg:px-[84px]">
    <div className="relative overflow-hidden rounded-[18px] bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14">
      <svg className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 opacity-10" viewBox="0 0 120 120" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="60" cy="60" r="56" />
          <circle cx="60" cy="60" r="40" />
          <circle cx="60" cy="60" r="22" />
          <path d="M60 2v116M2 60h116" />
        </g>
      </svg>
      <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Новые квартиры — сразу в Telegram</h2>
          <p className="mt-3 max-w-lg text-lg leading-relaxed text-primary-foreground/80">
            Укажите бюджет, округ и минимальную оценку. Бот напишет, когда в подходящем ЖК появится лот или снизится цена.
          </p>
          <ul className="mt-5 space-y-2 text-[0.95rem] text-primary-foreground/90">
            {["Только ЖК с оценкой не ниже выбранной", "Без рекламы и рассылок застройщиков", "Отписка одной командой"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="Check" size={16} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:justify-self-end">
          <SubscribeButton className="h-12 px-7 text-base" />
        </div>
      </div>
    </div>
  </section>
);

export default BotCta;
