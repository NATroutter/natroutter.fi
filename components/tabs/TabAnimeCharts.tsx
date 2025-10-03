'use client'

import {AnimeEntry} from "@/types/animeData";
import ChartAnimeCompletedByMonth from "@/components/charts/ChartAnimeCompletedByMonth";
import Combobox from "@/components/ui/combobox";
import * as React from "react";
import {useMemo, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import ChartAnimeCompletedByDayOfWeek from "@/components/charts/ChartAnimeCompletedByDayOfWeek";
import ChartAnimeStatus from "@/components/charts/ChartAnimeStatus";
import ChartAnimeScores from "@/components/charts/ChartAnimeScores";
import ChartAnimeGenres from "@/components/charts/ChartAnimeGenres";
import ChartAnimeSeasonsBest from "@/components/charts/ChartAnimeSeasonsBest";
import ChartAnimeStudio from "@/components/charts/ChartAnimeStudio";
import ChartAnimeNsfw from "@/components/charts/ChartAnimeNsfw";
import ChartAnimeYearPreference from "@/components/charts/ChartAnimeYearPreference";
import ChartAnimeQuickStats from "@/components/charts/ChartAnimeQuickStats";
import ChartAnimeRatings from "@/components/charts/ChartAnimeRatings";
import ChartAnimeSource from "@/components/charts/ChartAnimeSource";
import ChartAnimePopularity from "@/components/charts/ChartAnimePopularity";
import ChartAnimeProgress from "@/components/charts/ChartAnimeProgress";
import ChartAnimeSeason from "@/components/charts/ChartAnimeSeason";
import ChartAnimeUpdatesByDayOfWeek from "@/components/charts/ChartAnimeUpdatesByDayOfWeek";
import ChartAnimeUpdatesByMonth from "@/components/charts/ChartAnimeUpdatesByMonth";
import {ChartSettings} from "@/components/ChartSettingsDialog";

export default function TabAnimeCharts({ animeData, chartSettings }: { animeData: AnimeEntry[], chartSettings: ChartSettings}) {

	return (
		<div className="flex flex-col gap-5">

			<ChartAnimeQuickStats settings={chartSettings} animeData={animeData}/>
			<ChartAnimeSeasonsBest settings={chartSettings} animeData={animeData}/>

			<div className="grid place-content-between gap-5 grid-cols-1 sm:grid-cols-2 xxl:grid-cols-4">
				<ChartAnimeStatus settings={chartSettings} animeData={animeData}/>
				<ChartAnimeScores settings={chartSettings} animeData={animeData}/>
				<ChartAnimeNsfw settings={chartSettings} animeData={animeData}/>
				<ChartAnimeYearPreference settings={chartSettings} animeData={animeData}/>
			</div>

			<div className="grid place-content-between gap-5 grid-cols-1 sm:grid-cols-2 xxl:grid-cols-4">
				<ChartAnimeRatings settings={chartSettings} animeData={animeData}/>
				<ChartAnimePopularity settings={chartSettings} animeData={animeData}/>
				<ChartAnimeProgress settings={chartSettings} animeData={animeData}/>
				<ChartAnimeSeason settings={chartSettings} animeData={animeData}/>
			</div>

			<div className="flex flex-col lg:flex-row gap-5 w-full">
				<ChartAnimeUpdatesByMonth settings={chartSettings} animeData={animeData}/>
				<ChartAnimeUpdatesByDayOfWeek settings={chartSettings} animeData={animeData}/>
			</div>

			<div className="flex flex-col lg:flex-row gap-5 w-full">
				<ChartAnimeCompletedByMonth settings={chartSettings} animeData={animeData}/>
				<ChartAnimeCompletedByDayOfWeek settings={chartSettings} animeData={animeData}/>
			</div>

			<ChartAnimeSource settings={chartSettings} animeData={animeData}/>

			<div className="flex flex-col lg:flex-row gap-5 w-full">
				<ChartAnimeGenres settings={chartSettings} animeData={animeData}/>
				<ChartAnimeStudio settings={chartSettings} animeData={animeData}/>
			</div>
		</div>
	);
}
