import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

import { CLIENT_ID, TOKEN } from "../config";
import { logger } from "../utils";
import type { Command } from "../types";

export const deployCommands = async () => {
  const commandsPath = path.join(__dirname, "..", "commands");
  const commands: Command[] = fs.readdirSync(commandsPath).map((file) => {
    const filePath = path.join(commandsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(filePath).default.data.toJSON();
  });
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    logger.info(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })) as unknown[];

    logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (e) {
    logger.error(e);
  }
};
