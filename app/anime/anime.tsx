'use client'

import {AnimeEntry} from "@/types/animeData";
import {getCompleted} from "@/lib/mal";
import ChartWatchByMonth from "@/components/charts/ChartWatchByMonth";
import Combobox from "@/components/ui/combobox";
import * as React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import ChartWatchByDayOfWeek from "@/components/charts/ChartWatchByDayOfWeek";
import ChartAnimeCount from "@/components/charts/ChartAnimeCount";

export default function Anime({ animeData }: { animeData: AnimeEntry[]}) {
	const [selectedYear, setSelectedYear] = React.useState<string>(
		new Date().getFullYear().toString()
	)

	const availableYears = React.useMemo(() => {
		const yearsSet = new Set<number>()

		for (const anime of animeData) {
			const updatedAt = anime.list_status?.updated_at
			if (!updatedAt) continue

			const year = new Date(updatedAt).getFullYear()
			yearsSet.add(year)
		}

		//Sort years to be most recent first
		return ["All", ...Array.from(yearsSet).sort((a, b) => b - a)]
	}, [animeData])

	// const currentlyWatching = getWatching(animeData)
	const latestCompleted = getCompleted(animeData);
	// const latestPlanToWatch = getPlanToWatch(animeData);



	return (
		<div className="flex flex-col justify-center gap-5 w-full p-5">

			<Card className="py-0">
				<CardHeader className="flex flex-col items-stretch border-b border-card2-b p-0! sm:flex-row">
					<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
						<CardTitle>Chart settings</CardTitle>
					</div>
				</CardHeader>

				<CardContent className="px-2 sm:p-6">

					<div className="flex flex-col">
						<p className="text-sm">Viewing Year:</p>
						<Combobox
							comboData={availableYears.map((e) => ({
								label: e.toString(),
								value: e.toString().toLowerCase(),
							}))}
							onSelect={(e) => setSelectedYear(e)}
							defaultValue={selectedYear}
							placeholder="Select a year"
						/>
					</div>

				</CardContent>
			</Card>

			<div className="flex flex-col sm:flex-row gap-5">
				<ChartAnimeCount selectedYear={selectedYear} chartData={animeData}/>
				<ChartAnimeCount selectedYear={selectedYear} chartData={animeData}/>
			</div>

			<ChartWatchByMonth selectedYear={selectedYear} chartData={latestCompleted}/>
			<ChartWatchByDayOfWeek selectedYear={selectedYear} chartData={latestCompleted}/>

		</div>
	);
}
