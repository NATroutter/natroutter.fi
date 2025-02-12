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
	mean: number;
	alternative_titles: AlternativeTitles;
	synopsis: string;
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