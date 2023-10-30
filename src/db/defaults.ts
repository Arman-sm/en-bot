import type { IPolicy } from "../interfaces/Job";

export const DEFAULT_POLICY: IPolicy = { 
	allow_emojis:  true,
	allowed_languages: {
		en: true,
		fa: false
	}
}