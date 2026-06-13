import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { type ChangeEvent, type SyntheticEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Counter, CustomSection, Project } from "../../shared/schemas";
import { Button } from "../components/button";
import { Field, SelectInput, TextArea, TextInput } from "../components/field";
import {
  createCounter,
  createSection,
  deleteCounter,
  deleteProject,
  deleteProjectPhoto,
  deleteSection,
  getProject,
  listCounters,
  listSections,
  updateCounter,
  updateProject,
  uploadProjectPhoto,
} from "../lib/api";

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [counterError, setCounterError] = useState<string | null>(null);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCounter, setIsAddingCounter] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [materialLabel, setMaterialLabel] = useState("");
  const [materialValue, setMaterialValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let isMounted = true;

    listSections(projectId)
      .then((response) => {
        if (isMounted) {
          setSections(response.sections);
          setSectionError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSectionError("Materials could not be loaded.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  async function handleSave(event: SyntheticEvent<HTMLFormElement>) {
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

  async function handleAddCounter(event: SyntheticEvent<HTMLFormElement>) {
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

  async function handleAddMaterial() {
    if (!project) return;

    const title = materialLabel.trim();
    const content = materialValue.trim();

    if (!title) {
      setSectionError("Label is required.");
      return;
    }

    try {
      const response = await createSection(project.id, { title, content });
      setSections((current) => [...current, response.section]);
      setIsAddingMaterial(false);
      setMaterialLabel("");
      setMaterialValue("");
      setSectionError(null);
    } catch {
      setSectionError("Material could not be added.");
    }
  }

  async function handleDeleteSection(section: CustomSection) {
    try {
      await deleteSection(section.id);
      setSections((current) => current.filter((item) => item.id !== section.id));
      setSectionError(null);
    } catch {
      setSectionError("Material could not be removed.");
    }
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !project) return;

    setIsUploadingPhoto(true);
    setPhotoError(null);

    try {
      const response = await uploadProjectPhoto(project.id, file);
      setProject(response.project);
    } catch {
      setPhotoError("Photo could not be uploaded.");
    } finally {
      setIsUploadingPhoto(false);
      // Reset the input so same file can be re-selected
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  }

  async function handleDeletePhoto() {
    if (!project) return;

    try {
      await deleteProjectPhoto(project.id);
      setProject((prev) => (prev ? { ...prev, photoPath: undefined } : prev));
      setPhotoError(null);
    } catch {
      setPhotoError("Photo could not be removed.");
    }
  }

  if (error && !project) {
    return (
      <section className="rounded-lg border border-(--border) bg-(--shell) p-5">
        <Link className="inline-flex items-center gap-2 text-sm text-(--muted) hover:text-(--text)" to="/">
          <ArrowLeft size={16} />
          Dashboard
        </Link>
        <p className="mt-4 text-sm text-(--muted)">{error}</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="rounded-lg border border-(--border) bg-(--shell) p-5 text-sm text-(--muted)">
        Loading project...
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-(--border) bg-(--shell) p-5">
        <Link className="inline-flex items-center gap-2 text-sm text-(--muted) hover:text-(--text)" to="/">
          <ArrowLeft size={16} />
          Dashboard
        </Link>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{project.title}</h1>
            <p className="mt-2 text-sm text-(--muted)">
              {project.status} · {project.hookSize ?? "Hook not set"} · {project.yarnType ?? "Yarn not set"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { setIsEditing((value) => !value); setIsAddingMaterial(false); }}>
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
        <div className="rounded-lg border border-(--border) bg-(--surface-soft) p-4 text-sm text-(--muted)">
          {error}
        </div>
      ) : null}

      {isEditing ? (
        <form className="rounded-lg border border-(--border) bg-(--shell) p-5" onSubmit={handleSave}>
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

          {/* Custom materials inside edit form */}
          <div className="mt-6 border-t border-(--border) pt-5">
            <h3 className="mb-3 text-sm font-semibold">Custom materials</h3>
            {sections.length > 0 ? (
              <div className="mb-3 space-y-2">
                {sections.map((section) => (
                  <div className="flex items-center justify-between gap-3 rounded-md border border-(--border) bg-(--surface) px-3 py-2 text-sm" key={section.id}>
                    <span className="text-(--muted)">{section.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{section.content}</span>
                      <button
                        className="text-(--muted) opacity-60 hover:opacity-100"
                        onClick={() => handleDeleteSection(section)}
                        title={`Remove ${section.title}`}
                        type="button"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {sectionError ? <p className="mb-3 text-xs text-(--muted)">{sectionError}</p> : null}

            {isAddingMaterial ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Label">
                    <TextInput
                      onChange={(e) => setMaterialLabel(e.target.value)}
                      placeholder="Safety Eyes"
                      value={materialLabel}
                    />
                  </Field>
                  <Field label="Value">
                    <TextInput
                      onChange={(e) => setMaterialValue(e.target.value)}
                      placeholder="8mm"
                      value={materialValue}
                    />
                  </Field>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIsAddingMaterial(false);
                      setMaterialLabel("");
                      setMaterialValue("");
                    }}
                    type="button"
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddMaterial} type="button" variant="primary">
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <button
                className="flex items-center gap-1.5 text-xs text-(--muted) hover:text-(--text)"
                onClick={() => setIsAddingMaterial(true)}
                type="button"
              >
                <Plus size={13} />
                Add material
              </button>
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <Button disabled={isSaving} type="submit" variant="primary">
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-4">
          {/* Project photo — square */}
          <div className="aspect-square overflow-hidden rounded-lg border border-(--border) bg-(--surface-strong)">
            {project.photoPath ? (
              <div className="relative h-full w-full">
                <img
                  alt="Project photo"
                  className="h-full w-full object-cover"
                  src={`/api/projects/${project.id}/photo`}
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button
                    className="rounded bg-(--surface-strong) px-2 py-1 text-xs text-(--muted) opacity-80 hover:opacity-100"
                    onClick={() => photoInputRef.current?.click()}
                    title="Replace photo"
                    type="button"
                  >
                    Replace
                  </button>
                  <button
                    className="rounded bg-(--surface-strong) px-2 py-1 text-xs text-(--muted) opacity-80 hover:opacity-100"
                    onClick={handleDeletePhoto}
                    title="Remove photo"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-(--muted) transition-colors hover:text-(--text)"
                disabled={isUploadingPhoto}
                onClick={() => photoInputRef.current?.click()}
                type="button"
              >
                <Upload size={20} />
                {isUploadingPhoto ? "Uploading..." : "Upload photo"}
              </button>
            )}
          </div>
          <input
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handlePhotoChange}
            ref={photoInputRef}
            type="file"
          />
          {photoError ? <p className="text-xs text-(--muted)">{photoError}</p> : null}

          {/* Materials panel */}
          <div className="rounded-lg border border-(--border) bg-(--shell) p-5">
            <h2 className="text-base font-semibold">Materials</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow label="Yarn" value={project.yarnType} />
              <DetailRow label="Weight" value={project.yarnWeight} />
              <DetailRow label="Colors" value={project.colorsUsed} />
              <DetailRow label="Hook" value={project.hookSize} />
              <DetailRow label="Finished size" value={project.finishedSize} />
              {sections.map((section) => (
                <DetailRow key={section.id} label={section.title} value={section.content} />
              ))}
            </dl>
          </div>
        </aside>

        <div className="space-y-4">
          <section className="rounded-lg border border-(--border) bg-(--shell) p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold">Pattern</h2>
                <p className="mt-1 text-sm text-(--muted)">{project.pdfFilename ?? "No PDF attached yet."}</p>
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

          <section className="rounded-lg border border-(--border) bg-(--shell) p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Counters</h2>
              <Button onClick={() => setIsAddingCounter((value) => !value)} variant="ghost">
                <Plus size={17} />
                {isAddingCounter ? "Cancel" : "Add counter"}
              </Button>
            </div>

            {counterError ? <p className="mt-3 text-sm text-(--muted)">{counterError}</p> : null}

            {isAddingCounter ? (
              <form className="mt-4 rounded-md border border-(--border) bg-(--surface) p-4" onSubmit={handleAddCounter}>
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
                <div className="rounded-md border border-dashed border-(--border) bg-(--surface-soft) p-4 text-sm text-(--muted)">
                  No counters yet. Add one for the row or round you are working on.
                </div>
              ) : null}
              {counters.map((counter) => (
                <div className="grid gap-3 rounded-md border border-(--border) bg-(--surface) p-3 md:grid-cols-[1fr_auto]" key={counter.id}>
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
                    {counter.notes ? <p className="mt-2 text-sm text-(--muted)">{counter.notes}</p> : null}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      className="h-11 w-12 rounded-md border border-(--border) bg-(--surface-strong) text-(--text)"
                      type="button"
                      title="Decrement"
                      onClick={() => patchCounter(counter, { currentValue: Math.max(0, counter.currentValue - 1), isCompleted: false })}
                    >
                      <Minus className="mx-auto" size={18} />
                    </button>
                    <button
                      className="h-11 w-12 rounded-md border border-(--border) bg-(--accent-pink) text-(--button-text)"
                      type="button"
                      title="Increment"
                      onClick={() => patchCounter(counter, { currentValue: counter.currentValue + 1 })}
                    >
                      <Plus className="mx-auto" size={18} />
                    </button>
                    <button
                      className="h-11 w-12 rounded-md border border-(--border) bg-(--surface-strong) text-(--muted)"
                      type="button"
                      title="Reset"
                      onClick={() => patchCounter(counter, { currentValue: 0, isCompleted: false })}
                    >
                      <RotateCcw className="mx-auto" size={17} />
                    </button>
                    <button
                      className="h-11 w-12 rounded-md border border-(--border) bg-(--surface-strong) text-(--muted)"
                      type="button"
                      title="Toggle complete"
                      onClick={() => patchCounter(counter, { isCompleted: !counter.isCompleted })}
                    >
                      <CheckCircle2 className="mx-auto" size={17} />
                    </button>
                    <button
                      className="h-11 w-12 rounded-md border border-(--border) bg-(--surface-strong) text-(--muted)"
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

          <section className="rounded-lg border border-(--border) bg-(--shell) p-5">
            <h2 className="text-base font-semibold">Notes</h2>
            <p className="mt-3 text-sm leading-6 text-(--muted)">{project.notes ?? "No notes yet."}</p>
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
    <div className="flex items-center justify-between gap-3 border-b border-(--border) pb-3 last:border-0 last:pb-0">
      <dt className="text-(--muted)">{label}</dt>
      <dd className="text-right font-medium">{value ?? "Not set"}</dd>
    </div>
  );
}
