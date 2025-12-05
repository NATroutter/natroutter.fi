export const config = {
	MAL_CLIENT_ID: getEnv("MAL_CLIENT_ID"),
	UMAMI: {
		SCRIPT: getEnv("UMAMI_SCRIPT"),
		TOKEN: getEnv("UMAMI_TOKEN"),
	},
	POCKETBASE: {
		SERVER: getEnv("PB_SERVER"),
		PUBLIC: getEnv("PB_PUBLIC_ADDRESS"),
	},
};

export function getEnv(varName: string): string | undefined {
	return process.env[varName];
}
