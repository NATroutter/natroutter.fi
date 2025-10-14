"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import type { ChartSettings } from "@/components/ChartSettingsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { AnimeEntry } from "@/types/animeData";

const chartConfig: ChartConfig = {
	notStarted: {
		label: "(0%)",
		color: "var(--chart-1)",
	},
	justStarted: {
		label: "(<25%)",
		color: "var(--chart-2)",
	},
	halfWay: {
		label: "(25-50%)",
		color: "var(--chart-3)",
	},
	mostlyDone: {
		label: "(50-75%)",
		color: "var(--chart-4)",
	},
	almostComplete: {
		label: "(75-99%)",
		color: "var(--chart-5)",
	},
	completed: {
		label: "(100%)",
		color: "var(--chart-6)",
	},
} satisfies ChartConfig;

interface ChartProgressBreakdownProps {
	settings: ChartSettings;
	animeData: AnimeEntry[];
}

export default function ChartAnimeProgress({ settings, animeData }: ChartProgressBreakdownProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all";
		const year = Number(settings.viewingYear);
		const counts: Record<string, number> = {
			notStarted: 0,
			justStarted: 0,
			halfWay: 0,
			mostlyDone: 0,
			almostComplete: 0,
			completed: 0,
		};

		for (const entry of animeData) {
			const episodesWatched = entry.list_status.num_episodes_watched || 0;
			const totalEpisodes = entry.node.num_episodes || 0;

			// Skip entries with unknown total episodes
			if (totalEpisodes === 0) continue;

			if (!isAllYears) {
				const startYear = entry.node.start_date ? new Date(entry.node.start_date).getFullYear() : null;
				if (startYear !== year) continue;
			}

			// Calculate progress percentage
			const progressPercent = (episodesWatched / totalEpisodes) * 100;

			if (progressPercent === 0) {
				counts.notStarted++;
			} else if (progressPercent < 25) {
				counts.justStarted++;
			} else if (progressPercent < 50) {
				counts.halfWay++;
			} else if (progressPercent < 75) {
				counts.mostlyDone++;
			} else if (progressPercent < 100) {
				counts.almostComplete++;
			} else {
				counts.completed++;
			}
		}

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

		return Object.entries(counts)
			.map(([progress, count]) => ({
				progress,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig[progress as keyof typeof chartConfig].color,
			}))
			.filter((item) => item.count > 0) // Only show categories with data
			.sort((a, b) => b.count - a.count); // Sort by count descending
	}, [animeData, settings.viewingYear]);

	return (
		<Card className="flex flex-col mx-auto w-full h-full max-h-[400px] shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Progress Breakdown</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Distribution of anime by watch progress across all years."
							: `Distribution of anime by watch progress for ${settings.viewingYear}.`}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="flex-1 p-0!">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
					<PieChart className="p-0">
						<ChartTooltip
							content={
								<ChartTooltipContent
									hideLabel
									className="w-[180px]"
									formatter={(value, name, item) => (
										<>
											<div
												className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
												style={{
													backgroundColor: item.payload.fill,
												}}
											/>
											{chartConfig[name as keyof typeof chartConfig]?.label || name}
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
							cursor={false}
						/>
						<Pie data={chartData} dataKey="count" nameKey="progress" outerRadius={90} strokeWidth={1} label></Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="progress" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
