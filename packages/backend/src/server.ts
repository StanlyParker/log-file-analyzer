import { buildApp } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT ?? 5000);

async function start(): Promise<void> {
  const app = buildApp();
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    app.log.info(`Backend listening on http://0.0.0.0:${PORT}`);
  } catch (err) {
    app.log.error({ err, port: PORT }, 'Failed to start');
    process.exit(1);
  }
}

void start();
