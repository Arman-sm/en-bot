import { RedisHashSchema } from "@db/lib";

export const GuildPolicy = new RedisHashSchema({
	allow_emoji:        "boolean",
	allow_link:         "boolean", // http & https
	
	ignore_link_chars:  "boolean",

	delete_invalids:    "boolean",

	allowed_languages:  "json"
}, "GuildPolicy:")