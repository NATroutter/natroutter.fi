"use client";

import { type CSSProperties, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartSettings } from "@/components/ChartSettingsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type AnimeEntry, formatSource } from "@/types/animeData";

const chartConfig: ChartConfig = {
	count: {
		label: "Watched",
		color: "var(--chart-8)",
	},
} satisfies ChartConfig;

interface ChartAnimeSourceProps {
	settings: ChartSettings;
	animeData: AnimeEntry[];
}

export default function ChartAnimeSource({ settings, animeData }: ChartAnimeSourceProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all";
		const year = Number(settings.viewingYear);
		const counts: Record<string, number> = {};

		for (const entry of animeData) {
			const source = entry.node?.source;
			if (!source) continue;

			if (!isAllYears) {
				const updatedAt = entry.list_status?.updated_at;
				if (!updatedAt) continue;

				const entryYear = new Date(updatedAt).getFullYear();
				if (entryYear !== year) continue;
			}

			const formattedSource = formatSource(source);
			counts[formattedSource] = (counts[formattedSource] || 0) + 1;
		}

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

		return Object.entries(counts)
			.map(([source, count]) => ({
				source,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig.count.color,
			}))
			.sort((a, b) => b.count - a.count);
	}, [animeData, settings.viewingYear]);

	return (
		<Card className="py-0 w-full shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime by Source Material</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Distribution of anime by source material across all years."
							: `Distribution of anime by source material in ${settings.viewingYear}.`}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="px-2 p-6">
				<ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
					<BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 12, right: 12 }}>
						<CartesianGrid horizontal={false} />
						<YAxis dataKey="source" type="category" tickLine={false} axisLine={false} tickMargin={8} width={120} />
						<XAxis type="number" hide />
						<ChartTooltip
							content={
								<ChartTooltipContent
									hideLabel
									className="w-[180px]"
									formatter={(value, _name, item) => (
										<>
											<div
												className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
												style={
													{
														"--color-bg": chartConfig.count.color,
													} as CSSProperties
												}
											/>
											{item.payload.source}
											<div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
												{value}
											</div>
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
						/>
						<Bar dataKey="count" fill={chartConfig.count.color} radius={4}></Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
