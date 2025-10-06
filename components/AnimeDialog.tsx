"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate, toCapitalizedCase } from "@/lib/utils";
import {
	type AlternativeTitles,
	type AnimeEntry,
	formatRating,
} from "@/types/animeData";

interface AnimeCardProps {
	data: AnimeEntry;
	children?: ReactNode;
}

export function AnimeDialog({ data, children }: AnimeCardProps) {
	const anime = data.node;
	const status = data.list_status;
	const titles: AlternativeTitles = anime.alternative_titles;

	return (
		<Dialog>
			<DialogTrigger asChild data-umami-event={`[ANIME] Expand (${anime.id})`}>
				{children ?? anime.title}
			</DialogTrigger>
			<DialogContent className="border-none outline-hidden bg-background min-w-[70%] max-h-[90vh] w-full overflow-y-auto">
				<DialogHeader className="outline-hidden w-full">
					<DialogTitle className="hidden" />
					<DialogDescription className="hidden" />
					<div className="flex flex-col-reverse lg:flex-row gap-4 text-left">
						<div className="flex flex-col min-w-full max-w-full w-full lg:min-w-[20rem] lg:max-w-[20rem] lg:w-[20rem]">
							<div className="hidden lg:flex my-0 m-auto w-[20rem] py-0 pl-0 pr-6">
								{anime.main_picture.large || anime.main_picture.medium ? (
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
										<p className="text-muted font-semibold m-auto text-center">
											IMAGE NOT FOUND!
										</p>
									</div>
								)}
							</div>

							{/*Anime Statistics*/}
							{(anime.mean > 0 || anime.rank > 0 || anime.popularity > 0) && (
								<div className="pt-5">
									<h3 className="text-xl font-bold">Statistics</h3>

									<ul className="pl-5 list-disc">
										{anime.rank > 0 && (
											<li className="font-semibold">
												Ranked:{" "}
												<span className="text-primary font-normal">
													#{anime.rank}
												</span>
											</li>
										)}
										{anime.popularity > 0 && (
											<li className="font-semibold">
												Popularity:{" "}
												<span className="text-primary font-normal">
													#{anime.popularity}
												</span>
											</li>
										)}
										{anime.mean > 0 && (
											<li className="font-semibold">
												Rating:{" "}
												<span className="text-primary font-normal">
													{anime.mean} by {anime.num_scoring_users} users
												</span>
											</li>
										)}

										{status.score > 0 && (
											<li className="font-semibold">
												Score:{" "}
												<span className="text-primary font-normal">
													{status.score}
												</span>
											</li>
										)}
										{status.score > 0 && (
											<li className="font-semibold">
												Difference:{" "}
												<span className="text-primary font-normal">
													{Math.abs(anime.mean - status.score).toFixed(2)}
												</span>
											</li>
										)}

										{anime.num_episodes > 0 && (
											<li className="font-semibold">
												Progress:{" "}
												<span className="text-primary font-normal">
													{status.num_episodes_watched}/{
														anime.num_episodes
													}{" "}
												</span>
											</li>
										)}
									</ul>
								</div>
							)}

							{/*Anime Info*/}
							{(anime.media_type ||
								anime.num_episodes > 0 ||
								anime.status ||
								anime.start_date ||
								anime.end_date ||
								anime.studios.length > 0 ||
								anime.source ||
								anime.genres.length > 0 ||
								anime.average_episode_duration > 0 ||
								anime.rating) && (
								<div className="pt-5">
									<h3 className="text-xl font-bold">Anime Info</h3>

									<ul className="pl-5 list-disc">
										{anime.media_type && (
											<li className="font-semibold">
												Type:{" "}
												<span className="text-primary font-normal">
													{anime.media_type.toUpperCase()}
												</span>
											</li>
										)}
										{anime.num_episodes > 0 && (
											<li className="font-semibold">
												Episodes:{" "}
												<span className="text-primary font-normal">
													{anime.num_episodes}
												</span>
											</li>
										)}
										{anime.status && (
											<li className="font-semibold">
												Status:{" "}
												<span className="text-primary font-normal">
													{toCapitalizedCase(anime.status)}
												</span>
											</li>
										)}

										{anime.start_date && (
											<li className="font-semibold">
												Started:{" "}
												<span className="text-primary font-normal">
													{formatDate(anime.start_date)}
												</span>
											</li>
										)}
										{anime.end_date && (
											<li className="font-semibold">
												Ended:{" "}
												<span className="text-primary font-normal">
													{formatDate(anime.end_date)}
												</span>
											</li>
										)}

										{anime.studios.length > 0 && (
											<li className="font-semibold">
												<span>Studios: </span>
												{anime.studios.map((studio, index) => (
													<span key={index}>
														<Link
															href={`https://myanimelist.net/anime/producer/${studio.id}/`}
															target="_blank"
															data-umami-event={`[ANIME] Show Studio (${studio.id})`}
															data-umami-event-url={`https://myanimelist.net/anime/producer/${studio.id}/`}
															className="text-primary hover:text-secondary font-normal"
														>
															{studio.name}
														</Link>
														{index != anime.studios.length - 1 ? ", " : ""}
													</span>
												))}
											</li>
										)}

										{anime.source && (
											<li className="font-semibold">
												Source:{" "}
												<span className="text-primary font-normal">
													{toCapitalizedCase(anime.source)}
												</span>
											</li>
										)}

										{anime.genres.length > 0 && (
											<li className="font-semibold">
												<span>Genres: </span>
												{anime.genres.map((genre, index) => (
													<span key={index}>
														<Link
															href={`https://myanimelist.net/anime/genre/${genre.id}/`}
															target="_blank"
															data-umami-event={`[ANIME] Show Genre (${genre.id})`}
															data-umami-event-url={`https://myanimelist.net/anime/genre/${genre.id}/`}
															className="text-primary hover:text-secondary font-normal"
														>
															{genre.name}
														</Link>
														{index != anime.genres.length - 1 ? ", " : ""}
													</span>
												))}
											</li>
										)}

										{anime.average_episode_duration > 0 && (
											<li className="font-semibold">
												Duration:{" "}
												<span className="text-primary font-normal">
													{Math.floor(anime.average_episode_duration / 60)} min.
													per ep.
												</span>
											</li>
										)}
										{anime.rating && (
											<li className="font-semibold">
												Rating:{" "}
												<span className="text-primary font-normal">
													{formatRating(anime.rating)}
												</span>
											</li>
										)}
									</ul>
								</div>
							)}

							{/*MyAnimeList.net Button*/}
							<Link
								href={`https://myanimelist.net/anime/${anime.id}`}
								target="_blank"
								data-umami-event={`[ANIME] Show Anime (${anime.id})`}
								data-umami-event-url={`https://myanimelist.net/anime/${anime.id}`}
								className="flex w-full mt-10 m-auto"
							>
								<Button variant={"mal"}>MyAnimeList.net</Button>
							</Link>
						</div>

						{/*Right side*/}
						<div className="flex flex-col gap-4 w-fit">
							<div className="flex flex-col">
								<h1 className="text-2xl font-bold">
									{titles.en.length > 0 ? titles.en : anime.title}
								</h1>
								{anime.alternative_titles.ja && (
									<h2 className="text-base font-semibold">
										{anime.alternative_titles.ja}
									</h2>
								)}
							</div>

							{anime.synopsis && (
								<div>
									<p>
										{anime.synopsis.replace("[Written by MAL Rewrite]", "")}
									</p>
								</div>
							)}
						</div>

						{/*Image For mobile layout*/}
						<div className="flex lg:hidden my-0 m-auto w-[20rem] py-3 pl-0">
							{anime.main_picture.large || anime.main_picture.medium ? (
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
									<p className="text-muted font-semibold m-auto text-center">
										IMAGE NOT FOUND!
									</p>
								</div>
							)}
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
