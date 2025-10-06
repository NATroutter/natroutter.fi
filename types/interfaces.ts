//*************************************
//*             Components            *
//*************************************
export interface LinkData {
	id: string;
	name: string;
	display_name: string;
	image: string;
	icon: string;
	description: string;
	url: string;
}

export interface ProjectData {
	id: string;
	image: string;
	name: string;
	description: string;
	title: string;
	content: string;
	github: string;
	links: string[];
	priority: number;
	expand: ExpandLinks;
}

export interface FooterData {
	contact: string[];
	quick: string[];
	social: string[];
	about_me: string;
	copyright: string;
	expand: ExpandFooter;
}

//*************************************
//*              Page Data            *
//*************************************
export interface HomePage {
	id: string;
	username: string;
	intro: string;
	what_am_i: string;
	links: string[];
	expand: ExpandLinks;
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
	description: string;
	links: string[];
	priority: number;
	expand: ExpandLinks;
}
export interface ProjectPage {
	id: string;
	title: string;
	description: string;
	projects: string[];
	expand: ExpandProjects;
}

export interface PrivacyPage {
	id: string;
	title: string;
	privacy: string;
	updated: Date;
	effective: Date;
}

//*************************************
//*             Expansions            *
//*************************************
export interface ExpandLinks {
	links: LinkData[];
}
export interface ExpandProjects {
	projects: ProjectData[];
}
export interface ExpandFooter {
	contact: LinkData[];
	social: LinkData[];
	quick: LinkData[];
}
