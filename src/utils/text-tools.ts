export function is_ascii(str: string) {
	for (const char of str) {
		if (!(char.charCodeAt(0) < 128)) return false
	}
	return true
}

export function is_whitespace(str: string) {
	return /^\s+$/.test(str)
}

export function is_unicode_emoji(char: string) {
	return /^\p{Extended_Pictographic}$/u.test(char)
}

const CUSTOM_DISCORD_EMOJI_REGEX = /<a?:.+:\d{18}>/g

export function remove_custom_discord_emojis(str: string) {
	return str.replaceAll(CUSTOM_DISCORD_EMOJI_REGEX, "")
}

export function is_custom_discord_emoji(str: string) {
	return CUSTOM_DISCORD_EMOJI_REGEX.test(str)
}

export function is_link(str: string) {
	return /^https?:\/\/[\w\-.]+(:\d+|)(\/.*|)$/.test(str)
}