import { Grid2X2, List, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { sampleCounters, sampleProjects } from "../../shared/sample-data";
import { Button } from "../components/button";
import { ProjectCard } from "../components/project-card";

export function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-[var(--border)] bg-[var(--shell)] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Your crochet projects</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Keep patterns, counters, materials, photos, and notes organized on your own server.
            </p>
          </div>
          <Link to="/projects/new">
            <Button variant="primary">
              <Plus size={17} />
              Create project
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={17} />
            <input
              className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] pl-10 pr-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-pink)]"
              placeholder="Search projects"
              type="search"
            />
          </label>
          <select className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--accent-pink)]">
            <option>All statuses</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Finished</option>
            <option>Frogged</option>
          </select>
          <select className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--accent-pink)]">
            <option>Updated date</option>
            <option>Project title</option>
            <option>Status</option>
          </select>
          <div className="grid h-11 grid-cols-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1">
            <button className="inline-flex items-center justify-center rounded text-[var(--text)]" type="button" title="Grid view">
              <Grid2X2 size={17} />
            </button>
            <button className="inline-flex items-center justify-center rounded text-[var(--muted)] hover:text-[var(--text)]" type="button" title="List view">
              <List size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sampleProjects.map((project) => (
          <ProjectCard counters={sampleCounters} key={project.id} project={project} />
        ))}
        <Link
          className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-6 text-center transition hover:border-[var(--accent-purple)]"
          to="/projects/new"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--chip)] text-[var(--accent-pink)]">
            <Plus size={22} />
          </div>
          <h2 className="mt-4 text-base font-semibold">Start a new project</h2>
          <p className="mt-2 max-w-64 text-sm leading-6 text-[var(--muted)]">
            Add the pattern, yarn, hook size, and notes you need before the first row.
          </p>
        </Link>
      </div>
    </section>
  );
}
