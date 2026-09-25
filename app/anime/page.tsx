import type { Metadata } from "next";
import AnimeStats from "@/app/anime/AnimeStats";
import { ContentError } from "@/components/error";
import { getAnimeData, getHistory } from "@/lib/database";

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
	const [data, history] = await Promise.all([getAnimeData(), getHistory()]);

	if (!data) return <ContentError location="Anim-data" />;

	return <AnimeStats animeData={data} animeHistory={history} />;
}
