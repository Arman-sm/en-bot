import { RedisHashSchema, TFieldType } from "@db/lib";
import type { IPolicy } from "@interfaces/Job";

export const GuildPolicy = new RedisHashSchema({
	allow_emojis:        "boolean",
	allow_link:         "boolean", // http & https
	
	ignore_link_chars:  "boolean",

	delete_invalids:    "boolean",

	allowed_languages:  "json"
} satisfies { [policy in keyof IPolicy]: TFieldType }, "GuildPolicy:")