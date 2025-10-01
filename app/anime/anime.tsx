'use client'

import {AnimeEntry} from "@/types/animeData";
import * as React from "react";
import TabAnimeCharts from "@/components/tabs/TabAnimeCharts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TabAnimeList from "@/components/tabs/TabAnimeList";

export default function Anime({ animeData }: { animeData: AnimeEntry[]}) {


	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="gap-5 w-full max-w-[90vw] 3xl:w-640 flex flex-col self-center place-items-center">

				<Tabs defaultValue="charts" className="w-full">
					<TabsList>
						<TabsTrigger value="charts">Charts</TabsTrigger>
						<TabsTrigger value="anime_list">Anime List</TabsTrigger>
						<TabsTrigger value="favourites">Favourites</TabsTrigger>
					</TabsList>
					<TabsContent value="charts">
						<TabAnimeCharts animeData={animeData}></TabAnimeCharts>
					</TabsContent>
					<TabsContent value="anime_list" className="w-full">
						<TabAnimeList animeData={animeData}></TabAnimeList>
					</TabsContent>
					<TabsContent value="favourites">

					</TabsContent>
				</Tabs>

			</div>
		</div>
	);
}
