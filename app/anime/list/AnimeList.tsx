"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnimeEntry, AnimeWatchStatus } from "@/types/animeData";
import { AnimeGrid } from "./AnimeGrid";
import { AnimeListTypeSelector } from "./AnimeListTypeSelector";
import { AnimeSearchFilter } from "./AnimeSearchFilter";
import { AnimeSortControl } from "./AnimeSortControl";
import { searchTypes } from "./animeListTypes";
import { useAnimeFiltering } from "./useAnimeFiltering";

const titleMap: Record<AnimeWatchStatus | "all", string> = {
	all: "Anime List",
	plan_to_watch: "Plan to Watch",
	watching: "Currently Watching",
	completed: "Completed Anime",
	on_hold: "On Hold",
	dropped: "Dropped Anime",
};

const descriptionMap: Record<AnimeWatchStatus | "all", string> = {
	all: "All anime from my list across all statuses.",
	plan_to_watch: "Anime I'm planning to watch in the future.",
	watching: "Anime I'm currently watching.",
	completed: "Anime I've finished watching.",
	on_hold: "Anime I've temporarily paused.",
	dropped: "Anime I've decided not to continue watching.",
};

export default function AnimeList({ animeData }: { animeData: AnimeEntry[] }) {
	const {
		selectedList,
		setSelectedList,
		searchValue,
		setSearchValue,
		sortDirection,
		setSortDirection,
		sortColumn,
		setSortColumn,
		fieldSearchType,
		setFieldSearchType,
		processedData,
		visibleData,
		isInitialLoad,
		hasMore,
		isLoadingMore,
		loadMoreRef,
	} = useAnimeFiltering(animeData);

	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="gap-5 md:my-14 w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<Card className="w-full h-full">
					<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row">
						<div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 pt-4">
							<CardTitle>{titleMap[selectedList]}</CardTitle>
							<CardDescription>{descriptionMap[selectedList]}</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col p-0">
						{/* Control */}
						<div className="flex flex-col p-6 gap-2">
							{/* List Type Selector */}
							<AnimeListTypeSelector selectedList={selectedList} onListChange={setSelectedList} />

							{/* Search and Sort Controls */}
							<div className="flex flex-row gap-1 flex-wrap">
								<AnimeSearchFilter
									searchTypes={searchTypes}
									fieldSearchType={fieldSearchType}
									searchValue={searchValue}
									onFieldTypeChange={setFieldSearchType}
									onSearchValueChange={setSearchValue}
								/>

								<AnimeSortControl
									searchTypes={searchTypes}
									sortColumn={sortColumn}
									sortDirection={sortDirection}
									onSortColumnChange={setSortColumn}
									onSortDirectionToggle={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
								/>
							</div>

							{/* Display info */}
							<div className="flex">
								<div className="flex-1 text-sm font-semibold my-auto text-muted">
									Showing {visibleData.length} of {processedData.length} entries
								</div>
							</div>
						</div>

						{/* Divider */}
						<hr className="border-card-border" />

						{/* Anime Grid */}
						<div className="w-full p-6">
							<AnimeGrid
								visibleData={visibleData}
								isInitialLoad={isInitialLoad}
								hasMore={hasMore}
								isLoadingMore={isLoadingMore}
								loadMoreRef={loadMoreRef}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}