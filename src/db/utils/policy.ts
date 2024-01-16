import { debug, error, trace } from "@src/logger"
import { ZPolicy, type IPolicy, ZLanguagePolicy, IPartialPolicy } from "../../interfaces/Job"
import { GuildPolicy } from "../schemas/guild_policy"
import { db } from "@db/db"

export async function get_guild_policy(guild_id: string): Promise<IPartialPolicy> {
	const {allowed_languages, ...res} = await GuildPolicy.fetch(guild_id, db)

	trace("Checking for errors in the retrieved data")
	const langZodRes = ZLanguagePolicy.partial().safeParse(allowed_languages ?? {})

	const mainZodRes = ZPolicy.partial().safeParse(res)

	if (!(mainZodRes.success && langZodRes.success)) {
		//@ts-ignore
		error(`Guild ID ${guild_id} has invalid data (zod error: ${mainZodRes?.error || langZodRes?.error})`)
		return {}
	}

	debug("Successfully retrieved policy data")
	return {...mainZodRes, allowed_languages: langZodRes.data}
}

export async function set_guild_policy(guild_id: string, _value: IPartialPolicy) {
	const {allowed_languages: _allowed_languages, ...value} = _value
	const allowed_languages = ZLanguagePolicy.partial().parse(_allowed_languages || {})

	await GuildPolicy.set(guild_id, {...ZPolicy.partial().parse(value), allowed_languages}, db)
}

export async function update_guild_policy(guild_id: string, value: Partial<IPolicy>) {
	await GuildPolicy.update(guild_id, value, db)
}

export async function remove_guild_policy(guild_id: string) {
	await GuildPolicy.delete(guild_id, db)
}