import { Link } from "react-router-dom";
import { Logo } from "@/components/Header";

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ЖК.Чисто",
  url: "https://jkchisto.ru",
  description: "Сервис подбора и проверки новостроек Москвы и Московской области",
};

const Footer = () => (
  <footer className="relative z-10 mt-24 border-t border-border bg-card">
    <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10 lg:px-[84px]">
      <div>
        <Logo />
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Проверяем экологию, сроки и реальную цену каждой новостройки Москвы и области. Не агентство: передаём заявку напрямую застройщику.
        </p>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold">Каталог</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/novostroyki" className="hover:text-primary">Все новостройки</Link></li>
          <li><Link to="/novostroyki?podborka=clean12" className="hover:text-primary">Самые чистые до 12 млн</Link></li>
          <li><Link to="/novostroyki?podborka=forest" className="hover:text-primary">У леса</Link></li>
          <li><Link to="/novostroyki?podborka=west" className="hover:text-primary">С окнами на запад</Link></li>
        </ul>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold">Сервис</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/zastroyshchiki" className="hover:text-primary">Застройщики</Link></li>
          <li><Link to="/kak-my-proveryaem" className="hover:text-primary">Как считаем оценку</Link></li>
          <li><Link to="/bot" className="hover:text-primary">Telegram-бот</Link></li>
        </ul>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold">Документы</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/privacy" className="hover:text-primary">Политика конфиденциальности</Link></li>
          <li><Link to="/oferta" className="hover:text-primary">Оферта на передачу заявки</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <p className="mx-auto max-w-[1280px] px-4 py-5 text-xs text-muted-foreground md:px-10 lg:px-[84px]">
        © 2026 ЖК.Чисто · Данные: ЕИСЖС, ЕРЗ, Росреестр, OpenStreetMap · Регистрационные данные предоставляются по запросу
      </p>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
  </footer>
);

export default Footer;
