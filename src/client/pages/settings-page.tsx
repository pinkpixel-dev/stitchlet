import { useState } from "react";
import { Database, Download, HardDrive, Shield, SunMoon, Upload, AlertTriangle, RefreshCw } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { Button } from "../components/button";
import { restoreBackup } from "../lib/api";

const settings = [
  {
    icon: HardDrive,
    label: "Storage",
    value: "Local uploads folder",
  },
  {
    icon: Database,
    label: "Database",
    value: "SQLite at ./data/stitchlet.db",
  },
  {
    icon: Shield,
    label: "Access",
    value: "Single-user scaffold",
  },
];

export function SettingsPage() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = () => {
    window.location.href = "/api/system/backup";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setShowConfirm(true);
      setError(null);
    }
  };

  const handleConfirmRestore = async () => {
    if (!pendingFile) return;

    setShowConfirm(false);
    setIsRestoring(true);
    setRestoreStatus("Uploading backup file...");
    setError(null);

    try {
      await restoreBackup(pendingFile);
      setRestoreStatus("Backup uploaded! Server is replacing files and restarting...");

      // Count down 5 seconds before reloading to let the server reboot
      let secondsLeft = 5;
      const interval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft <= 0) {
          clearInterval(interval);
          window.location.href = "/";
        } else {
          setRestoreStatus(`Server is restarting... Reconnecting in ${secondsLeft}s`);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to restore backup.");
      setIsRestoring(false);
      setPendingFile(null);
    }
  };

  const handleCancelRestore = () => {
    setPendingFile(null);
    setShowConfirm(false);
  };

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-(--border) bg-(--shell) p-5">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--muted)">
          Keep the first version boring in the best way: local storage, clear settings, and no surprise cloud anything.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {isRestoring && (
        <div className="rounded-lg border border-(--accent-pink)/30 bg-(--accent-pink)/5 p-6 text-center space-y-4">
          <RefreshCw className="mx-auto text-(--accent-pink) animate-spin" size={32} />
          <h3 className="text-lg font-semibold">Restoring Archive</h3>
          <p className="text-sm text-(--muted) max-w-md mx-auto">
            {restoreStatus}
          </p>
        </div>
      )}

      {showConfirm && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={22} />
            <div>
              <h3 className="text-lg font-semibold text-yellow-400">Confirm Archive Restore</h3>
              <p className="mt-1 text-sm text-(--muted)">
                Are you sure you want to restore from <span className="font-semibold text-(--text)">{pendingFile?.name}</span>?
                This will overwrite all current projects, notes, photos, and PDFs. This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={handleCancelRestore}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmRestore}>
              Yes, Restore Backup
            </Button>
          </div>
        </div>
      )}

      {!isRestoring && !showConfirm && (
        <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            {/* Appearance Section */}
            <section className="rounded-lg border border-(--border) bg-(--shell) p-5">
              <h2 className="text-base font-semibold">Appearance</h2>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-md border border-(--border) bg-(--surface) p-4">
                <div className="flex items-center gap-3">
                  <SunMoon className="text-(--accent-purple)" size={20} />
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="mt-1 text-sm text-(--muted)">Dark/Light Mode</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </section>

            {/* Backup & Restore Section */}
            <section className="rounded-lg border border-(--border) bg-(--shell) p-5">
              <h2 className="text-base font-semibold">Backup & Restore</h2>
              <p className="mt-2 text-sm text-(--muted)">
                Export your entire local Stitchlet library (SQLite database, upload files, photos, patterns) or restore a previously saved backup.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between rounded-md border border-(--border) bg-(--surface) p-4">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Download size={16} className="text-(--accent-pink)" />
                      Export library
                    </h3>
                    <p className="mt-1.5 text-xs text-(--muted) leading-relaxed">
                      Download a compressed ZIP archive containing your local database and all project attachments.
                    </p>
                  </div>
                  <Button variant="secondary" onClick={handleExport} className="mt-4 w-full">
                    Export Backup
                  </Button>
                </div>

                <div className="flex flex-col justify-between rounded-md border border-(--border) bg-(--surface) p-4">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Upload size={16} className="text-(--accent-purple)" />
                      Import library
                    </h3>
                    <p className="mt-1.5 text-xs text-(--muted) leading-relaxed">
                      Upload a previously exported Stitchlet ZIP file to restore your entire project library.
                    </p>
                  </div>
                  <label className="mt-4 block w-full">
                    <span className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-(--border) bg-(--surface-strong) text-sm font-medium transition hover:border-(--accent-pink) text-(--text)">
                      Choose file
                    </span>
                    <input
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>

          <aside className="rounded-lg border border-(--border) bg-(--shell) p-5 h-fit">
            <h2 className="text-base font-semibold">Self-hosted status</h2>
            <div className="mt-4 space-y-3">
              {settings.map((item) => (
                <div className="flex gap-3 rounded-md border border-(--border) bg-(--surface) p-3" key={item.label}>
                  <item.icon className="mt-0.5 text-(--accent-pink)" size={18} />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-(--muted)">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
