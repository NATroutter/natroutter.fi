import ContentError from "@/components/errors/ContentError";
import {getAnimeData} from "@/lib/mal";
import AnimeFavourites from "@/app/anime/favourites/list";

export const metadata = {
	title: 'Anime',
	description: 'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!',
	openGraph: {
		description: 'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!'
	}
};

export default async function AnimeFavouritesPage() {
	const animeData = await getAnimeData();
	if (!animeData) return (<ContentError/>)
	return (<AnimeFavourites animeData={animeData}/>);
}
