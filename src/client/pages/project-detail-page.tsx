import { ArrowLeft, Download, FileText, Minus, Pencil, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { sampleCounters, sampleProjects, sampleSections } from "../../shared/sample-data";
import { Button } from "../components/button";

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const project = sampleProjects.find((item) => item.id === projectId) ?? sampleProjects[0];
  const counters = sampleCounters.filter((counter) => counter.projectId === project.id);
  const sections = sampleSections.filter((section) => section.projectId === project.id);

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
        <Link className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)]" to="/">
          <ArrowLeft size={16} />
          Dashboard
        </Link>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{project.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {project.status} · {project.hookSize ?? "Hook not set"} · {project.yarnType ?? "Yarn not set"}
            </p>
          </div>
          <Button>
            <Pencil size={17} />
            Edit project
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-4">
          <div className="aspect-[4/3] rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <div className="flex h-full items-end rounded-md border border-dashed border-[var(--border)] p-3 text-sm text-[var(--muted)]">
              Project photo
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
            <h2 className="text-base font-semibold">Materials</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow label="Yarn" value={project.yarnType} />
              <DetailRow label="Weight" value={project.yarnWeight} />
              <DetailRow label="Colors" value={project.colorsUsed} />
              <DetailRow label="Hook" value={project.hookSize} />
              <DetailRow label="Finished size" value={project.finishedSize} />
            </dl>
          </div>
        </aside>

        <div className="space-y-4">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold">Pattern</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{project.pdfFilename ?? "No PDF attached yet."}</p>
              </div>
              <div className="flex gap-2">
                <Button>
                  <FileText size={17} />
                  View PDF
                </Button>
                <Button variant="ghost">
                  <Download size={17} />
                  Download
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Counters</h2>
              <Button variant="ghost">
                <Plus size={17} />
                Add counter
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {counters.map((counter) => (
                <div className="grid gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 md:grid-cols-[1fr_auto]" key={counter.id}>
                  <div>
                    <p className="font-medium">{counter.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {counter.type === "round" ? "Round" : "Row"} {counter.currentValue}
                      {counter.targetValue ? ` / ${counter.targetValue}` : ""}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="h-11 w-14 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)]" type="button" title="Decrement">
                      <Minus className="mx-auto" size={18} />
                    </button>
                    <button className="h-11 w-14 rounded-md border border-[var(--border)] bg-[var(--accent-pink)] text-[var(--button-text)]" type="button" title="Increment">
                      <Plus className="mx-auto" size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
            <h2 className="text-base font-semibold">Custom sections</h2>
            <div className="mt-4 space-y-3">
              {sections.map((section) => (
                <article className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4" key={section.id}>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{section.content}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
            <h2 className="text-base font-semibold">Notes</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{project.notes ?? "No notes yet."}</p>
          </section>
        </div>
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="text-right font-medium">{value ?? "Not set"}</dd>
    </div>
  );
}
