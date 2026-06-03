import type { Metadata } from "next";
import { Suspense } from "react";
import AnimeSkeleton from "@/app/anime/AnimeSkeleton";
import AnimeStats from "@/app/anime/AnimeStats";
import { ContentError } from "@/components/error";
import { getAnimeData } from "@/lib/anime-api";
import { getHistory, getAnimeCharactersByAnimeIdMap } from "@/lib/database";


export const metadata: Metadata = {
	title: "Anime Statistics",
	description: "View detailed insights into my anime watching habits and history",
	openGraph: {
		description: "View detailed insights into my anime watching habits and history",
	},
};

// ISR: Revalidate
export const revalidate = 120;

async function AnimeContent() {
	const [data, history, animeCharacters] = await Promise.all([getAnimeData(), getHistory(), getAnimeCharactersByAnimeIdMap()]);

	if (!data) return <ContentError location="Anim-data" />;

	return <AnimeStats animeData={data} animeHistory={history} animeCharacters={animeCharacters} />;
}

export default function AnimePage() {
	return (
		<Suspense fallback={<AnimeSkeleton />}>
			<AnimeContent />
		</Suspense>
	);
}
