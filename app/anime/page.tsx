import type { Metadata } from "next";
import AnimeStats from "@/app/anime/AnimeStats";
import ServerError from "@/components/ServerError";
import { getAnimeData, getHistory } from "@/lib/anime-api";

export const metadata: Metadata = {
	title: "Anime Statistics",
	description: "View detailed insights into my anime watching habits and history",
	openGraph: {
		description: "View detailed insights into my anime watching habits and history",
	},
};

// ISR: Revalidate
export const revalidate = 120;

export default async function AnimePage() {
	const data = await getAnimeData();
	if (!data) return <ServerError type="content" reason="Failed to fetch anime data!" />;

	const history = await getHistory(data);
	if (!history) return <ServerError type="content" reason="Failed to fetch anime history!" />;

	return <AnimeStats animeData={data} animeHistory={history} />;
}
