"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAnimeAgeRating } from "@/lib/anime-format";
import { formatDate, toCapitalizedCase } from "@/lib/utils";
import type { AnimeInfo, ListStatus } from "@/types/animeData";

interface AnimeDialogSidebarProps {
	anime: AnimeInfo;
	status: ListStatus;
	animeUrl: string;
	shareUrl: string;
	shareCopied: boolean;
	onShareClick: (event: MouseEvent<HTMLInputElement>) => void;
}

export const AnimeDialogSidebar = memo(function AnimeDialogSidebar({
	anime,
	status,
	animeUrl,
	shareUrl,
	shareCopied,
	onShareClick,
}: AnimeDialogSidebarProps) {
	return (
		<div className="flex flex-col min-w-full max-w-full w-full lg:min-w-[20rem] lg:max-w-[20rem] lg:w-[20rem]">
			<div className="hidden lg:flex my-0 m-auto w-[20rem] py-0 pl-0 pr-6">
				{anime.main_picture.large || anime.main_picture.medium ? (
					<Image
						className="w-full rounded-lg"
						src={anime.main_picture.large || anime.main_picture.medium}
						alt="Anime_picture"
						sizes="100vw"
						loading="lazy"
						width={0}
						height={0}
					/>
				) : (
					<div className="w-full rounded-lg h-[415px] bg-card-inner flex">
						<p className="text-muted font-semibold m-auto text-center">IMAGE NOT FOUND!</p>
					</div>
				)}
			</div>

			{(anime.mean > 0 || anime.rank > 0 || anime.popularity > 0) && (
				<div className="pt-5">
					<h3 className="text-xl font-bold">Statistics</h3>

					<ul className="pl-5 list-disc">
						{anime.rank > 0 && (
							<li className="font-semibold">
								Ranked: <span className="text-muted font-normal">#{anime.rank}</span>
							</li>
						)}
						{anime.popularity > 0 && (
							<li className="font-semibold">
								Popularity: <span className="text-muted font-normal">#{anime.popularity}</span>
							</li>
						)}
						{anime.mean > 0 && (
							<li className="font-semibold">
								Rating:{" "}
								<span className="text-muted font-normal">
									{anime.mean} by {anime.num_scoring_users} users
								</span>
							</li>
						)}

						{status.score > 0 && (
							<li className="font-semibold">
								Score: <span className="text-muted font-normal">{status.score}</span>
							</li>
						)}
						{status.score > 0 && (
							<li className="font-semibold">
								Difference:{" "}
								<span className="text-muted font-normal">{Math.abs(anime.mean - status.score).toFixed(2)}</span>
							</li>
						)}

						{anime.num_episodes > 0 && (
							<li className="font-semibold">
								Progress:{" "}
								<span className="text-muted font-normal">
									{status.num_episodes_watched}/{anime.num_episodes}{" "}
								</span>
							</li>
						)}
					</ul>
				</div>
			)}

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
								Type: <span className="text-muted font-normal">{anime.media_type.toUpperCase()}</span>
							</li>
						)}
						{anime.num_episodes > 0 && (
							<li className="font-semibold">
								Episodes: <span className="text-muted font-normal">{anime.num_episodes}</span>
							</li>
						)}
						{anime.status && (
							<li className="font-semibold">
								Status: <span className="text-muted font-normal">{toCapitalizedCase(anime.status)}</span>
							</li>
						)}

						{anime.start_date && (
							<li className="font-semibold">
								Started: <span className="text-muted font-normal">{formatDate(anime.start_date)}</span>
							</li>
						)}
						{anime.end_date && (
							<li className="font-semibold">
								Ended: <span className="text-muted font-normal">{formatDate(anime.end_date)}</span>
							</li>
						)}

						{anime.studios.length > 0 && (
							<li className="font-semibold">
								<span>Studios: </span>
								{anime.studios.map((studio, index) => (
									<span key={studio.id}>
										<Link
											href={`https://myanimelist.net/anime/producer/${studio.id}/`}
											target="_blank"
											data-umami-event={`[ANIME] Show Studio (${studio.id})`}
											data-umami-event-url={`https://myanimelist.net/anime/producer/${studio.id}/`}
											className="font-normal text-muted hover:text-link-hover"
										>
											{studio.name}
										</Link>
										{index !== anime.studios.length - 1 ? ", " : ""}
									</span>
								))}
							</li>
						)}

						{anime.source && (
							<li className="font-semibold">
								Source: <span className="text-muted font-normal">{toCapitalizedCase(anime.source)}</span>
							</li>
						)}

						{anime.genres.length > 0 && (
							<li className="font-semibold">
								<span>Genres: </span>
								{anime.genres.map((genre, index) => (
									<span key={genre.id}>
										<Link
											href={`https://myanimelist.net/anime/genre/${genre.id}/`}
											target="_blank"
											data-umami-event={`[ANIME] Show Genre (${genre.id})`}
											data-umami-event-url={`https://myanimelist.net/anime/genre/${genre.id}/`}
											className="font-normal text-muted hover:text-link-hover"
										>
											{genre.name}
										</Link>
										{index !== anime.genres.length - 1 ? ", " : ""}
									</span>
								))}
							</li>
						)}

						{anime.average_episode_duration > 0 && (
							<li className="font-semibold">
								Duration:{" "}
								<span className="text-muted font-normal">
									{Math.floor(anime.average_episode_duration / 60)} min. per ep.
								</span>
							</li>
						)}
						{anime.rating && (
							<li className="font-semibold">
								Rating: <span className="text-muted font-normal">{formatAnimeAgeRating(anime.rating, true)}</span>
							</li>
						)}
					</ul>
				</div>
			)}

			<div className="mt-10 flex flex-col gap-2">
				<h3 className="text-xl font-bold">Share</h3>
				<div className="relative h-9 overflow-hidden rounded-md">
					<Input
						className="relative z-0 h-full cursor-pointer border-transparent bg-card-inner text-muted focus:border-transparent focus:bg-card-inner focus-visible:ring-0"
						readOnly
						useRing={false}
						tabIndex={-1}
						value={shareUrl}
						onClick={onShareClick}
						aria-label={`${anime.title} share link`}
					/>

					<div
						className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md bg-black/45 text-sm font-medium text-white backdrop-blur-[1.5px] ${
							shareCopied ? "opacity-100" : "opacity-0 transition-opacity duration-500 ease-out"
						}`}
					>
						Copied!
					</div>
				</div>
			</div>

			<Link
				href={animeUrl}
				target="_blank"
				data-umami-event={`[ANIME] Show Anime (${anime.id})`}
				data-umami-event-url={animeUrl}
				className="flex w-full mt-4 m-auto"
			>
				<Button variant={"mal"}>MyAnimeList.net</Button>
			</Link>
		</div>
	);
});
