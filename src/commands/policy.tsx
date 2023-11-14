import { DEFAULT_POLICY } from "@db/defaults";
import { update_guild_policy } from "@db/utils/policy";
import type { Command } from "@interfaces/Command";
import { ZPolicy, type IPolicy, ZLanguagePolicy, ILanguagePolicy } from "@interfaces/Job";
import { reacord } from "@src/discord";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { Button, Select, Option, Embed } from "reacord";
import { createContext, useContext, useState } from "react";
import { ZodBoolean } from "zod";

const interaction_context = createContext<ChatInputCommandInteraction | undefined>(undefined)
const policy_trans_names = new Map<keyof IPolicy, string>([
	["allow_emojis", "Emoji allowance"],
	["allowed_languages", "Allowed languages"],
	["allow_link", "Link allowance"],
	["delete_invalids", "Delete invalid messages"],
	["ignore_link_chars", "Ignore character validation in links"]
])

type TPolicyName = null | keyof IPolicy

function PolicySelect({
	set_policy_name
}: {
	set_policy_name: React.Dispatch<React.SetStateAction<TPolicyName>>
}) {
	const [tmp_policy_name, set_tmp_policy_name] = useState<keyof IPolicy | undefined>(undefined)

	return <>
		What policy would you like to change?
		{/*@ts-ignore*/}
		<Select placeholder="Choose a policy" value={tmp_policy_name} onChangeValue={set_tmp_policy_name}>{
			Object.keys(ZPolicy.shape).map(
				pname => <Option
					label={policy_trans_names.get(pname as keyof IPolicy) || pname}
					value={pname}
					key={pname}
				/>
			)
		}</Select>
		<Button
			label="Continue"
			style="primary"
			disabled={!tmp_policy_name}
			onClick={e => {
				set_policy_name(tmp_policy_name as keyof IPolicy)
			}}
		/>
	</>
}

type TPolicyChangerSet<T> = (value: T) => void

function BoolChange({ set: _set }: { set: TPolicyChangerSet<boolean> }) {
	const [res, set_res] = useState<boolean | null>(null)
	
	function set(val: boolean) {
		set_res(val)
		_set(val)
	}
	
	return (
		res != null ?
		<Embed title={res ? "Yes" : "No"} color={res ? 0x18c735 : 0xc71829}/> :
		<>
			<Button onClick={() => set(true)}  style="success" label={`Yes`}/>
			<Button onClick={() => set(false)} style="danger"  label={`No`}/>
		</>
	)
}

function LangChange({ set: _set }: { set: TPolicyChangerSet<Partial<ILanguagePolicy>> }) {
	const [lang, set_lang] = useState<keyof ILanguagePolicy | undefined>(undefined)
	const [res, set_res] = useState<boolean | null>(null)

	return res != null ?
		`\n'${lang}' is ${res ? "" : "dis"}allowed from now.` :	
		<>
			<Select value={lang} onChangeValue={v => set_lang(v as any)}>{
				Object.keys(DEFAULT_POLICY.allowed_languages)
					.map(lang => <Option value={lang}/>)
			}</Select>
			{lang && <BoolChange set={v => {set_res(v); _set({[lang]: v})}}/>}
		</>
}

function what_changer(policy_name: keyof IPolicy) {
	const shape = ZPolicy.shape[policy_name]
	
	if (shape instanceof ZodBoolean) {
		return BoolChange
	} else if (policy_name == "allowed_languages") {
		return LangChange
	} else {
		throw new Error(`Couldn't find changer component for ${shape}`)
	}
}

function PolicyChange({ policy_name }: { policy_name: keyof IPolicy }) {
	const interaction = useContext(interaction_context) as ChatInputCommandInteraction
	const Changer = what_changer(policy_name)

	function set(val: any) {
		update_guild_policy(interaction.guildId as string, { [policy_name]: val })
	}

	return <>
		Change '{policy_trans_names.get(policy_name) || policy_name}' to:
		<Changer set={set}/>
	</>
}

function PolicyWizard({ interaction }: { interaction: ChatInputCommandInteraction }) {
	const [policy_name, set_policy_name] = useState<TPolicyName>(null)

	return <interaction_context.Provider value={interaction}>{
		policy_name == null ?
		<PolicySelect set_policy_name={set_policy_name}/> :
		<PolicyChange policy_name={policy_name}/>
	}</interaction_context.Provider>
}

const exp: Command = {
	name: "policy",
	description: "Sets policies",

	handle(interaction) {
		const member = interaction.member as GuildMember
		if (!member.permissionsIn(interaction.channel as any).has("ManageMessages")) {
			interaction.reply({
				content: "You don't have the privilege to change policies.",
				ephemeral: true,
			})
			return
		}
		const reply = reacord.createInteractionReply(interaction).render(<PolicyWizard interaction={interaction}/>)
		setTimeout(() => reply.deactivate(), 45000)
	}
}

export default exp