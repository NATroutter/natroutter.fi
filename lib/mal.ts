import {AnimeData} from "@/types/animeData";
import logger from "@/lib/logger";
import {withCache} from "@/lib/cache";


const endpoint: string = "https://api.myanimelist.net/v2/users/NATroutter/animelist";
const fields: string = "list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

export async function getWatching() : Promise<AnimeData[]|undefined> {
	return withCache(async ()=>{
		const response = await fetch(endpoint + '?fields=' + fields + '&limit=' + "100" + '&status=' + "watching" + '&sort=' + "list_updated_at" + "&nsfw=1", {
			method: "GET",
			headers: {
				"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string
			},
			cache: 'no-store',
		})
		if (response.ok) {
			const json = await response.json()
			return json.data.map((anime: AnimeData) => ({
				...anime,
			})) as AnimeData[];
		}
		logger.error("Failed to fetch anime data from MyAnimeList.net : ("+response.status+") " +  response.statusText)
		return undefined
	},"anime_watching")
}

export async function getCompleted() : Promise<AnimeData[]|undefined> {
	return withCache(async ()=>{
		const response = await fetch(endpoint + '?fields=' + fields + '&limit=' + "100" + '&status=' + "completed" + '&sort=' + "list_updated_at" + "&nsfw=1", {
			method: "GET",
			headers: {
				"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string
			},
			cache: 'no-store',
		})
		if (response.ok) {
			const json = await response.json()
			return json.data.map((anime: AnimeData) => ({
				...anime,
			})) as AnimeData[];
		}
		logger.error("Failed to fetch anime data from MyAnimeList.net : ("+response.status+") " +  response.statusText)
		return undefined
	}, "anime_completed")
}

export async function getPlanToWatch() : Promise<AnimeData[]|undefined> {
	return withCache(async ()=>{
		const response = await fetch(endpoint + '?fields=' + fields + '&limit=' + "100" + '&status=' + "plan_to_watch" + '&sort=' + "list_updated_at" + "&nsfw=1", {
			method: "GET",
			headers: {
				"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string
			},
			cache: 'no-store',
		})
		if (response.ok) {
			const json = await response.json()
			return json.data.map((anime: AnimeData) => ({
				...anime,
			})) as AnimeData[];
		}
		logger.error("Failed to fetch anime data from MyAnimeList.net : ("+response.status+") " +  response.statusText)
		return undefined
	}, "anime_plan_to_watch")
}