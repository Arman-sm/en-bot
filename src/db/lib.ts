import type { RedisClientType } from "redis"

type RedisConn = RedisClientType<any, any, any>

export type TFieldType = "boolean" | "string" | "json"

export type TFieldTypes = {
	"boolean": boolean
	"string":  string
	"json":    object
}

export class RedisHashSchema<
	GTypes extends Record<string, TFieldType>
> {
	types:  GTypes
	prefix: string
	
	constructor(types: GTypes, prefix?: string) {
		this.types  = types
		this.prefix = prefix ?? ""
	}

	// utils
	key(id: string) { return this.prefix + id }
	type_of(field: keyof GTypes): TFieldType { return this.types[field] }


	//#region (De)Serialization
	serialize<F extends keyof GTypes>(field: F, data: TFieldTypes[GTypes[F]]): string {		
		switch (this.type_of(field)) {
			case "boolean": return data ? "1" : "0"
			case "json":    return JSON.stringify(data)
			
			default: return String(data)
		}
	}

	deserialize<F extends keyof GTypes>(field: F, data: string): TFieldTypes[GTypes[F]] {
		let res
		
		switch (this.type_of(field)) {
			case "boolean": res = data !== "0"    ; break
			case "string":  res = data            ; break
			case "json":    res = JSON.parse(data); break
		}

		if (res === undefined) throw new Error(`No method to deserialize '${field as string}' with type '${this.type_of(field)}'`)

		return res as any
	}
	//#endregion


	async get_field<F extends keyof GTypes>(id: string, field: keyof GTypes, db: RedisConn): Promise<TFieldTypes[GTypes[F]] | undefined> {
		const data = await db.hGet(this.key(id), field as string)
		
		return data === undefined ? undefined : this.deserialize(field, data) as any
	}
	
	async set_field<F extends keyof GTypes>(id: string, field: F, data: TFieldTypes[GTypes[F]], db: RedisConn) {
		await db.hSet(this.key(id), field as string, this.serialize(field, data))
	}
	

	async delete(id: string, db: RedisConn) { await db.del(this.key(id)) }

	async fetch(id: string, db: RedisConn): Promise<Partial<{[F in keyof GTypes]: TFieldTypes[GTypes[F]]}>> {
		let res: Record<string, any> = {}

		for (const [field, value] of Object.entries(await db.hGetAll(this.key(id)))) {
			res[field] = this.deserialize(field, value)
		}

		return res as any
	}

	async set(id: string, data: Partial<{[F in keyof GTypes]: TFieldTypes[GTypes[F]]}>, db: RedisConn) {
		await Promise.allSettled(Object.entries(data).map(
			([field, value]) => this.set_field(id, field as any, value as any, db)
		))
	}

	async fresh(id: string, data: Partial<{[F in keyof GTypes]: TFieldTypes[GTypes[F]]}>, db: RedisConn) {
		await this.delete(id, db)
		await this.set(id, data, db)
	}

	async update(id: string, data: Partial<{[F in keyof GTypes]: TFieldTypes[GTypes[F]]}>, db: RedisConn) {
		await Promise.allSettled(Object.entries(data).map(
			async ([field, value]) => {
				
				if (this.type_of(field) == "json") {
					value = {...(await this.get_field(id, field, db) as {} | undefined ?? {}), ...value}
				}

				await this.set_field(id, field, value as any, db)
			}
		))
	}
}