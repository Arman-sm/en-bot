import { ZPolicy, type IPolicy } from "../../interfaces/Job"
import { GuildPolicies } from "../repos"

export async function get_guild_policy(guild_id: string): Promise<Partial<IPolicy>> {
	const res = await GuildPolicies.fetch(guild_id)
	const zodRes = ZPolicy.partial().safeParse(res)

	if (!zodRes.success) { console.error(`Guild ID ${guild_id}'s had invalid data (zod error: ${zodRes.error})`) }

	return zodRes.success ? zodRes.data : {}
}

export async function set_guild_policy(guild_id: string, value: Partial<IPolicy>) {
	await GuildPolicies.save(guild_id, ZPolicy.partial().parse(value))
}

export async function update_guild_policy(guild_id: string, value: Partial<IPolicy>) {
	await set_guild_policy(guild_id, { ...await get_guild_policy(guild_id), ...value })
}

export async function remove_guild_policy(guild_id: string) {
	await GuildPolicies.remove([guild_id])
}