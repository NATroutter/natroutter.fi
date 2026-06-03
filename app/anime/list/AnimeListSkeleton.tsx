"use client";

import { Skeleton } from "boneyard-js/react";
import AnimeList from "@/app/anime/list/AnimeList";
import { animeCharactersFixture, animeFixture } from "@/app/skeleton-fixtures";

export default function AnimeListSkeleton() {
	return (
		<Skeleton
			name="anime-list-page"
			loading
			fixture={<AnimeList animeData={animeFixture} animeCharacters={animeCharactersFixture} />}
		>
			<AnimeList animeData={animeFixture} animeCharacters={animeCharactersFixture} />
		</Skeleton>
	);
}
