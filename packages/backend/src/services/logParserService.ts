import { Readable } from 'stream';

import type { LogStats } from '../types/analysisTypes.js';
import { processLines } from '../utils/lineReader.js';

export class LogParserService {
  public async parseStream(stream: Readable): Promise<LogStats> {
    let totalLines = 0;
    let totalBytes = 0;
    const levelCounts: Record<string, number> = {};
    const messageCounts: Map<string, number> = new Map();
    let firstTimestamp: Date | null = null;
    const lastTimestamp: Date | null = null;

    await processLines(stream, (line: string): void => {
      totalLines += 1;
      totalBytes += Buffer.byteLength(line, 'utf-8');

      const isoMatch = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)/);
      if (isoMatch) {
        const dt = new Date(isoMatch[1]);
        if (!Number.isNaN(dt.getTime())) {
          if (!firstTimestamp) firstTimestamp = dt;
        }
      }

      const upper = line.toUpperCase();
      if (upper.includes(' ERROR')) {
        levelCounts.ERROR = (levelCounts.ERROR ?? 0) + 1;
      } else if (upper.includes(' WARN') || upper.includes(' WARNING')) {
        levelCounts.WARN = (levelCounts.DEBUG ?? 0) + 1;
      } else if (upper.includes(' DEBUG')) {
        levelCounts.DEBUG = (levelCounts.DEBUG ?? 0) + 1;
      } else {
        levelCounts.INFO = (levelCounts.INFO ?? 0) + 1;
      }

      const message = this.extractMessage(line);
      const prev = messageCounts.get(message) ?? 0;
      messageCounts.set(message, prev + 1);
    });

    const topMessages = [...messageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }));

    const timeFrame = firstTimestamp
      ? {
          start: (firstTimestamp as Date).toISOString(),
          end: ((lastTimestamp ?? firstTimestamp) as Date).toISOString(),
        }
      : null;

    const stats: LogStats = {
      totalLines,
      totalBytes,
      levelCounts,
      topMessages,
      timeFrame,
    };
    return stats;
  }

  private extractMessage(line: string): string {
    const afterTimestamp = line.replace(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?\s*)/,
      '',
    );
    const afterLevel = afterTimestamp.replace(/\b(ERROR|WARN|WARNING|INFO|DEBUG)\b[:\s-]*/i, '');
    return afterLevel.trim().slice(0, 200);
  }
}
