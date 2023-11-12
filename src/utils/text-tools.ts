export function is_ascii(str: string) {
	for (const char of str) {
		if (!(char.charCodeAt(0) < 128)) return false
	}
	return true
}

export function is_whitespace(str: string) {
	return /^\s+$/.test(str)
}

export function is_emoji(char: string) {
	return /^\p{Emoji_Presentation}$/u.test(char)
}

export function is_link(str: string) {
	return /^https?:\/\/[\w\-.]+(:\d+|)(\/.*|)$/.test(str)
}