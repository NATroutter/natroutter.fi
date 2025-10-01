"use client"

import { Label, Pie, PieChart } from "recharts"

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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import * as React from "react"
import {AnimeEntry, formatScore} from "@/types/animeData"

const chartConfig: ChartConfig = {
	score_10: {
		label: formatScore(10),
		color: "var(--chart-1)",
	},
	score_9: {
		label: formatScore(9),
		color: "var(--chart-2)",
	},
	score_8: {
		label: formatScore(8),
		color: "var(--chart-3)",
	},
	score_7: {
		label: formatScore(7),
		color: "var(--chart-4)",
	},
	score_6: {
		label: formatScore(6),
		color: "var(--chart-5)",
	},
	score_5: {
		label: formatScore(5),
		color: "var(--chart-6)",
	},
	score_4: {
		label: formatScore(4),
		color: "var(--chart-7)",
	},
	score_3: {
		label: formatScore(3),
		color: "var(--chart-8)",
	},
	score_2: {
		label: formatScore(2),
		color: "var(--chart-9)",
	},
	score_1: {
		label: formatScore(1),
		color: "var(--chart-10)",
	},
}

interface ChartAnimeScoresProps {
	selectedYear: string
	chartData: AnimeEntry[]
}

export default function ChartAnimeScores({
	selectedYear,
	chartData
}: ChartAnimeScoresProps) {
	const scoreCounts = React.useMemo(() => {
		const isAllYears = selectedYear === "all"
		const year = Number(selectedYear)
		const counts: Record<number, number> = {}

		for (const entry of chartData) {
			const score = entry.list_status?.score
			if (!score || score < 1 || score > 10) continue

			if (!isAllYears) {
				const entryYear = new Date(entry.list_status.updated_at).getFullYear()
				if (entryYear !== year) continue
			}

			counts[score] = (counts[score] || 0) + 1
		}

		return counts
	}, [chartData, selectedYear])

	const pieChartData = React.useMemo(() => {
		return Object.entries(scoreCounts)
			.map(([score, count]) => ({
				score: `score_${score}`,
				scoreValue: Number(score),
				count,
				fill: chartConfig[`score_${score}` as keyof typeof chartConfig].color,
			}))
			.sort((a, b) => b.scoreValue - a.scoreValue) // Sort by score descending
	}, [scoreCounts])

	const totalScored = Object.values(scoreCounts).reduce((sum, count) => sum + count, 0)

	return (
		<Card className="flex flex-col aspect-square mx-auto w-full max-h-[400px]">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Score Distribution</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Distribution of anime by score across all years."
							: `Distribution of anime by score in ${selectedYear}.`
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
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={pieChartData}
							dataKey="count"
							nameKey="score"
							innerRadius={60}
							outerRadius={90}
							strokeWidth={1}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
												>
													{totalScored.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Scored Anime
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="score" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}