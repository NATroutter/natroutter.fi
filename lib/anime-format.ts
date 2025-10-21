import type { AnimeAgeRating, AnimeSource, AnimeStatus, AnimeWatchStatus } from "@/types/animeData";

const ANIME_WATCH_STATUES: Record<AnimeWatchStatus, string> = {
	plan_to_watch: "Plan To Watch",
	watching: "Watching",
	completed: "Completed",
	on_hold: "On Hold",
	dropped: "Dropped",
};

const ANIME_STATUES: Record<AnimeStatus, { name: string; style: string }> = {
	currently_airing: { name: "Currently Airing", style: "text-currently-airing" },
	finished_airing: { name: "Finished Airing", style: "text-finished-airing" },
	not_yet_aired: { name: "Not Yet Aired", style: "text-not-yet-aired" },
};

const ANIME_AGE_RATINGS: Record<AnimeAgeRating, { full: string; short: string }> = {
	g: { full: "All Ages", short: "G" },
	pg: { full: "Children", short: "PG" },
	pg_13: { full: "Teens 13 and Older", short: "PG-13" },
	r: { full: "17+ (violence & profanity)", short: "R" },
	"r+": { full: "Profanity & Mild Nudity", short: "R+" },
	rx: { full: "Hentai", short: "RX" },
};

const ANIME_SCORES: Record<number, string> = {
	0: "Unknown",
	1: "Appalling",
	2: "Horrible",
	3: "Very Bad",
	4: "Bad",
	5: "Average",
	6: "Fine",
	7: "Good",
	8: "Very Good",
	9: "Great",
	10: "Masterpiece",
};

//Formatters
export function formatAnimeWatchStatus(status: string | AnimeWatchStatus): string {
	return ANIME_WATCH_STATUES[status as AnimeWatchStatus];
}
export function formatAnimeAgeRating(rating: string | AnimeAgeRating, fullRating: boolean = false): string {
	return fullRating
		? ANIME_AGE_RATINGS[rating as AnimeAgeRating].full
		: ANIME_AGE_RATINGS[rating as AnimeAgeRating].short;
}
export function formatAnimeScore(rating: number): string {
	return ANIME_SCORES[rating];
}
export function formatAnimeStatus(status: string | AnimeStatus): string {
	return ANIME_STATUES[status as AnimeStatus].name;
}

//Getters
export function getStatusStyle(status: string | AnimeStatus): string {
	return ANIME_STATUES[status as AnimeStatus].style;
}
export function getWatchStatues(): string[] {
	return Object.entries(ANIME_WATCH_STATUES).map(([value]) => value);
}

export function formatAnime(source: AnimeSource): string {
	return source
		.toString()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}
