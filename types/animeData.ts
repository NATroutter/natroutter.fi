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
	dubbed?: boolean;
	jikan_data?: JikanAnimeFull;
	jikan_data_fetched_at?: string;
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

export interface AnimeCharacterData {
	data: AnimeCharacterEntry[];
}

export interface AnimeRelationImage {
	id: number;
	type: string;
	image_url?: string;
	source?: "jikan_data" | "data" | "jikan_api";
}

export interface AnimeRelationImagesResponse {
	data: Record<string, AnimeRelationImage>;
}

export interface AnimeCharacterListData {
	data: AnimeCharacterListEntry[];
}

export interface AnimeCharacterListEntry {
	character: AnimeCharacter;
	role: string;
	favorites: number;
	voice_actors: AnimeVoiceActor[];
}

export interface AnimeCharacterRecord {
	id: string;
	character_id: number;
	data: AnimeCharacterFull;
	fetched_at: string;
}

export type AnimeCharactersByAnimeId = Record<number, AnimeCharacterData>;

export interface AnimeSeriesRecord {
	anime_id: number;
	title?: string;
	data?: AnimeInfo;
	list_status?: ListStatus;
	list_status_synced_at?: string;
	dubbed?: boolean;
	jikan_data?: JikanAnimeFull;
	jikan_data_fetched_at?: string;
	characters?: string[];
	character_meta?: AnimeSeriesCharacterMetaById;
	fetched_at: string;
	expand?: {
		characters?: AnimeCharacterRecord[];
	};
}

export interface JikanAnimeFull {
	mal_id: number;
	url: string;
	images: JikanImages;
	trailer: JikanTrailer;
	approved: boolean;
	titles: JikanTitle[];
	title: string;
	title_english: string | null;
	title_japanese: string | null;
	title_synonyms: string[];
	type: string | null;
	source: string | null;
	episodes: number | null;
	status: string | null;
	airing: boolean;
	aired: JikanAired;
	duration: string | null;
	rating: string | null;
	score: number | null;
	scored_by: number | null;
	rank: number | null;
	popularity: number | null;
	members: number | null;
	favorites: number | null;
	synopsis: string | null;
	background: string | null;
	season: string | null;
	year: number | null;
	broadcast: JikanBroadcast;
	producers: JikanMalResource[];
	licensors: JikanMalResource[];
	studios: JikanMalResource[];
	genres: JikanMalResource[];
	explicit_genres: JikanMalResource[];
	themes: JikanMalResource[];
	demographics: JikanMalResource[];
	relations: JikanAnimeRelation[];
	theme: JikanAnimeTheme;
	external: JikanExternalLink[];
	streaming: JikanExternalLink[];
}

export interface JikanImages {
	jpg: JikanImageSet;
	webp: JikanImageSet;
}

export interface JikanImageSet {
	image_url: string | null;
	small_image_url: string | null;
	large_image_url: string | null;
}

export interface JikanTrailer {
	youtube_id: string | null;
	url: string | null;
	embed_url: string | null;
	images: {
		image_url: string | null;
		small_image_url: string | null;
		medium_image_url: string | null;
		large_image_url: string | null;
		maximum_image_url: string | null;
	};
}

export interface JikanTitle {
	type: string;
	title: string;
}

export interface JikanAired {
	from: string | null;
	to: string | null;
	prop: {
		from: JikanDateParts;
		to: JikanDateParts;
	};
	string: string;
}

export interface JikanDateParts {
	day: number | null;
	month: number | null;
	year: number | null;
}

export interface JikanBroadcast {
	day: string | null;
	time: string | null;
	timezone: string | null;
	string: string | null;
}

export interface JikanMalResource {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

export interface JikanAnimeRelation {
	relation: string;
	entry: JikanMalResource[];
}

export interface JikanAnimeTheme {
	openings: string[];
	endings: string[];
}

export interface JikanExternalLink {
	name: string;
	url: string;
}

export type AnimeSeriesCharacterMetaById = Record<number, AnimeSeriesCharacterMeta>;

export interface AnimeSeriesCharacterMeta {
	role: string;
	favorites: number;
}

export interface AnimeCharacterEntry {
	character: AnimeCharacterFull;
	role: string;
	favorites: number;
}

export interface AnimeCharacter {
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

export interface AnimeCharacterFull extends AnimeCharacter {
	name_kanji: string | null;
	nicknames: string[];
	favorites: number;
	about: string | null;
	anime: {
		role: string;
		anime: AnimeCharacterRelatedMedia;
	}[];
	manga: {
		role: string;
		manga: AnimeCharacterRelatedMedia;
	}[];
	voices: AnimeVoiceActor[];
}

export interface AnimeCharacterRelatedMedia {
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
}

export interface AnimeVoiceActor {
	person: {
		mal_id: number;
		url: string;
		images: {
			jpg: {
				image_url: string;
			};
		};
		name: string;
	};
	language: string;
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
