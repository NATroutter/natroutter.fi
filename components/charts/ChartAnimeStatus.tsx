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

export const description = "A pie chart showing anime watch status distribution";

const chartConfig = {
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
} satisfies ChartConfig;

export default function ChartAnimeStatus({
	settings,
	animeData,
}: {
	settings: ChartSettings;
	animeData: AnimeEntry[];
}) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all";
		const year = Number(settings.viewingYear);
		const counts: Record<string, number> = {};

		for (const entry of animeData) {
			const rating = entry.list_status.status;
			if (!rating) continue;

			if (!isAllYears) {
				const updatedAt = entry.list_status?.updated_at;
				if (!updatedAt) continue;

				const entryYear = new Date(updatedAt).getFullYear();
				if (entryYear !== year) continue;
			}

			counts[rating] = (counts[rating] || 0) + 1;
		}

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
		return Object.entries(counts)
			.map(([status, count]) => ({
				status,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig[status as keyof typeof chartConfig].color,
			}))
			.sort((a, b) => b.count - a.count);
	}, [animeData, settings.viewingYear]);

	return (
		<Card className="flex flex-col mx-auto w-full h-full max-h-[400px] shadow-xl">
			{/*// <Card className="flex flex-col">*/}
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Watch Status Distribution</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Distribution of anime by watch status across all years."
							: `Distribution of anime by watch status in ${settings.viewingYear}.`}
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
						<Pie data={chartData} dataKey="count" nameKey="status" outerRadius={90} strokeWidth={1} label></Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="status" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
