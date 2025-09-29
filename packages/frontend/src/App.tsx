import UploadForm from "./components/UploadForm";
import ReportsList from "../components/ReportsList";
import { useState } from "react";
import type { JSX } from "react";

export default function App(): JSX.Element {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());

  function onUploaded(): void {
    setRefreshKey(Date.now());
  }

  return (
    <div className="container py-5">
      <header className="mb-4">
        <h1 className="h3">Log File Analyzer</h1>
        <p className="text-muted">
          Upload logs and get quick analysis reports.
        </p>
      </header>

      <div className="mb-4">
        <UploadForm onUploaded={onUploaded} />
      </div>

      <ReportsList refreshKey={refreshKey} />
    </div>
  );
}
