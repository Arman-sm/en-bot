import "dotenv"

import { Client, GatewayIntentBits } from "discord.js"
import { ReacordDiscordJs } from "reacord"

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

client.on("interactionCreate", (interaction) => {
	if (interaction.isCommand() && interaction.commandName === "ping") {
		// Use the reply() function instead of send
		reacord.reply(interaction, <>pong!</>)
	}
})

client.on("messageCreate", msg => {
	// try { new URL(msg.content); continue } catch {}
	if (!(/^[(<a?)?:\w+:(\d{18}>)? | \x00-\x7F]+$/gm.test(msg.content))) {
		msg.reply("Speak English sweetie.")
		setTimeout(() => msg.delete(), 5000)
	}
})

await client.login(process.env.DISCORD_TOKEN)