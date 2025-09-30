'use client'

import {AnimeEntry} from "@/types/animeData";
import {getCompleted, getPlanToWatch, getWatching} from "@/lib/mal";
import ChartWatchTimeBy from "@/components/charts/ChartWatchTimeBy";

export default function Anime({ animeData }: { animeData: AnimeEntry[]}) {

	const currentlyWatching = getWatching(animeData)
	const latestCompleted = getCompleted(animeData);
	const latestPlanToWatch = getPlanToWatch(animeData);



	return (
		<div className="flex flex-col justify-center gap-10 m-auto w-full p-6 py-10">

			<ChartWatchTimeBy/>

		</div>
	);
}
