"use client";

import { Skeleton } from "boneyard-js/react";
import AnimeStats from "@/app/anime/AnimeStats";
import { animeFixture, animeHistoryFixture } from "@/app/skeleton-fixtures";

export default function AnimeSkeleton() {
	return (
		<Skeleton name="anime-stats-page" loading fixture={<AnimeStats animeData={animeFixture} animeHistory={animeHistoryFixture} />}>
			<AnimeStats animeData={animeFixture} animeHistory={animeHistoryFixture} />
		</Skeleton>
	);
}
