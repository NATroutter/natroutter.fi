"use client";

import { type CSSProperties, useMemo } from "react";
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
	top100: {
		label: "Top 100",
		color: "var(--chart-1)",
	},
	top500: {
		label: "Top 500",
		color: "var(--chart-2)",
	},
	top1000: {
		label: "Top 1000",
		color: "var(--chart-3)",
	},
	top5000: {
		label: "Top 5000",
		color: "var(--chart-4)",
	},
	beyond5000: {
		label: "Beyond 5000",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig;

interface ChartPopularityTiersProps {
	settings: ChartSettings;
	animeData: AnimeEntry[];
}

export default function ChartAnimePopularity({ settings, animeData }: ChartPopularityTiersProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all";
		const year = Number(settings.viewingYear);
		const counts: Record<string, number> = {
			top100: 0,
			top500: 0,
			top1000: 0,
			top5000: 0,
			beyond5000: 0,
		};

		for (const entry of animeData) {
			const popularity = entry.node.popularity;
			if (!popularity) continue;

			if (!isAllYears) {
				const startYear = entry.node.start_date ? new Date(entry.node.start_date).getFullYear() : null;
				if (startYear !== year) continue;
			}

			if (popularity <= 100) {
				counts.top100++;
			} else if (popularity <= 500) {
				counts.top500++;
			} else if (popularity <= 1000) {
				counts.top1000++;
			} else if (popularity <= 5000) {
				counts.top5000++;
			} else {
				counts.beyond5000++;
			}
		}

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

		return Object.entries(counts)
			.map(([tier, count]) => ({
				tier,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig[tier as keyof typeof chartConfig].color,
			}))
			.filter((item) => item.count > 0) // Only show tiers with data
			.sort((a, b) => b.count - a.count); // Sort by count descending
	}, [animeData, settings.viewingYear]);

	return (
		<Card className="flex flex-col mx-auto w-full h-full max-h-[400px] shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Popularity Tiers</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Distribution of anime by MAL popularity ranking across all years."
							: `Distribution of anime by MAL popularity ranking for ${settings.viewingYear}.`}
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
												className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
												style={
													{
														"--color-bg": `var(--color-${name})`,
													} as CSSProperties
												}
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
						<Pie data={chartData} dataKey="count" nameKey="tier" outerRadius={90} strokeWidth={1} label></Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="tier" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
