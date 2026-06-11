# Reimu Bot: Main Entry Point (`index.ts`)

## Overview

This file serves as the bootstrap and primary event router for the Reimu Discord bot. It is responsible for initializing the Discord client, loading environmental variables, building the command registry in memory, and routing incoming slash command interactions to their respective handler functions.

## Dependencies & Imports

- **`dotenv/config`**: Automatically loads environmental variables from a `.env` file into `process.env`. Must be the very first import.
- **`discord.js`**: The core library. Imports the `Client`, necessary `GatewayIntentBits`, the `Interaction` type for TypeScript safety, and the `Collection` utility (a specialized JavaScript Map).
- **`./commands/index.js`**: Exports an array of available slash commands (`commands`) and the TypeScript interface (`Command`) defining their structure.
- **`./welcome.js`**: Contains delegated logic for handling new user arrivals (`registerWelcomeEvents`).

## Initialization & Intents

The bot requires specific Gateway Intents to function based on its features:

- `GatewayIntentBits.Guilds`: Required for basic bot functionality, slash commands, and server cache.
- `GatewayIntentBits.GuildMembers`: **Privileged Intent.** Required to detect when new users join the server (necessary for the `welcome.js` logic). _Note: This must be explicitly enabled in the Discord Developer Portal._

## Core Systems

### 1. The Command Registry

```typescript
const registry = new Collection<string, Command>();
```

Instead of looping through arrays to find commands, the system builds an O(1) lookup table (a `Collection`) on startup. It maps the command's string name (e.g., `"ping"`) directly to its execution module.

### 2. Event Routing

- **Startup (`ready`)**: Fires once when the websocket connection to Discord is established. Logs the bot's username and discriminator to confirm a successful boot.
- **External Events (`registerWelcomeEvents`)**: Passes the active `client` instance to an external module to keep the entry file clean.
- **Interaction Router (`interactionCreate`)**:
- Intercepts all incoming interactions.
- Immediately filters out anything that isn't a Chat Input (Slash Command).
- Queries the `registry` for the executed command. If it doesn't exist, it aborts silently.
- Executes the command's `.execute(interaction)` method.

### 3. Error Handling Architecture

The interaction router wraps command execution in a `try/catch` block. If a command module crashes, it prevents the entire bot node process from dying.
It employs state-aware error messaging:

- If the bot has already deferred or replied to the user (e.g., a long-running task), it uses `followUp()` to send the error.
- If the interaction is fresh, it uses `reply()`.
- Both error messages are set to `ephemeral: true` so only the user who triggered the crash sees the error, keeping the public channel clean.

### 4. Authentication

Attempts to log in using the `DISCORD_REIMU_TOKEN` environmental variable. If the token is invalid or the connection fails, it catches the error, logs it to the console, and forces a fatal exit (`process.exit(1)`) to ensure process managers (like Docker or PM2) know the boot failed and can attempt a restart.
