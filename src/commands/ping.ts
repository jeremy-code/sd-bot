import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

const PingCommand: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default PingCommand;
