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
cd..
cd ./api-client
npm run build
cd ..
cd ..
cd ./apps/api
cp .env.example .env
npm run dev
```

# TODO 17 june 2026

- Logs when someone get gapped (bot-eiki)
- Create the clearBarrier commands (bot-eiki)
- Add moderatorLoggingChannel in the database etc. (bot-eiki)
- Make the kick command + log in the moderatorLoggingChannel (bot-eiki)
- Make the gap command + log in the moderatorLoggingChannel (bot-eiki)
- Make the ungap command + log in the moderatorLoggingChannel (bot-eiki)
- Make the ban command + log in the moderatorLoggingChannel (bot-eiki)
- Add settings commands (bot-eiki)

...

- Add miscelaneous info in command [contact, help etc.] /info (bot-reimu)

# Mission of 22 June 2026

- Logs when someone get gapped (bot-eiki) DONE
- Make the gap command + log in the moderatorLoggingChannel (bot-eiki) DONE
- Make the ungap commande + log in the moderatorLoggingChannel (bot-eiki)
