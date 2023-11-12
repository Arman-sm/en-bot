import "dotenv"

import { client } from "./discord"
import { MessageJob } from "@interfaces/Job"
import { CommandManager } from "@interfaces/Command"
import { is_valid } from "./validator"
import commands from "@utils/commands-listed"

const SENTENCES = ["Speak English dear", "Enough!", "I'm here so OBEY the rules!", "Slow down darling.", "It's annoying, I know", "Speak English sweetie."]

const cmd_mgr = new CommandManager(client, commands)

client.once("ready", () => cmd_mgr.sync())

client.on("interactionCreate", interaction => {
	if (!interaction.isChatInputCommand() || !interaction.guildId) return
	cmd_mgr.handle(interaction)
})

client.on("messageCreate", async msg => {
	if (!msg.guild) {
		msg.reply("This bot is only available to servers and not DMs.")
		return
	}

	if (msg.author.id == client.user?.id) {
		return
	}

	const job    = new MessageJob(msg)
	const policy = await  job.policy()
	
	if (!is_valid(job.msg.content, policy)) {
		msg.reply(SENTENCES[Math.round(Math.random() * (SENTENCES.length - 1))])
		if (policy.delete_invalids) setTimeout(() => msg.delete(), 5000)
	}
})