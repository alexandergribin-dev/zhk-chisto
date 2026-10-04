import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

type LeadTarget = { zhkName?: string; zhkSlug?: string; lotId?: string; lotLabel?: string };

type Ctx = { open: (t?: LeadTarget) => void };
const LeadCtx = createContext<Ctx>({ open: () => {} });

export const useLead = () => useContext(LeadCtx);

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export const reachGoal = (goal: string) => {
  try {
    window.ym?.(101026698, "reachGoal", goal);
  } catch {
    /* ignore */
  }
};

const formatPhone = (raw: string) => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  const p = d.slice(1);
  let out = "+7";
  if (p.length > 0) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ")";
  if (p.length > 3) out += " " + p.slice(3, 6);
  if (p.length > 6) out += "-" + p.slice(6, 8);
  if (p.length > 8) out += "-" + p.slice(8, 10);
  return out;
};

export const LeadProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [target, setTarget] = useState<LeadTarget>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  const open = useCallback((t: LeadTarget = {}) => {
    setTarget(t);
    setDone(false);
    setErrors({});
    setOpen(true);
    reachGoal("lead_form_open");
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (name.trim().length < 2) er.name = "Укажите имя";
    if (phone.replace(/\D/g, "").length !== 11) er.phone = "Укажите телефон полностью";
    if (!agree) er.agree = "Нужно согласие, чтобы передать контакт застройщику";
    setErrors(er);
    if (Object.keys(er).length) return;
    if (hp) {
      setDone(true);
      return;
    }
    setSending(true);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      name: name.trim(),
      phone,
      zhk: target.zhkSlug ?? null,
      lot: target.lotId ?? null,
      source: window.location.pathname,
      utm: Object.fromEntries([...params.entries()].filter(([k]) => k.startsWith("utm_"))),
      ts: new Date().toISOString(),
    };
    try {
      const prev = JSON.parse(localStorage.getItem("jk_leads") || "[]");
      localStorage.setItem("jk_leads", JSON.stringify([...prev, payload]));
    } catch {
      /* ignore */
    }
    setTimeout(() => {
      setSending(false);
      setDone(true);
      reachGoal("lead_submit");
    }, 600);
  };

  return (
    <LeadCtx.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-xl">
          {done ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
                <Icon name="Check" size={28} />
              </div>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-primary">Заявка принята</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                Мы передали ваш контакт{target.zhkName ? ` отделу продаж «${target.zhkName.replace("ЖК ", "")}»` : " застройщику"}. С вами свяжутся по указанному номеру.
              </DialogDescription>
              <Button className="mt-6" variant="outline" onClick={() => setOpen(false)}>
                Закрыть
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-semibold tracking-tight">Заявка застройщику</DialogTitle>
                <DialogDescription>
                  {target.zhkName ? (
                    <>
                      {target.zhkName}
                      {target.lotLabel ? ` · ${target.lotLabel}` : ""}
                    </>
                  ) : (
                    "Подберём ЖК и передадим контакт в отдел продаж"
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-5 space-y-4">
                <div>
                  <Label htmlFor="lead-name">Имя</Label>
                  <Input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11" autoComplete="name" />
                  {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="lead-phone">Телефон</Label>
                  <Input
                    id="lead-phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    placeholder="+7 (___) ___-__-__"
                    onFocus={() => !phone && setPhone("+7")}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="mt-1.5 h-11 num"
                    autoComplete="tel"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
                </div>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  aria-hidden="true"
                />
                <label className="flex items-start gap-3 text-sm leading-snug text-muted-foreground">
                  <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
                  <span>
                    Согласен на обработку персональных данных и передачу контакта застройщику по{" "}
                    <Link to="/privacy" className="underline underline-offset-2 text-foreground" onClick={() => setOpen(false)}>
                      политике
                    </Link>{" "}
                    и{" "}
                    <Link to="/oferta" className="underline underline-offset-2 text-foreground" onClick={() => setOpen(false)}>
                      оферте
                    </Link>
                  </span>
                </label>
                {errors.agree && <p className="-mt-2 text-sm text-destructive">{errors.agree}</p>}
              </div>
              <Button type="submit" disabled={sending} className="mt-6 h-12 w-full text-base">
                {sending ? "Отправляем..." : "Отправить заявку"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Без звонков от посредников — только отдел продаж застройщика</p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </LeadCtx.Provider>
  );
};
