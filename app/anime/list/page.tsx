import AnimeList from "@/app/anime/list/AnimeList";
import ContentError from "@/components/errors/ContentError";
import { getAnimeData } from "@/lib/mal";

export const metadata = {
	title: "Anime",
	description:
		'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!',
	openGraph: {
		description:
			'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!',
	},
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function AnimeListPage() {
	const animeData = await getAnimeData();
	if (!animeData) return <ContentError />;
	return <AnimeList animeData={animeData} />;
}
