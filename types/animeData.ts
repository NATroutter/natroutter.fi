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
	media_type: 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music' | 'unknown'
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

export interface ListStatus {
	status: 'plan_to_watch' | 'watching' | 'completed' | 'on_hold' | 'dropped';
	score: number;
	num_episodes_watched: number;
	is_rewatching: boolean;
	updated_at: string;
	tags: string[];
}

export interface AnimeData {
	node: Node;
	list_status: ListStatus;
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