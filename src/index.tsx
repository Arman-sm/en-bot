import "dotenv"

import { Client, GatewayIntentBits } from "discord.js"
import { is_ascii, is_emoji } from "./utils/text_tools"
import { MessageJob } from "./MessageJob"

const SENTENCES = ["Speak English dear", "Enough!", "I'm here so OBEY the rules!", "Slow down darling.", "It's annoying, I know", "Speak English sweetie."]

if (!process.env.DISCORD_TOKEN) {
	console.error("Discord token was not provided")
	process.exit(1)
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		
	]
})

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

async function is_valid(msg: MessageJob): Promise<boolean> {
	const policy = await msg.policy()

	for (const char of msg.content) {
		if (
			!is_ascii(char) ||
			(policy.allow_emojis && !is_emoji(char))
		) {
			return false
		}
	}

	return true
}

client.on("messageCreate", async msg => {
	// try { new URL(msg.content); continue } catch {}
	const job = new MessageJob(msg)

	if (!await is_valid(job)) {
		msg.reply(SENTENCES[Math.round(Math.random() * (SENTENCES.length - 1))])
		setTimeout(() => msg.delete(), 5000)
	}
})

await client.login(process.env.DISCORD_TOKEN)