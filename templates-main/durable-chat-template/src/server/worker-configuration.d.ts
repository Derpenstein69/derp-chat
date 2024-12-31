interface Env {
	Chat: DurableObjectNamespace<import("./index").Chat>;
	AI: Ai;
	ASSETS: Fetcher;
	AUTH_STORAGE: KVNamespace;
	AUTH_DB: D1Database;
}
