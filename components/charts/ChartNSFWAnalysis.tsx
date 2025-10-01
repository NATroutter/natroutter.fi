"use client"

import {Pie, PieChart} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import * as React from "react"
import {useMemo} from "react"
import {AnimeEntry} from "@/types/animeData"

const chartConfig: ChartConfig = {
	white: {
		label: "Safe for Work",
		color: "var(--chart-1)",
	},
	gray: {
		label: "Questionable",
		color: "var(--chart-2)",
	},
	black: {
		label: "Not Safe for Work",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig

interface ChartNSFWProps {
	selectedYear: string
	chartData: AnimeEntry[]
}

export default function ChartNSFWAnalysis({
	selectedYear,
	chartData
}: ChartNSFWProps) {
	const nsfwCounts = useMemo(() => {
		const isAllYears = selectedYear === "all"
		const year = Number(selectedYear)
		const counts: Record<string, number> = {}

		for (const entry of chartData) {
			const nsfw = entry.node.nsfw
			if (!nsfw || !['white', 'gray', 'black'].includes(nsfw)) continue

			if (!isAllYears) {
				const entryYear = new Date(entry.list_status?.updated_at).getFullYear()
				if (entryYear !== year) continue
			}

			counts[nsfw] = (counts[nsfw] || 0) + 1
		}

		return counts
	}, [chartData, selectedYear])

	const pieChartData = useMemo(() => {
		return Object.entries(nsfwCounts)
			.map(([nsfw, count]) => ({
				nsfw,
				count,
				fill: chartConfig[nsfw as keyof typeof chartConfig].color,
			}))
			.sort((a, b) => b.count - a.count) // Sort by count descending
	}, [nsfwCounts])

	return (
		<Card className="flex flex-col aspect-square mx-auto w-full max-h-[400px]">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>NSFW Tag Analysis</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Distribution of anime by NSFW tag across all years."
							: `Distribution of anime by NSFW tag in ${selectedYear}.`
						}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="flex-1 p-0!">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[300px]"
				>
					<PieChart className="p-0">
						<ChartTooltip
							content={
								<ChartTooltipContent
									hideLabel
									className="w-[180px]"
									formatter={(value, name) => (
										<>
											<div
												className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
												style={{ "--color-bg": `var(--color-${name})`,} as React.CSSProperties}
											/>
											{chartConfig[name as keyof typeof chartConfig]?.label || name}
											<div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
												{value}
											</div>
										</>
									)}
								/>
							}
							cursor={false}
						/>
						<Pie
							data={pieChartData}
							dataKey="count"
							nameKey="nsfw"
							outerRadius={90}
							strokeWidth={1}
							label
						>
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="nsfw" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
