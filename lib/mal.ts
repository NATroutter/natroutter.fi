import type { AnimeData, AnimeEntry } from "@/types/animeData";

const endpoint: string = "https://api.myanimelist.net/v2/users/NATroutter/animelist";
const fields: string =
	"list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

export async function getAnimeData(): Promise<AnimeEntry[] | undefined> {
	const data: AnimeEntry[] = [];

	let nextURL: string | undefined = `${endpoint}?fields=${fields}&limit=1000&sort=list_updated_at&nsfw=1`;

	while (nextURL) {
		const response = await fetch(nextURL, {
			method: "GET",
			headers: {
				"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string,
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
