"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { AnimeEntry } from "@/types/animeData"

type GenreData = {
	genre: string
	count: number
}

const chartConfig: ChartConfig = {
	count: {
		label: "Watched",
		color: "var(--chart-3)",
	},
}

interface ChartAnimeGenresProps {
	selectedYear: string
	chartData: AnimeEntry[]
}

export default function ChartAnimeGenres({
	selectedYear,
	chartData
}: ChartAnimeGenresProps) {
	const genreData: GenreData[] = React.useMemo(() => {
		const isAllYears = selectedYear === "all"
		const year = Number(selectedYear)
		const counts: Record<string, number> = {}

		for (const entry of chartData) {
			const genres = entry.node?.genres
			if (!genres || genres.length === 0) continue

			if (!isAllYears) {
				const updatedAt = entry.list_status?.updated_at
				if (!updatedAt) continue

				const entryYear = new Date(updatedAt).getFullYear()
				if (entryYear !== year) continue
			}

			for (const genre of genres) {
				counts[genre.name] = (counts[genre.name] || 0) + 1
			}
		}

		return Object.entries(counts)
			.map(([genre, count]) => ({ genre, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 15) // Limit to top 15 genres for readability
	}, [chartData, selectedYear])

	return (
		<Card className="py-0 w-full">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Most Watched Genres</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Top genres watched across all years."
							: `Top genres watched in ${selectedYear}.`
						}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="px-2 p-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[400px] w-full"
				>
					<BarChart
						accessibilityLayer
						data={genreData}
						layout="vertical"
						margin={{ left: 80, right: 12 }}
					>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey="genre"
							type="category"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							width={75}
						/>
						<XAxis type="number" hide />
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									nameKey="count"
									labelFormatter={(value) => `Genre: ${value}`}
								/>
							}
						/>
						<Bar dataKey="count" fill={chartConfig.count.color} radius={4} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}