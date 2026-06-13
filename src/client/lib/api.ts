import type {
  Counter,
  CreateCounterInput,
  CreateCustomSectionInput,
  CreateProjectInput,
  CustomSection,
  Project,
  UpdateCounterInput,
  UpdateCustomSectionInput,
  UpdateProjectInput,
} from "../../shared/schemas";

type ProjectsResponse = {
  projects: Project[];
};

type ProjectResponse = {
  project: Project;
};

type CountersResponse = {
  counters: Counter[];
};

type CounterResponse = {
  counter: Counter;
};

type SectionsResponse = {
  sections: CustomSection[];
};

type SectionResponse = {
  section: CustomSection;
};

export async function listProjects() {
  return request<ProjectsResponse>("/api/projects");
}

export async function createProject(input: CreateProjectInput) {
  return request<ProjectResponse>("/api/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getProject(id: string) {
  return request<ProjectResponse>(`/api/projects/${id}`);
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  return request<ProjectResponse>(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Project could not be deleted.");
  }
}

export async function listCounters(projectId: string) {
  return request<CountersResponse>(`/api/projects/${projectId}/counters`);
}

export async function createCounter(projectId: string, input: CreateCounterInput) {
  return request<CounterResponse>(`/api/projects/${projectId}/counters`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCounter(id: string, input: UpdateCounterInput) {
  return request<CounterResponse>(`/api/counters/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteCounter(id: string) {
  const response = await fetch(`/api/counters/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Counter could not be deleted.");
  }
}

export async function listSections(projectId: string) {
  return request<SectionsResponse>(`/api/projects/${projectId}/sections`);
}

export async function createSection(projectId: string, input: CreateCustomSectionInput) {
  return request<SectionResponse>(`/api/projects/${projectId}/sections`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateSection(id: string, input: UpdateCustomSectionInput) {
  return request<SectionResponse>(`/api/sections/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteSection(id: string) {
  const response = await fetch(`/api/sections/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Section could not be deleted.");
  }
}

export async function uploadProjectPhoto(projectId: string, file: File) {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(`/api/projects/${projectId}/photo`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Photo upload failed.");
  }

  return response.json() as Promise<ProjectResponse>;
}

export async function deleteProjectPhoto(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}/photo`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Photo could not be deleted.");
  }
}

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed.");
  }

  return response.json() as Promise<T>;
}

