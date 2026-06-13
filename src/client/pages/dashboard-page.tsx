import { ChevronRight, FileText, Grid2X2, List, Plus, Search, TimerReset } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../../shared/schemas";
import { Button } from "../components/button";
import { ProjectCard } from "../components/project-card";
import { listProjects } from "../lib/api";

const statusLabels: Record<Project["status"], string> = {
  active: "Active",
  paused: "Paused",
  finished: "Finished",
  frogged: "Frogged",
};

export function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  useEffect(() => {
    let isMounted = true;

    listProjects()
      .then((response) => {
        if (isMounted) {
          setProjects(response.projects);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Projects could not be loaded.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = projects
    .filter((project) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesNotes = project.notes?.toLowerCase().includes(query) ?? false;
        const matchesYarn = project.yarnType?.toLowerCase().includes(query) ?? false;
        const matchesHook = project.hookSize?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesNotes && !matchesYarn && !matchesHook) {
          return false;
        }
      }
      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      // Default: updated date descending
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-(--border) bg-(--shell) p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-(--muted)">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Crochet projects</h1>
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
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" size={17} />
            <input
              className="h-11 w-full rounded-md border border-(--border) bg-(--surface) pl-10 pr-3 text-sm outline-none transition placeholder:text-(--muted) focus:border-(--accent-pink)"
              placeholder="Search projects"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <select
            className="h-11 rounded-md border border-(--border) bg-(--surface) px-3 text-sm outline-none focus:border-(--accent-pink)"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="finished">Finished</option>
            <option value="frogged">Frogged</option>
          </select>
          <select
            className="h-11 rounded-md border border-(--border) bg-(--surface) px-3 text-sm outline-none focus:border-(--accent-pink)"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="updated">Updated date</option>
            <option value="title">Project title</option>
            <option value="status">Status</option>
          </select>
          <div className="grid h-11 grid-cols-2 rounded-md border border-(--border) bg-(--surface) p-1">
            <button
              className={`inline-flex items-center justify-center rounded transition ${viewMode === "grid" ? "bg-(--surface-strong) text-(--text)" : "text-(--muted) hover:text-(--text)"}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
              type="button"
            >
              <Grid2X2 size={17} />
            </button>
            <button
              className={`inline-flex items-center justify-center rounded transition ${viewMode === "list" ? "bg-(--surface-strong) text-(--text)" : "text-(--muted) hover:text-(--text)"}`}
              onClick={() => setViewMode("list")}
              title="List view"
              type="button"
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-(--border) bg-(--surface-soft) p-4 text-sm text-(--muted)">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-(--border) bg-(--shell) p-5 text-sm text-(--muted)">
          Loading projects...
        </div>
      ) : null}

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length > 0 && filteredProjects.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-(--border) bg-(--surface-soft) p-8 text-center text-sm text-(--muted)">
              No projects match your search filters.
            </div>
          )}
          <Link
            className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-(--border) bg-(--surface-soft) p-6 text-center transition hover:border-(--accent-purple)"
            to="/projects/new"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-(--chip) text-(--accent-pink)">
              <Plus size={22} />
            </div>
            <h2 className="mt-4 text-base font-semibold">Start a new project</h2>
            <p className="mt-2 max-w-64 text-sm leading-6 text-(--muted)">
              Add the pattern, yarn, hook size, and notes you need before the first row.
            </p>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-(--border) bg-(--shell) overflow-hidden">
          {projects.length === 0 ? (
            <p className="p-5 text-sm text-(--muted)">No projects yet.</p>
          ) : filteredProjects.length === 0 ? (
            <p className="p-5 text-sm text-(--muted)">No projects match your search filters.</p>
          ) : null}
          {filteredProjects.map((project, i) => (
            <Link
              className={`flex items-center gap-4 px-5 py-4 transition hover:bg-(--surface) ${i > 0 ? "border-t border-(--border)" : ""}`}
              key={project.id}
              to={`/projects/${project.id}`}
            >
              {/* Thumbnail */}
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-(--border) bg-(--surface-strong)">
                {project.photoPath ? (
                  <img
                    alt={project.title}
                    className="h-full w-full object-cover"
                    src={`/api/projects/${project.id}/photo`}
                  />
                ) : null}
              </div>

              {/* Title + meta */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{project.title}</p>
                <p className="mt-0.5 text-xs text-(--muted)">
                  {project.hookSize ?? "—"} · {project.yarnType ?? "—"}
                </p>
              </div>

              {/* Status chip */}
              <span className="shrink-0 rounded-md bg-(--chip) px-2 py-1 text-xs font-medium text-(--text)">
                {statusLabels[project.status]}
              </span>

              {/* PDF indicator */}
              {project.pdfFilename ? (
                <FileText className="shrink-0 text-(--accent-purple)" size={16} />
              ) : null}

              {/* Counter indicator */}
              <TimerReset className="shrink-0 text-(--accent-pink)" size={16} />

              <ChevronRight className="shrink-0 text-(--muted)" size={16} />
            </Link>
          ))}
          <Link
            className="flex items-center gap-3 border-t border-(--border) px-5 py-4 text-sm text-(--muted) transition hover:bg-(--surface) hover:text-(--text)"
            to="/projects/new"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-(--border)">
              <Plus size={15} />
            </div>
            New project
          </Link>
        </div>
      )}
    </section>
  );
}
