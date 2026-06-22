import {
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import * as ping from './ping.js';
import * as sim_join from './sim-join.js';
import * as configure from './configure.js';
import * as add_feature from './add_feature.js';
import * as gap from './gap.js';

export type Command = {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
};
export const commands: Command[] = [
  ping,
  sim_join,
  configure,
  add_feature,
  gap,
];

export async function registerGuildCommands(
  token: string,
  appId: string,
  guildId: string
) {
  const rest = new REST({ version: '10' }).setToken(token);
  const body = commands.map((c) => c.data.toJSON());
  await rest.put(Routes.applicationGuildCommands(appId, guildId), { body });
}
