"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, memo } from "react";
import type { AnimeRelationImagesResponse } from "@/types/animeData";
import type { AnimeRelationEntry } from "./types";
import { getRelationTypeBadgeStyle } from "./utils";

interface AnimeDialogRelationsSectionProps {
	entries: AnimeRelationEntry[];
	relationImages: AnimeRelationImagesResponse["data"];
	hasLoadedRelationImages: boolean;
	onAnimeRelationClick: (event: MouseEvent<HTMLElement>, animeId: number, url: string) => void;
}

export const AnimeDialogRelationsSection = memo(function AnimeDialogRelationsSection({
	entries,
	relationImages,
	hasLoadedRelationImages,
	onAnimeRelationClick,
}: AnimeDialogRelationsSectionProps) {
	if (entries.length === 0) {
		return null;
	}

	return (
		<div className="flex min-w-0 w-full flex-col gap-2">
			<h1 className="text-2xl font-bold">Relations</h1>
			<div className="grid min-w-0 w-full grid-cols-1 gap-3 xl:grid-cols-2">
				{entries.map(({ relation, entry }) => {
					const relationType = entry.type.toLowerCase();
					const relationName = relation.toLowerCase();
					const canLoadRelationImage = ["anime", "manga"].includes(relationType);
					const shouldOpenInternalAnime =
						relationType === "anime" && (relationName === "prequel" || relationName === "sequel");
					const relationImageKey = `${relationType}:${entry.mal_id}`;
					const relationImage = relationImages[relationImageKey]?.image_url;
					const shouldShowRelationImageLoading = canLoadRelationImage && !relationImage && !hasLoadedRelationImages;
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
									<Image className="object-cover" src={relationImage} alt={entry.name} sizes="3.5rem" fill />
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
								onClick={(event) => onAnimeRelationClick(event, entry.mal_id, entry.url)}
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
	);
});
