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
import { type AnimeEntry, formatScore } from "@/types/animeData";

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
} satisfies ChartConfig;

interface ChartAnimeScoresProps {
	settings: ChartSettings;
	animeData: AnimeEntry[];
}

export default function ChartAnimeScores({ settings, animeData }: ChartAnimeScoresProps) {
	const chartData = useMemo(() => {
		const isAllYears = settings.viewingYear === "all";
		const year = Number(settings.viewingYear);
		const counts: Record<number, number> = {};

		for (const entry of animeData) {
			const score = entry.list_status?.score;
			if (!score || score < 1 || score > 10) continue;

			if (!isAllYears) {
				const entryYear = new Date(entry.list_status.updated_at).getFullYear();
				if (entryYear !== year) continue;
			}

			counts[score] = (counts[score] || 0) + 1;
		}

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
		return Object.entries(counts)
			.map(([score, count]) => ({
				score: `score_${score}`,
				scoreValue: Number(score),
				count,
				percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
				fill: chartConfig[`score_${score}` as keyof typeof chartConfig].color,
			}))
			.sort((a, b) => b.scoreValue - a.scoreValue); // Sort by score descending
	}, [animeData, settings.viewingYear]);

	return (
		<Card className="flex flex-col mx-auto w-full h-full max-h-[400px] shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Score Distribution</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Distribution of anime by score across all years."
							: `Distribution of anime by score in ${settings.viewingYear}.`}
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
						<Pie data={chartData} dataKey="count" nameKey="score" outerRadius={90} strokeWidth={1} stroke="0" label />
						<ChartLegend
							content={<ChartLegendContent nameKey="score" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-nowrap"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
