FROM oven/bun

WORKDIR /app

COPY package*.json bun.lockb ./
RUN bun install

COPY . .

ENV PORT = 8231

ENTRYPOINT bun run main.ts