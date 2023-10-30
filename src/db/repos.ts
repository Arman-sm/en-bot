import { Repository } from "redis-om"
import { GuildPolicy } from "./schemas/guild_policy"
import { db } from "./db"

export const GuildPolicies = new Repository(GuildPolicy, db)