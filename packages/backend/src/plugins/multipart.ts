import fp from 'fastify-plugin';
import { buildApp } from '../app.js';
import fastifyMultipartModule from 'fastify-multipart';

const fastifyMultipart = fastifyMultipartModule.default ?? fastifyMultipartModule;

const app = buildApp();

export default fp(async function multipartPlugin(app) {
  void app.register(fastifyMultipart, {
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE_BYTES ?? '10485760'),
    },
  });
});

app.log.info(typeof fastifyMultipart);
