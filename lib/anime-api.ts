"use server";

import { config } from "@/lib/config";
import type { AnimeCharacterListData, AnimeData, AnimeEntry, AnimeFavoritesData } from "@/types/animeData";

type Endpoint = "anime_data" | "favorites" | "characters";
function getEndpoint(endpoint: Endpoint, data: string[]): string {
	const jikan = `https://api.jikan.moe/v4`;
	const mal = "https://api.myanimelist.net/v2";
	const mal_fields: string =
		"list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

	switch (endpoint) {
		case "anime_data":
			return `${mal}/users/${data[0]}/animelist?fields=${mal_fields}&limit=1000&sort=list_updated_at&nsfw=1`;
		case "favorites":
			return `${jikan}/users/${data[0]}/favorites`;
		case "characters":
			return `${jikan}/anime/${data[0]}/characters`;
	}
}


export async function getFavorites(): Promise<AnimeFavoritesData | undefined> {
	try {
		const response = await fetch(getEndpoint("favorites",["NATroutter"]), {
			method: "GET",
		});
		if (!response.ok) {
			console.error(`Failed to fetch anime data from jikan.moe : (${response.status}) ${response.statusText}`);
			return undefined;
		}
		const json = await response.json();
		return json as AnimeFavoritesData;
	} catch (err) {
		console.error("Failed to fetch favorites:", err);
		return undefined;
	}
}

export async function getAnimeData(): Promise<AnimeEntry[] | undefined> {
	const data: AnimeEntry[] = [];

	let nextURL: string | undefined = getEndpoint("anime_data",["NATroutter"]);

	const client_id = config.MAL_CLIENT_ID;
	if (!client_id) return undefined;

	try {
		while (nextURL) {
			const response = await fetch(nextURL, {
				method: "GET",
				headers: {
					"X-MAL-CLIENT-ID": client_id,
				},
			});
			if (!response.ok) {
				console.error(`Failed to fetch anime data from MyAnimeList.net : (${response.status}) ${response.statusText}`);
				return undefined;
			}
			const json = await response.json();
			const resp: AnimeData = json as AnimeData;

			if (!resp || !resp.data) break;
			data.push(...resp.data);
			nextURL = resp.paging?.next;
		}
	} catch (err) {
		console.error("Failed to fetch anime data:", err);
		return undefined;
	}

	return data.length > 0 ? data : undefined;
}
