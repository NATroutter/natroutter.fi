"use client";

import { Skeleton } from "boneyard-js/react";
import AnimeFavorites from "@/app/anime/favorites/AnimeFavorites";
import { animeFavoritesFixture, animeFixture } from "@/app/skeleton-fixtures";

export default function AnimeFavoritesSkeleton() {
	return (
		<Skeleton
			name="anime-favorites-page"
			loading
			fixture={<AnimeFavorites animeData={animeFixture} favorites={animeFavoritesFixture} />}
		>
			<AnimeFavorites animeData={animeFixture} favorites={animeFavoritesFixture} />
		</Skeleton>
	);
}
