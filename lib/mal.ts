import {AnimeData, AnimeEntry} from "@/types/animeData";
import logger from "@/lib/logger";
import {withCache} from "@/lib/cache";


const endpoint: string = "https://api.myanimelist.net/v2/users/NATroutter/animelist";
const fields: string = "list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

async function requestData(url: string) : Promise<AnimeData|undefined> {
	logger.info("Sending request to : myanimelist.net")
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string
		},
		cache: 'no-store',
	})
	if (!response.ok){
		logger.error("Failed to fetch anime data from MyAnimeList.net : ("+response.status+") " +  response.statusText)
		return undefined;
	}
	const json = await response.json();
	return json ? (json as AnimeData) : undefined;
}

export async function getAnimeData(): Promise<AnimeEntry[] | undefined> {
	return withCache(async () => {
		const allData: AnimeEntry[] = [];

		let nextURL: string | undefined = endpoint + '?fields=' + fields + '&limit=1000&sort=list_updated_at&nsfw=1';

		while (nextURL) {
			const resp = await requestData(nextURL);

			if (!resp || !resp.data) break;

			allData.push(...resp.data);

			nextURL = resp.paging?.next;
		}

		return allData.length > 0 ? allData : undefined;
	}, "anime_data");
}

export function getPlanToWatch(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter(anime => anime.list_status.status === "plan_to_watch");
}
export function getWatching(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter(anime => anime.list_status.status === "watching");
}

export function getCompleted(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter(anime => anime.list_status.status === "completed");
}
export function getOnHold(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter(anime => anime.list_status.status === "on_hold");
}
export function getDropped(data: AnimeEntry[]): AnimeEntry[] {
	return data.filter(anime => anime.list_status.status === "dropped");
}

//
// export async function getWatching() : Promise<AnimeData[]|undefined> {
// 	return withCache(async ()=>{
// 		const response = await fetch(endpoint + '?fields=' + fields + '&limit=' + "100" + '&status=' + "watching" + '&sort=' + "list_updated_at" + "&nsfw=1", {
// 			method: "GET",
// 			headers: {
// 				"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string
// 			},
// 			cache: 'no-store',
// 		})
// 		if (response.ok) {
// 			const json = await response.json()
// 			return json.data.map((anime: AnimeData) => ({
// 				...anime,
// 			})) as AnimeData[];
// 		}
// 		logger.error("Failed to fetch anime data from MyAnimeList.net : ("+response.status+") " +  response.statusText)
// 		return undefined
// 	},"anime_watching")
// }
//
// export async function getCompleted() : Promise<AnimeData[]|undefined> {
// 	return withCache(async ()=>{
// 		const response = await fetch(endpoint + '?fields=' + fields + '&limit=' + "100" + '&status=' + "completed" + '&sort=' + "list_updated_at" + "&nsfw=1", {
// 			method: "GET",
// 			headers: {
// 				"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string
// 			},
// 			cache: 'no-store',
// 		})
// 		if (response.ok) {
// 			const json = await response.json()
// 			return json.data.map((anime: AnimeData) => ({
// 				...anime,
// 			})) as AnimeData[];
// 		}
// 		logger.error("Failed to fetch anime data from MyAnimeList.net : ("+response.status+") " +  response.statusText)
// 		return undefined
// 	}, "anime_completed")
// }
//
// export async function getPlanToWatch() : Promise<AnimeData[]|undefined> {
// 	return withCache(async ()=>{
// 		const response = await fetch(endpoint + '?fields=' + fields + '&limit=' + "100" + '&status=' + "plan_to_watch" + '&sort=' + "list_updated_at" + "&nsfw=1", {
// 			method: "GET",
// 			headers: {
// 				"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string
// 			},
// 			cache: 'no-store',
// 		})
// 		if (response.ok) {
// 			const json = await response.json()
// 			return json.data.map((anime: AnimeData) => ({
// 				...anime,
// 			})) as AnimeData[];
// 		}
// 		logger.error("Failed to fetch anime data from MyAnimeList.net : ("+response.status+") " +  response.statusText)
// 		return undefined
// 	}, "anime_plan_to_watch")
// }