'use client'

import {AnimeEntry} from "@/types/animeData";
import ChartAnimeCompletedByMonth from "@/components/charts/ChartAnimeCompletedByMonth";
import * as React from "react";
import {useState} from "react";
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
import ChartSettingsDialog, {ChartSettings, defaultSettings} from "@/components/ChartSettingsDialog";
import {IoSettings} from "react-icons/io5";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

export default function AnimeStats({ animeData }: { animeData: AnimeEntry[]}) {
	const [chartSettings, setChartSettings] = useState<ChartSettings>(defaultSettings)

	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5 md:my-20">

					{/*<ChartSettingsDialog animeData={animeData} settings={chartSettings} onSettingsSave={(value)=>setChartSettings(value)}>*/}
					{/*	<div className="flex gap-1 w-fit text-muted hover:text-foreground duration-300 transition-colors">*/}
					{/*		<IoSettings size={24} />*/}
					{/*		<Label className="my-auto">Settings</Label>*/}
					{/*	</div>*/}
					{/*</ChartSettingsDialog>*/}

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
			</div>
		</div>
	);
}
