'use client'

import * as React from "react"
import {AnimeData, formatRating} from "@/types/animeData";
import Image from "next/image";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {formatDate, toCapitalizedCase} from "@/lib/utils";
import Link from "next/link";

export function AnimeCard({ data, showScore }: { data: AnimeData, showScore:boolean }) {

	const updated = new Date(data.list_status.updated_at);
	const title_en = data.node.alternative_titles.en;

	return (
		<Dialog>
			<DialogTrigger className="flex flex-col text-left w-full" data-umami-event={`[ANIME] Expand (${data.node.id})`}>
				<div className="flex p-1.5 m-3 h-[9rem]">
					<div className="flex w-full h-full bg-card2 rounded-lg hover:scale-[1.03] md:hover:scale-[1.02] lg:hover:scale-[1.02] xl:hover:scale-[1.03] transition-transform duration-300 ease-in-out">
						<div className="min-w-24 h-full">
							<Image
								className="h-full w-full m-auto"
								src={data.node.main_picture.large}
								alt="Anime"
								sizes="100vw"
								width={0}
								height={0}
							/>
						</div>
						<div className="flex flex-col justify-between px-2 py-1 w-full">
							<div className="flex flex-col justify-between">
								<h2 className="text-xl font-semibold line-clamp-1">{title_en.length > 0 ? title_en : data.node.title}</h2>
								<h3 className="text-sm leading-none line-clamp-1 text-neutral-500">{data.node.alternative_titles.ja}</h3>
							</div>
							<div className="flex flex-row justify-between">
								<div>
									<p className="text-sm text-neutral-400 font-semibold italic text-nowrap">{data.node.mean ? ("Rating: " + data.node.mean) : "Rating: ?"} {showScore && (" | Score: "+data.list_status.score)}</p>
								</div>
								<div className="flex flex-col justify-end">
									<p className="text-sm text-neutral-500 font-semibold italic text-nowrap">{updated.getDay()}.{updated.getMonth()}.{updated.getFullYear()} {updated.getHours()}:{updated.getMinutes()}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="border-none outline-none bg-background min-w-[70%] max-h-[90vh] w-full overflow-y-auto">
				<DialogHeader className="outline-none w-full">
					<DialogTitle className="hidden"/>
					<DialogDescription className="hidden"/>
					<div className="flex flex-col-reverse lg:flex-row gap-4 text-left">
						<div className="flex flex-col min-w-full max-w-full w-full lg:min-w-[20rem] lg:max-w-[20rem] lg:w-[20rem]">
							<Image
								className="hidden lg:flex my-0 m-auto w-[20rem] px-3 py-0"
								src={data.node.main_picture.large}
								alt="Anime_picture"
								sizes="100vw"
								width={0}
								height={0}
							/>
							<div className="pt-5">
								<h3 className="text-xl font-bold text-text">Info</h3>
								<p className="text-neutral-500">Type: <span className="text-theme">{data.node.media_type.toUpperCase()}</span></p>
								<p className="text-neutral-500">Episodes: <span className="text-theme">{data.node.num_episodes}</span></p>
								<p className="text-neutral-500">Status: <span className="text-theme">{toCapitalizedCase(data.node.status)}</span></p>
								<p className="text-neutral-500">Aired: <span className="text-theme">{data.node.start_date ? (formatDate(data.node.start_date)) : "???"}</span> to <span className="text-theme">{data.node.end_date ? (formatDate(data.node.end_date)) : "?"}</span></p>
								<p className="text-neutral-500"><span>Studios: </span>
									{data.node.studios.map((studio,index)=>(
										<span key={index} className="text-neutral-500">
											<Link href={`https://myanimelist.net/anime/producer/${studio.id}/`} target="_blank"
												  data-umami-event={`[ANIME] Show Studio (${studio.id})`}
												  data-umami-event-url={`https://myanimelist.net/anime/producer/${studio.id}/`}
												  className="text-theme hover:underline hover:text-themeHover">
												{studio.name}
											</Link>
											{index != data.node.studios.length -1 ? ", " : ""}
										</span>
									))}
								</p>
								<p className="text-neutral-500">Source: <span className="text-theme">{toCapitalizedCase(data.node.source)}</span></p>
								<p className="text-neutral-500"><span>Genres: </span>
									{data.node.genres.slice(0,data.node.genres.length-1).map((genre,index)=>(
										<span key={index} className="text-neutral-500">
											<Link href={`https://myanimelist.net/anime/genre/${genre.id}/`} target="_blank"
												  data-umami-event={`[ANIME] Show Genre (${genre.id})`}
												  data-umami-event-url={`https://myanimelist.net/anime/genre/${genre.id}/`}
												  className="text-theme hover:underline hover:text-themeHover">
												{genre.name}
											</Link>
											{index != data.node.genres.length -2 ? ", " : ""}
										</span>
									))}
								</p>
								<p className="text-neutral-500">Theme: <span className="text-theme">{data.node.genres.slice(-1)[0].name}</span></p>
								<p className="text-neutral-500">Duration: <span className="text-theme">{Math.floor(data.node.average_episode_duration / 60)} min. per ep.</span></p>
								<p className="text-neutral-500">Rating: <span className="text-theme">{formatRating(data.node.rating)}</span></p>
							</div>
							<div className="pt-5">
								<h3 className="text-xl font-bold text-text">Statistics</h3>
								<p className="text-neutral-500">Score: <span className="text-theme">{data.node.mean} (scored by {data.node.num_scoring_users.toLocaleString()} users)</span></p>
								<p className="text-neutral-500">Ranked: <span className="text-theme">#{data.node.rank}</span></p>
								<p className="text-neutral-500">Popularity: <span className="text-theme">#{data.node.popularity}</span></p>
							</div>
							<Link href={`https://myanimelist.net/anime/${data.node.id}`} target="_blank"
								  data-umami-event={`[ANIME] Show Anime (${data.node.id})`}
								  data-umami-event-url={`https://myanimelist.net/anime/${data.node.id}`}
								  className="flex w-full mt-10 m-auto">
								<button className="bg-[#3557a5] hover:bg-[#253c73] active:bg-[#253c73] text-white transition-colors ease-in-out duration-300 px-4 py-2 m-auto w-full font-mal">MyAnimeList.net</button>
							</Link>
						</div>
						<div className="flex flex-col w-fit">
							<div className="flex flex-col">
								<h1 className="text-2xl">{title_en.length > 0 ? title_en : data.node.title}</h1>
								<h2 className="text-base text-neutral-500">{data.node.alternative_titles.ja}</h2>
								{showScore && (<p className="mt-2 text-theme font-bold">My Score: <span className="text-theme">{data.list_status.score}</span></p>)}
							</div>
							<div className="mt-8">
								<p>{data.node.synopsis.replace("[Written by MAL Rewrite]", "")}</p>
							</div>

						</div>
						<Image
							className="flex lg:hidden my-0 m-auto w-[20rem] px-3 py-0"
							src={data.node.main_picture.large}
							alt="Anime_picture"
							sizes="100vw"
							width={0}
							height={0}
						/>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
