export const config = {
	MAL_CLIENT_ID: getEnv("MAL_CLIENT_ID"),
	UMAMI: {
		SCRIPT: getEnv("UMAMI_SCRIPT"),
		TOKEN: getEnv("UMAMI_TOKEN"),
	},
	POCKETBASE: {
		SERVER: getEnv("PB_SERVER"),
		PUBLIC: getEnv("PB_PUBLIC_ADDRESS"),
		ENCRYPT: getEnv("PB_ENCRYPTION"),
	},
};

export function getEnv(varName: string): string {
	const value = process.env[varName];
	if (value === undefined) {
		throw new Error(`Environment variable ${varName} is not set.`);
	}
	return value;
}
