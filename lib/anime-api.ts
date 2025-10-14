"use server";

import { config } from "@/lib/config";
import type {
	AnimeData,
	AnimeEntry,
	AnimeFavoritesData,
	AnimeHistoryEntry,
	AnimeHistoryResponse,
	AnimeHistoryUpdate,
} from "@/types/animeData";

type Endpoint = "anime_data" | "history" | "favorites";
function getEndpoint(endpoint: Endpoint): string {
	const username = "NATroutter";
	const jikan = `https://api.jikan.moe/v4`;
	const mal = "https://api.myanimelist.net/v2";
	const mal_fields: string =
		"list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

	switch (endpoint) {
		case "anime_data":
			return `${mal}/users/${username}/animelist?fields=${mal_fields}&limit=1000&sort=list_updated_at&nsfw=1`;
		case "history":
			return `${jikan}/users/${username}/history`;
		case "favorites":
			return `${jikan}/users/${username}/favorites`;
	}
}

export async function getFavorites(): Promise<AnimeFavoritesData | undefined> {
	const response = await fetch(getEndpoint("favorites"), {
		method: "GET",
	});
	if (!response.ok) {
		throw Error(`Failed to fetch anime data from jikan.moe : (${response.status}) ${response.statusText}`);
	}
	const json = await response.json();
	return json as AnimeFavoritesData;
}

export async function getCurrentHistory(): Promise<AnimeHistoryUpdate[]> {
	const response = await fetch(getEndpoint("history"), {
		method: "GET",
	});
	if (!response.ok) {
		throw Error(`Failed to fetch anime data from jikan.moe : (${response.status}) ${response.statusText}`);
	}
	const json = await response.json();
	const histroy = json as AnimeHistoryResponse;

	const dateMap = new Map<string, Map<string, { title: string; malId: number; episodes: number }>>();

	for (const entry of histroy.data) {
		const date = entry.date.split("T")[0];
		const animeKey = `${entry.entry.mal_id}`;

		let dayMap = dateMap.get(date);
		if (!dayMap) {
			dayMap = new Map();
			dateMap.set(date, dayMap);
		}

		if (!dayMap.has(animeKey)) {
			dayMap.set(animeKey, {
				title: entry.entry.name,
				malId: entry.entry.mal_id,
				episodes: 0,
			});
		}

		const day = dayMap.get(animeKey);
		if (day) {
			day.episodes++;
		}
	}
	// Transform to HistoryUpdate[]
	const entries: AnimeHistoryUpdate[] = [];
	let idCounter = 1;

	for (const [date, animeMap] of dateMap.entries()) {
		const updates: AnimeHistoryEntry[] = Array.from(animeMap.values()).map((anime) => ({
			id: anime.malId,
			title: anime.title,
			episodes: anime.episodes,
		}));
		entries.push({
			id: String(idCounter++),
			date,
			updates,
		});
	}
	return entries;
}

export async function getAnimeData(): Promise<AnimeEntry[] | undefined> {
	const data: AnimeEntry[] = [];

	let nextURL: string | undefined = getEndpoint("anime_data");

	const client_id = config.MAL_CLIENT_ID;
	if (!client_id) return undefined;

	while (nextURL) {
		const response = await fetch(nextURL, {
			method: "GET",
			headers: {
				"X-MAL-CLIENT-ID": client_id,
			},
		});
		if (!response.ok) {
			throw Error(`Failed to fetch anime data from MyAnimeList.net : (${response.status}) ${response.statusText}`);
		}
		const json = await response.json();
		const resp: AnimeData = json as AnimeData;

		if (!resp || !resp.data) break;
		data.push(...resp.data);
		nextURL = resp.paging?.next;
	}

	return data.length > 0 ? data : undefined;
}

// export async function getSavedHistory() {
// 	try {
// 		const pb = getPocketBase();
// 		return await pb.collection("anime_history").getFullList<SavedAnimeHistory>({});
// 	} catch (err) {
// 		return handlePocketBaseError(err, "Failed to fetch data for AnimeHistory");
// 	}
// }

// async function saveHistroy(data: SavedAnimeHistory) {
// 	try {
// 		const pb = getPocketBase();
// 		return await pb.collection('anime_history').create({
// 			data: data
// 		});
// 	} catch (err) {
// 		return handlePocketBaseError(err, "Failed to fetch data for AnimeHistory");
// 	}
// }
//
// export async function getHistory() {
// 	const savedHistory = await getSavedHistory();
// 	const currentHistory = await getCurrentHistory();
//
// 	console.log("saved: ", savedHistory)
//
// 	//If the saved history is empty so its first time when history is being saved
// 	if (!savedHistory) {
// 		const saved : SavedAnimeHistory = {
// 			data: currentHistory
// 		}
// 		await saveHistroy(saved);
// 		console.log("History saved!")
// 		return currentHistory;
// 	}
//
// 	//There are some history saved
//
// }
