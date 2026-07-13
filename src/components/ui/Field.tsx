import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const fieldBase =
  "w-full rounded-(--radius-md) border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100 disabled:text-neutral-400";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(fieldBase, icon && "pr-9", error && "border-red-400 focus:ring-red-100", className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(fieldBase, "min-h-24 resize-y", error && "border-red-400 focus:ring-red-100", className)}
      aria-invalid={Boolean(error)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(fieldBase, "appearance-none bg-white", error && "border-red-400 focus:ring-red-100", className)}
      aria-invalid={Boolean(error)}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function Label({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-neutral-700">
      {children}
      {required && <span className="mr-1 text-red-500">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}
