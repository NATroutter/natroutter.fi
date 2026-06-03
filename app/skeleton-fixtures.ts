import type {
	AnimeCharactersByAnimeId,
	AnimeEntry,
	AnimeFavoritesData,
	AnimeHistoryUpdate,
	AnimeWatchStatus,
} from "@/types/animeData";
import type { AboutPage, FooterData, HomePage, LinkData, LinkPage, PrivacyPage, ProjectPage } from "@/types/interfaces";

const image = "/images/logo.png";

const link = (id: string, name: string): LinkData => ({
	id,
	name,
	display_name: name,
	image,
	icon: "SiGithub",
	description: "Representative loading content for the generated skeleton layout.",
	url: "https://example.com",
});

export const homeFixture: HomePage = {
	id: "home-fixture",
	username: "NATroutter",
	intro:
		"I build useful software, explore new tools, and keep a small corner of the internet for projects, notes, and experiments.",
	what_am_i: "Fullstack Developer,Designer,Anime Enjoyer",
	links: ["github", "discord", "mail", "website"],
	expand: {
		links: [
			link("home-github", "GitHub"),
			link("home-discord", "Discord"),
			link("home-mail", "Email"),
			link("home-web", "Website"),
		],
	},
};

export const aboutFixture: AboutPage = {
	id: "about-fixture",
	image,
	about_title: "About Me",
	about:
		"I am a developer from Finland who likes building practical web apps, backend services, and small experiments.\n\nI enjoy learning how systems fit together and turning rough ideas into polished tools.",
	skills_title: "Skills",
	skills:
		"- TypeScript and React\n- Next.js applications\n- Backend APIs and databases\n- Linux, Docker, and deployment workflows",
	birthday: new Date("2000-01-01"),
};

export const projectFixture: ProjectPage = {
	id: "projects-fixture",
	title: "Projects",
	description: "A selected collection of software projects, experiments, and tools I have worked on.",
	projects: ["project-1", "project-2", "project-3", "project-4", "project-5", "project-6"],
	expand: {
		projects: Array.from({ length: 6 }, (_, index) => ({
			id: `project-${index + 1}`,
			image,
			name: `Project ${index + 1}`,
			description: "A compact project summary that spans enough text for the card layout.",
			title: `Project ${index + 1}`,
			content: "Project details for the dialog fixture.",
			github: "https://example.com",
			links: [],
			priority: index,
			expand: { links: [] },
		})),
	},
};

export const linksFixture: LinkPage[] = Array.from({ length: 3 }, (_, index) => ({
	id: `link-page-${index + 1}`,
	title: ["Social", "Code", "Profiles"][index],
	description: "Useful places to find me and my work online.",
	links: ["one", "two", "three"],
	priority: index,
	expand: {
		links: Array.from({ length: 3 }, (_, linkIndex) =>
			link(`link-${index + 1}-${linkIndex + 1}`, `Link ${linkIndex + 1}`),
		),
	},
}));

export const privacyFixture: PrivacyPage = {
	id: "privacy-fixture",
	title: "Privacy Policy",
	effective: new Date("2026-01-01"),
	updated: new Date("2026-06-01"),
	privacy:
		"## Information\nThis page explains what data is collected and why.\n\n## Analytics\nMinimal analytics may be used to understand visits.\n\n## Contact\nReach out if you have privacy questions.",
};

const animeStatuses: AnimeWatchStatus[] = ["completed", "watching", "plan_to_watch", "on_hold", "dropped"];

export const animeFixture: AnimeEntry[] = Array.from({ length: 36 }, (_, index) => ({
	node: {
		id: index + 1,
		title: `Fixture Anime ${index + 1}`,
		main_picture: { medium: image, large: image },
		rank: index + 10,
		rating: "pg_13",
		status: index % 4 === 0 ? "currently_airing" : "finished_airing",
		nsfw: "white",
		average_episode_duration: 24 * 60,
		popularity: index + 100,
		num_episodes: 12 + (index % 12),
		num_scoring_users: 12000 + index * 250,
		media_type: index % 5 === 0 ? "movie" : "tv",
		start_date: `202${index % 5}-04-01`,
		end_date: `202${index % 5}-06-24`,
		mean: 7.2 + (index % 18) / 10,
		source: index % 3 === 0 ? "original" : "manga",
		genres: [
			{ id: 1, name: "Action" },
			{ id: 2, name: "Drama" },
			{ id: 3, name: "Fantasy" },
		],
		alternative_titles: { synonyms: [], en: `Fixture Anime ${index + 1}`, ja: "" },
		synopsis: "A representative anime synopsis for layout generation.",
		studios: [{ id: 1, name: "Studio Fixture" }],
	},
	list_status: {
		status: animeStatuses[index % animeStatuses.length],
		score: 6 + (index % 5),
		num_episodes_watched: 8 + (index % 12),
		is_rewatching: false,
		updated_at: "2026-01-01T00:00:00Z",
		tags: [],
	},
}));

export const animeCharactersFixture: AnimeCharactersByAnimeId = animeFixture.reduce<AnimeCharactersByAnimeId>(
	(acc, entry, index) => {
		acc[entry.node.id] = {
			data: [
				{
					character: {
						mal_id: index + 1000,
						name: `Character ${index + 1}A`,
						name_kanji: null,
						nicknames: [],
						url: "https://example.com",
						images: {
							jpg: { image_url: image },
							webp: { image_url: image, small_image_url: image },
						},
						favorites: 100 + index,
						about: "A representative character biography for layout generation.",
						anime: [],
						manga: [],
						voices: [
							{
								person: {
									mal_id: index + 3000,
									url: "https://example.com",
									images: { jpg: { image_url: image } },
									name: `Voice Actor ${index + 1}A`,
								},
								language: "Japanese",
							},
						],
					},
					role: "Main",
					favorites: 100 + index,
				},
				{
					character: {
						mal_id: index + 2000,
						name: `Character ${index + 1}B`,
						name_kanji: null,
						nicknames: [],
						url: "https://example.com",
						images: {
							jpg: { image_url: image },
							webp: { image_url: image, small_image_url: image },
						},
						favorites: 20 + index,
						about: "A representative supporting character biography.",
						anime: [],
						manga: [],
						voices: [
							{
								person: {
									mal_id: index + 4000,
									url: "https://example.com",
									images: { jpg: { image_url: image } },
									name: `Voice Actor ${index + 1}B`,
								},
								language: "English",
							},
						],
					},
					role: "Supporting",
					favorites: 20 + index,
				},
			],
		};

		return acc;
	},
	{},
);

export const animeHistoryFixture: AnimeHistoryUpdate[] = Array.from({ length: 12 }, (_, index) => ({
	id: `history-${index + 1}`,
	date: `2026-${String((index % 12) + 1).padStart(2, "0")}-01`,
	updates: [
		{ id: index + 1, title: `Fixture Anime ${index + 1}`, episodes: 1 + (index % 3) },
		{ id: index + 100, title: `Fixture Anime ${index + 2}`, episodes: 1 },
	],
}));

export const animeFavoritesFixture: AnimeFavoritesData = {
	data: {
		anime: animeFixture.slice(0, 8).map((entry) => ({
			mal_id: entry.node.id,
			url: "https://example.com",
			images: {
				jpg: { image_url: image, small_image_url: image, large_image_url: image },
				webp: { image_url: image, small_image_url: image, large_image_url: image },
			},
			title: entry.node.title,
			type: "TV",
			start_year: 2026,
		})),
		characters: Array.from({ length: 8 }, (_, index) => ({
			mal_id: index + 1,
			url: "https://example.com",
			images: {
				jpg: { image_url: image },
				webp: { image_url: image, small_image_url: image },
			},
			name: `Character ${index + 1}`,
		})),
	},
};

export const footerFixture: FooterData = {
	contact: [],
	quick: [],
	social: [],
	about_me: "A short footer bio with enough text to establish the real footer layout.",
	copyright: "Copyright {year} NATroutter",
	expand: {
		contact: [link("footer-mail", "Email"), link("footer-discord", "Discord")],
		quick: [link("footer-home", "Home"), link("footer-projects", "Projects")],
		social: [link("footer-github", "GitHub"), link("footer-twitter", "Twitter")],
	},
};
