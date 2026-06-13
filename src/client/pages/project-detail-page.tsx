import { ArrowLeft, CheckCircle2, Download, FileText, Minus, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { sampleSections } from "../../shared/sample-data";
import type { Counter, Project } from "../../shared/schemas";
import { Button } from "../components/button";
import { Field, SelectInput, TextArea, TextInput } from "../components/field";
import { createCounter, deleteCounter, deleteProject, getProject, listCounters, updateCounter, updateProject } from "../lib/api";

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [counterError, setCounterError] = useState<string | null>(null);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCounter, setIsAddingCounter] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let isMounted = true;

    getProject(projectId)
      .then((response) => {
        if (isMounted) {
          setProject(response.project);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Project could not be loaded.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let isMounted = true;

    listCounters(projectId)
      .then((response) => {
        if (isMounted) {
          setCounters(response.counters);
          setCounterError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCounterError("Counters could not be loaded.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!project) {
      return;
    }

    setIsSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await updateProject(project.id, {
        title: String(formData.get("title") ?? ""),
        status: String(formData.get("status") ?? project.status) as Project["status"],
        yarnType: optionalString(formData.get("yarnType")),
        yarnWeight: optionalString(formData.get("yarnWeight")),
        colorsUsed: optionalString(formData.get("colorsUsed")),
        hookSize: optionalString(formData.get("hookSize")),
        finishedSize: optionalString(formData.get("finishedSize")),
        notes: optionalString(formData.get("notes")),
      });

      setProject(response.project);
      setIsEditing(false);
    } catch {
      setError("Project could not be updated.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!project) {
      return;
    }

    const confirmed = window.confirm(`Delete ${project.title}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(project.id);
      navigate("/");
    } catch {
      setError("Project could not be deleted.");
    }
  }

  async function handleAddCounter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!project) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      const response = await createCounter(project.id, {
        name: String(formData.get("name") ?? ""),
        type: String(formData.get("type") ?? "row") as Counter["type"],
        currentValue: numberFromForm(formData.get("currentValue"), 0),
        targetValue: optionalNumber(formData.get("targetValue")),
        notes: optionalString(formData.get("notes")),
      });

      setCounters((current) => [...current, response.counter]);
      setIsAddingCounter(false);
      setCounterError(null);
    } catch {
      setCounterError("Counter could not be added.");
    }
  }

  async function patchCounter(counter: Counter, input: Partial<Counter>) {
    try {
      const response = await updateCounter(counter.id, input);
      setCounters((current) => current.map((item) => (item.id === counter.id ? response.counter : item)));
      setCounterError(null);
    } catch {
      setCounterError("Counter could not be updated.");
    }
  }

  async function handleDeleteCounter(counter: Counter) {
    try {
      await deleteCounter(counter.id);
      setCounters((current) => current.filter((item) => item.id !== counter.id));
      setCounterError(null);
    } catch {
      setCounterError("Counter could not be deleted.");
    }
  }

  if (error && !project) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
        <Link className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)]" to="/">
          <ArrowLeft size={16} />
          Dashboard
        </Link>
        <p className="mt-4 text-sm text-[var(--muted)]">{error}</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5 text-sm text-[var(--muted)]">
        Loading project...
      </section>
    );
  }

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
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing((value) => !value)}>
              <Pencil size={17} />
              {isEditing ? "Cancel edit" : "Edit project"}
            </Button>
            <Button onClick={handleDelete} variant="ghost">
              <Trash2 size={17} />
              Delete
            </Button>
          </div>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">
          {error}
        </div>
      ) : null}

      {isEditing ? (
        <form className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5" onSubmit={handleSave}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project title">
              <TextInput defaultValue={project.title} name="title" required />
            </Field>
            <Field label="Status">
              <SelectInput defaultValue={project.status} name="status">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="finished">Finished</option>
                <option value="frogged">Frogged</option>
              </SelectInput>
            </Field>
            <Field label="Yarn type">
              <TextInput defaultValue={project.yarnType} name="yarnType" />
            </Field>
            <Field label="Yarn weight">
              <TextInput defaultValue={project.yarnWeight} name="yarnWeight" />
            </Field>
            <Field label="Colors used">
              <TextInput defaultValue={project.colorsUsed} name="colorsUsed" />
            </Field>
            <Field label="Hook size">
              <TextInput defaultValue={project.hookSize} name="hookSize" />
            </Field>
            <Field label="Finished size">
              <TextInput defaultValue={project.finishedSize} name="finishedSize" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Notes">
              <TextArea defaultValue={project.notes} name="notes" />
            </Field>
          </div>
          <div className="mt-4 flex justify-end">
            <Button disabled={isSaving} type="submit" variant="primary">
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      ) : null}

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
              <Button onClick={() => setIsAddingCounter((value) => !value)} variant="ghost">
                <Plus size={17} />
                {isAddingCounter ? "Cancel" : "Add counter"}
              </Button>
            </div>

            {counterError ? <p className="mt-3 text-sm text-[var(--muted)]">{counterError}</p> : null}

            {isAddingCounter ? (
              <form className="mt-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4" onSubmit={handleAddCounter}>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Counter name">
                    <TextInput name="name" placeholder="Body" required />
                  </Field>
                  <Field label="Type">
                    <SelectInput defaultValue="row" name="type">
                      <option value="row">Row</option>
                      <option value="round">Round</option>
                    </SelectInput>
                  </Field>
                  <Field label="Current">
                    <TextInput min={0} name="currentValue" type="number" defaultValue={0} />
                  </Field>
                  <Field label="Target">
                    <TextInput min={1} name="targetValue" placeholder="24" type="number" />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Notes">
                    <TextArea name="notes" placeholder="Optional counter note." />
                  </Field>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="submit" variant="primary">
                    Save counter
                  </Button>
                </div>
              </form>
            ) : null}

            <div className="mt-4 space-y-3">
              {counters.length === 0 ? (
                <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">
                  No counters yet. Add one for the row or round you are working on.
                </div>
              ) : null}
              {counters.map((counter) => (
                <div className="grid gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 md:grid-cols-[1fr_auto]" key={counter.id}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{counter.name}</p>
                      {counter.isCompleted ? (
                        <span className="rounded bg-[var(--chip)] px-2 py-1 text-xs text-[var(--accent-purple)]">Complete</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {counter.type === "round" ? "Round" : "Row"} {counter.currentValue}
                      {counter.targetValue ? ` / ${counter.targetValue}` : ""}
                    </p>
                    {counter.notes ? <p className="mt-2 text-sm text-[var(--muted)]">{counter.notes}</p> : null}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      className="h-11 w-12 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)]"
                      type="button"
                      title="Decrement"
                      onClick={() => patchCounter(counter, { currentValue: Math.max(0, counter.currentValue - 1), isCompleted: false })}
                    >
                      <Minus className="mx-auto" size={18} />
                    </button>
                    <button
                      className="h-11 w-12 rounded-md border border-[var(--border)] bg-[var(--accent-pink)] text-[var(--button-text)]"
                      type="button"
                      title="Increment"
                      onClick={() => patchCounter(counter, { currentValue: counter.currentValue + 1 })}
                    >
                      <Plus className="mx-auto" size={18} />
                    </button>
                    <button
                      className="h-11 w-12 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]"
                      type="button"
                      title="Reset"
                      onClick={() => patchCounter(counter, { currentValue: 0, isCompleted: false })}
                    >
                      <RotateCcw className="mx-auto" size={17} />
                    </button>
                    <button
                      className="h-11 w-12 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]"
                      type="button"
                      title="Toggle complete"
                      onClick={() => patchCounter(counter, { isCompleted: !counter.isCompleted })}
                    >
                      <CheckCircle2 className="mx-auto" size={17} />
                    </button>
                    <button
                      className="h-11 w-12 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]"
                      type="button"
                      title="Delete counter"
                      onClick={() => handleDeleteCounter(counter)}
                    >
                      <Trash2 className="mx-auto" size={17} />
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

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : undefined;
}

function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? Number(text) : undefined;
}

function numberFromForm(value: FormDataEntryValue | null, fallback: number) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? Number(text) : fallback;
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="text-right font-medium">{value ?? "Not set"}</dd>
    </div>
  );
}
