//*************************************
//*             Components            *
//*************************************
export interface LinkData {
	id: string;
	display_name: string;
	image: string;
	icon: string;
	description: string;
	url: string;
}
export interface TextData {
	id: string;
	content: string;
}

export interface NavData {
	icon: string;
	name: string;
	url: string;
	priority: number;
}

export interface FooterData {
	contact: string[];
	quick: string[];
	social: string[];
	about_me: string;
	copyright: string;
	expand: expandFooter;
}

//*************************************
//*              Page Data            *
//*************************************
export interface HomePage {
	id: string;
	username: string;
	intro: string;
	what_am_i:string;
	links: string[];
	expand: expandLinks;
}

export interface AboutPage {
	id: string;
	image: string;
	about_title: string;
	about: string;
	skills_title: string;
	skills: string;
	birthday: Date;
}
export interface LinkPage {
	id: string;
	title: string;
	category: 'dev' | 'social' | 'games' | 'projects' | 'other';
	links: string[];
	priority: number;
	expand: expandLinks;
}
export interface ProjectPage {
	id: string;
	image: string;
	name: string;
	description: string;
	github: string;
	links: string[]
	expand: expandLinks;
}

export interface PrivacyPage {
	id: string;
	title: string;
	privacy: string;
	updated: Date;
	effective: Date
}


//*************************************
//*             Expansions            *
//*************************************
export interface expandLinks {
	links: LinkData[];
}
export interface expandFooter {
	contact: LinkData[];
	quick: NavData[];
	social: LinkData[];
}