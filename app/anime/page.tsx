import {AnimeData} from "@/types/animeData";
import Anime from "@/app/anime/anime";

const getAnimeData = async (status:string, limit:number, order:string) => {
	const endpoint: string = "https://api.myanimelist.net/v2/users/NATroutter/animelist";
	const fields: string = "list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

	const response = await fetch(endpoint + '?fields=' + fields + '&limit=' + limit + '&status=' + status + '&sort=' + order + "&nsfw=1", {
		method: "GET",
		headers: {
			"X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID as string
		},
		cache: "force-cache",
		next: { revalidate: 3600 }
	})
	if (response.ok) {
		const json = await response.json()
		return json.data.map((anime: AnimeData) => ({
			...anime,
		})) as AnimeData[];
	} else {
		console.error("Failed to fetch anime data from MyAnimeList.net : ("+response.status+") " +  response.statusText)
	}
};

export default async function AnimePage() {
	const currentlyWatching = await getAnimeData("watching", 100, "list_updated_at");
	const latestCompleted = await getAnimeData("completed", 100, "list_updated_at");
	const latestPlanToWatch = await getAnimeData("plan_to_watch", 100, "list_updated_at");

	return (<Anime currentlyWatching={currentlyWatching} latestCompleted={latestCompleted} latestPlanToWatch={latestPlanToWatch}/>);
}
