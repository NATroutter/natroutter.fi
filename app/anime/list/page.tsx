import type { Metadata } from "next";
import AnimeList from "@/app/anime/list/AnimeList";
import ServerError from "@/components/ServerError";
import { getAnimeData } from "@/lib/anime-api";

export const metadata: Metadata = {
	title: "Anime List",
	description:
		'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!',
	openGraph: {
		description:
			'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!',
	},
};

// ISR: Revalidate
export const revalidate = 120;

export default async function AnimeListPage() {
	const data = await getAnimeData();
	if (!data) return <ServerError type="content" />;
	return <AnimeList animeData={data} />;
}
