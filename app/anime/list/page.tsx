import type { Metadata } from "next";
import { Suspense } from "react";
import AnimeList from "@/app/anime/list/AnimeList";
import AnimeListSkeleton from "@/app/anime/list/AnimeListSkeleton";
import { ContentError } from "@/components/error";
import { getAnimeData } from "@/lib/anime-api";
import { getAnimeCharactersByAnimeIdMap } from "@/lib/database";

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

async function AnimeListContent() {
	const [data, animeCharacters] = await Promise.all([getAnimeData(), getAnimeCharactersByAnimeIdMap()]);

	if (!data) return <ContentError location="AnimeList" />;
	return <AnimeList animeData={data} animeCharacters={animeCharacters} />;
}

export default function AnimeListPage() {
	return (
		<Suspense fallback={<AnimeListSkeleton />}>
			<AnimeListContent />
		</Suspense>
	);
}
