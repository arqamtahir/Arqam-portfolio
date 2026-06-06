import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-2xl transition-colors", {
  variants: {
    variant: {
      default: "border border-border bg-surface",
      muted: "border border-border bg-surface-muted",
      elevated: "border border-border bg-elevated shadow-soft",
      glass: "border border-border/60 glass",
      outline: "border border-border-strong bg-transparent",
    },
    interactive: {
      true: "group hover:border-border-strong hover:shadow-elevated",
      false: "",
    },
    padding: {
      none: "",
      sm: "p-5",
      md: "p-6 md:p-7",
      lg: "p-7 md:p-9",
    },
  },
  defaultVariants: { variant: "default", interactive: false, padding: "md" },
});

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({
  className,
  variant,
  interactive,
  padding,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, interactive, padding }), className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-2 text-sm leading-relaxed text-muted", className)} {...props} />
  );
}
