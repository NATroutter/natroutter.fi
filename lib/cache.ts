import NodeCache from "node-cache";

// Initialize the cache instance
const cache = new NodeCache({ stdTTL: 86400 });

//Variables to chang behavior - Meant for debugging!
let useCache = true;
let debug = true;

/**
 * Abstraction method for caching
 * @template T - The type of data being cached
 * @param {() => Promise<T>} func - The function to execute if the cache is empty
 * @param {string} key - The unique key for the cache
 * @returns {Promise<T>} - Returns the cached data or the result of the fetchFunction
 */
export async function withCache<T>(func: () => Promise<T>, key: string): Promise<T> {
	if (process.env.NODE_ENV !== "development") {
		debug = false
		useCache = true;
	}

	if (!useCache) {
		if (debug) console.warn("Returning fresh data (cache skipped)! : " + key)
		return await func();
	}


	const cachedData = cache.get<T>(key);
	if (cachedData) {
		if (debug) console.warn("Returning cached data! : " + key)
		return cachedData;
	}

	const data = await func();
	if (data != undefined) {
		cache.set(key, data);
		if (debug) console.warn("Data saved to cache! : " + key)
	}

	if (debug) console.warn("Returning fresh data (cache did not exist)! : " + key)
	return data;
}