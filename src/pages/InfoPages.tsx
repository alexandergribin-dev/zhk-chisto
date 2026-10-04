import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GradeBadge from "@/components/GradeBadge";
import Icon from "@/components/ui/icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { gradeText, type Grade } from "@/data/zhk";
import { useSeo } from "@/hooks/use-seo";
import { reachGoal } from "@/components/LeadDialog";

const Page = ({ crumb, title, lead, children }: { crumb: string; title: string; lead?: string; children: React.ReactNode }) => (
  <Layout>
    <div className="mx-auto max-w-[860px] px-4 pt-6 md:px-10">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Главная</Link> / <span className="text-foreground">{crumb}</span>
      </nav>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary md:text-5xl">{title}</h1>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lead}</p>}
      <div className="mt-10">{children}</div>
    </div>
  </Layout>
);

export const HowWeCheckPage = () => {
  useSeo({ title: "Как мы считаем эко-оценку A–D | ЖК.Чисто", description: "Методика эко-оценки новостроек: трассы, ж/д, промзоны, лес, роза ветров." });
  return (
    <Page crumb="Как мы проверяем" title="Как мы проверяем новостройки" lead="Оценка строится на открытых данных: кадастр, OpenStreetMap, реестр застройщиков ЕРЗ, ЕИСЖС и метеорологический реанализ. Мы не берём деньги за оценку и не меняем её по просьбе застройщика.">
      <h2 className="text-2xl font-semibold tracking-tight">Эко-оценка</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">Смотрим, что находится в 300 метрах и в километре от дома: трассы, железная дорога, промзоны, очистные. И откуда дует ветер — фактор с подветренной стороны весит меньше.</p>
      <div className="mt-5 space-y-3">
        {(["A", "B", "C", "D"] as Grade[]).map((g) => (
          <div key={g} className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-line">
            <GradeBadge grade={g} size="lg" />
            <p className="font-medium">{gradeText[g]}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-sm text-primary">Если по ЖК мало данных, мы честно пишем «по данным кадастра» и показываем только подтверждённое — без нулей и догадок.</p>

      <h2 id="rosa" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-tight">Как читать розу ветров</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">Каждый лепесток показывает, как часто ветер дует с этой стороны. Чем длиннее лепесток — тем чаще. Если с этой стороны есть трасса или промзона, лепесток красный: в такие дни воздух от источника идёт к дому. Данные реанализа за 5 лет, точность на уровне района.</p>

      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Частые вопросы</h2>
      <Accordion type="single" collapsible className="mt-4">
        {[
          ["Почему у ЖК рядом с лесом может быть оценка C?", "Лес — плюс, но он не отменяет трассу с наветренной стороны. Мы показываем и плюсы, и минусы на карте, а оценка отражает именно риски."],
          ["Откуда цены?", "Напрямую из открытых каталогов и API застройщиков. Если застройщик не публикует лоты, пишем «актуальные квартиры уточняйте у застройщика»."],
          ["Кто получает мою заявку?", "Только отдел продаж выбранного застройщика. Мы не передаём контакт агентствам и не перепродаём базу."],
          ["Почему вы не проверяете шум?", "Шум зависит от окон, этажа и времени суток — дистанционно его не измерить честно. На странице каждого ЖК есть список того, что стоит проверить лично."],
        ].map(([q, a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left text-base">{q}</AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Page>
  );
};

export const BotPage = () => {
  useSeo({ title: "Telegram-бот ЖК.Чисто — уведомления о новых квартирах", description: "Подпишитесь на уведомления о новых лотах в чистых ЖК." });
  return (
    <Page crumb="Telegram-бот" title="Новые квартиры — в Telegram" lead="Настройте бюджет, район и минимальную эко-оценку. Бот напишет, когда появится подходящая квартира или снизится цена.">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { i: "SlidersHorizontal", t: "Задайте параметры", d: "Бюджет, комнатность, округ, оценка от A до D." },
          { i: "Bell", t: "Получайте новое", d: "Только новые лоты и снижения цены, без рекламы." },
          { i: "MousePointerClick", t: "Оставьте заявку", d: "Прямо из сообщения — в отдел продаж застройщика." },
        ].map((s, n) => (
          <div key={s.t} className="rounded-xl bg-card p-5 shadow-line">
            <div className="flex items-center justify-between">
              <Icon name={s.i} size={22} className="text-primary" />
              <span className="num text-sm font-semibold text-muted-foreground">0{n + 1}</span>
            </div>
            <p className="mt-4 font-semibold">{s.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
      <a
        href="https://t.me/"
        target="_blank"
        rel="noreferrer"
        onClick={() => reachGoal("bot_click")}
        className="btn-action-shadow mt-8 inline-flex h-12 items-center gap-2.5 rounded-[10px] bg-action px-7 font-semibold text-action-foreground"
      >
        Подписаться <Icon name="Send" size={16} />
      </a>
      <p className="mt-3 text-sm text-muted-foreground">Бот запускается вместе с основным сервисом. Ссылка заработает после подключения.</p>
    </Page>
  );
};

const Legal = ({ title, crumb, blocks }: { title: string; crumb: string; blocks: [string, string][] }) => {
  useSeo({ title: `${title} | ЖК.Чисто` });
  return (
    <Page crumb={crumb} title={title} lead="Редакция от 4 октября 2026 года.">
      <div className="space-y-8">
        {blocks.map(([h, t]) => (
          <section key={h}>
            <h2 className="text-xl font-semibold">{h}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{t}</p>
          </section>
        ))}
      </div>
    </Page>
  );
};

export const PrivacyPage = () => (
  <Legal
    crumb="Политика конфиденциальности"
    title="Политика конфиденциальности"
    blocks={[
      ["1. Какие данные мы собираем", "Имя, номер телефона, выбранный ЖК или квартира, адрес страницы, с которой отправлена заявка, метки рекламных кампаний и время отправки."],
      ["2. Зачем", "Чтобы передать вашу заявку в отдел продаж выбранного застройщика и, при вашем согласии, присылать уведомления о новых квартирах."],
      ["3. Кому передаём", "Только застройщику, ЖК которого вы выбрали. Агентствам и третьим лицам данные не передаются и не продаются."],
      ["4. Где хранятся", "На серверах на территории Российской Федерации в соответствии с ч. 5 ст. 18 Федерального закона № 152-ФЗ «О персональных данных»."],
      ["5. Сроки и отзыв согласия", "Данные хранятся до достижения цели обработки или до отзыва согласия. Отозвать согласие можно письмом на адрес оператора — данные будут удалены в течение 30 дней."],
      ["6. Оператор", "Сервис ЖК.Чисто. Регистрационные данные оператора предоставляются по запросу."],
    ]}
  />
);

export const OfertaPage = () => (
  <Legal
    crumb="Оферта"
    title="Оферта на передачу заявки"
    blocks={[
      ["1. Предмет", "Сервис ЖК.Чисто бесплатно передаёт контакт пользователя в отдел продаж выбранного застройщика."],
      ["2. Что не входит в услугу", "Сервис не является агентством недвижимости, не участвует в сделке и не гарантирует сроки ответа застройщика."],
      ["3. Информация на сайте", "Эко-оценка, роза ветров и данные о надёжности застройщика носят справочный характер и основаны на открытых источниках."],
      ["4. Акцепт", "Отправка формы заявки с отметкой о согласии означает принятие условий оферты."],
      ["5. Реквизиты", "Регистрационные данные предоставляются по запросу."],
    ]}
  />
);
