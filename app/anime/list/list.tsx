"use client"

import * as React from "react"
import {useEffect, useMemo, useState, useTransition} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {AnimeEntry, WATCH_STATUS_LABELS, WatchStatus} from "@/types/animeData"
import {getCompleted, getDropped, getOnHold, getPlanToWatch, getWatching} from "@/lib/mal"
import {Input} from "@/components/ui/input"
import {AnimeCard} from "@/components/AnimeCard"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";

export default function AnimeList({ animeData }: { animeData: AnimeEntry[]}) {

	const copy1 = structuredClone(animeData);
	const animeDataArray = [...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1, ...copy1];
	// animeData = animeDataArray;

	const [selectedList, setSelectedList] = useState<WatchStatus | "all">("all")
	const [searchValue, setSearchValue] = useState("")
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
	const [sortColumn, setSortColumn] = useState<string>("title")
	const [pageIndex, setPageIndex] = useState(0)
	const [pageSize, setPageSize] = useState(10)
	const [isPending, startTransition] = useTransition()
	const [isInitialLoad, setIsInitialLoad] = useState(true)

	const titleMap: Record<WatchStatus | "all", string> = {
		all: "My Anime List",
		plan_to_watch: "Plan to Watch",
		watching: "Currently Watching",
		completed: "Completed Anime",
		on_hold: "On Hold",
		dropped: "Dropped Anime",
	}

	const descriptionMap: Record<WatchStatus | "all", string> = {
		all: "All anime from my list across all statuses.",
		plan_to_watch: "Anime I'm planning to watch in the future.",
		watching: "Anime I'm currently watching.",
		completed: "Anime I've finished watching.",
		on_hold: "Anime I've temporarily paused.",
		dropped: "Anime I've decided not to continue watching.",
	}

	// Defer initial processing to prevent page freeze
	useEffect(() => {
		// Use setTimeout to defer processing until after initial render
		const timer = setTimeout(() => {
			setIsInitialLoad(false)
		}, 0)
		return () => clearTimeout(timer)
	}, [])

	// Manual filtering, sorting, and pagination
	const processedData = useMemo(() => {
		// On initial load, return empty array to prevent freeze
		if (isInitialLoad) {
			return []
		}
		// Step 1: Filter by list type (lazy evaluation - only filter when needed)
		let data: AnimeEntry[]
		if (selectedList === "all") {
			data = animeData
		} else {
			// Only filter for the selected list type, not all types
			switch(selectedList) {
				case "plan_to_watch":
					data = getPlanToWatch(animeData)
					break
				case "watching":
					data = getWatching(animeData)
					break
				case "completed":
					data = getCompleted(animeData)
					break
				case "on_hold":
					data = getOnHold(animeData)
					break
				case "dropped":
					data = getDropped(animeData)
					break
				default:
					data = animeData
			}
		}

		// Step 2: Filter by search
		if (searchValue.trim()) {
			const search = searchValue.toLowerCase()
			data = data.filter(entry => {
				const title = entry.node.alternative_titles.en.length > 0
					? entry.node.alternative_titles.en
					: entry.node.title
				return title.toLowerCase().includes(search)
			})
		}

		// Step 3: Sort
		data = [...data].sort((a, b) => {
			let aVal: any, bVal: any

			switch(sortColumn) {
				case "title":
					aVal = a.node.alternative_titles.en.length > 0 ? a.node.alternative_titles.en : a.node.title
					bVal = b.node.alternative_titles.en.length > 0 ? b.node.alternative_titles.en : b.node.title
					break
				case "score":
					aVal = a.list_status.score
					bVal = b.list_status.score
					break
				case "mean":
					aVal = a.node.mean
					bVal = b.node.mean
					break
				case "rating":
					aVal = a.node.rating
					bVal = b.node.rating
					break
				case "difference":
					aVal = Math.abs(a.node.mean - a.list_status.score)
					bVal = Math.abs(b.node.mean - b.list_status.score)
					break
				case "type":
					aVal = a.node.media_type
					bVal = b.node.media_type
					break
				case "progress":
					aVal = a.node.num_episodes > 0
						? (a.list_status.num_episodes_watched / a.node.num_episodes) * 100
						: a.list_status.num_episodes_watched
					bVal = b.node.num_episodes > 0
						? (b.list_status.num_episodes_watched / b.node.num_episodes) * 100
						: b.list_status.num_episodes_watched
					break
				case "source":
					aVal = a.node.source
					bVal = b.node.source
					break
				case "popularity":
					aVal = a.node.popularity
					bVal = b.node.popularity
					break
				case "start_date":
					aVal = a.node.start_date
					bVal = b.node.start_date
					break
				case "end_date":
					aVal = a.node.end_date
					bVal = b.node.end_date
					break
				case "rank":
					aVal = a.node.rank
					bVal = b.node.rank
					break
				case "average_episode_duration":
					aVal = a.node.average_episode_duration
					bVal = b.node.average_episode_duration
					break
				case "num_episodes":
					aVal = a.node.num_episodes
					bVal = b.node.num_episodes
					break
				case "num_scoring_users":
					aVal = a.node.num_scoring_users
					bVal = b.node.num_scoring_users
					break
				default:
					aVal = a.node.title
					bVal = b.node.title
			}

			// Handle null/undefined values - push them to the end
			if (aVal == null && bVal == null) return 0
			if (aVal == null) return 1
			if (bVal == null) return -1

			// String comparison
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return sortDirection === "asc"
					? aVal.localeCompare(bVal)
					: bVal.localeCompare(aVal)
			}

			// Numeric comparison - ensure we're working with numbers
			const numA = Number(aVal)
			const numB = Number(bVal)

			// Handle NaN values
			if (isNaN(numA) && isNaN(numB)) return 0
			if (isNaN(numA)) return 1
			if (isNaN(numB)) return -1

			return sortDirection === "asc" ? numA - numB : numB - numA
		})

		return data
	}, [animeData, selectedList, searchValue, sortColumn, sortDirection, isInitialLoad])

	// Paginated data
	const paginatedData = useMemo(() => {
		const start = pageIndex * pageSize
		return processedData.slice(start, start + pageSize)
	}, [processedData, pageIndex, pageSize])

	const totalPages = Math.ceil(processedData.length / pageSize)


	// Reset to first page when filters change
	useEffect(() => {
		setPageIndex(0)
	}, [searchValue, selectedList])

	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="gap-5 w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<Card className="w-full h-full py-0">
					<CardHeader className="flex flex-col items-stretch border-b bg-card-header border-card-inner-border p-0 sm:flex-row">
						<div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 pt-4">
							<CardTitle>{titleMap[selectedList]}</CardTitle>
							<CardDescription>
								{descriptionMap[selectedList]}
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="p-6">
						<div className="flex flex-row pb-3 gap-1 flex-wrap">
							<div className="flex flex-col flex-auto min-w-[200px]">
								<p className="text-sm font-medium">Search Title</p>
								<Input
									placeholder="Filter anime..."
									value={searchValue}
									onChange={(event) =>setSearchValue(event.target.value)}
									className="w-full"
								/>
							</div>

							<div className="flex flex-col">
								<p className="text-sm font-medium">List Type</p>
								<Select defaultValue="all" onValueChange={(e) =>setSelectedList(e as WatchStatus)}>
									<SelectTrigger className="w-[200px]">
										<SelectValue placeholder="Select a list" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										{Object.entries(WATCH_STATUS_LABELS).map(([value, label], index) => (
											<SelectItem key={index} value={value}>{label}</SelectItem>
										))}

									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col">
								<p className="text-sm font-medium">Cards per page</p>
								<Select defaultValue={pageSize.toString()} onValueChange={(value) => {
									setPageSize(Number(value))
									setPageIndex(0)
								}}>
									<SelectTrigger className="w-[130px]">
										<SelectValue placeholder="Select a amount" />
									</SelectTrigger>
									{/*TODO ADD "CheckMark={false}" prop to disable check mark*/}
									<SelectContent>
										{[10, 20, 30, 50, 100].map((e,index) => (
											<SelectItem key={index} value={e.toString()}>{e.toString()}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col">
								<p className="text-sm font-medium">Sort By</p>
								<div className="flex gap-1">
									<Select defaultValue="title" onValueChange={(value) => {
										setSortColumn(value)
										setPageIndex(0)
									}}>
										<SelectTrigger className="w-[200px]">
											<SelectValue placeholder="Select sort" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="title">Title</SelectItem>
											<SelectItem value="score">My Score</SelectItem>
											<SelectItem value="mean">MAL Rating</SelectItem>
											<SelectItem value="difference">Score Difference</SelectItem>
											<SelectItem value="type">Type</SelectItem>
											<SelectItem value="progress">Progress</SelectItem>
											<SelectItem value="source">Source</SelectItem>
											<SelectItem value="popularity">Popularity</SelectItem>
											<SelectItem value="start_date">Start Date</SelectItem>
											<SelectItem value="end_date">End Date</SelectItem>
											<SelectItem value="rank">Rank</SelectItem>
											<SelectItem value="rating">Age Rating</SelectItem>
											<SelectItem value="average_episode_duration">Episode Duration</SelectItem>
											<SelectItem value="num_episodes">Episodes</SelectItem>
											<SelectItem value="num_scoring_users">Scoring Users</SelectItem>
										</SelectContent>
									</Select>
									<Button
										variant="control"
										size="icon"
										className="h-10 w-10"
										onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
									>
										<span className="sr-only">Toggle sort direction</span>
										{sortDirection === "asc" ? <FaArrowUp className="w-3! h-3!" /> : <FaArrowDown className="w-3! h-3!" />}
									</Button>
								</div>
							</div>
						</div>

						{/* Pagination Controls */}
						<div className="flex flex-col justify-center gap-2">
							<div className="flex w-full items-center justify-center text-sm font-medium">
								Page {pageIndex + 1} of {totalPages}
							</div>
							<div className="flex justify-center gap-2">
								<Button
									variant="control"
									className="hidden h-8 w-8 p-0 lg:flex"
									onClick={() => setPageIndex(0)}
									disabled={pageIndex === 0}
								>
									<span className="sr-only">Go to first page</span>
									<span>««</span>
								</Button>
								<Button
									variant="control"
									className="h-8 w-8 p-0"
									onClick={() => setPageIndex(prev => prev - 1)}
									disabled={pageIndex === 0}
								>
									<span className="sr-only">Go to previous page</span>
									<span>‹</span>
								</Button>
								<Button
									variant="control"
									className="h-8 w-8 p-0"
									onClick={() => setPageIndex(prev => prev + 1)}
									disabled={pageIndex >= totalPages - 1}
								>
									<span className="sr-only">Go to next page</span>
									<span>›</span>
								</Button>
								<Button
									variant="control"
									className="hidden h-8 w-8 p-0 lg:flex"
									onClick={() => setPageIndex(totalPages - 1)}
									disabled={pageIndex >= totalPages - 1}
								>
									<span className="sr-only">Go to last page</span>
									<span>»»</span>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
				<div className="w-full">
					{isInitialLoad ? (
						<div className="h-24 flex items-center justify-center text-center text-muted-foreground">
							Loading...
						</div>
					) : paginatedData.length > 0 ? (
						<div className="grid gap-4 place-items-center grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6">
							{paginatedData.map((entry, index) => (
								<AnimeCard key={`${entry.node.id}-${index}`} data={entry} />
							))}
						</div>
					) : (
						<div className="h-24 flex items-center justify-center text-center text-muted-foreground">
							No results.
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
