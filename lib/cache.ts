import NodeCache from "node-cache";

// Initialize the cache instance
const cache = new NodeCache({ stdTTL: 86400 });

/**
 * Abstraction method for caching
 * @template T - The type of data being cached
 * @param {() => Promise<T>} func - The function to execute if the cache is empty
 * @param {string} key - The unique key for the cache
 * @returns {Promise<T>} - Returns the cached data or the result of the fetchFunction
 */
export async function withCache<T>(func: () => Promise<T>, key: string): Promise<T> {
	if (process.env.NODE_ENV === "development") {
		console.warn("Skipping cache in development mode! : " + key)
		return await func();
	}


	const cachedData = cache.get<T>(key);
	if (cachedData) {
		return cachedData;
	}

	const data = await func();
	if (data != undefined) {
		cache.set(key, data);
	}

	return data;
}