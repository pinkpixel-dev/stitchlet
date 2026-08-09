import { CheckCircle2, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { Counter } from "../../shared/schemas";

type CounterRowProps = {
  counter: Counter;
  onPatch: (counter: Counter, input: Partial<Counter>) => void;
  onDelete?: (counter: Counter) => void;
  variant?: "full" | "compact";
};

const controlClass = "h-11 rounded-md border border-(--border) bg-(--surface-strong) text-(--muted)";

/**
 * A single counter with its controls.
 *
 * "full" is the project page row (includes delete). "compact" keeps the
 * label and controls together in the pattern workspace without crowding the
 * PDF on phones.
 */
export function CounterRow({ counter, onDelete, onPatch, variant = "full" }: CounterRowProps) {
  const isCompact = variant === "compact";

  const label = (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium">{counter.name}</p>
        {counter.isCompleted ? (
          <span className="rounded bg-(--chip) px-2 py-1 text-xs text-(--accent-purple)">Complete</span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-(--muted)">
        {counter.type === "round" ? "Round" : "Row"} {counter.currentValue}
        {counter.targetValue ? ` / ${counter.targetValue}` : ""}
      </p>
      {counter.notes && !isCompact ? <p className="mt-2 text-sm text-(--muted)">{counter.notes}</p> : null}
    </div>
  );

  const controls = (
    <div
      className={
        isCompact
          ? "grid grid-cols-4 gap-1.5 min-[360px]:w-[12.125rem]"
          : "grid grid-cols-5 gap-2"
      }
    >
      <button
        className={`${controlClass} ${isCompact ? "w-full text-(--text)" : "w-12 text-(--text)"}`}
        type="button"
        title="Decrement"
        onClick={() => onPatch(counter, { currentValue: Math.max(0, counter.currentValue - 1), isCompleted: false })}
      >
        <Minus className="mx-auto" size={18} />
      </button>
      <button
        className={`h-11 rounded-md border border-(--border) bg-(--accent-pink) text-(--button-text) ${isCompact ? "w-full" : "w-12"}`}
        type="button"
        title="Increment"
        onClick={() => onPatch(counter, { currentValue: counter.currentValue + 1 })}
      >
        <Plus className="mx-auto" size={18} />
      </button>
      <button
        className={`${controlClass} ${isCompact ? "w-full" : "w-12"}`}
        type="button"
        title="Reset"
        onClick={() => onPatch(counter, { currentValue: 0, isCompleted: false })}
      >
        <RotateCcw className="mx-auto" size={17} />
      </button>
      <button
        className={`${controlClass} ${isCompact ? "w-full" : "w-12"}`}
        type="button"
        title="Toggle complete"
        onClick={() => onPatch(counter, { isCompleted: !counter.isCompleted })}
      >
        <CheckCircle2 className="mx-auto" size={17} />
      </button>
      {onDelete ? (
        <button
          className={`${controlClass} w-12`}
          type="button"
          title="Delete counter"
          onClick={() => onDelete(counter)}
        >
          <Trash2 className="mx-auto" size={17} />
        </button>
      ) : null}
    </div>
  );

  if (isCompact) {
    return (
      <div className="grid gap-2 rounded-md border border-(--border) bg-(--surface) p-2 min-[360px]:grid-cols-[minmax(0,1fr)_auto] min-[360px]:items-center">
        {label}
        {controls}
      </div>
    );
  }

  return (
    <div className="grid gap-3 rounded-md border border-(--border) bg-(--surface) p-3 md:grid-cols-[1fr_auto]">
      {label}
      {controls}
    </div>
  );
}
