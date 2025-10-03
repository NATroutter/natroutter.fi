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

type Month = {
	short: string
	full: string
}

const Labels: Month[] = [
	{ short: "Jan", full: "January" },
	{ short: "Feb", full: "February" },
	{ short: "Mar", full: "March" },
	{ short: "Apr", full: "April" },
	{ short: "May", full: "May" },
	{ short: "Jun", full: "June" },
	{ short: "Jul", full: "July" },
	{ short: "Aug", full: "August" },
	{ short: "Sep", full: "September" },
	{ short: "Oct", full: "October" },
	{ short: "Nov", full: "November" },
	{ short: "Dec", full: "December" }
];

const chartConfig: ChartConfig = {
	count: {
		label: "Completed",
		color: "var(--chart-6)",
	},
} satisfies ChartConfig

interface ChartAnimeCompletedByMonthProps {
	settings: ChartSettings
	animeData: AnimeEntry[]
}


export default function ChartAnimeCompletedByMonth({settings, animeData}: ChartAnimeCompletedByMonthProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all"
		const year = Number(settings.viewingYear)

		const monthArr = Array(12).fill(0)

		animeData.forEach((entry) => {
			if (entry.list_status?.status !== "completed") return

			const updatedAt = entry.list_status?.updated_at
			if (!updatedAt) return

			const date = new Date(updatedAt)

			if (!isAllYears) {
				const startYear = date.getFullYear()
				if (startYear !== year) return
			}

			monthArr[date.getMonth()]++
		})

		const totalCount = monthArr.reduce((sum, count) => sum + count, 0)

		return monthArr
			.map((count, index) => ({
				month: Labels[index].short,
				fullMonth: Labels[index].full,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig.count.color,
			}))
	}, [animeData, settings])

	return (
		<Card className="py-0 w-full shadow-xl">
			<CardHeader className="flex flex-col items-stretch border-b bg-card-header border-card-inner-border p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Completed by Month</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Amount of Anime I completed each month across all years."
							: `Amount of Anime I completed each month in ${settings.viewingYear}.`
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
							dataKey="month"
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
												style={{"--color-bg": chartConfig.count.color} as React.CSSProperties}
											/>
											{item.payload.fullMonth}
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
						<Bar dataKey="count" fill={chartConfig.count.color} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}