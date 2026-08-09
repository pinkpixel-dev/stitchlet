import { ChevronDown, ChevronUp, Download, FileText, X } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Counter, Project } from "../../shared/schemas";
import { getStoredVisibleCounterIds, setCounterVisibility } from "../lib/pattern-counter-visibility";
import { CounterRow } from "./counter-row";

const PdfDocumentViewer = lazy(() => import("./pdf-document-viewer"));

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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const storageKey = `stitchlet:pattern-counters:${project.id}`;
  const [visibleCounterIds, setVisibleCounterIds] = useState<string[]>(() => {
    try {
      return getStoredVisibleCounterIds(counters, window.localStorage.getItem(storageKey));
    } catch {
      return getStoredVisibleCounterIds(counters, null);
    }
  });
  const closeRef = useRef<HTMLButtonElement>(null);
  const visibleCounterIdSet = new Set(visibleCounterIds);
  const visibleCounters = counters.filter((counter) => visibleCounterIdSet.has(counter.id));

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(visibleCounterIds));
    } catch {
      // The workspace still works when browser storage is blocked.
    }
  }, [storageKey, visibleCounterIds]);

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
        <Suspense
          fallback={
            <div className="min-h-0 flex-1 bg-(--surface-strong) p-4 text-sm text-(--muted)" role="status">
              Loading PDF reader...
            </div>
          }
        >
          <PdfDocumentViewer
            filename={project.pdfFilename}
            source={`/api/projects/${project.id}/pdf`}
          />
        </Suspense>

        <aside className="flex shrink-0 flex-col border-t border-(--border) bg-(--shell) lg:h-auto lg:w-[22rem] lg:border-l lg:border-t-0">
          <div className="flex h-12 shrink-0 items-center gap-1 px-2">
            <button
              aria-controls="pattern-counter-panel"
              aria-expanded={isPanelOpen}
              className="flex h-10 min-w-0 flex-1 items-center justify-between rounded-md px-2 text-sm font-medium text-(--text) hover:bg-(--surface)"
              onClick={() => {
                setIsPanelOpen((value) => !value);
                setIsPickerOpen(false);
              }}
              title={isPanelOpen ? "Hide counters" : "Show counters"}
              type="button"
            >
              <span>
                Counters
                {visibleCounters.length > 0 ? (
                  <span className="ml-2 text-(--muted)">{visibleCounters.length}</span>
                ) : null}
              </span>
              {isPanelOpen ? (
                <ChevronDown className="shrink-0 text-(--muted)" size={17} />
              ) : (
                <ChevronUp className="shrink-0 text-(--muted)" size={17} />
              )}
            </button>

            {isPanelOpen && counters.length > 0 ? (
              <button
                aria-controls="pattern-counter-picker"
                aria-expanded={isPickerOpen}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-(--border) bg-(--surface) px-3 text-xs font-medium text-(--muted) hover:text-(--text)"
                onClick={() => setIsPickerOpen((value) => !value)}
                title={isPickerOpen ? "Close counter chooser" : "Choose counters"}
                type="button"
              >
                {isPickerOpen ? <X size={14} /> : null}
                {isPickerOpen ? "Done" : "Choose"}
              </button>
            ) : null}
          </div>

          {isPanelOpen ? (
            <div
              className="min-h-0 max-h-[28dvh] flex-1 space-y-2 overflow-y-auto px-3 pb-3 lg:max-h-none"
              id="pattern-counter-panel"
            >
              {counterError ? <p className="pb-1 text-sm text-(--muted)">{counterError}</p> : null}
              {counters.length === 0 ? (
                <div className="rounded-md border border-dashed border-(--border) bg-(--surface-soft) p-3 text-sm text-(--muted)">
                  No counters yet. Close the pattern to add one.
                </div>
              ) : null}
              {counters.length > 0 && isPickerOpen ? (
                <fieldset
                  className="rounded-md border border-(--border) bg-(--surface) p-2"
                  id="pattern-counter-picker"
                >
                  <legend className="sr-only">Choose counters to show</legend>
                  <p className="px-2 pb-1 text-xs font-medium text-(--muted)">Show in workspace</p>
                  <div className="space-y-1">
                    {counters.map((counter) => (
                      <label
                        className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 text-sm hover:bg-(--surface-strong)"
                        key={counter.id}
                      >
                        <input
                          aria-label={`Show ${counter.name} in pattern workspace`}
                          checked={visibleCounterIdSet.has(counter.id)}
                          className="h-5 w-5 shrink-0 [accent-color:var(--accent-pink)]"
                          onChange={(event) =>
                            setVisibleCounterIds((currentIds) =>
                              setCounterVisibility(currentIds, counter.id, event.target.checked),
                            )
                          }
                          type="checkbox"
                        />
                        <span className="min-w-0 flex-1 truncate">{counter.name}</span>
                        <span className="shrink-0 text-xs text-(--muted)">
                          {counter.type === "round" ? "Round" : "Row"} {counter.currentValue}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {counters.length > 0 && visibleCounters.length === 0 ? (
                <div className="rounded-md border border-dashed border-(--border) bg-(--surface-soft) p-3 text-sm text-(--muted)">
                  No counters selected. Use Choose to add one.
                </div>
              ) : null}

              {visibleCounters.map((counter) => (
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
