import type { Command } from "@interfaces/Command";

const exp: Command = {
	name: "ping",
	description: "responds 'pong' ( for testing purposes )",

	handle(job) {
		job.reply("Pong!")
	}
}

export default exp