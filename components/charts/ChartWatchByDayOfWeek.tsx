"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

type DayData = {
	day: string
	count: number
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const chartConfig: ChartConfig = {
	count: {
		label: "Watched",
		color: "var(--chart-5)",
	},
}

interface ChartWatchByDayOfWeekProps {
	selectedYear: string
	chartData: AnimeEntry[]
}

export default function ChartWatchByDayOfWeek({selectedYear, chartData}: ChartWatchByDayOfWeekProps) {
	const dayData: DayData[] = React.useMemo(() => {
		const isAllYears = selectedYear === "all"
		const year = Number(selectedYear)
		const dayCount = Array(7).fill(0)

		for (const anime of chartData) {
			const updatedAt = anime.list_status?.updated_at
			if (!updatedAt) continue

			const date = new Date(updatedAt)
			if (!isAllYears && date.getFullYear() !== year) continue

			dayCount[date.getDay()]++
		}

		return dayCount.map((count, index) => ({
			day: DAY_LABELS[index],
			count,
		}))
	}, [chartData, selectedYear])

	return (
		<Card className="py-0 w-full">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Completed by Day of Week</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Amount of Anime I completed each day of week across all years."
							: `Amount of Anime I completed each day of week in ${selectedYear}.`
						}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="px-2 p-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<BarChart
						accessibilityLayer
						data={dayData}
						margin={{ left: 12, right: 12 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="day"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={16}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									nameKey="count"
									labelFormatter={(value) => `Day: ${value}`}
								/>
							}
						/>
						<Bar dataKey="count" fill={chartConfig.count.color} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}