import React, { useRef, useState } from "react";
import axios from "axios";
import type { JSX } from "react";

type Props = {
  onUploaded?: () => void;
};

export default function UploadForm({ onUploaded }: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!inputRef.current?.files?.length) {
      setError("No file selected");
      return;
    }
    const file = inputRef.current.files[0];
    const fd = new FormData();
    fd.append("file", file);

    setUploading(true);

    try {
      const base =
        (import.meta.env.VITE_API_URL as string) ?? "http://localhost:5000";
      const res = await axios.post<{ id: string }>(
        `${base}/api/logs/upload`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setSuccess(`Uploaded (id: ${res.data.id})`);
      inputRef.current.value = "";
      onUploaded?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <div className="mb-3">
        <label htmlFor="logFile" className="form-label">
          Choose log file
        </label>
        <input
          id="logFile"
          type="file"
          className="form-control"
          ref={inputRef}
          accept=".log,.txt"
        />
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            inputRef.current && (inputRef.current.value = "");
            setError(null);
            setSuccess(null);
          }}
        >
          Clear
        </button>
      </div>

      {error && <div className="mt-3 alert alert-danger">{error}</div>}
      {success && <div className="mt-3 alert alert-success">{success}</div>}
    </form>
  );
}
