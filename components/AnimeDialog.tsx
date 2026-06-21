"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatAnimeAgeRating, formatAnimeWatchStatus, getWatchStatusStyle } from "@/lib/anime-format";
import { formatDate, toCapitalizedCase } from "@/lib/utils";
import type {
	AnimeAlternativeTitles,
	AnimeCharacterData,
	AnimeEntry,
	AnimeRelationImagesResponse,
} from "@/types/animeData";
import { AnimeCharacterCarousel, AnimeCharacterCarouselLoading } from "./AnimeCharacterCarousel";

interface AnimeCardProps {
	data: AnimeEntry;
	children?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

function getAnimeDialogUrlId(): number | undefined {
	const animeId = Number(new URLSearchParams(window.location.search).get("anime"));
	return Number.isInteger(animeId) && animeId > 0 ? animeId : undefined;
}

function setAnimeDialogUrlId(animeId: number) {
	if (getAnimeDialogUrlId() === animeId) {
		return;
	}

	const url = new URL(window.location.href);
	url.searchParams.set("anime", String(animeId));
	window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function clearAnimeDialogUrlId(animeId: number) {
	if (getAnimeDialogUrlId() !== animeId) {
		return;
	}

	const url = new URL(window.location.href);
	url.searchParams.delete("anime");
	window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function getAnimeShareUrl(animeId: number): string {
	const url = new URL(window.location.href);
	url.search = "";
	url.searchParams.set("anime", String(animeId));
	return url.toString();
}

function getTrailerEmbedUrl(embedUrl?: string | null, autoplay = false): string | undefined {
	if (!embedUrl) {
		return undefined;
	}

	try {
		const url = new URL(embedUrl);
		url.searchParams.set("autoplay", autoplay ? "1" : "0");
		return url.toString();
	} catch {
		return embedUrl;
	}
}

function getRelationTypeBadgeStyle(type: string): string {
	switch (type.toLowerCase()) {
		case "anime":
			return "bg-sky-500/20 text-sky-200 border-sky-400/30";
		case "manga":
			return "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";
		default:
			return "bg-card text-muted border-card-inner-border";
	}
}

const ANIME_DIALOG_URL_OPEN_SYNC_DELAY_MS = 300;
const ANIME_DIALOG_DEFERRED_CONTENT_DELAY_MS = 300;

export function AnimeDialog({ data, children, open: controlledOpen, onOpenChange }: AnimeCardProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [trailerOpen, setTrailerOpen] = useState(false);
	const [relatedAnime, setRelatedAnime] = useState<AnimeEntry | undefined>();
	const [relatedAnimeOpen, setRelatedAnimeOpen] = useState(false);
	const [characterData, setCharacterData] = useState<AnimeCharacterData | undefined>();
	const [characterLoadFailed, setCharacterLoadFailed] = useState(false);
	const [hasLoadedCharacters, setHasLoadedCharacters] = useState(false);
	const [relationImages, setRelationImages] = useState<AnimeRelationImagesResponse["data"]>({});
	const [hasLoadedRelationImages, setHasLoadedRelationImages] = useState(false);
	const [shareUrl, setShareUrl] = useState("");
	const [shareCopied, setShareCopied] = useState(false);
	const [canRenderDeferredContent, setCanRenderDeferredContent] = useState(false);
	const shareCopiedTimeoutRef = useRef<number | undefined>(undefined);
	const animeUrlSyncTimeoutRef = useRef<number | undefined>(undefined);
	const deferredContentTimeoutRef = useRef<number | undefined>(undefined);
	const anime = data.node;
	const jikanData = data.jikan_data;
	const status = data.list_status;
	const titles: AnimeAlternativeTitles = anime.alternative_titles;
	const watchStatusStyle = getWatchStatusStyle(status.status);
	const animeUrl = jikanData?.url ?? `https://myanimelist.net/anime/${anime.id}`;
	const trailerPreviewUrl = getTrailerEmbedUrl(jikanData?.trailer?.embed_url);
	const trailerPlayerUrl = getTrailerEmbedUrl(jikanData?.trailer?.embed_url, true);
	const animeRelationEntries = useMemo(
		() =>
			(jikanData?.relations ?? [])
				.filter((relation) => relation.entry.length > 0)
				.flatMap((relation) =>
					relation.entry.map((entry) => ({
						relation: relation.relation,
						entry,
					})),
				),
		[jikanData?.relations],
	);
	const relationImageItemsKey = useMemo(
		() =>
			Array.from(
				new Set(
					animeRelationEntries
						.filter(({ entry }) => ["anime", "manga"].includes(entry.type.toLowerCase()))
						.map(({ entry }) => `${entry.type.toLowerCase()}:${entry.mal_id}`),
				),
			)
				.sort()
				.join(","),
		[animeRelationEntries],
	);
	const open = controlledOpen ?? internalOpen;
	const setOpen = onOpenChange ?? setInternalOpen;
	const shouldRenderTrigger = controlledOpen === undefined;

	const hasCharacterData = Array.isArray(characterData?.data) && characterData.data.length > 0;
	const shouldShowCharacterLoading = !hasCharacterData && !hasLoadedCharacters && !characterLoadFailed;

	useEffect(() => {
		if (animeUrlSyncTimeoutRef.current) {
			window.clearTimeout(animeUrlSyncTimeoutRef.current);
			animeUrlSyncTimeoutRef.current = undefined;
		}
		if (deferredContentTimeoutRef.current) {
			window.clearTimeout(deferredContentTimeoutRef.current);
			deferredContentTimeoutRef.current = undefined;
		}

		if (open) {
			setShareUrl(getAnimeShareUrl(anime.id));
			setCanRenderDeferredContent(false);
			setHasLoadedRelationImages(false);
			// Keep the open interaction responsive by syncing the non-visual URL state after the dialog animation.
			animeUrlSyncTimeoutRef.current = window.setTimeout(() => {
				setAnimeDialogUrlId(anime.id);
				animeUrlSyncTimeoutRef.current = undefined;
			}, ANIME_DIALOG_URL_OPEN_SYNC_DELAY_MS);
			deferredContentTimeoutRef.current = window.setTimeout(() => {
				setCanRenderDeferredContent(true);
				deferredContentTimeoutRef.current = undefined;
			}, ANIME_DIALOG_DEFERRED_CONTENT_DELAY_MS);
		} else {
			setCanRenderDeferredContent(false);
			setHasLoadedRelationImages(false);
			clearAnimeDialogUrlId(anime.id);
		}

		return () => {
			if (animeUrlSyncTimeoutRef.current) {
				window.clearTimeout(animeUrlSyncTimeoutRef.current);
				animeUrlSyncTimeoutRef.current = undefined;
			}
			if (deferredContentTimeoutRef.current) {
				window.clearTimeout(deferredContentTimeoutRef.current);
				deferredContentTimeoutRef.current = undefined;
			}
		};
	}, [anime.id, open]);

	useEffect(() => {
		setShareCopied(false);
	}, [anime.id]);

	useEffect(() => {
		return () => {
			if (shareCopiedTimeoutRef.current) {
				window.clearTimeout(shareCopiedTimeoutRef.current);
			}
			if (animeUrlSyncTimeoutRef.current) {
				window.clearTimeout(animeUrlSyncTimeoutRef.current);
			}
			if (deferredContentTimeoutRef.current) {
				window.clearTimeout(deferredContentTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (!open || !canRenderDeferredContent || characterData || characterLoadFailed) {
			return;
		}

		let cancelled = false;
		setCharacterLoadFailed(false);

		async function loadCharacters() {
			try {
				const response = await fetch(`/api/anime/characters/${anime.id}`, {
					credentials: "same-origin",
					headers: {
						accept: "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`Failed to load characters (${response.status})`);
				}

				const payload = (await response.json()) as AnimeCharacterData;
				if (!cancelled) {
					setCharacterData(Array.isArray(payload.data) ? payload : { data: [] });
					setHasLoadedCharacters(true);
				}
			} catch (err) {
				if (!cancelled) {
					console.error("Failed to load anime characters:", err);
					setCharacterLoadFailed(true);
				}
			}
		}

		loadCharacters();

		return () => {
			cancelled = true;
		};
	}, [anime.id, canRenderDeferredContent, characterData, characterLoadFailed, open]);

	useEffect(() => {
		if (!open || !canRenderDeferredContent || !relationImageItemsKey) {
			if (!relationImageItemsKey) {
				setHasLoadedRelationImages(true);
			}
			return;
		}

		let cancelled = false;
		setHasLoadedRelationImages(false);

		async function loadRelationImages() {
			try {
				const response = await fetch(`/api/anime/relation-images?items=${relationImageItemsKey}`, {
					credentials: "same-origin",
					headers: {
						accept: "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`Failed to load relation images (${response.status})`);
				}

				const payload = (await response.json()) as AnimeRelationImagesResponse;
				if (!cancelled) {
					setRelationImages(payload.data ?? {});
					setHasLoadedRelationImages(true);
				}
			} catch (err) {
				if (!cancelled) {
					console.error("Failed to load anime relation images:", err);
					setRelationImages({});
					setHasLoadedRelationImages(true);
				}
			}
		}

		loadRelationImages();

		return () => {
			cancelled = true;
		};
	}, [canRenderDeferredContent, open, relationImageItemsKey]);

	async function handleAnimeRelationClick(event: MouseEvent<HTMLElement>, animeId: number, url: string) {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
			return;
		}

		event.preventDefault();

		try {
			const response = await fetch(`/api/anime/series/${animeId}`, {
				credentials: "same-origin",
				headers: {
					accept: "application/json",
				},
			});

			if (!response.ok) {
				window.open(url, "_blank", "noopener,noreferrer");
				return;
			}

			const payload = (await response.json()) as AnimeEntry;
			setRelatedAnime(payload);
			setRelatedAnimeOpen(true);
		} catch (err) {
			console.error("Failed to load related anime:", err);
			window.open(url, "_blank", "noopener,noreferrer");
		}
	}

	function handleRelatedAnimeOpenChange(nextOpen: boolean) {
		setRelatedAnimeOpen(nextOpen);
		if (!nextOpen && open) {
			setAnimeDialogUrlId(anime.id);
			setShareUrl(getAnimeShareUrl(anime.id));
		}
	}

	async function handleShareClick(event: MouseEvent<HTMLInputElement>) {
		event.currentTarget.blur();

		const nextShareUrl = getAnimeShareUrl(anime.id);
		setShareUrl(nextShareUrl);

		if (nextShareUrl.startsWith("https")) {
			try {
				await navigator.clipboard.writeText(nextShareUrl);
			} catch (err) {
				console.error("Failed to copy anime share URL:", err);
			}
		}

		setShareCopied(true);

		if (shareCopiedTimeoutRef.current) {
			window.clearTimeout(shareCopiedTimeoutRef.current);
		}

		shareCopiedTimeoutRef.current = window.setTimeout(() => {
			setShareCopied(false);
			shareCopiedTimeoutRef.current = undefined;
		}, 1500);
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				{shouldRenderTrigger && (
					<DialogTrigger asChild data-umami-event={`[ANIME] Expand (${anime.id})`}>
						{children ?? anime.title}
					</DialogTrigger>
				)}
				<DialogContent className="border-none outline-hidden bg-background min-w-[70%] max-h-[90vh] w-full overflow-y-auto">
					<DialogHeader className="outline-hidden w-full">
						<DialogTitle className="hidden" />
						<DialogDescription className="hidden" />
						<div className="flex flex-col-reverse lg:flex-row gap-4 text-left min-w-0">
							<div className="flex flex-col min-w-full max-w-full w-full lg:min-w-[20rem] lg:max-w-[20rem] lg:w-[20rem]">
								<div className="hidden lg:flex my-0 m-auto w-[20rem] py-0 pl-0 pr-6">
									{anime.main_picture.large || anime.main_picture.medium ? (
										<Image
											className="w-full rounded-lg"
											src={anime.main_picture.large || anime.main_picture.medium}
											alt="Anime_picture"
											sizes="100vw"
											loading="eager"
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
													<span className="text-muted font-normal">
														{Math.abs(anime.mean - status.score).toFixed(2)}
													</span>
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
													Rating:{" "}
													<span className="text-muted font-normal">{formatAnimeAgeRating(anime.rating, true)}</span>
												</li>
											)}
										</ul>
									</div>
								)}

								{/*Share link*/}
								<div className="mt-10 flex flex-col gap-2">
									<h3 className="text-xl font-bold">Share</h3>
									<div className="relative h-9 overflow-hidden rounded-md">
										<Input
											className="relative z-0 h-full cursor-pointer border-transparent bg-card-inner text-muted focus:border-transparent focus:bg-card-inner focus-visible:ring-0"
											readOnly
											useRing={false}
											tabIndex={-1}
											value={shareUrl}
											onClick={handleShareClick}
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

								{/*MyAnimeList.net Button*/}
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

							{/*Right side*/}
							<div className="flex min-w-0 w-full flex-1 flex-col gap-4 justify-between overflow-visible">
								{/*Top section - title synopsis*/}
								<div className="flex flex-col gap-4 pr-5 xl:flex-row">
									{/* Left side information */}
									<div className="flex min-w-0 w-full flex-col gap-4">
										<div className="flex flex-col">
											{/* English title */}
											<div className="flex flex-col">
												<h1 className="text-2xl font-bold">{titles.en.length > 0 ? titles.en : anime.title}</h1>
											</div>

											{/* Japanees title */}
											{anime.alternative_titles.ja && (
												<h2 className="text-base font-semibold">{anime.alternative_titles.ja}</h2>
											)}

											{/* Status badges list_status, airing status */}
											<div className="flex gap-2">
												<span
													className={`mt-2 w-fit shrink-0 rounded-sm px-2 py-1 text-xs font-semibold ${watchStatusStyle}`}
												>
													{formatAnimeWatchStatus(status.status)}
												</span>
												{jikanData?.airing === true && (
													<span
														className={`mt-2 w-fit shrink-0 rounded-sm px-2 py-1 text-xs font-semibold bg-green-700/80`}
													>
														Airing
													</span>
												)}
												{data.dubbed && (
													<span
														className={`mt-2 w-fit shrink-0 rounded-sm px-2 py-1 text-xs font-semibold bg-green-700/80`}
													>
														DUB
													</span>
												)}
											</div>
										</div>

										{/* Description for the anime */}
										{anime.synopsis && (
											<div>
												<p>{anime.synopsis.replace("[Written by MAL Rewrite]", "")}</p>
											</div>
										)}
									</div>

									{/* Trailer view */}
									{trailerPreviewUrl && (
										<Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
											<DialogTrigger asChild>
												<div
													className="w-full shrink-0 cursor-pointer sm:max-w-64 xl:max-w-72"
													data-umami-event={`[ANIME] Show Trailer (${anime.id})`}
												>
													{canRenderDeferredContent ? (
														<iframe
															className="aspect-video w-full pointer-events-none rounded-lg"
															src={trailerPreviewUrl}
															title={`${anime.title} trailer preview`}
															allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
															aria-hidden="true"
															tabIndex={-1}
														/>
													) : (
														<div className="aspect-video w-full animate-pulse rounded-lg bg-card-inner" />
													)}
												</div>
											</DialogTrigger>
											<DialogContent
												className="w-[min(96vw,90rem)] max-w-none overflow-hidden border-none bg-background p-0 sm:max-w-none"
												showCloseButton={false}
											>
												<DialogHeader className="hidden">
													<DialogTitle>{anime.title} trailer</DialogTitle>
													<DialogDescription>Embedded anime trailer video.</DialogDescription>
												</DialogHeader>
												{trailerOpen && trailerPlayerUrl && (
													<iframe
														className="aspect-video w-full rounded-lg"
														src={trailerPlayerUrl}
														title={`${anime.title} trailer`}
														allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
														allowFullScreen
													/>
												)}
											</DialogContent>
										</Dialog>
									)}
								</div>

								{/*Bottom section*/}
								<div className="grid min-w-0 w-full grid-cols-[minmax(0,1fr)] gap-4">
									{/* Relations section */}
									{animeRelationEntries.length > 0 && (
										<div className="flex min-w-0 w-full flex-col gap-2">
											<h1 className="text-2xl font-bold">Relations</h1>
											<div className="grid min-w-0 w-full grid-cols-1 gap-3 xl:grid-cols-2">
												{animeRelationEntries.map(({ relation, entry }) => {
													const relationType = entry.type.toLowerCase();
													const relationName = relation.toLowerCase();
													const canLoadRelationImage = ["anime", "manga"].includes(relationType);
													const shouldOpenInternalAnime =
														relationType === "anime" && (relationName === "prequel" || relationName === "sequel");
													const relationImageKey = `${relationType}:${entry.mal_id}`;
													const relationImage = relationImages[relationImageKey]?.image_url;
													const shouldShowRelationImageLoading =
														canLoadRelationImage && !relationImage && !hasLoadedRelationImages;
													const relationCardClass =
														"relative flex min-w-0 gap-3 rounded-lg border border-card-inner-border bg-card-inner p-3 hover:scale-103 transition-transform duration-300 ease-in-out";
													const relationCardContent = (
														<>
															<span
																className={`absolute top-2 right-2 rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${getRelationTypeBadgeStyle(relationType)}`}
															>
																{relationType}
															</span>
															{relationImage ? (
																<div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-background">
																	<Image
																		className="object-cover"
																		src={relationImage}
																		alt={entry.name}
																		sizes="3.5rem"
																		fill
																	/>
																</div>
															) : (
																shouldShowRelationImageLoading && (
																	<div className="h-20 w-14 shrink-0 animate-pulse rounded-md bg-muted/30" />
																)
															)}
															<div className="min-w-0 pr-12">
																<h3 className="truncate text-sm font-semibold">{relation}</h3>
																<p className="mt-2 truncate text-sm text-muted">{entry.name}</p>
															</div>
														</>
													);

													if (shouldOpenInternalAnime) {
														return (
															<button
																key={`${relation}-${entry.type}-${entry.mal_id}`}
																type="button"
																data-umami-event={`[ANIME] Show Relation (${entry.mal_id})`}
																data-umami-event-url={entry.url}
																className={`${relationCardClass} cursor-pointer text-left`}
																title={entry.name}
																onClick={(event) => handleAnimeRelationClick(event, entry.mal_id, entry.url)}
															>
																{relationCardContent}
															</button>
														);
													}

													return (
														<Link
															key={`${relation}-${entry.type}-${entry.mal_id}`}
															href={entry.url}
															target="_blank"
															data-umami-event={`[ANIME] Show Relation (${entry.mal_id})`}
															data-umami-event-url={entry.url}
															className={relationCardClass}
															title={entry.name}
														>
															{relationCardContent}
														</Link>
													);
												})}
											</div>
										</div>
									)}

									{/*Characters section*/}
									<div className="min-w-0 w-full">
										{hasCharacterData && <AnimeCharacterCarousel characterData={characterData} />}
										{shouldShowCharacterLoading && <AnimeCharacterCarouselLoading />}
										{characterLoadFailed && (
											<div className="flex flex-col gap-2">
												<h1 className="text-2xl font-bold">Characters</h1>
												<div className="rounded-xl bg-card-inner p-4 text-sm text-muted-foreground">
													Character data is unavailable.
												</div>
											</div>
										)}
										{hasLoadedCharacters && !hasCharacterData && !characterLoadFailed && (
											<div className="flex flex-col gap-2">
												<h1 className="text-2xl font-bold">Characters</h1>
												<div className="rounded-xl bg-card-inner p-4 text-sm text-muted-foreground">
													No cached character data is available for this anime yet.
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{/*Image For mobile layout*/}
							<div className="flex lg:hidden my-0 m-auto w-full max-w-[20rem] py-3 pl-0">
								{anime.main_picture.large || anime.main_picture.medium ? (
									<Image
										className="w-full rounded-lg"
										src={anime.main_picture.large || anime.main_picture.medium}
										alt="Anime_picture"
										sizes="100vw"
										loading="eager"
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
			{relatedAnime && (
				<AnimeDialog data={relatedAnime} open={relatedAnimeOpen} onOpenChange={handleRelatedAnimeOpenChange} />
			)}
		</>
	);
}
