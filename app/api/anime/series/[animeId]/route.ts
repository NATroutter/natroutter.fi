import type { NextRequest } from "next/server";
import { getAnimeEntryByAnimeId } from "@/lib/database";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ animeId: string }> }) {
	const { animeId } = await params;
	const parsedAnimeId = Number(animeId);
	if (!Number.isInteger(parsedAnimeId) || parsedAnimeId <= 0) {
		return Response.json({ error: "Invalid anime id" }, { status: 400 });
	}

	const anime = await getAnimeEntryByAnimeId(parsedAnimeId);
	if (!anime) {
		return Response.json({ error: "Anime not found" }, { status: 404 });
	}

	return Response.json(anime, {
		headers: {
			"Cache-Control": "private, max-age=120",
			"X-Robots-Tag": "noindex",
		},
	});
}
