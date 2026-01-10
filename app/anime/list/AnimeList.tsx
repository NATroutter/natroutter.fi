"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {formatAnimeWatchStatus, getWatchStatues} from "@/lib/anime-format";
import type { AnimeEntry, AnimeWatchStatus } from "@/types/animeData";

interface SearchTypes {
	type: string;
	label: string;
	getValue: (entry: AnimeEntry) => string | number;
	isNumeric: boolean;
	reversed?: boolean;
}

const searchTypes: SearchTypes[] = [
	{
		type: "title",
		label: "Title",
		getValue: (entry) =>
			entry.node.alternative_titles.en.length > 0 ? entry.node.alternative_titles.en : entry.node.title,
		isNumeric: false,
	},
	{
		type: "updated",
		label: "Updated",
		getValue: (entry) => entry.list_status.updated_at,
		isNumeric: false,
	},
	{
		type: "score",
		label: "My Score",
		getValue: (entry) => entry.list_status.score,
		isNumeric: true,
	},
	{
		type: "mean",
		label: "MAL Rating",
		getValue: (entry) => entry.node.mean,
		isNumeric: true,
	},
	{
		type: "difference",
		label: "Score Difference",
		getValue: (entry) => Math.abs(entry.node.mean - entry.list_status.score),
		isNumeric: true,
	},
	{
		type: "type",
		label: "Type",
		getValue: (entry) => entry.node.media_type,
		isNumeric: false,
	},
	{
		type: "progress",
		label: "Progress",
		getValue: (entry) =>
			entry.node.num_episodes > 0
				? (entry.list_status.num_episodes_watched / entry.node.num_episodes) * 100
				: entry.list_status.num_episodes_watched,
		isNumeric: true,
	},
	{
		type: "source",
		label: "Source",
		getValue: (entry) => entry.node.source,
		isNumeric: false,
	},
	{
		type: "popularity",
		label: "Popularity",
		getValue: (entry) => entry.node.popularity,
		isNumeric: true,
	},
	{
		type: "start_date",
		label: "Start Date",
		getValue: (entry) => entry.node.start_date,
		isNumeric: false,
	},
	{
		type: "end_date",
		label: "End Date",
		getValue: (entry) => entry.node.end_date,
		isNumeric: false,
	},
	{
		type: "rank",
		label: "Rank",
		getValue: (entry) => entry.node.rank,
		isNumeric: true,
	},
	{
		type: "rating",
		label: "Age Rating",
		getValue: (entry) => entry.node.rating,
		isNumeric: false,
	},
	{
		type: "average_episode_duration",
		label: "Episode Duration",
		getValue: (entry) => entry.node.average_episode_duration,
		isNumeric: true,
	},
	{
		type: "num_episodes",
		label: "Episodes",
		getValue: (entry) => entry.node.num_episodes,
		isNumeric: true,
	},
	{
		type: "num_scoring_users",
		label: "Scoring Users",
		getValue: (entry) => entry.node.num_scoring_users,
		isNumeric: true,
	},
];

export default function AnimeList({ animeData }: { animeData: AnimeEntry[] }) {
	// const copy1 = structuredClone(animeData);
	// const animeDataArray = [...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1];
	// animeData = animeDataArray;

	const [selectedList, setSelectedList] = useState<AnimeWatchStatus | "all">("all");
	const [searchValue, setSearchValue] = useState("");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const [sortColumn, setSortColumn] = useState<string>(searchTypes[1].type);
	const [itemsPerLoad] = useState(30);
	const [visibleCount, setVisibleCount] = useState(30);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [fieldSearchType, setFieldSearchType] = useState<string>(searchTypes[0].type);
	const loadMoreRef = useRef<HTMLDivElement>(null);

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

	// Defer initial processing to prevent page freeze
	useEffect(() => {
		// Use setTimeout to defer processing until after initial render
		const timer = setTimeout(() => {
			setIsInitialLoad(false);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	// Manual filtering, sorting, and pagination
	const processedData = useMemo(() => {
		// On initial load, return empty array to prevent freeze
		if (isInitialLoad) {
			return [];
		}
		// Step 1: Filter by list type (lazy evaluation - only filter when needed)
		let data: AnimeEntry[];
		if (selectedList === "all") {
			data = animeData;
		} else {
			// Only filter for the selected list type, not all types
			switch (selectedList) {
				case "plan_to_watch":
					data = animeData.filter((anime) => anime.list_status.status === "plan_to_watch");
					break;
				case "watching":
					data = animeData.filter((anime) => anime.list_status.status === "watching");
					break;
				case "completed":
					data = animeData.filter((anime) => anime.list_status.status === "completed");
					break;
				case "on_hold":
					data = animeData.filter((anime) => anime.list_status.status === "on_hold");
					break;
				case "dropped":
					data = animeData.filter((anime) => anime.list_status.status === "dropped");
					break;
				default:
					data = animeData;
			}
		}

		// Step 2: Filter by search
		if (searchValue.trim()) {
			const search = searchValue.toLowerCase();
			const searchNum = Number(searchValue);
			const isNumericSearch = !Number.isNaN(searchNum) && searchValue.trim() !== "";

			// Get the search type config
			const searchTypeConfig = searchTypes.find((st) => st.type === fieldSearchType) || searchTypes[0];
			const getFieldValue = searchTypeConfig.getValue;

			data = data.filter((entry) => {
				const fieldValue = getFieldValue(entry);

				if (fieldValue == null) return false;

				// Handle string fields
				if (typeof fieldValue === "string") {
					return fieldValue.toLowerCase().includes(search);
				}

				// Handle numeric fields - include all for numeric search (will sort by proximity)
				if (isNumericSearch) {
					return true; // Include all, will be sorted by proximity
				} else {
					return fieldValue.toString().includes(search);
				}
			});

			// Step 2.5: Sort by proximity for numeric searches
			if (isNumericSearch && searchTypeConfig.isNumeric) {
				data = [...data].sort((a, b) => {
					const aVal = getFieldValue(a);
					const bVal = getFieldValue(b);

					if (aVal == null) return 1;
					if (bVal == null) return -1;

					const aDist = Math.abs(Number(aVal) - searchNum);
					const bDist = Math.abs(Number(bVal) - searchNum);

					return aDist - bDist;
				});
			}
		}

		// Step 3: Sort (skip if we already sorted by proximity in search AND searching the same field we're sorting by)
		const searchTypeConfigForSkip = searchTypes.find((st) => st.type === fieldSearchType) || searchTypes[0];
		const skipRegularSort =
			(searchValue.trim() &&
				!Number.isNaN(Number(searchValue)) &&
				searchTypeConfigForSkip.isNumeric &&
				fieldSearchType === sortColumn);

		if (!skipRegularSort) {
			const sortTypeConfig = searchTypes.find((st) => st.type === sortColumn) || searchTypes[0];

			// Apply reversed logic: if reversed is true, flip the sort direction
			const effectiveDirection = sortTypeConfig.reversed
				? (sortDirection === "asc" ? "desc" : "asc")
				: sortDirection;

			data = [...data].sort((a, b) => {
				const aVal = sortTypeConfig.getValue(a);
				const bVal = sortTypeConfig.getValue(b);

				// Handle null/undefined values - push them to the end
				if (aVal == null && bVal == null) return 0;
				if (aVal == null) return 1;
				if (bVal == null) return -1;

				// String comparison
				if (typeof aVal === "string" && typeof bVal === "string") {
					return effectiveDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
				}

				// Handle NaN values
				if (Number.isNaN(aVal) && Number.isNaN(bVal)) return 0;
				if (Number.isNaN(aVal)) return 1;
				if (Number.isNaN(bVal)) return -1;

				return effectiveDirection === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
			});
		}

		return data;
	}, [animeData, selectedList, searchValue, sortColumn, sortDirection, isInitialLoad, fieldSearchType]);

	// Visible data for infinite scroll
	const visibleData = useMemo(() => {
		return processedData.slice(0, visibleCount);
	}, [processedData, visibleCount]);

	const hasMore = visibleCount < processedData.length;

	// Reset visible count when filters change
	useEffect(() => {
		setVisibleCount(itemsPerLoad);
	}, [searchValue, selectedList, fieldSearchType, itemsPerLoad]);

	// Load more items callback
	const loadMore = useCallback(() => {
		if (isLoadingMore || !hasMore) return;

		setIsLoadingMore(true);
		// Simulate a small delay for smooth UX
		setTimeout(() => {
			setVisibleCount((prev) => prev + itemsPerLoad);
			setIsLoadingMore(false);
		}, 300);
	}, [isLoadingMore, hasMore, itemsPerLoad]);

	// Infinite scroll with IntersectionObserver
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
					loadMore();
				}
			},
			{ threshold: 0.1 }
		);

		const currentRef = loadMoreRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [hasMore, isLoadingMore, loadMore]);

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
						{/*Control*/}
						<div className="flex flex-col p-6 gap-2">
							{/*Control (row-1) / Anime list type*/}
							<div className="flex flex-col w-full">
								<p className="text-sm font-medium">List Type</p>
								<Select value={selectedList} onValueChange={(e) => {
									setSelectedList(e as AnimeWatchStatus)
								}}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a list" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										{getWatchStatues().map((status) => (
											<SelectItem key={status} value={status}>
												{formatAnimeWatchStatus(status)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/*Control (row-2)*/}
							<div className="flex flex-row gap-1 flex-wrap">
								{/*Control (row-2) / Filter Anime */}
								<div className="flex flex-col flex-auto">
									<Label className="text-sm font-medium">Search anime by</Label>
									<div className="flex flex-row shadow-sm">
										{/*Control (row-2) / Filter Anime / Filter type */}
										<div className="flex flex-col">
											<Select
												value={fieldSearchType}
												onValueChange={(value) => {
													setFieldSearchType(value);
												}}
											>
												<SelectTrigger className="w-fit max-w-48 rounded-r-none border-r-0 shadow-none">
													<SelectValue placeholder="Search field" />
												</SelectTrigger>
												<SelectContent>
													{searchTypes.map((e) => (
														<SelectItem key={e.type} value={e.type}>
															{e.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{/*Control (row-2) / Filter Anime / Input Field */}
										<div className="flex flex-col flex-1">
											<Input
												className="w-full rounded-l-none border-l-0 shadow-none"
												placeholder="Filter..."
												value={searchValue}
												useRing={false}
												onChange={(event) => setSearchValue(event.target.value)}
											/>
										</div>
									</div>
								</div>

								{/*Control (row-2) / Sorting */}
								<div className="flex flex-col w-full md:w-fit">
									<p className="text-sm font-medium">Sort By</p>
									<div className="flex w-full md:w-fit shadow-sm">
										{/*Control (row-2) / Sorting / Type */}
										<Select
											value={sortColumn}
											onValueChange={(value) => {
												setSortColumn(value);
											}}
										>
											<SelectTrigger className="w-full md:w-fit md:max-w-48 rounded-r-none border-r-0 shadow-none">
												<SelectValue placeholder="Select sort" />
											</SelectTrigger>
											<SelectContent>
												{searchTypes.map((e) => (
													<SelectItem key={e.type} value={e.type}>
														{e.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										{/*Control (row-2) / Sorting / Direction */}
										<Button
											size="icon"
											className="h-10 w-10 rounded-l-none border-l-0 shadow-none"
											onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
										>
											<span className="sr-only">Toggle sort direction</span>
											{sortDirection === "asc" ? (
												<FaArrowUp className="w-3! h-3!" />
											) : (
												<FaArrowDown className="w-3! h-3!" />
											)}
										</Button>
									</div>
								</div>
							</div>

							{/* Display info */}
							<div className="flex">
								<div className="flex-1 text-sm font-semibold my-auto text-muted">
									Showing {visibleData.length} of {processedData.length} entries
								</div>
							</div>
						</div>

						{/*Divider between controls and data*/}
						<hr className="border-card-border" />

						{/*Anime data displayed*/}
						<div className="w-full p-6">
							{isInitialLoad ? (
								<div className="h-24 flex items-center justify-center text-center text-muted-foreground">
									Loading...
								</div>
							) : visibleData.length > 0 ? (
								<>
									<div className="grid gap-4 place-items-center grid-cols-1 xl:grid-cols-2 xxl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6">
										{visibleData.map((entry) => (
											<AnimeCard key={entry.node.id} data={entry} />
										))}
									</div>

									{/* Infinite scroll trigger */}
									{hasMore && (
										<div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-4">
											{isLoadingMore && (
												<div className="text-sm text-muted-foreground">Loading more...</div>
											)}
										</div>
									)}
								</>
							) : (
								<div className="h-24 flex items-center justify-center text-center text-muted-foreground">
									No results.
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
