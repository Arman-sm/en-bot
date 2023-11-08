import type { IPolicy } from "@interfaces/Job"
import { is_ascii, is_emoji, is_link } from "@utils/text-tools"

const WHITESPACE_REGEX = /[\n| ]/

export function is_valid(content: string, policy: IPolicy): boolean {
	// Character based filters
	for (const char of content) {
		if (!(
			is_ascii(char) ||
			(policy.allow_emojis && is_emoji(char))
		)) return false
	}

	for (const part of content.split(WHITESPACE_REGEX)) {
		if (
			(!policy.allow_link && is_link(part))
		) return false
	}

	return true
}