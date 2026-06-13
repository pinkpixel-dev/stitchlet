import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/app-shell";
import { DashboardPage } from "./pages/dashboard-page";
import { NewProjectPage } from "./pages/new-project-page";
import { ProjectDetailPage } from "./pages/project-detail-page";
import { SettingsPage } from "./pages/settings-page";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects/new" element={<NewProjectPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
