import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { LogParserService } from '../services/logParserService.js';
import { ReportService } from '../services/reportService.js';
import pino from 'pino';

const logger = pino();

const uploadParamsSchema = z.object({});

const parser = new LogParserService();
const reportSvc = new ReportService();

export async function uploadLogHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  uploadParamsSchema.parse(request.body ?? {});

  const mp = await request.file();
  if (!mp) {
    reply.status(400).send({ error: 'No file uploaded. Use field name "file".' });
    return;
  }

  const { filename, mimetype } = mp;
  const stream = mp.file;
  logger.info({ filename, mimetype }, 'Received upload');

  try {
    const stats = await parser.parseStream(stream);
    const stored = await reportSvc.presistRepos(stats, filename ?? 'unknown.log', stats.totalBytes);
    reply.status(201).send({ id: stored.id, meta: stored });
  } catch (err) {
    logger.error({ err }, 'Failed processing upload');
    reply.status(500).send({ error: 'Failed to process file' });
  }
}

export async function getReportHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const paramSchema = z.object({ id: z.string().uuid() });
  const { id } = paramSchema.parse(request.params as unknown);
  const data = await reportSvc.readReport(id);
  if (!data) {
    reply.status(404).send({ error: 'Report not found' });
    return;
  }
  reply.send(data);
}

export async function listReportsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const list = await reportSvc.listReports();
  reply.send({ reports: list });
}
