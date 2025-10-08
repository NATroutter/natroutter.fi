import getConfig from "next/config";
import type { AnimeData, AnimeEntry, AnimeHistoryEntry, AnimeHistoryUpdate } from "@/types/animeData";
import {config} from "@/lib/config";

const { serverRuntimeConfig } = getConfig();

const username = "NATroutter";

const jikan_api = `https://api.jikan.moe/v4/users/${username}/history`;
const mal_api: string = `https://api.myanimelist.net/v2/users/${username}/animelist`;
const mal_fields: string =
	"list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

interface HistoryResponse {
	data: {
		entry: {
			mal_id: number;
			type: string;
			name: string;
			url: string;
		};
		increment: number;
		date: string;
	}[];
}

export async function getHistory(animeEntries: AnimeEntry[]): Promise<AnimeHistoryUpdate[]> {
	const response = await fetch(jikan_api, {
		method: "GET",
	});
	if (!response.ok) {
		throw Error(`Failed to fetch anime data from jikan.moe : (${response.status}) ${response.statusText}`);
	}
	const json = await response.json();
	const resp: HistoryResponse = json as HistoryResponse;

	const dateMap = new Map<string, Map<string, { title: string; malId: number; episodes: number }>>();

	for (const entry of resp.data) {
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
			anime: animeEntries.find((entry) => entry.node.id === anime.malId),
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

	let nextURL: string | undefined = `${mal_api}?fields=${mal_fields}&limit=1000&sort=list_updated_at&nsfw=1`;

	while (nextURL) {
		const response = await fetch(nextURL, {
			method: "GET",
			headers: {
				"X-MAL-CLIENT-ID": config.MAL_CLIENT_ID,
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

export function getPlanToWatch(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter((anime) => anime.list_status.status === "plan_to_watch");
}
export function getWatching(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter((anime) => anime.list_status.status === "watching");
}
export function getCompleted(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter((anime) => anime.list_status.status === "completed");
}
export function getOnHold(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter((anime) => anime.list_status.status === "on_hold");
}
export function getDropped(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter((anime) => anime.list_status.status === "dropped");
}
