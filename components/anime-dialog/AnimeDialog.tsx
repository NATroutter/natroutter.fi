"use client";

import { type MouseEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getWatchStatusStyle } from "@/lib/anime-format";
import type {
	AnimeAlternativeTitles,
	AnimeCharacterData,
	AnimeEntry,
	AnimeRelationImagesResponse,
} from "@/types/animeData";
import { AnimeDialogCharacters } from "./AnimeDialogCharacters";
import { AnimeDialogMobileImage } from "./AnimeDialogMobileImage";
import { AnimeDialogRelations } from "./AnimeDialogRelations";
import { AnimeDialogSidebar } from "./AnimeDialogSidebar";
import { AnimeDialogTop } from "./AnimeDialogTop";
import { getTrailerEmbedUrl } from "./utils";

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

const ANIME_DIALOG_URL_OPEN_SYNC_DELAY_MS = 300;
const ANIME_DIALOG_DEFERRED_CONTENT_DELAY_MS = 300;

type CharacterLoadState = {
	animeId: number;
	data?: AnimeCharacterData;
	failed: boolean;
	loaded: boolean;
};

type RelationImagesState = {
	itemsKey: string;
	data: AnimeRelationImagesResponse["data"];
	loaded: boolean;
};

export function AnimeDialog({ data, children, open: controlledOpen, onOpenChange }: AnimeCardProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [trailerOpen, setTrailerOpen] = useState(false);
	const [relatedAnime, setRelatedAnime] = useState<AnimeEntry | undefined>();
	const [relatedAnimeOpen, setRelatedAnimeOpen] = useState(false);
	const [characterLoadState, setCharacterLoadState] = useState<CharacterLoadState>({
		animeId: 0,
		failed: false,
		loaded: false,
	});
	const [relationImagesState, setRelationImagesState] = useState<RelationImagesState>({
		itemsKey: "",
		data: {},
		loaded: false,
	});
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

	const characterData = characterLoadState.animeId === anime.id ? characterLoadState.data : undefined;
	const characterLoadFailed = characterLoadState.animeId === anime.id && characterLoadState.failed;
	const hasLoadedCharacters = characterLoadState.animeId === anime.id && characterLoadState.loaded;
	const relationImages = relationImagesState.itemsKey === relationImageItemsKey ? relationImagesState.data : {};
	const hasLoadedRelationImages =
		relationImagesState.itemsKey === relationImageItemsKey ? relationImagesState.loaded : false;
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
		setTrailerOpen(false);
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
					setCharacterLoadState({
						animeId: anime.id,
						data: Array.isArray(payload.data) ? payload : { data: [] },
						failed: false,
						loaded: true,
					});
				}
			} catch (err) {
				if (!cancelled) {
					console.error("Failed to load anime characters:", err);
					setCharacterLoadState({
						animeId: anime.id,
						failed: true,
						loaded: false,
					});
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
				setRelationImagesState({
					itemsKey: "",
					data: {},
					loaded: true,
				});
			}
			return;
		}

		let cancelled = false;

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
					setRelationImagesState({
						itemsKey: relationImageItemsKey,
						data: payload.data ?? {},
						loaded: true,
					});
				}
			} catch (err) {
				if (!cancelled) {
					console.error("Failed to load anime relation images:", err);
					setRelationImagesState({
						itemsKey: relationImageItemsKey,
						data: {},
						loaded: true,
					});
				}
			}
		}

		loadRelationImages();

		return () => {
			cancelled = true;
		};
	}, [canRenderDeferredContent, open, relationImageItemsKey]);

	const handleAnimeRelationClick = useCallback(async (event: MouseEvent<HTMLElement>, animeId: number, url: string) => {
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
	}, []);

	const handleRelatedAnimeOpenChange = useCallback(
		(nextOpen: boolean) => {
			setRelatedAnimeOpen(nextOpen);
			if (!nextOpen && open) {
				setAnimeDialogUrlId(anime.id);
				setShareUrl(getAnimeShareUrl(anime.id));
			}
		},
		[anime.id, open],
	);

	const handleShareClick = useCallback(
		async (event: MouseEvent<HTMLInputElement>) => {
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
		},
		[anime.id],
	);

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
							<AnimeDialogSidebar
								anime={anime}
								status={status}
								animeUrl={animeUrl}
								shareUrl={shareUrl}
								shareCopied={shareCopied}
								onShareClick={handleShareClick}
							/>

							{/*Right side*/}
							<div className="flex min-w-0 w-full flex-1 flex-col gap-4 justify-between overflow-visible">
								{/*Top section - title synopsis*/}
								<AnimeDialogTop
									anime={anime}
									titles={titles}
									status={status}
									watchStatusStyle={watchStatusStyle}
									jikanData={jikanData}
									dubbed={data.dubbed}
									trailerOpen={trailerOpen}
									trailerPreviewUrl={trailerPreviewUrl}
									trailerPlayerUrl={trailerPlayerUrl}
									canRenderDeferredContent={canRenderDeferredContent}
									onTrailerOpenChange={setTrailerOpen}
								/>

								{/*Bottom section*/}
								<div className="grid min-w-0 w-full grid-cols-[minmax(0,1fr)] gap-4">
									<AnimeDialogRelations
										entries={animeRelationEntries}
										relationImages={relationImages}
										hasLoadedRelationImages={hasLoadedRelationImages}
										onAnimeRelationClick={handleAnimeRelationClick}
									/>
									<AnimeDialogCharacters
										characterData={characterData}
										hasCharacterData={hasCharacterData}
										shouldShowCharacterLoading={shouldShowCharacterLoading}
										characterLoadFailed={characterLoadFailed}
										hasLoadedCharacters={hasLoadedCharacters}
									/>
								</div>
							</div>

							{/*Image For mobile layout*/}
							<AnimeDialogMobileImage anime={anime} />
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
