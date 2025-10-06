"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import {AnimeEntry} from "@/types/animeData";
import {AnimeCard} from "@/components/AnimeCard";
import {ChartSettings} from "@/components/ChartSettingsDialog";

interface ChartAnimeScoresProps {
	settings: ChartSettings
	animeData: AnimeEntry[]
}

export type Season = "Winter" | "Spring" | "Summer" | "Fall"

interface SeasonalAnime {
	season: Season
	year: number
	anime?: AnimeEntry
}

function getSeasonFromMonth(month: number): Season {
	if (month >= 0 && month <= 2) return "Winter"      // Jan, Feb, Mar
	if (month >= 3 && month <= 5) return "Spring"      // Apr, May, Jun
	if (month >= 6 && month <= 8) return "Summer"      // Jul, Aug, Sep
	return "Fall"                                       // Oct, Nov, Dec
}

export function getAnimeStartYear(entry: AnimeEntry): number | undefined {
	const startDate = entry.node.start_date
	if (!startDate) return undefined
	const date = new Date(startDate)
	return date.getFullYear();
}

export function getAnimeSeason(entry: AnimeEntry): Season | undefined {
	const startDate = entry.node.start_date
	if (!startDate) return undefined
	const date = new Date(startDate)
	return getSeasonFromMonth(date.getMonth())
}

export default function ChartAnimeSeasonsBest({ settings, animeData }: ChartAnimeScoresProps) {
	const isAllYears = settings.viewingYear === "all"
	const year = Number(settings.viewingYear)

	// Group anime by season (and year if needed)
	const seasonMap = new Map<string, AnimeEntry[]>()

	for (const entry of animeData) {
		const updatedAt = entry.list_status?.updated_at
		const score = entry.list_status?.score

		// Skip entries without date or score
		if (!updatedAt || !score || score < 1 || score > 10) continue

		const date = new Date(updatedAt)
		const entryYear = date.getFullYear()

		// Filter by year if not "all"
		if (!isAllYears && entryYear !== year) continue

		const season = getSeasonFromMonth(date.getMonth())
		// For "all" years, group by season only; otherwise by season-year
		const key = isAllYears ? season : `${season}-${entryYear}`

		if (!seasonMap.has(key)) {
			seasonMap.set(key, [])
		}
		seasonMap.get(key)!.push(entry)
	}

	// Get the highest rated anime for each season
	const seasonOrder: Season[] = ["Winter", "Spring", "Summer", "Fall"]
	const topRatedPerSeason: (SeasonalAnime | null)[] = []

	for (const season of seasonOrder) {
		const key = isAllYears ? season : `${season}-${year}`
		const entries = seasonMap.get(key)

		if (!entries || entries.length === 0) {
			topRatedPerSeason.push({
				season: season,
				year: year,
				anime: undefined,
			})
			continue
		}

		// Sort by score descending, then by title alphabetically as tiebreaker
		const sorted = entries.sort((a, b) => {
			const scoreDiff = (b.list_status?.score || 0) - (a.list_status?.score || 0)
			if (scoreDiff !== 0) return scoreDiff
			return a.node.title.localeCompare(b.node.title)
		})

		// Get the year from the top anime for display
		const topAnime = sorted[0]
		const topAnimeYear = new Date(topAnime.list_status.updated_at).getFullYear()

		topRatedPerSeason.push({
			season,
			year: isAllYears ? topAnimeYear : year,
			anime: topAnime,
		})
	}

	return (
		<Card className="py-0 w-full shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Top Rated Anime by Season</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Highest rated anime from each season across all years."
							: `Highest rated anime from each season in ${settings.viewingYear}.`
						}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="px-2 p-6">
				<div className="gap-4 w-full grid mx-auto place-items-center grid-cols-1 lg:grid-cols-2 min-[115rem]:grid-cols-4">
					{topRatedPerSeason.map((item, index) => (
						<div key={index} className="flex h-full w-full flex-col gap-3 px-3 max-w-[28rem]">
							<div className="flex mx-auto w-full text-center p-2 rounded-xl bg-card-inner border border-card-inner-border">
								<h1 className="w-full text-xl font-semibold text-center">{item?.season}</h1>
							</div>
							<div className="flex pb-3 flex-1 justify-center">
								<AnimeCard key={index} data={item?.anime} />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}