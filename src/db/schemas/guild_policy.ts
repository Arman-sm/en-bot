import { Schema } from "redis-om"

export const GuildPolicy = new Schema("GuildPolicy", {
	allow_emoji:        { type: "boolean" },
	allow_link:         { type: "boolean" }, // http & https
	delete_invalids:    { type: "boolean" },

	// Allowed languages
	fa: { type: "boolean", path: "$.allowed_languages.fa" },
	en: { type: "boolean", path: "$.allowed_languages.en" },
}, {
	dataStructure: "JSON"
})