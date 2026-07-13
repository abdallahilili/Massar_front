import type { HTMLAttributes } from "react";
import { Loader2, Inbox } from "lucide-react";
import { cn } from "@/utils/cn";

type Tone = "neutral" | "info" | "warning" | "success" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  info: "bg-accent-100 text-accent-700",
  warning: "bg-gold-100 text-gold-800",
  success: "bg-primary-100 text-primary-800",
  danger: "bg-red-100 text-red-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-(--radius-lg) border border-neutral-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b border-neutral-100 px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-neutral-500">{clamped.toFixed(0)}٪ من الملف مكتمل</p>
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-neutral-500">
      <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-(--radius-lg) border border-dashed border-neutral-300 py-12 text-center">
      <div className="text-neutral-300">{icon ?? <Inbox className="h-8 w-8" />}</div>
      <p className="font-medium text-neutral-700">{title}</p>
      {description && <p className="max-w-xs text-sm text-neutral-500">{description}</p>}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-(--radius-md) border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}
