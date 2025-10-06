import ContentError from "@/components/errors/ContentError";
import {getAnimeData} from "@/lib/anime";
import AnimeFavourites from "@/app/anime/favourites/list";

export const metadata = {
	title: 'Anime / favorite',
	description: 'My favorite anime series, movies, and characters',
	openGraph: {
		description: 'My favorite anime series, movies, and characters'
	}
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function AnimeFavouritesPage() {
	const animeData = await getAnimeData();
	if (!animeData) return (<ContentError/>)
	return (<AnimeFavourites animeData={animeData}/>);
}
