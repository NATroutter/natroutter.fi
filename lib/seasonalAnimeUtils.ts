import { AnimeEntry } from "@/types/animeData"

export type Season = "Winter" | "Spring" | "Summer" | "Fall"

interface SeasonalAnime {
	season: Season
	year: number
	anime: AnimeEntry
}

/**
 * Determines the season based on a month (0-11)
 */
function getSeasonFromMonth(month: number): Season {
	if (month >= 0 && month <= 2) return "Winter"      // Jan, Feb, Mar
	if (month >= 3 && month <= 5) return "Spring"      // Apr, May, Jun
	if (month >= 6 && month <= 8) return "Summer"      // Jul, Aug, Sep
	return "Fall"                                       // Oct, Nov, Dec
}

/**
 * Gets the top rated anime for each season
 * @param chartData - Array of anime entries
 * @param selectedYear - Year to filter by, or "all" for all years
 * @returns Array of top rated anime per season (always returns 4 items, null for missing seasons)
 */
export function getTopRatedAnimePerSeason(
	chartData: AnimeEntry[],
	selectedYear: string
): (SeasonalAnime | null)[] {
	const isAllYears = selectedYear === "all"
	const year = Number(selectedYear)

	// Group anime by season (and year if needed)
	const seasonMap = new Map<string, AnimeEntry[]>()

	for (const entry of chartData) {
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
			topRatedPerSeason.push(null)
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

	return topRatedPerSeason
}

/**
 * Gets all anime grouped by season
 * @param chartData - Array of anime entries
 * @param selectedYear - Year to filter by, or "all" for all years
 * @returns Map of season keys to anime arrays
 */
export function getAnimeGroupedBySeason(
	chartData: AnimeEntry[],
	selectedYear: string
): Map<string, { season: Season; year: number; anime: AnimeEntry[] }> {
	const isAllYears = selectedYear === "all"
	const year = Number(selectedYear)

	const seasonMap = new Map<string, { season: Season; year: number; anime: AnimeEntry[] }>()

	for (const entry of chartData) {
		const updatedAt = entry.list_status?.updated_at
		if (!updatedAt) continue

		const date = new Date(updatedAt)
		const entryYear = date.getFullYear()

		if (!isAllYears && entryYear !== year) continue

		const season = getSeasonFromMonth(date.getMonth())
		const key = `${season}-${entryYear}`

		if (!seasonMap.has(key)) {
			seasonMap.set(key, {
				season,
				year: entryYear,
				anime: [],
			})
		}
		seasonMap.get(key)!.anime.push(entry)
	}

	return seasonMap
}