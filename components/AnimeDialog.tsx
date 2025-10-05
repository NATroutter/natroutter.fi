'use client'

import * as React from "react"
import {AlternativeTitles, AnimeEntry, formatRating} from "@/types/animeData";
import Image from "next/image";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {formatDate, toCapitalizedCase} from "@/lib/utils";
import Link from "next/link";
import {ReactNode} from "react";

interface AnimeCardProps {
	data: AnimeEntry;
	children?: ReactNode;
}

export function AnimeDialog({ data, children }: AnimeCardProps) {

	const anime = data.node;
	const status = data.list_status;
	const titles : AlternativeTitles = anime.alternative_titles;

	return (
		<Dialog>
			<DialogTrigger asChild data-umami-event={`[ANIME] Expand (${anime.id})`}>
				{children ?? anime.title}
			</DialogTrigger>
			<DialogContent className="border-none outline-hidden bg-background min-w-[70%] max-h-[90vh] w-full overflow-y-auto">
				<DialogHeader className="outline-hidden w-full">
					<DialogTitle className="hidden"/>
					<DialogDescription className="hidden"/>
					<div className="flex flex-col-reverse lg:flex-row gap-4 text-left">
						<div className="flex flex-col min-w-full max-w-full w-full lg:min-w-[20rem] lg:max-w-[20rem] lg:w-[20rem]">
							<div className="hidden lg:flex my-0 m-auto w-[20rem] py-0 pl-0 pr-6">
								{(anime.main_picture.large || anime.main_picture.medium) ? (
									<Image
										className="w-full rounded-lg"
										src={anime.main_picture.large || anime.main_picture.medium}
										alt="Anime_picture"
										sizes="100vw"
										width={0}
										height={0}
									/>
								) : (
									<div className="w-full rounded-lg h-[415px] bg-card-inner flex">
										<p className="text-muted font-semibold m-auto text-center">IMAGE NOT FOUND!</p>
									</div>
								)}
							</div>


							{/*Anime Statistics*/}
							{(anime.mean > 0 || anime.rank > 0 || anime.popularity > 0) && (
								<div className="pt-5">
									<h3 className="text-xl font-bold">Statistics</h3>

									{anime.rank>0 && (<p>Ranked: <span className="text-muted">#{anime.rank}</span></p>)}
									{anime.popularity>0 && (<p>Popularity: <span className="text-muted">#{anime.popularity}</span></p>)}
									{anime.mean>0 && (<p>Rating: <span className="text-muted">{anime.mean} by {anime.num_scoring_users} users</span></p>)}

									{status.score>0 && (<p>Score: <span className="text-muted">{status.score}</span></p>)}
									{status.score>0 && (<p>Difference: <span className="text-muted">{Math.abs(anime.mean - status.score).toFixed(2)}</span></p>)}

									{(anime.num_episodes>0) && (<p>Progress: <span className="text-muted">{status.num_episodes_watched}/{anime.num_episodes} </span></p>)}

								</div>
							)}

							{/*Anime Info*/}
							{(anime.media_type || anime.num_episodes>0 || anime.status || anime.start_date || anime.end_date || anime.studios.length>0 || anime.source || anime.genres.length>0 || anime.average_episode_duration>0 || anime.rating) && (
								<div className="pt-5">
									<h3 className="text-xl font-bold">Anime Info</h3>

									{anime.media_type && (<p>Type: <span className="text-muted">{anime.media_type.toUpperCase()}</span></p>)}
									{anime.num_episodes>0 && (<p>Episodes: <span className="text-muted">{anime.num_episodes}</span></p>)}
									{anime.status && (<p>Status: <span className="text-muted">{toCapitalizedCase(anime.status)}</span></p>)}

									{anime.start_date && (
										<p>Started: <span className="text-muted">{formatDate(anime.start_date)}</span></p>
									)}
									{anime.end_date && (
										<p>Ended: <span className="text-muted">{formatDate(anime.end_date)}</span></p>
									)}

									{anime.studios.length>0 && (
										<p><span>Studios: </span>
											{anime.studios.map((studio,index)=>(
												<span key={index}>
											<Link href={`https://myanimelist.net/anime/producer/${studio.id}/`} target="_blank"
											      data-umami-event={`[ANIME] Show Studio (${studio.id})`}
											      data-umami-event-url={`https://myanimelist.net/anime/producer/${studio.id}/`}
											      className="text-muted hover:underline hover:text-muted-hover">
												{studio.name}
											</Link>
													{index != anime.studios.length -1 ? ", " : ""}
										</span>
											))}
										</p>
									)}
									{anime.source && (<p>Source: <span className="text-muted">{toCapitalizedCase(anime.source)}</span></p>)}
									{anime.genres.length>0 && (
										<p><span>Genres: </span>
											{anime.genres.slice(0,anime.genres.length-1).map((genre,index)=>(
												<span key={index}>
											<Link href={`https://myanimelist.net/anime/genre/${genre.id}/`} target="_blank"
											      data-umami-event={`[ANIME] Show Genre (${genre.id})`}
											      data-umami-event-url={`https://myanimelist.net/anime/genre/${genre.id}/`}
											      className="text-muted hover:underline hover:text-muted-hover">
												{genre.name}
											</Link>
													{index != anime.genres.length -2 ? ", " : ""}
										</span>
											))}
										</p>
									)}
									{anime.genres.length>0 && (<p>Theme: <span className="text-muted">{anime.genres.slice(-1)[0].name}</span></p>)}
									{anime.average_episode_duration>0 && (<p>Duration: <span className="text-muted">{Math.floor(anime.average_episode_duration / 60)} min. per ep.</span></p>)}
									{anime.rating && (<p>Rating: <span className="text-muted">{formatRating(anime.rating)}</span></p>)}
								</div>
							)}


							{/*MyAnimeList.net Button*/}
							<Link href={`https://myanimelist.net/anime/${anime.id}`} target="_blank"
								  data-umami-event={`[ANIME] Show Anime (${anime.id})`}
								  data-umami-event-url={`https://myanimelist.net/anime/${anime.id}`}
								  className="flex w-full mt-10 m-auto">
								<button className="bg-[#3557a5] hover:bg-[#253c73] active:bg-[#253c73] rounded-lg text-white transition-colors ease-in-out duration-300 px-4 py-2 m-auto w-full font-mal">MyAnimeList.net</button>
							</Link>
						</div>

						{/*Right side*/}
						<div className="flex flex-col gap-4 w-fit">
							<div className="flex flex-col">
								<h1 className="text-2xl">{titles.en.length > 0 ? titles.en : anime.title}</h1>
								{anime.alternative_titles.ja && (<h2 className="text-base">{anime.alternative_titles.ja}</h2>)}
							</div>

							{anime.synopsis && (
								<div className="text-muted">
									<p>{anime.synopsis.replace("[Written by MAL Rewrite]", "")}</p>
								</div>
							)}

						</div>

						{/*Image For mobile layout*/}
						<div className="flex lg:hidden my-0 m-auto w-[20rem] py-3 pl-0">
							{(anime.main_picture.large || anime.main_picture.medium) ? (
								<Image
									className="w-full rounded-lg"
									src={anime.main_picture.large || anime.main_picture.medium}
									alt="Anime_picture"
									sizes="100vw"
									width={0}
									height={0}
								/>
							) : (
								<div className="w-full rounded-lg h-[415px] bg-card-inner flex">
									<p className="text-muted font-semibold m-auto text-center">IMAGE NOT FOUND!</p>
								</div>
							)}
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
