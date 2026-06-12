"use server";

import type { AnimeFavoritesData } from "@/types/animeData";

type Endpoint = "favorites";
function getEndpoint(endpoint: Endpoint, data: string[]): string {
	const jikan = `https://api.jikan.moe/v4`;

	switch (endpoint) {
		case "favorites":
			return `${jikan}/users/${data[0]}/favorites`;
	}
}

export async function getFavorites(): Promise<AnimeFavoritesData | undefined> {
	try {
		const response = await fetch(getEndpoint("favorites", ["NATroutter"]), {
			method: "GET",
		});
		if (!response.ok) {
			console.error(`Failed to fetch anime data from jikan.moe : (${response.status}) ${response.statusText}`);
			return undefined;
		}
		const json = await response.json();
		return json as AnimeFavoritesData;
	} catch (err) {
		console.error("Failed to fetch favorites:", err);
		return undefined;
	}
}
