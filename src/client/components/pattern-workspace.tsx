import { ChevronDown, ChevronUp, Download, FileText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Counter, Project } from "../../shared/schemas";
import { CounterRow } from "./counter-row";

type PatternWorkspaceProps = {
  project: Project;
  counters: Counter[];
  counterError: string | null;
  onPatchCounter: (counter: Counter, input: Partial<Counter>) => void;
  onClose: () => void;
};

/**
 * Full-screen split view: the pattern PDF next to the project counters so a
 * row can be counted without closing the pattern. Side by side on large
 * screens, PDF over a docked counter panel on phones.
 */
export function PatternWorkspace({
  counterError,
  counters,
  onClose,
  onPatchCounter,
  project,
}: PatternWorkspaceProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      aria-label={`Pattern workspace for ${project.title}`}
      aria-modal="true"
      className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-(--bg)"
      role="dialog"
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-(--border) bg-(--shell) px-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <FileText className="shrink-0 text-(--accent-pink)" size={18} />
          <span className="truncate text-sm font-medium">{project.pdfFilename}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-(--border) bg-(--surface) px-3 text-sm text-(--muted) transition hover:text-(--text)"
            download={project.pdfFilename}
            href={`/api/projects/${project.id}/pdf/download`}
          >
            <Download size={15} />
            <span className="hidden sm:inline">Download</span>
          </a>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--surface) text-(--muted) transition hover:text-(--text)"
            onClick={onClose}
            ref={closeRef}
            title="Close pattern workspace"
            type="button"
          >
            <X size={17} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <iframe
          className="min-h-0 w-full flex-1 border-0"
          src={`/api/projects/${project.id}/pdf`}
          title={project.pdfFilename ?? "Pattern PDF"}
        />

        <aside className="flex shrink-0 flex-col border-t border-(--border) bg-(--shell) lg:h-auto lg:w-[22rem] lg:border-l lg:border-t-0">
          <button
            aria-expanded={isPanelOpen}
            className="flex h-12 shrink-0 items-center justify-between px-4 text-sm font-medium text-(--text)"
            onClick={() => setIsPanelOpen((value) => !value)}
            title={isPanelOpen ? "Hide counters" : "Show counters"}
            type="button"
          >
            <span>
              Counters
              {counters.length > 0 ? <span className="ml-2 text-(--muted)">{counters.length}</span> : null}
            </span>
            {isPanelOpen ? (
              <ChevronDown className="text-(--muted)" size={17} />
            ) : (
              <ChevronUp className="text-(--muted)" size={17} />
            )}
          </button>

          {isPanelOpen ? (
            <div className="min-h-0 max-h-[40dvh] flex-1 space-y-2 overflow-y-auto px-3 pb-3 lg:max-h-none">
              {counterError ? <p className="pb-1 text-sm text-(--muted)">{counterError}</p> : null}
              {counters.length === 0 ? (
                <div className="rounded-md border border-dashed border-(--border) bg-(--surface-soft) p-3 text-sm text-(--muted)">
                  No counters yet. Close the pattern to add one.
                </div>
              ) : null}
              {counters.map((counter) => (
                <CounterRow counter={counter} key={counter.id} onPatch={onPatchCounter} variant="compact" />
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </div>,
    document.body,
  );
}
