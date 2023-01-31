import { Collection, Events, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";

import { TOKEN } from "../config";
import { DiscordClient } from "../services";
import { logger } from "./logger";

export const startDiscordBot = () => {
  const client = new DiscordClient({
    intents: [GatewayIntentBits.Guilds],
  });

  client
    .on(Events.ClientReady, (c) => {
      logger.info(`⚡ Logged in as ${c?.user?.tag}!`);
    })
    .on(Events.Debug, (d) => {
      logger.debug(d);
    })
    .on(Events.Error, (e) => {
      logger.error(e);
    })
    .on(Events.Warn, (w) => {
      logger.warn(w);
    });

  client.login(TOKEN);

  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "..", "commands");
  fs.readdirSync(commandsPath).forEach((file) => {
    const filePath = path.join(commandsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(filePath).default;

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      logger.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as DiscordClient).commands.get(interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (e) {
      logger.error(e);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });

  return client;
};
