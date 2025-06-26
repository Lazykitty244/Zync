FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-slim as production
WORKDIR /usr/src/app

COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/.next ./.next
COPY --from=base /usr/src/app/public ./public
COPY --from=base /usr/src/app/package.json ./
COPY --from=base /usr/src/app/server ./server

EXPOSE 3000 8080

# Start both Next.js and WebSocket server
CMD ["bun", "run", "start:prod"]