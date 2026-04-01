import type { Metadata } from "next";
import AnimeStats from "@/app/anime/AnimeStats";
import { ContentError } from "@/components/error";
import { getAnimeData } from "@/lib/anime-api";
import { getHistory } from "@/lib/database";

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
	if (!data) return <ContentError location="Anim-data" />;

	const history = await getHistory();
	if (!history) return <ContentError location="anime-history"/>;

	return <AnimeStats animeData={data} animeHistory={history} />;
}
