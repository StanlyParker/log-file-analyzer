export type LogStats = {
  totalLines: number;
  totalBytes: number;
  levelCounts: Record<string, number>;
  topMessages: { message: string; count: number }[];
  timeFrame?: { start: string; end: string } | null;
};

export type ReportEnvelope = {
  meta: {
    id: string;
    originalName: string;
    uploadedAt: string;
    sizeBytes: number;
    reportPath?: string;
  };
  stats: LogStats;
};
