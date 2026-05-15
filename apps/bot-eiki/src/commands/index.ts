import {
  REST,
  Routes,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import * as ping from './ping.js';
import * as sim_join from './sim-join.js';

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
};
export const commands: Command[] = [ping, sim_join];

export async function registerGuildCommands(
  token: string,
  appId: string,
  guildId: string
) {
  const rest = new REST({ version: '10' }).setToken(token);
  const body = commands.map((c) => c.data.toJSON());
  await rest.put(Routes.applicationGuildCommands(appId, guildId), { body });
}
