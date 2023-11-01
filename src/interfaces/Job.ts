import type { Message } from "discord.js"
import { get_guild_policy } from "../db/utils/policy"
import { DEFAULT_POLICY } from "../db/defaults"
import { z } from "zod"

export const ZLanguagePolicy = z.object({
	fa: z.boolean(),
	en: z.boolean()
})

export type ILanguagePolicy = z.infer<typeof ZLanguagePolicy>

export const ZPolicy = z.object({
	allow_emojis:      z.boolean(),
	allow_link:        z.boolean(),
	delete_invalids:   z.boolean(),
	allowed_languages: ZLanguagePolicy,
})

export type IPolicy = z.infer<typeof ZPolicy>

export class MessageJob {
	readonly msg: Message

	constructor(msg: Message) {
		if (!msg.guildId) throw new Error("Message does not have 'guild id'")

		this.msg = msg
	}

	get guild_id(): string {
		return this.msg.guildId as string
	}

	async policy(): Promise<IPolicy> {
		return {...DEFAULT_POLICY, ...await get_guild_policy(this.msg.guildId as string)}
	}
}