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
} satisfies ChartConfig;

interface ChartNSFWProps {
	settings: ChartSettings;
	animeData: AnimeEntry[];
}

export default function ChartAnimeNsfw({ settings, animeData }: ChartNSFWProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all";
		const year = Number(settings.viewingYear);
		const counts: Record<string, number> = {};

		for (const entry of animeData) {
			const nsfw = entry.node.nsfw;
			if (!nsfw || !["white", "gray", "black"].includes(nsfw)) continue;

			if (!isAllYears) {
				const entryYear = new Date(entry.list_status?.updated_at).getFullYear();
				if (entryYear !== year) continue;
			}

			counts[nsfw] = (counts[nsfw] || 0) + 1;
		}

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
		return Object.entries(counts)
			.map(([nsfw, count]) => ({
				nsfw,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig[nsfw as keyof typeof chartConfig].color,
			}))
			.sort((a, b) => b.count - a.count); // Sort by count descending
	}, [animeData, settings.viewingYear]);

	return (
		<Card className="flex flex-col mx-auto w-full h-full max-h-[400px] shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>NSFW Tag Analysis</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Distribution of anime by NSFW tag across all years."
							: `Distribution of anime by NSFW tag in ${settings.viewingYear}.`}
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
						<Pie data={chartData} dataKey="count" nameKey="nsfw" outerRadius={90} strokeWidth={1} label></Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="nsfw" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
