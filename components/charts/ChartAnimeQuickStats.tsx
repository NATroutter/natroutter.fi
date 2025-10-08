"use client";

import { useMemo } from "react";
import { IoSettings } from "react-icons/io5";
import ChartSettingsDialog, { type ChartSettings } from "@/components/ChartSettingsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAnime } from "@/lib/anime-format";
import type { AnimeEntry, AnimeSource } from "@/types/animeData";

interface ChartAnimeScoresProps {
	settings: ChartSettings;
	setChartSettings: (settings: ChartSettings) => void;
	animeData: AnimeEntry[];
}

type StatsData = {
	label: string;
	value: number | string;
};

export default function ChartAnimeQuickStats({ settings, setChartSettings, animeData }: ChartAnimeScoresProps) {
	// Filter data based on selected year
	const filteredData = useMemo(() => {
		if (settings.viewingYear === "all") {
			return animeData;
		}

		return animeData.filter((entry) => {
			const startYear = entry.node.start_date ? new Date(entry.node.start_date).getFullYear().toString() : null;
			return startYear === settings.viewingYear;
		});
	}, [animeData, settings.viewingYear]);

	// Calculate total anime watched
	const totalAnimeWatched = filteredData.length;

	// Calculate total episodes watched
	const totalEpisodesWatched = filteredData.reduce((total, entry) => {
		return total + (entry.list_status.num_episodes_watched || 0);
	}, 0);

	// Calculate total days spent (assuming average 24 minutes per episode)
	const totalMinutesWatched = filteredData.reduce((total, entry) => {
		const episodesWatched = entry.list_status.num_episodes_watched || 0;
		const avgDuration = entry.node.average_episode_duration || 24 * 60; // default 24 minutes in seconds
		return total + episodesWatched * (avgDuration / 60); // convert seconds to minutes
	}, 0);
	const totalDaysSpent = parseFloat((totalMinutesWatched / (60 * 24)).toFixed(1));

	// Find favorite source (most common source material)
	const sourceCounts = filteredData.reduce(
		(acc, entry) => {
			const source = entry.node.source || "unknown";
			acc[source] = (acc[source] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	const favoriteSource = Object.entries(sourceCounts).reduce((max, [source, count]) => {
		return count > (sourceCounts[max] || 0) ? source : max;
	}, Object.keys(sourceCounts)[0] || "N/A");

	// Calculate average score given
	const scoredAnime = filteredData.filter((entry) => entry.list_status.score > 0);
	const averageScoreGiven =
		scoredAnime.length > 0
			? parseFloat(
					(scoredAnime.reduce((sum, entry) => sum + entry.list_status.score, 0) / scoredAnime.length).toFixed(2),
				)
			: 0;

	// Calculate completion rate
	const completedAnime = filteredData.filter((entry) => entry.list_status.status === "completed").length;
	const completionRate =
		totalAnimeWatched > 0 ? parseFloat(((completedAnime / totalAnimeWatched) * 100).toFixed(1)) : 0;

	// Calculate sequel chaser (anime with titles containing sequel indicators)
	const sequelKeywords = [
		"2nd",
		"3rd",
		"4th",
		"5th",
		"II",
		"III",
		"IV",
		"Season 2",
		"Season 3",
		"Season 4",
		"Part 2",
		"Part 3",
		"2",
		": Second",
		": Third",
		"Zoku",
		"Kai",
		"Shippuden",
		"Next",
		"Continue",
	];
	const sequelAnime = filteredData.filter((entry) => {
		const title = entry.node.title.toLowerCase();
		const enTitle = entry.node.alternative_titles?.en?.toLowerCase() || "";
		return sequelKeywords.some(
			(keyword) => title.includes(keyword.toLowerCase()) || enTitle.includes(keyword.toLowerCase()),
		);
	}).length;
	const sequelChaserRate = totalAnimeWatched > 0 ? parseFloat(((sequelAnime / totalAnimeWatched) * 100).toFixed(1)) : 0;

	// Calculate OVA Explorer
	const ovaCount = filteredData.filter((entry) => entry.node.media_type === "ova").length;

	const data: StatsData[] = [
		{ label: "Animes Watched", value: totalAnimeWatched },
		{ label: "Episodes Watched", value: totalEpisodesWatched },
		{ label: "Days Spent", value: totalDaysSpent },
		{ label: "OVA Explorer", value: ovaCount },
		{
			label: "Favorite Source",
			value: formatAnime(favoriteSource as AnimeSource),
		},
		{ label: "Average Score", value: averageScoreGiven },
		{ label: "Completion Rate", value: `${completionRate}%` },
		{ label: "Sequel Chaser", value: `${sequelChaserRate}%` },
	];

	return (
		<Card className="py-0 w-full shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Quick Stats</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Overview of your anime watching statistics across all years."
							: `Overview of your anime watching statistics for ${settings.viewingYear}.`}
					</CardDescription>
				</div>
				<div className="flex items-center px-6 pt-4 pb-3">
					<ChartSettingsDialog
						animeData={animeData}
						settings={settings}
						onSettingsSave={(value) => setChartSettings(value)}
					>
						<button
							type="button"
							className="flex gap-2 items-center text-muted hover:text-foreground transition-all duration-300 group"
						>
							<IoSettings size={28} className="group-hover:rotate-180 transition-transform duration-300" />
						</button>
					</ChartSettingsDialog>
				</div>
			</CardHeader>
			<CardContent className="px-2 p-6">
				<div className="gap-4 w-full place-items-center grid mx-auto grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 3xl:px-72">
					{data.map((entry) => (
						<div
							key={entry.value}
							className="flex flex-col text-center bg-card-inner p-2 gap-1 rounded-2xl w-full max-w-[280px] hover:scale-103 transition-transform duration-300 ease-in-out shadow-xl"
						>
							<h1 className="font-bold text-xl text-nowrap">{entry.label}</h1>
							<span className="font-mono">{entry.value}</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
