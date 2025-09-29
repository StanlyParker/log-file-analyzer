import path from 'path';
import fs from 'fs/promises';
import { LogStats, StoredLog } from '../types/analysisTypes.js';
import { v4 as uuidv4 } from 'uuid';

const REPORT_DIR = process.env.REPORT_DIR ?? 'reports';

export class ReportService {
  public async presistRepos(
    stats: LogStats,
    originalName: string,
    sizeBytes: number,
  ): Promise<StoredLog> {
    await fs.mkdir(REPORT_DIR, { recursive: true });
    const id = uuidv4();
    const fileName = `${id}.json`;
    const reportPath = path.join(REPORT_DIR, fileName);
    const stored: StoredLog = {
      id,
      originalName,
      uploadedAt: new Date().toISOString(),
      sizeBytes,
      reportPath,
    };
    const body = { meta: stored, stats };
    await fs.writeFile(reportPath, JSON.stringify(body, null, 2), { encoding: 'utf-8' });
    return stored;
  }

  public async readReport(id: string): Promise<{ meta: StoredLog; stats: LogStats } | null> {
    const filePath = path.join(REPORT_DIR, `${id}.json`);
    try {
      const raw = await fs.readFile(filePath, { encoding: 'utf-8' });
      return JSON.parse(raw) as { meta: StoredLog; stats: LogStats };
    } catch {
      return null;
    }
  }

  public async listReports(): Promise<StoredLog[]> {
    await fs.mkdir(REPORT_DIR, { recursive: true });
    const files = await fs.readdir(REPORT_DIR);
    const results: StoredLog[] = [];
    for (const f of files) {
      if (f.endsWith('.json')) {
        const raw = await fs.readFile(path.join(REPORT_DIR, f), { encoding: 'utf-8' });
        const parsed = JSON.parse(raw) as { meta: StoredLog; stats: LogStats };
        results.push(parsed.meta);
      }
    }
    return results;
  }
}
