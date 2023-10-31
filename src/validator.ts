import { MessageJob } from "@interfaces/Job"
import { is_ascii, is_emoji, is_link } from "@utils/text-tools"

const WHITESPACE_REGEX = /[\n| ]/

export async function is_valid(job: MessageJob): Promise<boolean> {
	const policy = await job.policy()

	// Character based filters
	for (const char of job.msg.content) {
		if (!(
			is_ascii(char) ||
			(policy.allow_emojis && is_emoji(char))
		)) return false
	}

	for (const part of job.msg.content.split(WHITESPACE_REGEX)) {
		if (
			(!policy.allow_link && is_link(part))
		) return false
	}

	return true
}