import { MessageJob } from "@interfaces/Job"
import { is_ascii, is_emoji } from "@utils/text-tools"

export async function is_valid(job: MessageJob): Promise<boolean> {
	const policy = await job.policy()

	for (const char of job.msg.content) {
		if (
			!is_ascii(char) &&
			(policy.allow_emojis && !is_emoji(char))
		) {
			return false
		}
	}

	return true
}