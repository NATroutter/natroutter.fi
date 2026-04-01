"use client";

import type { ChartSettings } from "@/components/ChartSettingsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeatmapCell } from "@/components/ui/heatmap-calendar";
import { HeatmapCalendar } from "@/components/ui/heatmap-calendar";
import type { AnimeHistoryUpdate } from "@/types/animeData";

interface ChartAnimeActivityMapProps {
	settings: ChartSettings;
	animeHistory: AnimeHistoryUpdate[];
}

function isLeapYear(year: number) {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export default function ChartAnimeActivityMap({ settings, animeHistory }: ChartAnimeActivityMapProps) {
	const isAllYears = settings.viewingYear === "all";
	const year = isAllYears ? null : Number(settings.viewingYear);

	const endDate = year ? new Date(year, 11, 31) : new Date();
	const rangeDays = year ? (isLeapYear(year) ? 366 : 365) : 365;

	const data = animeHistory.map((item) => ({
		date: item.date,
		value: item.updates.reduce((sum, edit) => sum + edit.episodes, 0),
	}));

	const handleCellClick = (cell: HeatmapCell) => {
		const el = document.getElementById(`timeline-${cell.key}`);
		if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const renderTooltip = (cell: HeatmapCell) => {
		if (cell.disabled) return null;
		if (cell.value === 0) return <div className="text-sm text-muted-foreground">{cell.label}</div>;
		return (
			<div className="text-sm">
				<div className="font-medium">{cell.value} episode{cell.value !== 1 ? "s" : ""}</div>
				<div className="text-muted-foreground">{cell.label}</div>
			</div>
		);
	};

	return (
		<Card className="py-0 w-full shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Watch Activity</CardTitle>
					<CardDescription>
						{isAllYears
							? "Daily episodes watched over the past year."
							: `Daily episodes watched in ${year}.`}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="px-2 p-6">
				<HeatmapCalendar
					data={data}
					endDate={endDate}
					rangeDays={rangeDays}
					cellSize={16}
					cellGap={4}
					onCellClick={handleCellClick}
					axisLabels={{
						className: "normal-case",
						weekdayIndices: [0, 2, 4, 6],
					}}
					renderTooltip={renderTooltip}
					legend={{
						show:false
					}}

				/>
			</CardContent>
		</Card>
	);
}
