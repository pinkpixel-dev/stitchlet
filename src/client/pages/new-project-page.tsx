import { ArrowLeft, Save } from "lucide-react";
import { type SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Field, SelectInput, TextArea, TextInput } from "../components/field";
import { createProject } from "../lib/api";

export function NewProjectPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      navigate(`/projects/${response.project.id}`);
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
              <button className="w-full rounded-md border border-dashed border-(--border) bg-(--surface) px-4 py-6 text-sm text-(--muted) transition hover:border-(--accent-pink) hover:text-(--text)" type="button">
                Add main photo
              </button>
              <button className="w-full rounded-md border border-dashed border-(--border) bg-(--surface) px-4 py-6 text-sm text-(--muted) transition hover:border-(--accent-purple) hover:text-(--text)" type="button">
                Add pattern PDF
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-(--border) bg-(--surface-soft) p-4 text-sm leading-6 text-(--muted)">
            Phase 1 keeps file controls visual only. Upload handling gets wired when photos and PDFs are implemented.
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
