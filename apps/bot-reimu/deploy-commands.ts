import { REST, Routes } from 'discord.js';
import 'dotenv/config'; // Assumes you use dotenv for your tokens

// 1. Import the 'data' part from your command files
import { data as pingData } from './src/commands/ping.js';
import { data as simJoinData } from './src/commands/sim-join.js';

// Load your credentials
const token = process.env.DISCORD_REIMU_TOKEN!;
const clientId = process.env.CLIENT_ID! || '1419669452311756821';
const guildId = process.env.GUILD_ID! || '1349376920512630784'; // Use your development server ID here!

// 2. Package them into an array of JSON objects
const commands = [pingData.toJSON(), simJoinData.toJSON()];

// 3. Prepare the REST module
const rest = new REST({ version: '10' }).setToken(token);

// 4. Push the state to Discord
(async () => {
  try {
    console.log(`Pushing ${commands.length} slash commands to Discord...`);

    // Using applicationGuildCommands registers them instantly in your specific server.
    // (Global commands take up to an hour to cache, which is bad for testing)
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log(
      'Successfully synced commands! You should see them in the server now.'
    );
  } catch (error) {
    console.error('Error syncing commands:', error);
  }
})();
