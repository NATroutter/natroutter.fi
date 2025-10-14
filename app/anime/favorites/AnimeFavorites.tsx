"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimeCard } from "@/components/AnimeCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnimeEntry, AnimeFaveAnime, AnimeFavoritesData } from "@/types/animeData";

interface AnimeFavoritesProps {
	animeData: AnimeEntry[];
	favorites: AnimeFavoritesData;
}

interface SortedFaveAnime {
	fave: AnimeFaveAnime;
	anime: AnimeEntry;
}

export default function AnimeFavorites({ animeData, favorites }: AnimeFavoritesProps) {
	// Create Map for O(1) lookups and match favorites with anime data
	const animeMap = new Map(animeData.map((anime) => [anime.node.id, anime]));

	const favorites_anime = favorites.data.anime
		.map((fave) => ({
			fave,
			anime: animeMap.get(fave.mal_id),
		}))
		.filter((item): item is SortedFaveAnime => item.anime !== undefined);

	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5 md:my-14">
					<Card className="w-full h-full py-0">
						<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
							<div className="flex flex-1 flex-col gap-0.5 px-6 py-2 my-auto">
								<CardTitle className="text-xl">Favorite Anime Shows & Movies</CardTitle>
								<CardDescription className="line-clamp-2 text-ellipsis text-md">
									The shows that have left a lasting impact on me and keep me coming back for more.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="p-6 grid gap-4 place-items-center grid-cols-1 xl:grid-cols-2 xxl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6">
							{favorites_anime.map((anime) => (
								<AnimeCard key={anime.anime.node.id} data={anime.anime}></AnimeCard>
							))}
						</CardContent>
					</Card>
					<Card className="w-full h-full py-0">
						<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
							<div className="flex flex-1 flex-col gap-0.5 px-6 py-2 my-auto">
								<CardTitle className="text-xl">Favorite Characters</CardTitle>
								<CardDescription className="line-clamp-2 text-ellipsis text-md">
									A list of anime characters I like
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="p-6 flex flex-wrap gap-4 justify-center">
							{favorites.data.characters.map((character) => (
								<Link
									key={character.mal_id}
									target="_blank"
									href={`https://myanimelist.net/character/${character.mal_id}`}
								>
									<div className="bg-card-inner shadow-xl select-none p-5 rounded-xl flex justify-center flex-col gap-4 hover:scale-103 transition-transform duration-300 ease-in-out">
										<div className="w-50 h-50 aspect-square m-auto">
											<Image
												className="h-full aspect-square w-full m-auto rounded-full pointer-events-none"
												src={character.images.webp.image_url}
												alt={character.name}
												sizes="100vw"
												width={0}
												height={0}
											/>
										</div>
										<div className="">
											<h2 className="text-center text-lg font-semibold">{character.name}</h2>
										</div>
									</div>
								</Link>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
