import { Client, EmbedBuilder, Events, GatewayIntentBits } from "discord.js";

import configData from "../config.json" with { type: "json" };
import { type Config } from "./types/index.js";
const config = configData as Config;

const prefix = "oldcord!";

const client = new Client({
  rest: {
    api: `${config.oldcord.baseURL}/api`,
    cdn: config.oldcord.cdn ?? config.oldcord.baseURL,
    mediaProxy: config.oldcord.mediaProxy ?? config.oldcord.baseURL,
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (!command) return;

  switch (command) {
    case "ping": {
      await message.channel.send("Pong!");
      break;
    }
    case "calc": {
      const expression = args[0];
      if (!expression || args.length > 1) {
        await message.channel.send(
          args.length > 1 ? "Too much args!" : "Please provide an expression!",
        );
        return;
      }

      if (!/^\d+([-+*/^][-]*\d+)*$/i.test(expression)) {
        await message.channel.send("Not allowed!");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
      const result = new Function(`return ${expression}`)() as number;

      await message.channel.send(result.toString());

      if (message.content.includes("9+9") || message.content.includes("2+5+2") || result === 9) {
        await message.channel.send("みんなー！　チルノのさんすう教室はじまるよー！");
      }
      break;
    }
    case "help": {
      const helpEmbed = new EmbedBuilder()
        .setTitle("Hurple — Help")
        .setDescription(
          "Commands:\noldcord!ping — Ping command\noldcord!calc — Calculate\noldcord!help — Show this help message.\noldcord!echo — Reply back with your message content.\noldcord!meow — Meow.",
        );
      await message.channel.send({ embeds: [helpEmbed] });
      break;
    }
    case "echo": {
      await message.channel.send(message.content.slice(prefix.length + 5));
      break;
    }
    case "meow": {
      const meow = ["Meow", "meow", "Meow! :3"];
      const randomMeow = meow[Math.floor(Math.random() * meow.length)];
      if (randomMeow) {
        await message.channel.send(randomMeow);
      }
      break;
    }
    default: {
      await message.channel.send("Invalid command! Please try again!");
    }
  }
});

void client.login(config.token);
