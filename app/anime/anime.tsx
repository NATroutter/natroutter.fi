'use client'

import {AnimeEntry} from "@/types/animeData";
import * as React from "react";
import TabAnimeCharts from "@/components/tabs/TabAnimeCharts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TabAnimeList from "@/components/tabs/TabAnimeList";
import {AnimeCard} from "@/components/AnimeCard";
import {useEffect, useState} from "react";
import ChartSettingsDialog, {defaultSettings, ChartSettings} from "@/components/ChartSettingsDialog";
import {IoSettings} from "react-icons/io5";

export default function Anime({ animeData }: { animeData: AnimeEntry[]}) {
	const [activeTab, setActiveTab] = useState("charts")
	const [chartSettings, setChartSettings] = useState<ChartSettings>(defaultSettings)

	useEffect(() => {
		const stored = localStorage.getItem("activeTab")
		if (stored) setActiveTab(stored)
	}, [])

	const handleTabChange = (tab: string) => {
		setActiveTab(tab)
		localStorage.setItem("activeTab", tab)
	}

	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="gap-5 w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">

				<Tabs defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={handleTabChange}>
					<TabsList className="flex relative gap-0 py-0 mb-5 h-full text-text">
						<TabsTrigger className="m-0 rounded-[0px] py-3 duration-300 transition-colors border-card-border border-l" value="charts">Statistics</TabsTrigger>
						<TabsTrigger className="m-0 rounded-[0px] py-3 duration-300 transition-colors border-card-border border-l border-r" value="anime_list">Anime List</TabsTrigger>
						<TabsTrigger className="m-0 rounded-[0px] py-3 duration-300 transition-colors border-card-border border-r" value="favourites">Favourites</TabsTrigger>
						{(activeTab == "charts") && (
							<div className="absolute left-5">
								<ChartSettingsDialog animeData={animeData} settings={chartSettings} onSettingsSave={(value)=>setChartSettings(value)}>
									<IoSettings size={20} className="text-text-secondary hover:text-text/90 duration-300 transition-colors" />
								</ChartSettingsDialog>
							</div>
						)}
					</TabsList>
					<TabsContent value="charts">
						<TabAnimeCharts chartSettings={chartSettings} animeData={animeData}></TabAnimeCharts>
					</TabsContent>
					<TabsContent value="anime_list" className="w-full">
						<TabAnimeList animeData={animeData}></TabAnimeList>
					</TabsContent>
					<TabsContent value="favourites">
						<div className="flex flex-row flex-wrap gap-5 justify-center">
							{/*<AnimeCard  data={test} />*/}
							{animeData.slice(0,animeData.length-1).map((entry,index) => (
								<AnimeCard key={index} data={entry} />
							))}
						</div>
					</TabsContent>
				</Tabs>

			</div>
		</div>
	);
}
