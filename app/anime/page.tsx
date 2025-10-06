import AnimeStats from "@/app/anime/AnimeStats";
import ContentError from "@/components/errors/ContentError";
import { getAnimeData } from "@/lib/mal";

export const metadata = {
	title: "Anime",
	description:
		"View detailed insights into my anime watching habits and history",
	openGraph: {
		description:
			"View detailed insights into my anime watching habits and history",
	},
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function AnimePage() {
	const animeData = await getAnimeData();
	if (!animeData) return <ContentError />;
	return <AnimeStats animeData={animeData} />;
}
