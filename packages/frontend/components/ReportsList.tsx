import axios from "axios";
import { useEffect, useState, type JSX } from "react";

export type ReportMeta = {
  id: string;
  originalName: string;
  uploadedAt: string;
  sizeBytes: string;
  reportPath?: string;
};

type Props = {
  refreshKey?: number;
};

export default function ReportsList({ refreshKey }: Props): JSX.Element {
  const [reports, setReports] = useState<ReportMeta[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, [refreshKey]);

  async function load(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const base =
        (import.meta.env.VITE_API_URL as string) ?? "http://localhost:5000";
      const res = await axios.get<{ reports: ReportMeta[] }>(
        `${base}/api/logs`,
      );
      setReports(res.data.reports);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function viewPort(id: string): Promise<void> {
    const base =
      (import.meta.env.VITE_API_URL as string) ?? "http://localhost:5000";
    window.open(`${base}/api/logs/${id}/report`, "_blank", "noopener");
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h5">Reports</h2>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => void load()}
        >
          Refresh
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {reports.map((r) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={r.id}
          >
            <div>
              <div className="fw-bold">{r.originalName}</div>
              <div className="text-muted small">
                {new Date(r.uploadedAt).toLocaleString()} • {r.sizeBytes} bytes
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => void viewPort(r.id)}
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>

      {reports.length === 0 && !loading && (
        <div className="mt-3 text-muted">No reports yet.</div>
      )}
    </div>
  );
}
