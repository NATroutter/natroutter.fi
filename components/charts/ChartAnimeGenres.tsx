"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartSettings } from "@/components/ChartSettingsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { AnimeEntry } from "@/types/animeData";

const chartConfig: ChartConfig = {
	count: {
		label: "Watched",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

interface ChartAnimeGenresProps {
	settings: ChartSettings;
	animeData: AnimeEntry[];
}

export default function ChartAnimeGenres({ settings, animeData }: ChartAnimeGenresProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all";
		const year = Number(settings.viewingYear);
		const counts: Record<string, number> = {};

		for (const entry of animeData) {
			const genres = entry.node?.genres;
			if (!genres || genres.length === 0) continue;

			if (!isAllYears) {
				const updatedAt = entry.list_status?.updated_at;
				if (!updatedAt) continue;

				const entryYear = new Date(updatedAt).getFullYear();
				if (entryYear !== year) continue;
			}

			for (const genre of genres) {
				counts[genre.name] = (counts[genre.name] || 0) + 1;
			}
		}

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

		return Object.entries(counts)
			.map(([genre, count]) => ({
				genre,
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig.count.color,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 20);
	}, [animeData, settings.viewingYear]);

	return (
		<Card className="py-0 w-full shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Top-20 Most Watched Genres</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Genres watched across all years."
							: `Genres watched in ${settings.viewingYear}.`}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="px-2 p-6">
				<ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
					<BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 12, right: 12 }}>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey="genre"
							type="category"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							width={120}
							interval={0}
						/>
						<XAxis type="number" hide />
						<ChartTooltip
							content={
								<ChartTooltipContent
									hideLabel
									className="w-[180px]"
									formatter={(value, _name, item) => (
										<>
											<div
												className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
												style={{
													backgroundColor: item.payload.fill,
												}}
											/>
											{item.payload.genre}
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
