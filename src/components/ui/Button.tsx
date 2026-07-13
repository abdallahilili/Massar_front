import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-(--radius-md) font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900",
        secondary: "bg-gold-400 text-neutral-900 hover:bg-gold-500",
        outline: "border border-neutral-300 bg-transparent text-neutral-800 hover:bg-neutral-100",
        ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-primary-600 text-white hover:bg-primary-700",
        link: "bg-transparent text-primary-700 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
        xl: "h-[3.25rem] px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
