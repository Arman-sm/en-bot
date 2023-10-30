import { createClient } from "redis"

if (!process.env.REDIS_CONNECTION_URL) {
	console.error("Redis connection URL wasn't provided")
	process.exit(1)
}

export const db = createClient({
	url: process.env.REDIS_CONNECTION_URL
})

db.on("error", err => console.error(err))

if (!db.isOpen) {
	await db.connect()
}