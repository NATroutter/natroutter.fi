"use client";

import { memo } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { formatAnimeWatchStatus } from "@/lib/anime-format";
import type { AnimeAlternativeTitles, AnimeInfo, JikanAnimeFull, ListStatus } from "@/types/animeData";

interface AnimeDialogTopSectionProps {
	anime: AnimeInfo;
	titles: AnimeAlternativeTitles;
	status: ListStatus;
	watchStatusStyle: string;
	jikanData?: JikanAnimeFull;
	dubbed?: boolean;
	trailerOpen: boolean;
	trailerPreviewUrl?: string;
	trailerPlayerUrl?: string;
	canRenderDeferredContent: boolean;
	onTrailerOpenChange: (open: boolean) => void;
}

export const AnimeDialogTopSection = memo(function AnimeDialogTopSection({
	anime,
	titles,
	status,
	watchStatusStyle,
	jikanData,
	dubbed,
	trailerOpen,
	trailerPreviewUrl,
	trailerPlayerUrl,
	canRenderDeferredContent,
	onTrailerOpenChange,
}: AnimeDialogTopSectionProps) {
	return (
		<div className="flex flex-col gap-4 pr-5 xl:flex-row">
			<div className="flex min-w-0 w-full flex-col gap-4">
				<div className="flex flex-col">
					<div className="flex flex-col">
						<h1 className="text-2xl font-bold">{titles.en.length > 0 ? titles.en : anime.title}</h1>
					</div>

					{anime.alternative_titles.ja && <h2 className="text-base font-semibold">{anime.alternative_titles.ja}</h2>}

					<div className="flex gap-2">
						<span className={`mt-2 w-fit shrink-0 rounded-sm px-2 py-1 text-xs font-semibold ${watchStatusStyle}`}>
							{formatAnimeWatchStatus(status.status)}
						</span>
						{jikanData?.airing === true && (
							<span className="mt-2 w-fit shrink-0 rounded-sm px-2 py-1 text-xs font-semibold bg-green-700/80">
								Airing
							</span>
						)}
						{dubbed && (
							<span className="mt-2 w-fit shrink-0 rounded-sm px-2 py-1 text-xs font-semibold bg-green-700/80">
								DUB
							</span>
						)}
					</div>
				</div>

				{anime.synopsis && (
					<div>
						<p>{anime.synopsis.replace("[Written by MAL Rewrite]", "")}</p>
					</div>
				)}
			</div>

			{trailerPreviewUrl && (
				<Dialog open={trailerOpen} onOpenChange={onTrailerOpenChange}>
					<DialogTrigger asChild>
						<button
							type="button"
							className="aspect-video w-full shrink-0 self-start cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0 sm:max-w-64 xl:max-w-72"
							data-umami-event={`[ANIME] Show Trailer (${anime.id})`}
						>
							{canRenderDeferredContent ? (
								<iframe
									className="h-full w-full pointer-events-none rounded-lg"
									src={trailerPreviewUrl}
									title={`${anime.title} trailer preview`}
									allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									aria-hidden="true"
									tabIndex={-1}
								/>
							) : (
								<div className="h-full w-full animate-pulse rounded-lg bg-card-inner" />
							)}
						</button>
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
	);
});
