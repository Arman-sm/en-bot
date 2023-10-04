export function is_ascii(char: string): boolean {
	return char.charCodeAt(0) < 128
}

export function is_emoji(str: string): boolean {
	return /\p{Emoji_Presentation}/u.test(str)
}