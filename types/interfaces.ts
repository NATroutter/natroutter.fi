export interface LinkData {
	id: string;
	image: string;
	icon: string;
	name: string;
	description: string;
	url: string;
	type: 'dev' | 'social' | 'games' | 'projects' | 'other';
	priority: number;
	active: boolean;
}

export interface AboutData {
	id: string;
	image: string;
	about: string;
	skills: string;
	languages: string;
	favourite_shows: string;
	favourite_games: string;
	programing_langs: string;
	frameworks: string;
	databases: string;
	birthday: Date;
}

export interface NavData {
	icon: string;
	name: string;
	link: string;
	priority: number;
}

export interface FooterData {
	links: LinkData[];
	copyright: string;
	expand: expandFooter;
}

export interface expandFooter {
	links: LinkData[];
}