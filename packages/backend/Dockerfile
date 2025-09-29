FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci --production=false && npx tsc
RUN npm run lint
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --production
COPY --from=build /app/dist ./dist

RUN mkdir -p /app/reports

EXPOSE 5000
CMD ["node", "dist/server.js"]