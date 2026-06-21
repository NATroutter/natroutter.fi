"use client";

import { memo } from "react";
import type { AnimeCharacterData } from "@/types/animeData";
import { AnimeCharacterCarousel, AnimeCharacterCarouselLoading } from "../AnimeCharacterCarousel";

interface AnimeCharactersSectionProps {
	characterData?: AnimeCharacterData;
	hasCharacterData: boolean;
	shouldShowCharacterLoading: boolean;
	characterLoadFailed: boolean;
	hasLoadedCharacters: boolean;
}

export const AnimeCharactersSection = memo(function AnimeCharactersSection({
	characterData,
	hasCharacterData,
	shouldShowCharacterLoading,
	characterLoadFailed,
	hasLoadedCharacters,
}: AnimeCharactersSectionProps) {
	return (
		<div className="min-w-0 w-full">
			{hasCharacterData && characterData && <AnimeCharacterCarousel characterData={characterData} />}
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
	);
});
