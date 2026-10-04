import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { reachGoal } from "@/components/LeadDialog";

export const Logo = ({ className }: { className?: string }) => (
  <Link to="/" className={cn("flex items-center gap-2.5 text-[1.06rem] font-semibold tracking-tight text-foreground", className)}>
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <path className="fill-primary" d="M15 3c6 5 9 9.5 9 14a9 9 0 0 1-18 0c0-4.5 3-9 9-14Z" />
      <path d="M15 11v15M15 18l-4-3.5M15 21.5l4-3.5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    <span>ЖК.Чисто</span>
  </Link>
);

const links = [
  { to: "/novostroyki", label: "Каталог" },
  { to: "/#podborki", label: "Подборки", home: true },
  { to: "/zastroyshchiki", label: "Застройщики" },
  { to: "/kak-my-proveryaem", label: "Как мы проверяем" },
];

export const SubscribeButton = ({ className }: { className?: string }) => (
  <Link
    to="/bot"
    onClick={() => reachGoal("bot_click")}
    className={cn(
      "btn-action-shadow inline-flex h-11 items-center gap-2.5 rounded-[10px] bg-action px-5 text-[0.94rem] font-semibold text-action-foreground transition-transform hover:-translate-y-px",
      className,
    )}
  >
    Подписаться
    <Icon name="Send" size={16} />
  </Link>
);

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (l: (typeof links)[number]) => (l.home ? pathname === "/" : pathname.startsWith(l.to));

  return (
    <header className="relative z-20 flex h-16 items-center px-4 md:h-[72px] md:px-7">
      <Logo />
      <nav className="ml-12 hidden gap-2 lg:flex" aria-label="Основное">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={cn(
              "rounded-lg px-3 py-2 text-[0.94rem] font-semibold transition-colors",
              isActive(l) ? "bg-secondary text-primary" : "text-foreground hover:text-primary",
            )}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-6">
        <span className="hidden text-[0.94rem] font-medium xl:inline">Новые квартиры — в Telegram</span>
        <SubscribeButton className="hidden sm:inline-flex" />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="grid h-11 w-11 place-items-center rounded-lg bg-card shadow-line lg:hidden" aria-label="Меню">
            <Icon name="Menu" size={20} />
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-sm">
            <SheetTitle className="sr-only">Меню</SheetTitle>
            <Logo />
            <nav className="mt-8 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 text-lg font-semibold",
                    isActive(l) ? "bg-secondary text-primary" : "text-foreground",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 rounded-xl bg-secondary p-4">
              <p className="font-semibold text-primary">Новые квартиры — в Telegram</p>
              <p className="mt-1 text-sm text-muted-foreground">Пришлём, когда в выбранных ЖК появятся лоты по вашим параметрам.</p>
              <SubscribeButton className="mt-4 w-full justify-center" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
