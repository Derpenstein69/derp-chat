interface Env {
	Chat: DurableObjectNamespace<import("./index").Chat>;
	AI: Ai;
	ASSETS: Fetcher;
	AUTH_STORAGE: KVNamespace;
	AUTH_DB: D1Database;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GITHUB_CLIENT_ID: string;
	GITHUB_CLIENT_SECRET: string;
	APPLE_CLIENT_ID: string;
	APPLE_CLIENT_SECRET: string;
	DISCORD_CLIENT_ID: string;
	DISCORD_CLIENT_SECRET: string;
}
