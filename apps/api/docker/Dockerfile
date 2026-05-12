# ==========================================
# STAGE 1: BUILDER (Heavy, but thrown away)
# ==========================================
FROM node:24-alpine AS builder

RUN corepack enable pnpm
WORKDIR /app

COPY . .

# Install all dependencies across the workspace
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (crucial: do this before deploying)
RUN pnpm --filter @swissokyo/db exec prisma generate

RUN pnpm --filter @swissokyo/db build

# Build API
RUN pnpm --filter api build

RUN ls



# THE MAGIC TRICK: pnpm deploy
# This isolates the 'api' package AND its local workspace dependencies (like your db) 
# into a single, clean folder called '/app/pruned'.
# Legacy used because the new way is broken for monorepo it's sh*t
RUN pnpm --filter api deploy --legacy pruned


# ==========================================
# STAGE 2: RUNNER (Tiny, Production Ready)
# ==========================================
FROM node:24-alpine AS runner

WORKDIR /app

# We ONLY copy the 'pruned' folder from the builder stage.
# The rest of the monorepo is left behind and destroyed.
COPY --from=builder /app/pruned .

# 2. THE FIX: Explicitly rescue the entrypoint script from the builder
COPY --from=builder /app/apps/api/entrypoint.sh ./entrypoint.sh

# 3. Scrub invisible Windows characters (\r) and make executable
RUN sed -i 's/\r$//' ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

EXPOSE 3000

# Start the API directly from the isolated folder
# (Adjust 'dist/index.js' to match your actual compiled entry point)
# RUN npx prisma migrate dev --name init_database

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/src/app.js"]