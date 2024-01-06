import type { ILanguagePolicy, IPolicy } from "@interfaces/Job"
import { is_unicode_emoji, is_link, remove_custom_discord_emojis } from "@utils/text-tools"

const WHITESPACE_REGEX = /\s/

const LANG_CHAR_SET_DETECTIONS: Record<keyof ILanguagePolicy, (str: string) => boolean> = {
	en: str => /^[a-zA-Z0-9]*$/.test(str),
	fa: str => /^[آ-ی \u200C ء چ]*$/.test(str),
}

// Note: It will only check wether the whole text uses one allowed character set
// Note: This function will skip punctuation
export function validate_by_char_set_preference(text: string, lang_policy: ILanguagePolicy) {
	for (const [lang, is_allowed] of Object.entries(lang_policy)) {
		if (
			is_allowed &&
			LANG_CHAR_SET_DETECTIONS[lang as keyof ILanguagePolicy](text)
		) {
			return true
		}
	}
}

export function is_valid(content: string, policy: IPolicy): boolean {
	for (let part of content.split(WHITESPACE_REGEX)) {
		console.log(part)
		if (is_link(part)) {
			if (!policy.allow_link) return false
			if (policy.ignore_link_chars) continue

			// Exclude url structure
			part = part.replace(/https?\:\/\//, "").replaceAll(/[\/\&\=]/g, "")
		}

		if (policy.allow_emojis) {
			part = remove_custom_discord_emojis(part)
		}

		// Character based filters
		for (const char of part) {
			// Skip punctuation
			if (/\p{P}/u.test(char)) continue
			// Emojis
			if (policy.allow_emojis && is_unicode_emoji(char)) continue
			// Other characters
			if (validate_by_char_set_preference(char, policy.allowed_languages)) continue

			return false
		}
	}

	return true
}