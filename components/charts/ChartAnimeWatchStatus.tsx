"use client"

import {Pie, PieChart} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import * as React from "react";
import {useMemo} from "react";
import {AnimeEntry} from "@/types/animeData";

export const description = "A pie chart showing anime watch status distribution"

const chartConfig = {
	total: {
		label: "Total",
	},
	plan_to_watch: {
		label: "Plan To Watch",
		color: "var(--chart-1)",
	},
	watching: {
		label: "Watching",
		color: "var(--chart-2)",
	},
	completed: {
		label: "Completed",
		color: "var(--chart-3)",
	},
	on_hold: {
		label: "On Hold",
		color: "var(--chart-4)",
	},
	dropped: {
		label: "Dropped",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig

export default function ChartAnimeWatchStatus({ selectedYear, chartData }: { selectedYear: string, chartData: AnimeEntry[] }) {
	// Filter data by year if not "all"
	const filteredData = useMemo(() => {
		if (selectedYear === "all") {
			return chartData;
		}

		return chartData.filter(entry => {
			const entryYear = new Date(entry.list_status.updated_at).getFullYear().toString();
			return entryYear === selectedYear;
		});
	}, [chartData, selectedYear]);

	// Count anime by status
	const statusCounts = useMemo(() => {
		const counts = {
			plan_to_watch: 0,
			watching: 0,
			completed: 0,
			on_hold: 0,
			dropped: 0,
		};

		filteredData.forEach(entry => {
			const status = entry.list_status.status;
			if (status in counts) {
				counts[status as keyof typeof counts]++;
			}
		});

		return counts;
	}, [filteredData]);

	// Create chart data from counts
	const pieChartData = [
		{ status: "plan_to_watch", count: statusCounts.plan_to_watch, fill: "var(--chart-1)" },
		{ status: "watching", count: statusCounts.watching, fill: "var(--chart-2)" },
		{ status: "completed", count: statusCounts.completed, fill: "var(--chart-3)" },
		{ status: "on_hold", count: statusCounts.on_hold, fill: "var(--chart-4)" },
		{ status: "dropped", count: statusCounts.dropped, fill: "var(--chart-5)" },
	].filter(item => item.count > 0); // Only show statuses with count > 0

	return (
		<Card className="flex flex-col aspect-square mx-auto w-full max-h-[400px]">
		{/*// <Card className="flex flex-col">*/}
			<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Watch Status Distribution</CardTitle>
					<CardDescription>
						{selectedYear === "all"
							? "Distribution of anime by watch status across all years."
							: `Distribution of anime by watch status in ${selectedYear}.`
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
							nameKey="status"
							outerRadius={90}
							strokeWidth={1}
							label
						>
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="status" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}