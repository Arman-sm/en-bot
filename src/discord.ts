import { Client, GatewayIntentBits } from "discord.js";
import { ReacordDiscordJs } from "reacord";

if (!process.env.DISCORD_TOKEN) throw new Error("Discord token was not provided")

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
})

export const reacord = new ReacordDiscordJs(client)

client.on("ready", () => console.log("A new discord client has just been initialized"))
client.on("error", console.error)

await client.login(process.env.DISCORD_TOKEN)