"use server";

import { config } from "@/lib/config";
import type { AnimeData, AnimeEntry, AnimeFavoritesData } from "@/types/animeData";

type Endpoint = "anime_data" | "favorites";
function getEndpoint(endpoint: Endpoint): string {
	const username = "NATroutter";
	const jikan = `https://api.jikan.moe/v4`;
	const mal = "https://api.myanimelist.net/v2";
	const mal_fields: string =
		"list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

	switch (endpoint) {
		case "anime_data":
			return `${mal}/users/${username}/animelist?fields=${mal_fields}&limit=1000&sort=list_updated_at&nsfw=1`;
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

