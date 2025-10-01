export interface MainPicture {
	medium: string;
	large: string;
}

export interface AlternativeTitles {
	synonyms: string[];
	en: string;
	ja: string;
}

export interface Node {
	id: number;
	title: string;
	main_picture: MainPicture;
	rank: number;
	rating: 'g' | 'pg' | 'pg_13' | 'r' | 'r+' | 'rx';
	status: 'finished_airing' | 'currently_airing' | 'not_yet_aired';
	nsfw: 'white' | 'gray' | 'black';
	average_episode_duration: number;
	popularity: number;
	num_episodes: number;
	num_scoring_users: number;
	media_type: MediaType;
	start_date: string;
	end_date: string;
	mean: number;
	source: 'original' | 'manga' | '4_koma_manga' | 'web_manga' | 'digital_manga' | 'novel' | 'light_novel' | 'visual_novel' | 'game' | 'card_game' | 'book' | 'picture_book' | 'radio' | 'music' | 'other'
	genres: Genre[];
	alternative_titles: AlternativeTitles;
	synopsis: string;
	studios: Studio[];
}

export interface Genre {
	id: number,
	name: string
}
export interface Studio {
	id: number,
	name: string
}
export type MediaType = 'tv' | 'ova' | 'movie' | 'special' | 'tv_special' | 'ona' | 'music' | 'unknown';
export type WatchStatus = 'plan_to_watch' | 'watching' | 'completed' | 'on_hold' | 'dropped';


export interface ListStatus {
	status: WatchStatus;
	score: number;
	num_episodes_watched: number;
	is_rewatching: boolean;
	updated_at: string;
	tags: string[];
}

export interface AnimeEntry {
	node: Node;
	list_status: ListStatus;
}

export interface AnimePaging {
	next: string
}

export interface AnimeData {
	data: AnimeEntry[];
	paging: AnimePaging;
}

export const WATCH_STATUS_LABELS: Record<WatchStatus, string> = {
	plan_to_watch: 'Plan To Watch',
	watching: 'Watching',
	completed: 'Completed',
	on_hold: 'On Hold',
	dropped: 'Dropped',
};

export function formatWatchStatus(status: WatchStatus): string {
	return WATCH_STATUS_LABELS[status];
}

export function formatMediaType(status: MediaType): string {
	return status.toString().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export function formatScore(rating: number) : string {
	switch (rating) {
		case 10: return "Masterpiece";
		case 9: return "Great";
		case 8: return "Very Good";
		case 7: return "Good";
		case 6: return "Fine";
		case 5: return "Average";
		case 4: return "Bad";
		case 3: return "Very Bad";
		case 2: return "Horrible";
		case 1: return "Appalling";
		case 0: return "Unknown";
		default: return rating.toString();
	}
}

export function formatType(rating: 'g' | 'pg' | 'pg_13' | 'r' | 'r+' | 'rx') : string {
	switch (rating) {
		case "g": return "All Ages";
		case "pg": return "Children";
		case "pg_13": return "Teens 13 and Older";
		case "r": return "17+ (violence & profanity)";
		case "r+": return "Profanity & Mild Nudity";
		case "rx": return "Hentai";
	}
}

export function formatRating(rating: 'g' | 'pg' | 'pg_13' | 'r' | 'r+' | 'rx') : string {
	switch (rating) {
		case "g": return "All Ages";
		case "pg": return "Children";
		case "pg_13": return "Teens 13 and Older";
		case "r": return "17+ (violence & profanity)";
		case "r+": return "Profanity & Mild Nudity";
		case "rx": return "Hentai";
	}
}