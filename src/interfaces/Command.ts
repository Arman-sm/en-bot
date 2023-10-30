import type { ChatInputCommandInteraction, Client } from "discord.js"

export interface Command {
	name: string
	description: string
	// options?: 

	handle(job: ChatInputCommandInteraction): void
}

export class CommandManager {
	commands: Command[]
	client:   Client

	constructor(client: Client, commands: Command[]) {
		this.client   = client
		this.commands = commands
	}

	async sync() {
		await Promise.allSettled(
			this.commands.map(cmd => this.client.application?.commands.create(cmd))
		)
	}

	handle(interaction: ChatInputCommandInteraction) {
		for (const cmd of this.commands) {
			if (cmd.name == interaction.commandName) {
				cmd.handle(interaction)
				return
			}
		}
	}
}