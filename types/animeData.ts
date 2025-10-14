export interface AnimeMainPicture {
	medium: string;
	large: string;
}

export interface AnimeAlternativeTitles {
	synonyms: string[];
	en: string;
	ja: string;
}

export interface AnimeInfo {
	id: number;
	title: string;
	main_picture: AnimeMainPicture;
	rank: number;
	rating: AnimeAgeRating;
	status: AnimeStatus;
	nsfw: "white" | "gray" | "black";
	average_episode_duration: number;
	popularity: number;
	num_episodes: number;
	num_scoring_users: number;
	media_type: AnimeMediaType;
	start_date: string;
	end_date: string;
	mean: number;
	source: AnimeSource;
	genres: AnimeGenre[];
	alternative_titles: AnimeAlternativeTitles;
	synopsis: string;
	studios: AnimeStudio[];
}

export interface AnimeGenre {
	id: number;
	name: string;
}
export interface AnimeStudio {
	id: number;
	name: string;
}
export type AnimeMediaType = "tv" | "ova" | "movie" | "special" | "tv_special" | "ona" | "music" | "unknown";
export type AnimeWatchStatus = "plan_to_watch" | "watching" | "completed" | "on_hold" | "dropped";
export type AnimeSource =
	| "original"
	| "manga"
	| "4_koma_manga"
	| "web_manga"
	| "digital_manga"
	| "novel"
	| "light_novel"
	| "visual_novel"
	| "game"
	| "card_game"
	| "book"
	| "picture_book"
	| "radio"
	| "music"
	| "other";
export type AnimeStatus = "finished_airing" | "currently_airing" | "not_yet_aired";
export type AnimeAgeRating = "g" | "pg" | "pg_13" | "r" | "r+" | "rx";

export interface ListStatus {
	status: AnimeWatchStatus;
	score: number;
	num_episodes_watched: number;
	is_rewatching: boolean;
	updated_at: string;
	tags: string[];
}

export interface AnimeEntry {
	node: AnimeInfo;
	list_status: ListStatus;
}

export interface AnimePaging {
	next: string;
}

export interface AnimeData {
	data: AnimeEntry[];
	paging: AnimePaging;
}

export interface AnimeHistoryEntry {
	id: number;
	title: string;
	episodes: number;
}

export interface AnimeHistoryUpdate {
	id: string;
	date: string;
	updates: AnimeHistoryEntry[];
}

export interface SavedAnimeHistory {
	data: AnimeHistoryUpdate[];
}

export interface AnimeFavoritesData {
	data: {
		anime: AnimeFaveAnime[];
		characters: AnimeFaveCharacters[];
	};
}

export interface AnimeHistoryResponse {
	data: {
		entry: {
			mal_id: number;
			type: string;
			name: string;
			url: string;
		};
		increment: number;
		date: string;
	}[];
}

export interface AnimeFaveAnime {
	mal_id: number;
	url: string;
	images: {
		jpg: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
		webp: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
	};
	title: string;
	type: string;
	start_year: number;
}

export interface AnimeFaveCharacters {
	mal_id: number;
	url: string;
	images: {
		jpg: {
			image_url: string;
		};
		webp: {
			image_url: string;
			small_image_url: string;
		};
	};
	name: string;
}
