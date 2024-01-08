import "dotenv"

import { client } from "./discord"
import { MessageJob } from "@interfaces/Job"
import { CommandManager } from "@interfaces/Command"
import { is_valid } from "./validator"
import commands from "@utils/commands-listed"
import { debug, trace } from "./logger"

const RESPONSES = ["Speak English dear", "Enough!", "I'm here so OBEY the rules!", "Slow down darling.", "It's annoying, I know", "Speak English sweetie."]

const cmd_mgr = new CommandManager(client, commands)

client.once("ready", async () => await cmd_mgr.sync())

client.on("interactionCreate", interaction => {
	if (!interaction.isChatInputCommand() || !interaction.guildId) return
	cmd_mgr.handle(interaction)
})

client.on("messageCreate", async msg => {
	debug("Received new message")
	
	trace("Checking whether the message was sent in a guild or not")
	if (!msg.guild) {
		debug("Message wasn't sent in a guild, rejecting to validate it.")

		msg.reply("This bot is only available to servers, not DMs.")
		trace("Responded to DM")
		
		return
	}

	trace("Checking if the bot itself is the author of the message")
	if (msg.author.id == client.user?.id) {
		debug("Message was sent by the bot itself, skipping the validation")
		return
	}

	debug("Message is accepted to be processed")

	const job    = new MessageJob(msg)

	trace("Retrieving policy information from the DB")
	const policy = await  job.policy()
	
	debug("Validating the message based on the policy information retrieved from the DB")
	if (!is_valid(job.msg.content, policy)) {
		debug("Message is invalid")

		trace("Responding to the invalid message")
		msg.reply(RESPONSES[Math.round(Math.random() * (RESPONSES.length - 1))])

		if (policy.delete_invalids) {
			debug(`Deleting the invalid message in 5 seconds`)
			setTimeout(() => msg.delete(), 5000)
		}
	}
})