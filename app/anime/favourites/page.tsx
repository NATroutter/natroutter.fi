import AnimeFavs from "@/app/anime/favourites/AnimeFavs";
import ContentError from "@/components/errors/ContentError";
import { getAnimeData } from "@/lib/mal";

export const metadata = {
	title: "Anime / favorite",
	description: "My favorite anime series, movies, and characters",
	openGraph: {
		description: "My favorite anime series, movies, and characters",
	},
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function AnimeFavouritesPage() {
	const animeData = await getAnimeData();
	if (!animeData) return <ContentError />;
	return <AnimeFavs animeData={animeData} />;
}
