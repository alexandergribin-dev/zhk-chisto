import { Link } from "react-router-dom";
import GradeBadge from "@/components/GradeBadge";
import { fmtMln, getDeveloper, type Zhk } from "@/data/zhk";
import { cn } from "@/lib/utils";

const ZhkCard = ({ z, className, wide }: { z: Zhk; className?: string; wide?: boolean }) => {
  const dev = getDeveloper(z.developer);
  return (
    <Link
      to={`/zhk/${z.slug}`}
      className={cn(
        "group block rounded-[10px] bg-card p-2 shadow-line transition-all hover:-translate-y-0.5 hover:shadow-soft",
        className,
      )}
    >
      <div className={cn("overflow-hidden rounded-md bg-secondary", wide ? "h-36" : "h-28")}>
        <img
          src={z.photo}
          alt={z.name}
          loading="lazy"
          style={{ objectPosition: z.photoPos }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-1.5 pb-1.5">
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <h3 className="truncate text-[0.98rem] font-semibold">{z.name}</h3>
          <GradeBadge grade={z.grade} />
        </div>
        <p className="num mt-1 text-[0.95rem] font-semibold">
          {fmtMln(z.priceFrom)}–{fmtMln(z.priceTo)} млн ₽
        </p>
        <p className="mt-0.5 text-[0.84rem] text-muted-foreground">
          {z.district} · {z.deadline}
        </p>
        {wide && dev && (
          <p className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[0.82rem] text-muted-foreground">
            <span>{dev.name}</span>
            <span className="num">{z.pricePerM2} тыс ₽/м²</span>
          </p>
        )}
      </div>
    </Link>
  );
};

export default ZhkCard;
