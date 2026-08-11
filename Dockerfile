FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-numpy \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY project_display/package.json project_display/package-lock.json ./
RUN npm ci

COPY project_display/ .
COPY projects/MonteCarloPi ../projects/MonteCarloPi

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
