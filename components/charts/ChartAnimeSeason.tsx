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
	winter: {
		label: "Winter",
		color: "var(--chart-1)",
	},
	spring: {
		label: "Spring",
		color: "var(--chart-2)",
	},
	summer: {
		label: "Summer",
		color: "var(--chart-3)",
	},
	fall: {
		label: "Fall",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

interface ChartSeasonDistributionProps {
	settings: ChartSettings;
	animeData: AnimeEntry[];
}

export default function ChartAnimeSeason({ settings, animeData }: ChartSeasonDistributionProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all";
		const year = Number(settings.viewingYear);
		const counts: Record<string, number> = {
			winter: 0,
			spring: 0,
			summer: 0,
			fall: 0,
		};

		for (const entry of animeData) {
			const startDate = entry.node.start_date;
			if (!startDate) continue;

			const date = new Date(startDate);
			const month = date.getMonth() + 1; // JavaScript months are 0-indexed

			if (!isAllYears) {
				const startYear = date.getFullYear();
				if (startYear !== year) continue;
			}

			// Determine season based on month
			if (month >= 1 && month <= 3) {
				counts.winter++;
			} else if (month >= 4 && month <= 6) {
				counts.spring++;
			} else if (month >= 7 && month <= 9) {
				counts.summer++;
			} else if (month >= 10 && month <= 12) {
				counts.fall++;
			}
		}

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

		return Object.entries(counts)
			.map(([season, count]) => ({
				season,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig[season as keyof typeof chartConfig].color,
			}))
			.filter((item) => item.count > 0) // Only show seasons with data
			.sort((a, b) => b.count - a.count); // Sort by count descending
	}, [animeData, settings.viewingYear]);

	return (
		<Card className="flex flex-col mx-auto w-full h-full max-h-[400px] shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Season Distribution</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Distribution of anime by premiere season across all years."
							: `Distribution of anime by premiere season for ${settings.viewingYear}.`}
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
						<Pie data={chartData} dataKey="count" nameKey="season" outerRadius={90} strokeWidth={1} label></Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="season" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
