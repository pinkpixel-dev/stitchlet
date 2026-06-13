import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { Field, SelectInput, TextArea, TextInput } from "../components/field";

export function NewProjectPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Link className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)]" to="/">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-semibold">Create project</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            This scaffold captures the fields from the plan. Saving to SQLite comes next.
          </p>
        </div>
        <Button variant="primary">
          <Save size={17} />
          Save draft
        </Button>
      </header>

      <form className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4 rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project title">
              <TextInput placeholder="Strawberry Bunny" />
            </Field>
            <Field label="Status">
              <SelectInput defaultValue="active">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="finished">Finished</option>
                <option value="frogged">Frogged</option>
              </SelectInput>
            </Field>
            <Field label="Yarn type">
              <TextInput placeholder="Premier Parfait Chunky" />
            </Field>
            <Field label="Yarn weight">
              <TextInput placeholder="6 super bulky" />
            </Field>
            <Field label="Colors used">
              <TextInput placeholder="pink, cream, green" />
            </Field>
            <Field label="Hook size">
              <TextInput placeholder="4.0mm" />
            </Field>
            <Field label="Finished size">
              <TextInput placeholder="10 inches" />
            </Field>
          </div>
          <Field label="Notes">
            <TextArea placeholder="Pattern changes, sizing notes, gift details, or anything useful." />
          </Field>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
            <h2 className="text-base font-semibold">Files</h2>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--muted)] transition hover:border-[var(--accent-pink)] hover:text-[var(--text)]" type="button">
                Add main photo
              </button>
              <button className="w-full rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--muted)] transition hover:border-[var(--accent-purple)] hover:text-[var(--text)]" type="button">
                Add pattern PDF
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm leading-6 text-[var(--muted)]">
            Phase 1 keeps file controls visual only. Upload handling gets wired when photos and PDFs are implemented.
          </div>
        </aside>
      </form>
    </section>
  );
}
