import { debug, error, trace } from "@src/logger"
import { ZPolicy, type IPolicy, ZLanguagePolicy, ILanguagePolicy, IPartialPolicy } from "../../interfaces/Job"
import { GuildPolicies } from "../repos"

export async function get_guild_policy(guild_id: string): Promise<IPartialPolicy> {
	const {allowed_languages, ...res} = await GuildPolicies.fetch(guild_id)

	trace("Checking for errors in the retrieved data")
	const langZodRes = ZLanguagePolicy.partial().safeParse(
		JSON.parse(allowed_languages as string | undefined || "{}")
	)

	const mainZodRes = ZPolicy.partial().safeParse(res)

	if (!(mainZodRes.success && langZodRes.success)) {
		//@ts-ignore
		error(`Guild ID ${guild_id} has invalid data (zod error: ${mainZodRes?.error || langZodRes?.error})`)
		return {}
	}

	debug("Successfully retrieved policy data")
	return {...mainZodRes, allowed_languages: langZodRes.data}
}

export async function set_guild_policy(
	guild_id: string, _value: Partial<Omit<IPolicy, "allowed_languages"> & { allowed_languages: Partial<ILanguagePolicy> }>
) {
	const {allowed_languages: _allowed_languages, ...value} = _value
	const allowed_languages = ZLanguagePolicy.partial().parse(_allowed_languages || {})

	await GuildPolicies.save(guild_id, {...ZPolicy.partial().parse(value), allowed_languages})
}

export async function update_guild_policy(guild_id: string, value: Partial<IPolicy>) {
	const prev_data = await get_guild_policy(guild_id)

	await set_guild_policy(guild_id, {
		...prev_data,
		...value,
		allowed_languages: {...prev_data.allowed_languages, ...value.allowed_languages}
	})
}

export async function remove_guild_policy(guild_id: string) {
	await GuildPolicies.remove([guild_id])
}