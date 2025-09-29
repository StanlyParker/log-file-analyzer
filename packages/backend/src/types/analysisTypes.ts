export interface LogStats {
  totalLines: number;
  totalBytes: number;
  levelCounts: Record<string, number>;
  topMessages: { message: string; count: number }[];
  timeFrame?: { start: string; end: string } | null;
}

export interface StoredLog {
  id: string;
  originalName: string;
  uploadedAt: string;
  sizeBytes: number;
  reportPath?: string;
}
