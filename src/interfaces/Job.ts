import type { Message } from "discord.js"
import { get_guild_policy } from "../db/utils/policy"
import { DEFAULT_POLICY } from "../db/defaults"
import { z } from "zod"

export const ZLanguagePolicy = z.object({
	fa: z.boolean(),
	en: z.boolean()
})

export type ILanguagePolicy = z.infer<typeof ZLanguagePolicy>

export type IPartialPolicy = Partial<Omit<IPolicy, "allowed_languages"> & { allowed_languages: Partial<ILanguagePolicy> }>

export const ZPolicy = z.object({
	allow_emojis:      z.boolean(),
	// HTTP & HTTPS URLs
	allow_link:        z.boolean(),
	// Ignore checking characters in links to see wether they are allowed in the language policy or not
	ignore_link_chars: z.boolean(),
	// Delete invalid messages or not
	delete_invalids:   z.boolean(),
	allowed_languages: ZLanguagePolicy,
})

export type IPolicy = z.infer<typeof ZPolicy>

export class MessageJob {
	public msg: Message

	constructor(msg: Message) {
		if (!msg.guildId) throw new Error("Message does not have 'guild id'")

		this.msg = msg
	}

	get guild_id(): string {
		return this.msg.guildId as string
	}

	async policy(): Promise<IPolicy> {
		let data = await get_guild_policy(this.msg.guildId as string)
		return {...DEFAULT_POLICY, ...data, allowed_languages: {...DEFAULT_POLICY.allowed_languages, ...data?.allowed_languages}}
	}
}