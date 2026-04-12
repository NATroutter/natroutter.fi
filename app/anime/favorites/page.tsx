import type { Metadata } from "next";
import { Suspense } from "react";
import AnimeFavorites from "@/app/anime/favorites/AnimeFavorites";
import AnimeFavoritesSkeleton from "@/app/anime/favorites/AnimeFavoritesSkeleton";
import { ContentError } from "@/components/error";
import { getAnimeData, getFavorites } from "@/lib/anime-api";

export const metadata: Metadata = {
	title: "Anime Favorite",
	description: "My favorite anime series, movies, and characters",
	openGraph: {
		description: "My favorite anime series, movies, and characters",
	},
};

// ISR: Revalidate
export const revalidate = 120;

async function AnimeFavoritesContent() {
	const [data, favorites] = await Promise.all([getAnimeData(), getFavorites()]);

	if (!data) return <ContentError location="AnimeFavorites(1)" />;
	if (!favorites) return <ContentError location="AnimeFavorites(2)" />;

	return <AnimeFavorites animeData={data} favorites={favorites} />;
}

export default function AnimeFavoritesPage() {
	return (
		<Suspense fallback={<AnimeFavoritesSkeleton />}>
			<AnimeFavoritesContent />
		</Suspense>
	);
}
