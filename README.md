# cool_monorepo

# RUN cool_monorepo

```
npm run update
npm run docker:build
```

# Requirements

- NPM : https://nodejs.org/en/download
- PNPM : npm install -g pnpm@latest-11
- Docker + Docker Compose: https://docs.docker.com/engine/install/

# RUN DEV

```
npm run update
cd ./packages/db
npm run prepare:dev
cd ..
cd ..
cd ./apps/api
cp .env.example .env
npm run dev
```
