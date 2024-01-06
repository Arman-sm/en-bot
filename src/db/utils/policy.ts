import { ZPolicy, type IPolicy, ZLanguagePolicy } from "../../interfaces/Job"
import { GuildPolicies } from "../repos"

export async function get_guild_policy(guild_id: string): Promise<Partial<IPolicy>> {
	const {allowed_languages, ...res} = await GuildPolicies.fetch(guild_id)
	
	const langZodRes = ZLanguagePolicy.partial().safeParse(allowed_languages || {})
	const mainZodRes = ZPolicy.partial().safeParse(res)

	//@ts-ignore
	const err = mainZodRes?.error || langZodRes?.error
	if (err) {
		console.error(`Guild ID ${guild_id}'s had invalid data (zod error: ${err})`)
		return {}
	}

	//@ts-ignore
	return {...mainZodRes.data, allowed_languages: langZodRes.data}
}

export async function set_guild_policy(guild_id: string, _value: Partial<IPolicy>) {
	const {allowed_languages: _allowed_languages, ...value} = _value
	const allowed_languages = ZLanguagePolicy.partial().parse(_allowed_languages || {})

	await GuildPolicies.save(guild_id, {...ZPolicy.partial().parse(value), allowed_languages})
}

export async function update_guild_policy(guild_id: string, value: Partial<IPolicy>) {
	await set_guild_policy(guild_id, { ...await get_guild_policy(guild_id), ...value })
}

export async function remove_guild_policy(guild_id: string) {
	await GuildPolicies.remove([guild_id])
}