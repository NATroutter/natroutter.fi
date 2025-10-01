"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getTopRatedAnimePerSeason, Season} from "@/lib/seasonalAnimeUtils";
import Image from "next/image";
import * as React from "react";
import {AnimeEntry} from "@/types/animeData";
import {AnimeDialog} from "@/components/AnimeDialog";

interface ChartAnimeScoresProps {
	selectedYear: string
	chartData: AnimeEntry[]
}

export default function ChartBestOfTheSeason({ selectedYear, chartData }: ChartAnimeScoresProps) {
	const topAnimePerSeason = getTopRatedAnimePerSeason(chartData, selectedYear)

	return (
		<Card className="py-0 w-full">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Top Rated Anime by Season</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Highest rated anime from each season across all years."
							: `Highest rated anime from each season in ${selectedYear}.`
						}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="px-2 p-6">
				{/*TODO fix positioning center the items (tailwind autocomplete broken so this is still not done....)*/}
				<div className="gap-4 w-full c grid mx-auto grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
					{topAnimePerSeason.map((item, index) => {
						const seasons: Season[] = ["Winter", "Spring", "Summer", "Fall"]
						const season = seasons[index]

						if (!item) {
							return (
								<div
									key={season}
									className="flex flex-col bg-card2/80 p-4 gap-3 rounded-2xl opacity-50 flex-1 max-w-[280px] hover:scale-105 transition-transform duration-300 ease-in-out"
								>
									<h1 className="text-2xl font-bold text-center">{season}</h1>
									<div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-muted flex items-center justify-center">
										<p className="text-muted-foreground">No data</p>
									</div>
									<h2 className="text-lg font-medium text-center text-muted-foreground">
										No anime watched
									</h2>
								</div>
							)
						}

						return (
							<AnimeDialog key={`${item.season}-${item.year}`} data={item.anime}>
								<div
									className="flex flex-col bg-card2 p-4 gap-3 rounded-2xl flex-1 max-w-[280px] hover:scale-105 transition-transform duration-300 ease-in-out"
								>
									<h1 className="text-2xl font-bold text-center">{item.season}</h1>

									<div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl shadow-2xl">
										<Image
											className="object-cover"
											src={item.anime.node.main_picture.medium}
											alt={item.anime.node.title}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
										/>
									</div>

									<h2 className="text-lg font-medium line-clamp-2 text-center">
										{item.anime.node.title}
									</h2>
									<p className="text-sm text-muted-foreground text-center">
										Score: {item.anime.list_status.score}
									</p>
								</div>
							</AnimeDialog>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}