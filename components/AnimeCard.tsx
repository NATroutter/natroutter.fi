"use client";

import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { AnimeDialog } from "@/components/AnimeDialog";
import { getAnimeSeason, getAnimeStartYear } from "@/components/charts/ChartAnimeSeasonsBest";
import { Card, CardContent } from "@/components/ui/card";
import { formatAnimeAgeRating, formatAnimeStatus, getStatusStyle } from "@/lib/anime-format";
import { toCapitalizedCase } from "@/lib/utils";
import type { AnimeAlternativeTitles, AnimeEntry, AnimeInfo } from "@/types/animeData";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface AnimeCardProps {
	data?: AnimeEntry;
	animation?: boolean;
}

export function AnimeCard({ data, animation = true }: AnimeCardProps) {
	if (!data || !data.node || !data.list_status) {
		return (
			<Card
				className={`select-none w-full h-full min-h-52 max-h-52 overflow-hidden cursor-pointer bg-card-inner shadow-xl border border-card-inner-border ${animation && "hover:scale-103 transition-transform duration-300 ease-in-out"}`}
			>
				<CardContent className="p-2 flex gap-4 w-full h-full">
					<div className="w-full flex justify-center">
						<p className="text-center my-auto text-muted">No anime data</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const anime: AnimeInfo = data.node;

	const season = getAnimeSeason(data);
	let yearSeason: string | undefined;

	if (season && anime.start_date) {
		const year = new Date(anime.start_date).getFullYear();
		yearSeason = `${toCapitalizedCase(season)} ${year}`;
	}

	// Get genres (limit to display)
	const maxGenres = 2;
	const displayGenres = anime.genres?.slice(0, maxGenres) || [];
	const hasMoreGenres = anime.genres && anime.genres.length > maxGenres;

	const titles: AnimeAlternativeTitles = anime.alternative_titles;

	return (
		<AnimeDialog data={data}>
			<Card
				className={`select-none w-full h-full min-h-52 overflow-hidden cursor-pointer bg-card-inner shadow-xl border border-card-inner-border ${animation && "hover:scale-103 transition-transform duration-300 ease-in-out"}`}
			>
				<CardContent className="p-2 flex flex-col xs:flex-row gap-4 w-full h-full">
					{/* Left side - Anime Poster */}
					<div className="flex flex-1 overflow-hidden w-full xs:max-w-32 justify-center xs:justify-start">
						<div className="relative min-w-44 x max-w-44 xs:min-w-32 x xs:max-w-32">
							<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none" />
							<Image
								className="h-full w-full m-auto rounded-xl pointer-events-none"
								src={anime.main_picture.medium || anime.main_picture.large}
								alt={anime.title}
								sizes="100vw"
								width={0}
								height={0}
							/>

							{/* Rating badge on image */}
							{anime.rating && (
								<div className="absolute bottom-2 left-2 font-semibold z-20 text-xs">
									| {formatAnimeAgeRating(anime.rating)}
								</div>
							)}
						</div>
					</div>

					{/* Right side - Info */}
					<div className="flex-1 xs:pr-4 flex flex-col justify-between">
						<div className="space-y-0 xs:space-y-2 flex flex-col justify-between h-full">
							{/*Status*/}
							<div className="flex flex-col items-start space-y-2 text-xs m-0 text-ellipsis flex-nowrap whitespace-nowrap">
								{anime.status && (
									<span
										className={`${getStatusStyle(anime.status)} px-2 py-1 font-medium rounded border bg-card border-card-border`}
									>
										{formatAnimeStatus(anime.status)}
									</span>
								)}
								{yearSeason ? (
									anime.num_episodes > 0 ? (
										<div>
											{/*Year and episode data for propper good devices*/}
											<span className="hidden xs:flex flex-row">
												{yearSeason} <GoDotFill className="my-auto mx-0.5 text-muted" size={10} /> {anime.num_episodes}{" "}
												episodes
											</span>

											{/*Year and episode data for shit devices that should be thrown in to e-waste...*/}
											<span className="flex xs:hidden flex-row">
												{getAnimeStartYear(data)} <GoDotFill className="my-auto mx-0.5 text-muted" size={10} />{" "}
												{anime.num_episodes}
											</span>
										</div>
									) : (
										""
									)
								) : anime.num_episodes > 0 ? (
									`${anime.num_episodes} episodes`
								) : (
									""
								)}
							</div>

							{/*Title*/}
							<div className="flex flex-col m-0">
								<h3 className="font-semibold text-base line-clamp-2 leading-tight m-0 xs:my-3 overflow-hidden break-words">
									{titles.en.length > 0 ? titles.en : anime.title}
								</h3>
							</div>

							{/*Ratings*/}
							<div className="flex flex-col space-y-2">
								<div className="flex items-center gap-4">
									{anime.num_scoring_users > 0 && anime.mean > 0 && (
										<div className="flex flex-col items-start">
											<div>
												<span className="text-yellow-500">★</span>
												<span className="font-bold text-sm">{anime.mean ? anime.mean.toFixed(2) : "N/A"}</span>
											</div>
											<div>
												<p className="text-xs text-muted-foreground">{anime.num_scoring_users} users</p>
											</div>
										</div>
									)}
									{anime.rank && (
										<div className="flex flex-col items-start">
											<div>
												<span className="font-bold text-foreground">#{anime.rank}</span>
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Ranking</p>
											</div>
										</div>
									)}
								</div>

								<div className="flex gap-1.5">
									{displayGenres.map((genre) => (
										<div
											key={genre.id}
											className={`grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] overflow-ellipsis truncate`}
										>
											<Tooltip>
												<TooltipTrigger>
													<div className="flex">
														<span className="bg-card border border-card-border text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium truncate">
															{genre.name}
														</span>
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<p>{genre.name}</p>
												</TooltipContent>
											</Tooltip>
										</div>
									))}
									{hasMoreGenres && (
										<Tooltip>
											<TooltipTrigger>
												<span className="bg-card border border-card-border text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium shrink-0">
													+{anime.genres.length - maxGenres}
												</span>
											</TooltipTrigger>
											<TooltipContent>
												<div className="flex flex-col text-center">
													{anime.genres.slice(maxGenres).map((genre) => (
														<span key={genre.id}>{genre.name}</span>
													))}
												</div>
											</TooltipContent>
										</Tooltip>
									)}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</AnimeDialog>
	);
}
