import type { Metadata } from "next";
import AnimeFaves from "@/app/anime/favourites/AnimeFavs";
import ServerError from "@/components/ServerError";
import { getAnimeData } from "@/lib/mal";

export const metadata: Metadata = {
	title: "Anime Favorite",
	description: "My favorite anime series, movies, and characters",
	openGraph: {
		description: "My favorite anime series, movies, and characters",
	},
};

// ISR: Revalidate
export const revalidate = 120;

export default async function AnimeFavouritesPage() {
	const data = await getAnimeData();
	if (!data) return <ServerError type="content" />;
	return <AnimeFaves animeData={data} />;
}
