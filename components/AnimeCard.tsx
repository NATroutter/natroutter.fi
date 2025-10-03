'use client'

import * as React from "react"
import {AnimeEntry, AnimeInfo, formatRatingPG, formatStatus} from "@/types/animeData";
import Image from "next/image";
import {toCapitalizedCase} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import {AnimeDialog} from "@/components/AnimeDialog";
import {GoDotFill} from "react-icons/go";
import {getAnimeSeason} from "@/components/charts/ChartAnimeSeasonsBest";

interface AnimeCardProps {
	data?: AnimeEntry
	animation?: boolean;
}

export function AnimeCard({ data, animation=true }: AnimeCardProps) {
	if (!data || !data.node || !data.list_status) {
		return (
			<Card className={`select-none w-full h-full min-h-[200px] max-w-[400px] overflow-hidden cursor-pointer bg-transparent shadow-xl border border-card-border ${animation && "hover:scale-103 transition-transform duration-300 ease-in-out"}`}>
				<CardContent className="p-2 flex gap-4 w-full h-full">
					<div className="h-[200px] w-full flex justify-center">
						<p className="text-center my-auto text-text-secondary">No anime data</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	const anime : AnimeInfo = data.node;

	const season = getAnimeSeason(data);
	let yearSeason = undefined;

	if (season && anime.start_date) {
		const year = new Date(anime.start_date).getFullYear();
		yearSeason = toCapitalizedCase(season) + " " + year;
	}

	const statusColor = (() => {
		switch (anime.status) {
			case "currently_airing": return "text-currently-airing";
			case "finished_airing": return "text-finished-airing";
			case "not_yet_aired": return "text-not-yet-aired";
			default: return "text-primary";
		}
	})();

	// Get genres (limit to display)
	const displayGenres = anime.genres?.slice(0, 3) || [];
	const hasMoreGenres = anime.genres && anime.genres.length > 3;

	return (
		<AnimeDialog data={data}>
			<Card className={`select-none w-full h-full min-h-[200px] max-w-[400px] overflow-hidden cursor-pointer bg-transparent shadow-xl border border-card-border ${animation && "hover:scale-103 transition-transform duration-300 ease-in-out"}`}>
				<CardContent className="p-2 flex gap-4 w-full h-full">
					{/* Left side - Anime Poster */}
					<div className="flex-shrink-0 overflow-hidden rounded-xl">
						<div className="relative w-full h-full max-w-[140px]">
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none" />
							<Image
								className="h-full w-full m-auto"
								src={anime.main_picture.large}
								alt={anime.title}
								sizes="100vw"
								width={0}
								height={0}
							/>

							{/* Rating badge on image */}
							{anime.rating && (
								<div className="absolute bottom-2 left-2 font-semibold z-20 text-xs">
									| {formatRatingPG(anime.rating)}
								</div>
							)}
						</div>
					</div>

					{/* Right side - Info */}
					<div className="flex-1 pr-4 flex flex-col justify-between">
						<div className="space-y-2 flex flex-col justify-between h-full">

							{/*Status*/}
							<div className="flex flex-col items-start gap-2 text-xs m-0">
								{anime.status && (
									<span className={`${statusColor} px-2 py-1 font-medium rounded border border-card-inner-border`}>
										{formatStatus(anime.status)}
									</span>
								)}
								{yearSeason ?
									(anime.num_episodes > 0 ? (
										<span className="flex flex-row">
											{yearSeason} <GoDotFill className="my-auto mx-0.5 text-text-secondary/40" size={10} /> {anime.num_episodes} episodes
										</span>
									) : '') :
									(anime.num_episodes > 0 ? `${anime.num_episodes} episodes` : '')
								}
							</div>

							{/*Title*/}
							<div className="flex flex-col m-0">
								<h3 className="font-semibold text-base line-clamp-2 leading-tight m-0 my-3 overflow-hidden break-words">
									{anime.title}
								</h3>
							</div>

							{/*Ratings*/}
							<div className="flex flex-col m-0">
								<div className="flex items-center gap-4">
									{(anime.num_scoring_users > 0 && anime.mean > 0) && (
										<div className="flex flex-col items-start">
											<div>
												<span className="text-yellow-500">★</span>
												<span className="font-bold text-sm">{anime.mean ? anime.mean.toFixed(2) : 'N/A'}</span>
											</div>
											<div>
												<p className="text-xs text-muted-foreground">
													{anime.num_scoring_users} users
												</p>
											</div>
										</div>
									)}
									{anime.rank && (
										<div className="flex flex-col items-start">
											<div>
												<span className="font-bold text-foreground">#{anime.rank}</span>
											</div>
											<div>
												<p className="text-xs text-muted-foreground">
													Ranking
												</p>
											</div>
										</div>
									)}
								</div>

								{/*Tags*/}
								<div className="flex flex-wrap gap-1.5 mt-2">
									{displayGenres.map((genre, index) => (
										<span
											key={index}
											className="bg-card-inner text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium"
										>
										{genre.name}
									</span>
									))}
									{hasMoreGenres && (
										<span className="bg-card-inner text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium">
										+{anime.genres.length - 3}
									</span>
									)}
								</div>

							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</AnimeDialog>
	)
}