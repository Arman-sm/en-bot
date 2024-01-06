import { describe, expect, test } from "bun:test";
import { is_valid } from "./validator";
import { DEFAULT_POLICY } from "@db/defaults";
import type { IPolicy } from "@interfaces/Job";

const POLICY_ALL_FALSE: IPolicy = {
	ignore_link_chars: false,
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
	describe("links", () => {
		test("char validation off", () => {
			const POLICY: IPolicy = {...POLICY_ALL_FALSE, allow_link: true, ignore_link_chars: true}
			const chk = policy_based_check_helper(POLICY)
			
			chk("http://ww1.eg.example.co/سلام").toBe(true)
			chk("https://hello/dwaad?dawd=adwتستی").toBe(true)
			chk("http://planes/wdad/سیwad/adwad?s=dwad").toBe(true)
		})

		test("char validation on", () => {
			const POLICY: IPolicy = {...POLICY_ALL_FALSE, allow_link: true, allowed_languages: { en: true, fa: false }}
			const chk = policy_based_check_helper(POLICY)
			
			chk("http://ww1.eg.example.co").toBe(true)
			chk("https://hello/dwaad?dawd=adw").toBe(true)
			chk("http://planes/wdad/wad/adwad?s=dwad").toBe(true)

			// Testing the validation of characters in links
			chk("http://ww1.eg.example.co/سلام").toBe(false)
			chk("https://hello/dwaad?dawd=adwتستی").toBe(false)
			chk("http://planes/wdad/سیwad/adwad?s=dwad").toBe(false)
		})
	})
		
	describe("languages", () => {
		test("English", () => {
			const POLICY: IPolicy = {...POLICY_ALL_FALSE, allowed_languages: { en: true, fa: false }}
			expect(is_valid("Just a really simple and straightforward text.", POLICY)).toBe(true)
		})
	
		test("Persian", () => {
			const POLICY: IPolicy = {...POLICY_ALL_FALSE, allowed_languages: { en: false, fa: true }}
			const chk = policy_based_check_helper(POLICY)

			chk("فقط یه متن خیلی معمولی و ساده.").toBe(true)
			chk("این تَنها یِک چِک ساده بَرای نِشانه‌های صِدادار اَست پَس لُطفاً پاس بِشو اَگَر مَن دِقَّتِ کافی کَرده‌اَم.").toBe(true)
		})
	})

	describe("emojis", () => {
		test("enabled", () => {
			const POLICY: IPolicy = {...POLICY_ALL_FALSE, allow_emojis: true}
			const chk = policy_based_check_helper(POLICY)
			
			chk("😀😀😀 😀 😀😀").toBe(true)
		})

		test("disabled", () => {
			const POLICY: IPolicy = {...POLICY_ALL_FALSE}
			const chk = policy_based_check_helper(POLICY)
			
			chk("😀😀😀 😀 😀😀").toBe(false)
		})
	})
})