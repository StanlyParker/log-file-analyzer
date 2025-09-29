import { FastifyInstance } from 'fastify';
import {
  uploadLogHandler,
  getReportHandler,
  listReportsHandler,
} from '../controllers/logController.js';

export default async function logsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/logs/upload', uploadLogHandler);
  fastify.get('/logs/:id/report', getReportHandler);
  fastify.get('/logs', listReportsHandler);
}
