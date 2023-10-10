import type { IPolicy } from "../../MessageJob"
import { DEFAULT_GUILD_POLICY } from "../defaults"

export async function get_guild_policy(guild_id: string): Promise<IPolicy> {
	//TODO connect to db
	return DEFAULT_GUILD_POLICY
}

export async function set_guild_policy(guild_id: string, value: IPolicy) {
	//TODO connect to db
}

export async function set_default_guild_policy(guild_id: string) {
	//TODO connect to db
}