"use server";

import PocketBase from "pocketbase";
import { config } from "@/lib/config";
import logger from "@/lib/logger";
import type {
	AnimeCharacterData,
	AnimeCharactersByAnimeId,
	AnimeHistoryEntry,
	AnimeHistoryResponse,
	AnimeHistoryUpdate,
	AnimeSeriesRecord,
} from "@/types/animeData";
import type { AboutPage, FooterData, HomePage, LinkPage, PrivacyPage, ProjectPage } from "@/types/interfaces";

function getFileURL(collection: string, id: string, file: string): string {
	return `${config.POCKETBASE.PUBLIC}/api/files/${collection}/${id}/${file}`;
}
function getPocketBase(): PocketBase {
	return new PocketBase(config.POCKETBASE.SERVER);
}

export async function getHomePage(): Promise<HomePage | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("page_home").getFirstListItem<HomePage>("", {
			expand: "links",
		});
		if (!data) return undefined;
		data.expand.links.map((link) => {
			link.image = getFileURL("links", link.id, link.image);
			return link;
		});
		return data;
	} catch (err) {
		return handlePocketBaseError(err, "Failed to fetch data for HomePage");
	}
}

export async function getAboutPage(): Promise<AboutPage | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("page_about").getFirstListItem<AboutPage>("");
		if (!data) return undefined;
		data.image = getFileURL("page_about", data.id, data.image);
		return data;
	} catch (err) {
		return handlePocketBaseError(err, "Failed to fetch data for AboutPage");
	}
}

export async function getLinkPage(): Promise<LinkPage[] | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("page_links").getFullList<LinkPage>({
			expand: "links",
			sort: "-priority",
		});
		if (!data) return undefined;
		data.map((entry) =>
			entry.expand.links.map((link) => {
				link.image = getFileURL("links", link.id, link.image);
				return link;
			}),
		);
		return data;
	} catch (err) {
		return handlePocketBaseError(err, "Failed to fetch data for LinkPage");
	}
}

export async function getProjectsPage(): Promise<ProjectPage | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("page_projects").getFirstListItem<ProjectPage>("", {
			expand: "projects.links",
		});
		if (!data) return undefined;

		data.expand.projects.map((entry) => {
			entry.image = getFileURL("projects", entry.id, entry.image);
			if (entry.expand.links) {
				entry.expand.links.map((link) => {
					link.image = getFileURL("links", link.id, link.image);
					return link;
				});
			}
			return entry;
		});
		return data;
	} catch (err: unknown) {
		return handlePocketBaseError(err, "Failed to fetch data for ProjectPage");
	}
}

export async function getPrivacyPage(): Promise<PrivacyPage | undefined> {
	try {
		const pb = getPocketBase();
		return await pb.collection("page_privacy").getFirstListItem<PrivacyPage>("");
	} catch (err) {
		return handlePocketBaseError(err, "Failed to fetch data for PrivacyPage");
	}
}

export async function getFooterData(): Promise<FooterData | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("footer").getFirstListItem<FooterData>("", {
			expand: "contact,quick,social",
		});
		if (!data) return undefined;
		data.expand.contact.map((link) => {
			link.image = getFileURL("links", link.id, link.image);
			return link;
		});
		data.expand.quick.map((link) => {
			link.image = getFileURL("links", link.id, link.image);
			return link;
		});
		data.expand.social.map((link) => {
			link.image = getFileURL("links", link.id, link.image);
			return link;
		});
		return data;
	} catch (err) {
		return handlePocketBaseError(err, "Failed to fetch data for Footer");
	}
}

//***************************************
//*         ANIME HISTORY               *
//***************************************
export async function getHistory(): Promise<AnimeHistoryUpdate[]> {
	let records: { data: AnimeHistoryResponse }[] | undefined;
	try {
		const pb = getPocketBase();
		records = await pb.collection("anime_history").getFullList<{ data: AnimeHistoryResponse }>({});
	} catch (err) {
		await handlePocketBaseError(err, "Failed to fetch data for AnimeHistory");
	}

	if (!records || records.length === 0) return [];

	// Merge all snapshots, deduplicating by normalized UTC timestamp + anime ID
	// (same event can appear with different timezone offsets across snapshots)
	const seenKeys = new Set<string>();
	const allEntries: AnimeHistoryResponse["data"] = [];

	const now = Date.now();

	for (const record of records) {
		const response = record.data;
		if (!response?.data) continue;
		for (const entry of response.data) {
			if (new Date(entry.date).getTime() > now) continue;
			const key = `${entry.entry.mal_id}-${entry.increment}`;
			if (!seenKeys.has(key)) {
				seenKeys.add(key);
				allEntries.push(entry);
			}
		}
	}

	// Group by UTC date + anime, counting episodes
	const dateMap = new Map<string, Map<string, { title: string; malId: number; episodes: number }>>();

	for (const entry of allEntries) {
		const date = new Date(entry.date).toISOString().split("T")[0];
		const animeKey = `${entry.entry.mal_id}`;

		let dayMap = dateMap.get(date);
		if (!dayMap) {
			dayMap = new Map();
			dateMap.set(date, dayMap);
		}

		if (!dayMap.has(animeKey)) {
			dayMap.set(animeKey, { title: entry.entry.name, malId: entry.entry.mal_id, episodes: 0 });
		}

		const day = dayMap.get(animeKey);
		if (day) day.episodes++;
	}

	const entries: AnimeHistoryUpdate[] = [];
	let idCounter = 1;

	for (const [date, animeMap] of dateMap.entries()) {
		const updates: AnimeHistoryEntry[] = Array.from(animeMap.values()).map((anime) => ({
			id: anime.malId,
			title: anime.title,
			episodes: anime.episodes,
		}));
		entries.push({ id: String(idCounter++), date, updates });
	}

	entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return entries;
}

//***************************************
//*        ANIME CHARACTERS             *
//***************************************
export async function getAnimeSeriesCharacters(): Promise<AnimeSeriesRecord[]> {
	try {
		const pb = getPocketBase();
		return await pb.collection("anime_series").getFullList<AnimeSeriesRecord>({
			expand: "characters",
			fields:
				"anime_id,characters,character_meta,fetched_at,expand.characters.id,expand.characters.character_id,expand.characters.data",
		});
	} catch (err) {
		await handlePocketBaseError(err, "Failed to fetch data for AnimeSeriesCharacters");
		return [];
	}
}

export async function getAnimeCharactersByAnimeIdMap(): Promise<AnimeCharactersByAnimeId> {
	const seriesRecords = await getAnimeSeriesCharacters();

	return seriesRecords.reduce<AnimeCharactersByAnimeId>((acc, record) => {
		const characterMeta = record.character_meta ?? {};
		const characters = record.expand?.characters ?? [];

		const data = characters
			.map((characterRecord) => {
				const meta = characterMeta[characterRecord.character_id];
				if (!meta) return undefined;
				return {
					character: characterRecord.data,
					role: meta.role,
					favorites: meta.favorites,
				};
			})
			.filter((entry): entry is AnimeCharacterData["data"][number] => entry !== undefined);

		if (data.length > 0) {
			acc[record.anime_id] = { data };
		}

		return acc;
	}, {});
}

export async function getAnimeCharactersByAnimeId(animeId: number): Promise<AnimeCharacterData | undefined> {
	const animeCharacters = await getAnimeCharactersByAnimeIdMap();
	return animeCharacters[animeId];
}

//***************************************
//*           ERROR HANDLING            *
//***************************************
interface PocketBaseError {
	code: number;
	message: string;
}
function isPocketBaseError(err: unknown): err is { response: PocketBaseError } {
	return typeof err === "object" && err !== null && "response" in err;
}
export async function handlePocketBaseError(err: unknown, message: string) {
	if (err && isPocketBaseError(err)) {
		const data = err.response;
		const code = data.code ? ` (${data.code})` : "";
		const resp = data.message ? `: ${data.message}` : "";
		logger.error(`[PocketBase] ${message}${code}${resp} - (${process.env.POCKETBASE_ADDRESS})`);
	} else {
		logger.error(`[PocketBase] Unknown Error > ${err} - (${process.env.POCKETBASE_ADDRESS})`);
	}
	return undefined;
}
