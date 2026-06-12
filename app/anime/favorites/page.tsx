import type { Metadata } from "next";
import AnimeFavorites from "@/app/anime/favorites/AnimeFavorites";
import { ContentError } from "@/components/error";
import { getFavorites } from "@/lib/anime-api";
import { getAnimeData } from "@/lib/database";

export const metadata: Metadata = {
	title: "Anime Favorite",
	description: "My favorite anime series, movies, and characters",
	openGraph: {
		description: "My favorite anime series, movies, and characters",
	},
};

// ISR: Revalidate
export const revalidate = 120;

export default async function AnimeFavoritesPage() {
	const [data, favorites] = await Promise.all([getAnimeData(), getFavorites()]);

	if (!data) return <ContentError location="AnimeFavorites(1)" />;
	if (!favorites) return <ContentError location="AnimeFavorites(2)" />;

	return <AnimeFavorites animeData={data} favorites={favorites} />;
}
