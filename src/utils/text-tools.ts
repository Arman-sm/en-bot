export function is_ascii(char: string): boolean {
	return char.charCodeAt(0) < 128
}

export function is_emoji(char: string): boolean {
	return /^\p{Emoji_Presentation}$/u.test(char)
}

export function is_link(str: string) {
	return /^https?:\/\/[\w\-.]+(:\d+|)(\/.*|)$/.test(str)
}