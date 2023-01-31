import { Collection, Client, ClientOptions } from "discord.js";
import type { Command } from "../types";

export class DiscordClient extends Client {
  public commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}
