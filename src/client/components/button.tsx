import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[var(--accent-pink)] text-[var(--button-text)] hover:brightness-105",
  secondary: "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:border-[var(--accent-pink)]",
  ghost: "border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
};

export function Button({ children, className = "", variant = "secondary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
