import "dotenv/config";
import { EventEmitter } from "events";

import { startDiscordBot, deployCommands } from "./utils";
import { DiscordClient } from "./services";

/**
 * Express application wrapper class to centralize initialization
 */
class App extends EventEmitter {
  public app: DiscordClient;

  constructor() {
    super();
    this.app = startDiscordBot();
    deployCommands();
  }
}

new App();
