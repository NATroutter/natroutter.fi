"use client";

import { Skeleton } from "boneyard-js/react";
import AnimeStats from "@/app/anime/AnimeStats";
import { animeCharactersFixture, animeFixture, animeHistoryFixture } from "@/app/skeleton-fixtures";

export default function AnimeSkeleton() {
	return (
		<Skeleton
			name="anime-stats-page"
			loading
			fixture={
				<AnimeStats
					animeData={animeFixture}
					animeHistory={animeHistoryFixture}
					animeCharacters={animeCharactersFixture}
				/>
			}
		>
			<AnimeStats
				animeData={animeFixture}
				animeHistory={animeHistoryFixture}
				animeCharacters={animeCharactersFixture}
			/>
		</Skeleton>
	);
}
