# FOR DEV

If you want to develop the code, be sure to

- have the API in docker-compose.yml commented out

make sur the `.env` file is correct :

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5433/databaseName
JWT_SECRET=arandomstring
NODE_ENV=development or production
FRONTEND_URL=https://gensowall.swissokyo.ch
```

## Commands

Here's some must use commands to code the API

```pwsh
docker-compose up -d --build //to run the database and adminer container
```

```pwsh
npx prisma migrate dev --name init_database //create migration, to DO BEFORE PUTTING IN PRODUCTION (DOCKER)
```

```pwsh
npx prisma db push //to push the schema into the running database
```

```pwsh
npx prisma generate //to generate prisma client, to do when schema.prisma is edited
```

```pwsh
npm run dev //to run the API on localhost:3000
```

```pwsh
docker-compose down -v //to stop the containers
```
