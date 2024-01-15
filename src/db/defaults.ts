import type { IPolicy } from "../interfaces/Job";

export const DEFAULT_POLICY: IPolicy = { 
	allow_emojis:  true,
	allow_link:    true,
	delete_invalids: true,
	ignore_link_chars: true,
	allowed_languages: {
		en: true,
		fa: false
	}
}