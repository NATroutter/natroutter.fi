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
import {useMemo} from "react";
import {ChartSettings} from "@/components/ChartSettingsDialog";

type Day = {
	short: string
	full: string
}

const Labels: Day[] = [
	{ short: "Mon", full: "Monday" },
	{ short: "Tue", full: "Tuesday" },
	{ short: "Wed", full: "Wednesday" },
	{ short: "Thu", full: "Thursday" },
	{ short: "Fri", full: "Friday" },
	{ short: "Sat", full: "Saturday" },
	{ short: "Sun", full: "Sunday" }
];

const chartConfig: ChartConfig = {
	count: {
		label: "Completed",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig

interface ChartAnimeUpdatesByDayOfWeekProps {
	settings: ChartSettings
	animeData: AnimeEntry[]
}


export default function ChartAnimeUpdatesByDayOfWeek({settings, animeData}: ChartAnimeUpdatesByDayOfWeekProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all"
		const year = Number(settings.viewingYear)

		const dayArr = Array(7).fill(0)


		animeData.forEach((entry) => {

			const updatedAt = entry.list_status?.updated_at
			if (!updatedAt) return

			const date = new Date(updatedAt)

			if (!isAllYears) {
				const startYear = date.getFullYear()
				if (startYear !== year) return
			}

			const dayIndex = date.getDay()
			const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1
			dayArr[adjustedIndex]++
		})

		const totalCount = dayArr.reduce((sum, count) => sum + count, 0)

		return dayArr
			.map((count, index) => ({
				day: Labels[index].short,
				fullDay: Labels[index].full,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig.count.color,
			}))
	}, [animeData, settings])

	return (
		<Card className="py-0 w-full shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Updates by Day of Week</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Amount of Anime list updates I made each day of week across all years."
							: `Amount of Anime list updates I made each day of week in ${settings.viewingYear}.`
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
						data={chartData}
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
									hideLabel
									className="w-[180px]"
									formatter={(value, name, item) => (
										<>
											<div
												className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
												style={{"--color-bg": `blue`,} as React.CSSProperties}
											/>
											{item.payload.fullDay}
											<div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
												{value}
											</div>
											{/* Add this after the last item */}
											<div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
												Percentage
												<div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
													{item.payload.percentage}
													<span className="text-muted-foreground font-normal">%</span>
												</div>
											</div>
										</>
									)}
								/>
							}
						/>
						<Bar dataKey="count" fill="blue" />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}