export function is_ascii(str: string): boolean {
	for (const char of str) {
		if (!(char.charCodeAt(0) < 128)) return false
	}
	return true
}

export function is_emoji(char: string): boolean {
	return /^\p{Emoji_Presentation}$/u.test(char)
}

export function is_link(str: string) {
	return /^https?:\/\/[\w\-.]+(:\d+|)(\/.*|)$/.test(str)
}