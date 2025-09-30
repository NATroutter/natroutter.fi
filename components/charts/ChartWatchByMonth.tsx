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

type MonthData = {
	month: string
	count: number
}

const MONTH_LABELS = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const chartConfig: ChartConfig = {
	count: {
		label: "Watched",
		color: "var(--chart-theme)",
	},
}

interface ChartWatchByMonthProps {
	selectedYear: string
	chartData: AnimeEntry[]
}

export default function ChartWatchByMonth({selectedYear, chartData}: ChartWatchByMonthProps) {
	const monthData: MonthData[] = React.useMemo(() => {
		const isAllYears = selectedYear === "all"
		const year = Number(selectedYear)
		const monthCount = Array(12).fill(0)

		for (const anime of chartData) {
			const updatedAt = anime.list_status?.updated_at
			if (!updatedAt) continue

			const date = new Date(updatedAt)
			if (!isAllYears && date.getFullYear() !== year) continue

			monthCount[date.getMonth()]++
		}

		return monthCount.map((count, index) => ({
			month: MONTH_LABELS[index],
			count,
		}))
	}, [chartData, selectedYear])

	return (
		<Card className="py-0">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Completed by Month</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Amount of Anime I completed each month across all years."
							: `Amount of Anime I completed each month in ${selectedYear}.`
						}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="px-2 sm:p-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<BarChart
						accessibilityLayer
						data={monthData}
						margin={{ left: 12, right: 12 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
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
									labelFormatter={(value) => `Month: ${value}`}
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