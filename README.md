# en-bot

An annoying but fun bot for an English discord channel

## Setup
For using the bot you should set your discord token as en environment variable called `DISCORD_TOKEN`.
A redis database is also required for the bot to run, you can provide your redis connection url via setting the `REDIS_CONNECTION_URL` environment variables.

Note: `.env` files are supported.

After that you can add the bot to your server but you have to give it permission to:
 - read messages
 - send messages
 - delete messages

## Commands
### `ping`
Responds `pong` ( for testing purposes )
### `policy`
In development...
