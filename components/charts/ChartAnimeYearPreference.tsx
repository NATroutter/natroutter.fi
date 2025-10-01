"use client"

import {Pie, PieChart} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import * as React from "react"
import {AnimeEntry} from "@/types/animeData"

const chartConfig: ChartConfig = {
	older: {
		label: "Before 2000",
		color: "var(--chart-1)",
	},
	mid_2000s: {
		label: "2000 - 2010",
		color: "var(--chart-2)",
	},
	mid_2010s: {
		label: "2010 - 2020",
		color: "var(--chart-3)",
	},
	recent: {
		label: "2020+",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig

interface ChartAnimePreferenceProps {
	selectedYear: string
	chartData: AnimeEntry[]
}

export default function ChartAnimeYearPreference({
	selectedYear,
	chartData
}: ChartAnimePreferenceProps) {
	const yearCounts = React.useMemo(() => {
		const isAllYears = selectedYear === "all"
		const year = Number(selectedYear)
		const counts: Record<string, number> = {
			older: 0,
			mid_2000s: 0,
			mid_2010s: 0,
			recent: 0
		}

		for (const entry of chartData) {
			// Skip entries that I have not watched yet
			if (entry.list_status.status != "completed") continue;
			// Skip entries without start_date
			if (!entry.node.start_date) continue

			const startDate = new Date(entry.node.start_date)

			// Only consider entries with valid dates
			if (isNaN(startDate.getTime())) continue

			// Apply year filter if not "all"
			if (!isAllYears) {
				const entryYear = new Date(entry.list_status.updated_at).getFullYear()
				if (entryYear !== year) continue
			}

			const releaseYear = startDate.getFullYear()

			// Categorize by release decade
			if (releaseYear < 2000) {
				counts.older += 1
			} else if (releaseYear >= 2000 && releaseYear < 2010) {
				counts.mid_2000s += 1
			} else if (releaseYear >= 2010 && releaseYear < 2020) {
				counts.mid_2010s += 1
			} else {
				counts.recent += 1
			}
		}

		return counts
	}, [chartData, selectedYear])

	const pieChartData = React.useMemo(() => {
		return Object.entries(yearCounts)
			.map(([category, count]) => ({
				category,
				count,
				fill: chartConfig[category as keyof typeof chartConfig].color,
			}))
			.filter(item => item.count > 0) // Only show categories with data
	}, [yearCounts])

	return (
		<Card className="flex flex-col aspect-square mx-auto w-full max-h-[400px]">
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>New vs. Old Anime Preference</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Distribution of anime by release year across all years."
							: `Distribution of anime by release year in ${selectedYear}.`
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
							nameKey="category"
							outerRadius={90}
							strokeWidth={1}
							label
						>
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="category" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
