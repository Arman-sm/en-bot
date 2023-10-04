import "dotenv"

import { Client, GatewayIntentBits, Message } from "discord.js"
import { ReacordDiscordJs } from "reacord"
import { is_ascii, is_emoji } from "./utils/text_tools"

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		
	]
})

const reacord = new ReacordDiscordJs(client)

client.on("ready", () => console.log("Discord.js client is ready."))
client.on("ready", () => {
	// client.application?.commands.create({
	// 	name: "config",
	// 	description: "manipulation of the bot's configurations"
	// })
	client.application?.commands.create({
		name: "ping",
		description: "responds 'pong'"
	})
})

client.on("interactionCreate", interaction => {
	if (interaction.isCommand() && interaction.commandName === "ping") {
		// Use the reply() function instead of send
		interaction.reply("pong!?")
	}
})

class MessageJob {
	public content: string

	constructor(msg: Message) {
		this.content = msg.content
	}
}

function is_valid(msg: MessageJob): boolean {
	for (const char of msg.content) {
		if (!(
			is_ascii(char) ||
			is_emoji(char)
		)) {
			return false
		}
	}
	return true
}

client.on("messageCreate", msg => {
	// try { new URL(msg.content); continue } catch {}
	const job = new MessageJob(msg)

	if (!is_valid(job)) {
		msg.reply("Speak English sweetie.")
		setTimeout(() => msg.delete(), 5000)
	}
})

await client.login(process.env.DISCORD_TOKEN)