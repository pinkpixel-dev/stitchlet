import { FileText, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import type { Counter, Project } from "../../shared/schemas";

type ProjectCardProps = {
  counters: Counter[];
  project: Project;
};

const statusLabels: Record<Project["status"], string> = {
  active: "Active",
  paused: "Paused",
  finished: "Finished",
  frogged: "Frogged",
};

export function ProjectCard({ counters, project }: ProjectCardProps) {
  const activeCounter = counters.find((counter) => counter.projectId === project.id);

  return (
    <Link
      className="group block rounded-lg border border-(--border) bg-(--surface) p-3 transition hover:-translate-y-0.5 hover:border-(--accent-pink) hover:bg-(--surface-strong)"
      to={`/projects/${project.id}`}
    >
      <div className="aspect-4/3 rounded-md border border-(--border) bg-(--surface-strong) p-3">
        <div className="flex h-full items-end justify-between">
          <div className="rounded-md bg-(--chip) px-2 py-1 text-xs font-medium text-(--text)">
            {statusLabels[project.status]}
          </div>
          {project.pdfFilename ? <FileText className="text-(--accent-purple)" size={20} /> : null}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold leading-tight group-hover:text-(--accent-pink)">
            {project.title}
          </h2>
          <span className="whitespace-nowrap text-xs text-(--muted)">Updated today</span>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-(--muted)">Hook</dt>
            <dd className="mt-1 font-medium">{project.hookSize ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-xs text-(--muted)">Yarn</dt>
            <dd className="mt-1 truncate font-medium">{project.yarnWeight ?? project.yarnType ?? "Not set"}</dd>
          </div>
        </dl>
        {activeCounter ? (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-(--border) bg-(--shell) px-3 py-2 text-sm">
            <TimerReset size={16} className="text-(--accent-pink)" />
            <span className="text-(--muted)">{activeCounter.name}</span>
            <span className="ml-auto font-semibold">
              {activeCounter.currentValue}
              {activeCounter.targetValue ? ` / ${activeCounter.targetValue}` : ""}
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
