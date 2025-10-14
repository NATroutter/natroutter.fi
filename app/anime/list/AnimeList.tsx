"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdFirstPage, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdLastPage } from "react-icons/md";
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getWatchStatues } from "@/lib/anime-format";
import type { AnimeEntry, AnimeWatchStatus } from "@/types/animeData";

interface SearchTypes {
	type: string;
	label: string;
	getValue: (entry: AnimeEntry) => string | number;
	isNumeric: boolean;
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
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [sortColumn, setSortColumn] = useState<string>(searchTypes[0].type);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(30);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [pageInputValue, setPageInputValue] = useState("1");
	const isTypingRef = useRef(false);
	const [fieldSearchType, setFieldSearchType] = useState<string>(searchTypes[0].type);

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
					data = animeData.filter((anime) => anime.list_status.status === "plan_to_watch");
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
				fieldSearchType === sortColumn) ||
			sortColumn === "none";

		if (!skipRegularSort) {
			const sortTypeConfig = searchTypes.find((st) => st.type === sortColumn) || searchTypes[0];

			data = [...data].sort((a, b) => {
				const aVal = sortTypeConfig.getValue(a);
				const bVal = sortTypeConfig.getValue(b);

				// Handle null/undefined values - push them to the end
				if (aVal == null && bVal == null) return 0;
				if (aVal == null) return 1;
				if (bVal == null) return -1;

				// String comparison
				if (typeof aVal === "string" && typeof bVal === "string") {
					return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
				}

				// Handle NaN values
				if (Number.isNaN(aVal) && Number.isNaN(bVal)) return 0;
				if (Number.isNaN(aVal)) return 1;
				if (Number.isNaN(bVal)) return -1;

				return sortDirection === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
			});
		}

		return data;
	}, [animeData, selectedList, searchValue, sortColumn, sortDirection, isInitialLoad, fieldSearchType]);

	// Paginated data
	const paginatedData = useMemo(() => {
		const start = pageIndex * pageSize;
		return processedData.slice(start, start + pageSize);
	}, [processedData, pageIndex, pageSize]);

	const totalPages = Math.ceil(processedData.length / pageSize);

	// Reset to first page when filters change
	useEffect(() => {
		setPageIndex(0);
		setPageInputValue("1");
	}, [searchValue, selectedList, fieldSearchType]);

	// Debounce page input changes
	useEffect(() => {
		if (!isTypingRef.current) return; // Skip if not from user input

		const timer = setTimeout(() => {
			const pageNum = Number(pageInputValue);
			if (!Number.isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
				const newIndex = pageNum - 1;
				if (newIndex !== pageIndex) {
					setPageIndex(newIndex);
				}
			} else {
				setPageIndex(0);
				setPageInputValue("1");
			}
			isTypingRef.current = false;
		}, 500);
		return () => clearTimeout(timer);
	}, [pageInputValue, totalPages, pageIndex]);

	// Update input value when page changes externally (e.g., via buttons)
	useEffect(() => {
		if (!isTypingRef.current) {
			const expectedValue = (pageIndex + 1).toString();
			if (pageInputValue !== expectedValue) {
				setPageInputValue(expectedValue);
			}
		}
	}, [pageIndex, pageInputValue]);

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
								<Select defaultValue="all" onValueChange={(e) => setSelectedList(e as AnimeWatchStatus)}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a list" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										{getWatchStatues().map((status) => (
											<SelectItem key={status.replace(" ", "_")} value={status}>
												{status}
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
												defaultValue={searchTypes[0].type}
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
											defaultValue={searchTypes[0].type}
											onValueChange={(value) => {
												setSortColumn(value);
												setPageIndex(0);
											}}
										>
											<SelectTrigger className="w-full md:w-fit md:max-w-48 rounded-r-none border-r-0 shadow-none">
												<SelectValue placeholder="Select sort" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
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

							{/*Control (row-3) / Pagination */}
							<div className="flex flex-col sm:flex-row gap-2 justify-between">
								{/*Control (row-3) / Pagination / Card Amount Selector */}
								<div className="flex gap-0 sm:gap-2 flex-col sm:flex-row">
									<Label className="text-sm font-medium my-auto flex sm:hidden">Per page</Label>
									<Select
										defaultValue={pageSize.toString()}
										onValueChange={(value) => {
											setPageSize(Number(value));
											setPageIndex(0);
										}}
									>
										<SelectTrigger className="w-full sm:w-[110px]">
											<SelectValue placeholder="Select a amount" />
										</SelectTrigger>
										<SelectContent className="min-w-[3rem]">
											{[10, 20, 30, 50, 100].map((e) => (
												<SelectItem checkMark={false} key={e} value={e.toString()}>
													{e.toString()}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Label className="text-sm font-medium my-auto hidden sm:flex">Per page</Label>
								</div>

								{/*Control (row-3) / Pagination / Buttons */}
								<div className="flex flex-col xs:flex-row justify-center gap-1 pt-3 sm:pt-0">
									<div className="flex flex-row items-center gap-2 justify-center xs:justify-start">
										<div className="flex">
											{/*Control (row-3) / Pagination / Buttons / First Page */}
											<Button
												className="flex h-10 w-10 p-0 rounded-r-none border-r-0"
												onClick={() => {
													isTypingRef.current = false;
													setPageIndex(0);
												}}
												disabled={pageIndex === 0}
											>
												<MdFirstPage />
											</Button>

											{/*Control (row-3) / Pagination / Buttons / Previous Page */}
											<Button
												className="flex h-10 w-10 p-0 rounded-l-none border-l-0"
												onClick={() => {
													isTypingRef.current = false;
													setPageIndex((prev) => prev - 1);
												}}
												disabled={pageIndex === 0}
											>
												<MdKeyboardArrowLeft />
											</Button>
										</div>

										{/*Control (row-3) / Pagination / Current page field (for big layouts)*/}
										<div className="hidden xs:flex">
											<Input
												className="text-right w-14 pr-1 my-auto bg-transparent focus:bg-card-inner-focus"
												value={pageInputValue}
												useRing={false}
												onChange={(e) => {
													isTypingRef.current = true;
													setPageInputValue(e.target.value);
												}}
											/>
											<span className="my-auto">of {totalPages}</span>
										</div>

										<div className="flex">
											{/*Control (row-3) / Pagination / Buttons / Next Page */}
											<Button
												className="flex h-10 w-10 p-0 border-r-0 rounded-r-none"
												onClick={() => {
													isTypingRef.current = false;
													setPageIndex((prev) => prev + 1);
												}}
												disabled={pageIndex >= totalPages - 1}
											>
												<MdKeyboardArrowRight />
											</Button>

											{/*Control (row-3) / Pagination / Buttons / Last Page */}
											<Button
												className="flex h-10 w-10 p-0 border-l-0 rounded-l-none"
												onClick={() => {
													isTypingRef.current = false;
													setPageIndex(totalPages - 1);
												}}
												disabled={pageIndex >= totalPages - 1}
											>
												<MdLastPage />
											</Button>
										</div>
									</div>
								</div>
							</div>

							<div className="flex">
								{/* Display search results */}
								<div className="flex-1 text-sm font-semibold my-auto text-muted ">
									{processedData.length} total entries
								</div>

								{/*Control (row-3) / Pagination / Current page field (for small layouts)*/}
								<div className="flex xs:hidden">
									<Input
										className="text-right w-14 pr-1 my-auto bg-transparent focus:bg-card-inner-focus"
										value={pageInputValue}
										useRing={false}
										onChange={(e) => {
											isTypingRef.current = true;
											setPageInputValue(e.target.value);
										}}
									/>
									<span className="my-auto">of {totalPages}</span>
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
							) : paginatedData.length > 0 ? (
								//    grid-cols-1 xl:grid-cols-2 xxl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6
								<div className="grid gap-4 place-items-center grid-cols-1 xl:grid-cols-2 xxl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6">
									{paginatedData.map((entry) => (
										<AnimeCard key={entry.node.id} data={entry} />
									))}
								</div>
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
