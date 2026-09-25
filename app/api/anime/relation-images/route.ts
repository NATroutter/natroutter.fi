import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { config } from "@/lib/config";
import logger from "@/lib/logger";
import type {
	AnimeRelationImage,
	AnimeRelationImagesResponse,
	AnimeSeriesRecord,
	JikanAnimeFull,
	JikanImages,
} from "@/types/animeData";

const MAX_RELATION_IMAGE_ITEMS = 20;
const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

interface RelationImageItem {
	id: number;
	type: string;
}

function getRelationImageKey(item: RelationImageItem): string {
	return `${item.type.toLowerCase()}:${item.id}`;
}

function getJikanImage(images?: JikanImages): string | undefined {
	return (
		images?.webp?.large_image_url ||
		images?.jpg?.large_image_url ||
		images?.webp?.image_url ||
		images?.jpg?.image_url ||
		undefined
	);
}

function getJikanAnimeImage(jikanData?: JikanAnimeFull): string | undefined {
	return getJikanImage(jikanData?.images);
}

function getMalAnimeImage(data?: AnimeSeriesRecord["data"]): string | undefined {
	return data?.main_picture?.large || data?.main_picture?.medium || undefined;
}

async function getJikanRelationImageById(item: RelationImageItem): Promise<string | undefined> {
	const type = item.type.toLowerCase();
	if (type !== "anime" && type !== "manga") {
		return undefined;
	}

	try {
		const response = await fetch(`${JIKAN_BASE_URL}/${type}/${item.id}/pictures`, {
			headers: {
				accept: "application/json",
			},
			next: {
				revalidate: 60 * 60 * 24,
			},
		});

		if (!response.ok) {
			return undefined;
		}

		const payload = (await response.json()) as { data?: JikanImages[] };
		return getJikanImage(payload.data?.[0]);
	} catch (err) {
		logger.error(`[Jikan] Failed to fetch relation image for ${type} ${item.id}: ${err}`);
		return undefined;
	}
}

function parseRelationImageItems(req: NextRequest): RelationImageItem[] {
	const typedItems = (req.nextUrl.searchParams.get("items") ?? "")
		.split(",")
		.map((item) => {
			const [rawType, rawId] = item.split(":");
			const type = rawType?.trim().toLowerCase();
			const id = Number(rawId?.trim());

			if (!type || !Number.isInteger(id) || id <= 0) {
				return undefined;
			}

			return { id, type };
		})
		.filter((item): item is RelationImageItem => item !== undefined);

	if (typedItems.length > 0) {
		return Array.from(new Map(typedItems.map((item) => [getRelationImageKey(item), item])).values()).slice(
			0,
			MAX_RELATION_IMAGE_ITEMS,
		);
	}

	return (req.nextUrl.searchParams.get("ids") ?? "")
		.split(",")
		.map((id) => Number(id.trim()))
		.filter((id) => Number.isInteger(id) && id > 0)
		.map((id) => ({ id, type: "anime" }))
		.slice(0, MAX_RELATION_IMAGE_ITEMS);
}

async function getRelationImagesByItems(items: RelationImageItem[]): Promise<Record<string, AnimeRelationImage>> {
	if (items.length === 0) {
		return {};
	}

	const images: Record<string, AnimeRelationImage> = {};
	const animeItems = items.filter((item) => item.type.toLowerCase() === "anime");
	const uniqueAnimeIds = Array.from(new Set(animeItems.map((item) => item.id)));

	if (uniqueAnimeIds.length > 0) {
		try {
			const pb = new PocketBase(config.POCKETBASE.SERVER);
			const filter = uniqueAnimeIds.map((animeId) => `anime_id = ${animeId}`).join(" || ");
			const records = await pb.collection("anime_series").getFullList<AnimeSeriesRecord>({
				filter,
				fields: "anime_id,data,jikan_data",
			});

			for (const record of records) {
				const key = getRelationImageKey({ id: record.anime_id, type: "anime" });
				const jikanImage = getJikanAnimeImage(record.jikan_data);
				if (jikanImage) {
					images[key] = {
						id: record.anime_id,
						type: "anime",
						image_url: jikanImage,
						source: "jikan_data",
					};
					continue;
				}

				const malImage = getMalAnimeImage(record.data);
				if (malImage) {
					images[key] = {
						id: record.anime_id,
						type: "anime",
						image_url: malImage,
						source: "data",
					};
				}
			}
		} catch (err) {
			logger.error(`[PocketBase] Failed to fetch relation images from AnimeSeries: ${err}`);
		}
	}

	for (const item of items) {
		const key = getRelationImageKey(item);
		if (images[key]?.image_url) {
			continue;
		}

		const jikanImage = await getJikanRelationImageById(item);
		if (jikanImage) {
			images[key] = {
				id: item.id,
				type: item.type,
				image_url: jikanImage,
				source: "jikan_api",
			};
		}
	}

	return images;
}

export async function GET(req: NextRequest) {
	const items = parseRelationImageItems(req);

	if (items.length === 0) {
		return Response.json({ data: {} } satisfies AnimeRelationImagesResponse);
	}

	const images = await getRelationImagesByItems(items);

	return Response.json({ data: images } satisfies AnimeRelationImagesResponse, {
		headers: {
			"Cache-Control": "private, max-age=300",
			"X-Robots-Tag": "noindex",
		},
	});
}
