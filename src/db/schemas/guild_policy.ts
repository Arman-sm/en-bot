import { Schema } from "redis-om"

export const GuildPolicy = new Schema("GuildPolicy", {
	allow_emoji:   { type: "boolean" },

	// Allowed languages
	fa: { type: "boolean", path: "$.allowed_languages.fa" },
	en: { type: "boolean", path: "$.allowed_languages.en" },
}, {
	dataStructure: "JSON"
})