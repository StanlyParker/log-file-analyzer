import Fastify, { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';
import logRoutes from './routes/logRoutes.js';
import path from 'path';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

dotenv.config();

const logger =
  process.env.NODE_ENV === 'development'
    ? {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }
    : { level: 'info' };

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger });

  void app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  });

  void app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? '*',
  });

  app.get('/api/health', async () => ({ status: 'ok' }));

  void app.register(
    async function (instance) {
      await logRoutes(instance);
    },
    { prefix: '/api' },
  );

  const reportDir = process.env.REPORT_DIR ?? 'reports';
  app.register(import('@fastify/static'), {
    root: path.resolve(process.cwd(), reportDir),
    prefix: '/reports/',
    decorateReply: false,
  });

  return app;
}
