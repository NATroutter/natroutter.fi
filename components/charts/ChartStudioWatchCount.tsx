"use client"

import * as React from "react"
import {Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis} from "recharts"

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

type StudioData = {
	studio: string
	count: number
}

const chartConfig: ChartConfig = {
	count: {
		label: "Watched",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig

interface ChartStudioWatchCountProps {
	selectedYear: string
	chartData: AnimeEntry[]
}

export default function ChartStudioWatchCount({
	selectedYear,
	chartData
}: ChartStudioWatchCountProps) {
	const studioData: StudioData[] = useMemo(() => {
		const isAllYears = selectedYear === "all"
		const year = Number(selectedYear)
		const counts: Record<string, number> = {}

		for (const entry of chartData) {
			const studios = entry.node?.studios
			if (!studios || studios.length === 0) continue

			if (!isAllYears) {
				const entryYear = new Date(entry.list_status?.updated_at).getFullYear()
				if (entryYear !== year) continue
			}

			for (const studio of studios) {
				counts[studio.name] = (counts[studio.name] || 0) + 1
			}
		}

		return Object.entries(counts)
			.map(([studio, count]) => ({ studio, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 15) // Limit to top 15 studios for readability
	}, [chartData, selectedYear])

	return (
		<Card className="py-0 w-full">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Most Watched Studios</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Top studios watched across all years."
							: `Top studios watched in ${selectedYear}.`
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
						data={studioData}
						layout="vertical"
						margin={{ left: 12, right: 12 }}

					>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey="studio"
							type="category"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							width={120}
							hide
						/>
						<XAxis type="number" hide/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[180px]"
									nameKey="count"
									labelFormatter={(value) => `${value}`}
								/>
							}
						/>
						<Bar dataKey="count" fill={chartConfig.count.color} radius={4}>
							<LabelList
								dataKey="studio"
								position="insideLeft"
								offset={8}
								className="fill-(--color-header) font-semibold"
								fontSize={12}
							/>
							<LabelList
								dataKey="count"
								position="right"
								offset={8}
								className="fill-(--color-text)"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
