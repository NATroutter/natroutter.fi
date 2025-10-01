"use client"

import * as React from "react"
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {AnimeEntry, formatMediaType, WATCH_STATUS_LABELS, WatchStatus} from "@/types/animeData"
import Combobox from "@/components/ui/combobox"
import { getCompleted, getDropped, getOnHold, getPlanToWatch, getWatching } from "@/lib/mal"
import {AnimeDialog} from "@/components/AnimeDialog"
import {Input} from "@/components/ui/input"
import {useEffect, useMemo, useState} from "react";

interface TabAnimeListProps {
	animeData: AnimeEntry[]
}

export default function TabAnimeList({ animeData }: TabAnimeListProps) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [selectedList, setSelectedList] = useState<WatchStatus | "all">("all")
	const [searchValue, setSearchValue] = useState("")

	const columns = useMemo<ColumnDef<AnimeEntry>[]>(() => [
		{
			accessorFn: (row) => row.node.title,
			id: "title",
			header: ({ column }) => {
				return (
					<button
						className="flex items-center hover:text-foreground"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Title
						<span className="ml-2">
            {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}
          </span>
					</button>
				)
			},
			cell: ({ row }) => (
				<div className="capitalize text-ellipsis">{row.original.node.title}</div>
			),
		},
		{
			accessorFn: (row) => row.list_status.score,
			id: "score",
			header: ({ column }) => {
				return (
					<button
						className="flex items-center hover:text-foreground"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Score
						<span className="ml-2">
            {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}
          </span>
					</button>
				)
			},
			cell: ({ row }) => {
				const score = row.original.list_status.score
				return <div className="text-nowrap">{score > 0 ? score : ""}</div>
			},
		},
		{
			accessorFn: (row) => row.node.mean,
			id: "rating",
			header: ({ column }) => {
				return (
					<button
						className="flex items-center hover:text-foreground"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Rating
						<span className="ml-2">
            {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}
          </span>
					</button>
				)
			},
			cell: ({ row }) => {
				const score = row.original.node.mean
				return <div className="text-nowrap">{score > 0 ? score : ""}</div>
			},
		},
		{
			accessorFn: (row) => Math.abs(row.node.mean - row.list_status.score),
			id: "difference",
			header: ({ column }) => {
				return (
					<button
						className="flex items-center hover:text-foreground"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Difference
						<span className="ml-2">
            {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}
          </span>
					</button>
				)
			},
			cell: ({ row }) => {
				const difference = Math.abs(row.original.node.mean - row.original.list_status.score)
				return <div className="text-nowrap">{ isNaN(difference) ? "" : difference.toFixed(2)}</div>
			},
		},
		{
			accessorFn: (row) => row.node.media_type,
			id: "type",
			header: ({ column }) => {
				return (
					<button
						className="flex items-center hover:text-foreground"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Type
						<span className="ml-2">
            {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}
          </span>
					</button>
				)
			},
			cell: ({ row }) => (
				<div className="capitalize text-nowrap">{formatMediaType(row.original.node.media_type)}</div>
			),
		},
		{
			accessorFn: (row) => row.list_status.num_episodes_watched,
			id: "progress",
			header: ({ column }) => {
				return (
					<button
						className="flex items-center hover:text-foreground"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Progress
						<span className="ml-2">
            {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}
          </span>
					</button>
				)
			},
			cell: ({ row }) => {
				const watched = row.original.list_status.num_episodes_watched
				const total = row.original.node.num_episodes
				return <div className="text-nowrap">{watched > 0 ? watched+" / "+total : ""}</div>
			},
		},
	], [])

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

	const dataMap = useMemo<Record<WatchStatus, AnimeEntry[]>>(() => ({
		plan_to_watch: getPlanToWatch(animeData),
		watching: getWatching(animeData),
		completed: getCompleted(animeData),
		on_hold: getOnHold(animeData),
		dropped: getDropped(animeData),
	}), [animeData])

	const filteredData = useMemo(() => selectedList == "all" ? animeData : (dataMap[selectedList] ?? animeData),
		[dataMap, selectedList, animeData]
	)

	const table = useReactTable({
		data: filteredData,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	})

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			table.getColumn("title")?.setFilterValue(searchValue)
			table.setPageIndex(0) // Reset to first page when filtering
		}, 300)
		return () => clearTimeout(timeoutId)
	}, [searchValue, table])

	return (
		<Card className="w-full py-0">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 pt-4">
					<CardTitle>{titleMap[selectedList]}</CardTitle>
					<CardDescription>
						{descriptionMap[selectedList]}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="p-6">
				<div className="flex flex-row pb-3 gap-1">
					<div className="flex flex-col flex-auto">
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
						<Combobox
							comboData={[
								{ label: "All", value: "all" },
								...Object.entries(WATCH_STATUS_LABELS).map(([key, label]) => ({
									label: label,
									value: key,
								}))
							]}
							onSelect={(e) => setSelectedList(e as WatchStatus)}
							placeholder="Select a list"
						/>
					</div>
				</div>
				<div className="w-full overflow-hidden rounded-md border border-card2-b bg-card2">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (

								table.getRowModel().rows.map((row) => (
									<AnimeDialog key={row.id} data={row.original}>
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									</AnimeDialog>

								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination Controls */}
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredRowModel().rows.length} total entries
					</div>
					<div className="flex items-center space-x-6 lg:space-x-8">
						<div className="flex items-center space-x-2">
							<p className="text-sm font-medium">Rows per page</p>
							<Combobox
								placeholder={table.getState().pagination.pageSize.toString()}
								onSelect={(value)=> table.setPageSize(Number(value))}
								className="w-[70px]"
								CheckMark={false}
					            comboData={
									[10, 20, 30, 50, 100].map((e) => ({
										label: e.toString(),
										value: e.toString(),
									}))
								}
							/>
						</div>
						<div className="flex w-[100px] items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to first page</span>
								<span>««</span>
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to previous page</span>
								<span>‹</span>
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to next page</span>
								<span>›</span>
							</Button>
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to last page</span>
								<span>»»</span>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}