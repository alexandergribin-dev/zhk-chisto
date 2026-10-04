import { cn } from "@/lib/utils";
import type { Grade } from "@/data/zhk";

const bg: Record<Grade, string> = {
  A: "bg-grade-a",
  B: "bg-grade-b",
  C: "bg-grade-c",
  D: "bg-grade-d",
};

export const gradeBg = bg;

type Props = { grade: Grade; size?: "sm" | "md" | "lg"; className?: string; dim?: boolean };

const GradeBadge = ({ grade, size = "sm", className, dim }: Props) => (
  <b
    title={`Эко-оценка ${grade}`}
    className={cn(
      "inline-grid place-items-center rounded-md font-semibold not-italic text-white shrink-0 transition-opacity",
      bg[grade],
      size === "sm" && "h-6 w-6 text-xs",
      size === "md" && "h-8 w-8 text-sm",
      size === "lg" && "h-12 w-12 text-xl rounded-lg",
      dim && "opacity-30",
      className,
    )}
  >
    {grade}
  </b>
);

export default GradeBadge;
