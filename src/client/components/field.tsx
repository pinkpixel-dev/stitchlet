import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  children: ReactNode;
  label: string;
};

export function Field({ children, label }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-(--text)">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="h-11 w-full rounded-md border border-(--border) bg-(--surface) px-3 text-sm text-(--text) outline-none transition placeholder:text-(--muted) focus:border-(--accent-pink)"
      {...props}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="min-h-28 w-full resize-y rounded-md border border-(--border) bg-(--surface) px-3 py-3 text-sm text-(--text) outline-none transition placeholder:text-(--muted) focus:border-(--accent-pink)"
      {...props}
    />
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="h-11 w-full rounded-md border border-(--border) bg-(--surface) px-3 text-sm text-(--text) outline-none transition focus:border-(--accent-pink)"
      {...props}
    />
  );
}
