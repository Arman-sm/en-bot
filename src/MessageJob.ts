import type { Message } from "discord.js"
import { get_guild_policy } from "./db/utils/policy"
import { DEFAULT_GUILD_POLICY } from "./db/defaults"

export interface IPolicy {
	allow_emojis:  boolean,
	allow_persian: boolean,
}

export class MessageJob {
	#msg: Message
	public content: string

	constructor(msg: Message) {
		this.#msg = msg
		this.content = msg.content
	}

	async policy(): Promise<IPolicy> {
		if (!this.#msg.guildId) {
			return DEFAULT_GUILD_POLICY
			// set_default_guild_policy(this.#msg.guildId)
		}

		return await get_guild_policy(this.#msg.guildId)
	}
}