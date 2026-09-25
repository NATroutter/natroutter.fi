import type { NextRequest } from "next/server";
import { getAnimeCharactersByAnimeId } from "@/lib/database";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ animeId: string }> }) {
	const { animeId } = await params;
	const parsedAnimeId = Number(animeId);
	if (!Number.isInteger(parsedAnimeId) || parsedAnimeId <= 0) {
		return Response.json({ error: "Invalid anime id" }, { status: 400 });
	}

	const characterData = await getAnimeCharactersByAnimeId(parsedAnimeId);

	if (!characterData) {
		return Response.json({ data: [] });
	}

	return Response.json(characterData, {
		headers: {
			"Cache-Control": "private, max-age=120",
			"X-Robots-Tag": "noindex",
		},
	});
}
