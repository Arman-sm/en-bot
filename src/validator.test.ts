import { describe, expect, test } from "bun:test";
import { is_valid } from "./validator";
import { DEFAULT_POLICY } from "@db/defaults";
import type { IPolicy } from "@interfaces/Job";

const POLICY_ALL_FALSE: IPolicy = {
	allow_emojis: false,
	allow_link: false,
	allowed_languages: {
		en: false,
		fa: false,
	},
	delete_invalids: false
}

function policy_based_check_helper(policy: IPolicy) {
	return (sentence: string) => expect(is_valid(sentence, policy))
}

describe("Validation", () => {
	test("mix - none true", () => {
		const SENTENCE = "Hello dear friends\n\t It's Qu1te a l0v3ly evEning 😊\n\n \t \nThis link https://example.com is absolutely not an example هاها"
		expect([
			is_valid(SENTENCE, {...DEFAULT_POLICY, allowed_languages: { en: true, fa: false }}),
			is_valid(SENTENCE, {...DEFAULT_POLICY, allowed_languages: { en: false, fa: true }}),
			
			is_valid(SENTENCE, {...DEFAULT_POLICY, allow_emojis: false}),
			is_valid(SENTENCE, {...DEFAULT_POLICY, allow_link: false}),
		]).not.toContain(true)
	})

	test("links", () => {
		const POLICY: IPolicy = {...POLICY_ALL_FALSE, allow_link: true}
		const chk = policy_based_check_helper(POLICY)

		chk("http://ww1.eg.example.co").toBe(true)
		chk("https://hello/dwaad?dawd=adw").toBe(true)
		chk("http://planes/wdad/wad/adwad?s=dwad").toBe(true)
	})

	describe("languages", () => {
		test("English", () => {
			const POLICY: IPolicy = {...POLICY_ALL_FALSE, allowed_languages: { en: true, fa: false }}
			expect(is_valid("Just a really simple and straightforward text.", POLICY)).toBe(true)
		})
	
		test.todo("Persian", () => {
			const POLICY: IPolicy = {...POLICY_ALL_FALSE, allowed_languages: { en: false, fa: true }}
			const chk = policy_based_check_helper(POLICY)
			
			chk("فقط یه متن خیلی معمولی و ساده.").toBe(true)
			chk("این تَنها یِک چِک ساده بَرای نِشانه‌های صِدادار اَست پَس لُطفاً پاس بِشو اَگَر مَن دِقَّتِ کافی کَرده‌اَم.").toBe(true)
		})
	})
})