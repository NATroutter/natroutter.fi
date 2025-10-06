import type { Metadata } from "next";
import AnimeStats from "@/app/anime/AnimeStats";
import ServerError from "@/components/ServerError";
import { getAnimeData } from "@/lib/mal";

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
	if (!data) return <ServerError type="content" />;
	return <AnimeStats animeData={data} />;
}
