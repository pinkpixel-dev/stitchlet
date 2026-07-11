import { ArrowLeft, FileText, Image as ImageIcon, Save, X } from "lucide-react";
import { type ChangeEvent, type SyntheticEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Field, SelectInput, TextArea, TextInput } from "../components/field";
import { createProject, uploadProjectPdf, uploadProjectPhoto } from "../lib/api";

export function NewProjectPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  }

  function handlePdfChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      status: String(formData.get("status") ?? "active") as "active" | "paused" | "finished" | "frogged",
      yarnType: optionalString(formData.get("yarnType")),
      yarnWeight: optionalString(formData.get("yarnWeight")),
      colorsUsed: optionalString(formData.get("colorsUsed")),
      hookSize: optionalString(formData.get("hookSize")),
      finishedSize: optionalString(formData.get("finishedSize")),
      notes: optionalString(formData.get("notes")),
    };

    try {
      const response = await createProject(payload);
      const projectId = response.project.id;

      if (photoFile) {
        await uploadProjectPhoto(projectId, photoFile);
      }
      if (pdfFile) {
        await uploadProjectPdf(projectId, pdfFile);
      }

      navigate(`/projects/${projectId}`);
    } catch {
      setError("Project could not be saved.");
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-lg border border-(--border) bg-(--shell) p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Link className="inline-flex items-center gap-2 text-sm text-(--muted) hover:text-(--text)" to="/">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-semibold">Create project</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-(--muted)">
            Save the core project details to your local Stitchlet database.
          </p>
        </div>
        <Button disabled={isSaving} form="new-project-form" type="submit" variant="primary">
          <Save size={17} />
          {isSaving ? "Saving..." : "Save project"}
        </Button>
      </header>

      {error ? (
        <div className="rounded-lg border border-(--border) bg-(--surface-soft) p-4 text-sm text-(--muted)">
          {error}
        </div>
      ) : null}

      <form className="grid gap-4 lg:grid-cols-[1fr_20rem]" id="new-project-form" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-lg border border-(--border) bg-(--shell) p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project title">
              <TextInput name="title" placeholder="Strawberry Bunny" required />
            </Field>
            <Field label="Status">
              <SelectInput defaultValue="active" name="status">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="finished">Finished</option>
                <option value="frogged">Frogged</option>
              </SelectInput>
            </Field>
            <Field label="Yarn type">
              <TextInput name="yarnType" placeholder="Premier Parfait Chunky" />
            </Field>
            <Field label="Yarn weight">
              <TextInput name="yarnWeight" placeholder="6 super bulky" />
            </Field>
            <Field label="Colors used">
              <TextInput name="colorsUsed" placeholder="pink, cream, green" />
            </Field>
            <Field label="Hook size">
              <TextInput name="hookSize" placeholder="4.0mm" />
            </Field>
            <Field label="Finished size">
              <TextInput name="finishedSize" placeholder="10 inches" />
            </Field>
          </div>
          <Field label="Notes">
            <TextArea name="notes" placeholder="Pattern changes, sizing notes, gift details, or anything useful." />
          </Field>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-(--border) bg-(--shell) p-5">
            <h2 className="text-base font-semibold">Files</h2>
            <div className="mt-4 space-y-3">
              {photoFile ? (
                <div className="flex items-center justify-between gap-2 rounded-md border border-(--border) bg-(--surface) px-4 py-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-(--text)">
                    <ImageIcon className="shrink-0" size={16} />
                    <span className="truncate">{photoFile.name}</span>
                  </span>
                  <button
                    className="shrink-0 text-(--muted) hover:text-(--text)"
                    onClick={() => {
                      setPhotoFile(null);
                      if (photoInputRef.current) photoInputRef.current.value = "";
                    }}
                    title="Remove main photo"
                    type="button"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  className="w-full rounded-md border border-dashed border-(--border) bg-(--surface) px-4 py-6 text-sm text-(--muted) transition hover:border-(--accent-pink) hover:text-(--text)"
                  onClick={() => photoInputRef.current?.click()}
                  type="button"
                >
                  Add main photo
                </button>
              )}
              {pdfFile ? (
                <div className="flex items-center justify-between gap-2 rounded-md border border-(--border) bg-(--surface) px-4 py-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-(--text)">
                    <FileText className="shrink-0" size={16} />
                    <span className="truncate">{pdfFile.name}</span>
                  </span>
                  <button
                    className="shrink-0 text-(--muted) hover:text-(--text)"
                    onClick={() => {
                      setPdfFile(null);
                      if (pdfInputRef.current) pdfInputRef.current.value = "";
                    }}
                    title="Remove pattern PDF"
                    type="button"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  className="w-full rounded-md border border-dashed border-(--border) bg-(--surface) px-4 py-6 text-sm text-(--muted) transition hover:border-(--accent-purple) hover:text-(--text)"
                  onClick={() => pdfInputRef.current?.click()}
                  type="button"
                >
                  Add pattern PDF
                </button>
              )}
              <input
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handlePhotoChange}
                ref={photoInputRef}
                type="file"
              />
              <input accept="application/pdf" className="hidden" onChange={handlePdfChange} ref={pdfInputRef} type="file" />
            </div>
          </div>
          <div className="rounded-lg border border-(--border) bg-(--surface-soft) p-4 text-sm leading-6 text-(--muted)">
            Photo and PDF uploads are attached once you save the project.
          </div>
        </aside>
      </form>
    </section>
  );
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : undefined;
}
