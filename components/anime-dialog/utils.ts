export function getTrailerEmbedUrl(embedUrl?: string | null, autoplay = false): string | undefined {
	if (!embedUrl) {
		return undefined;
	}

	try {
		const url = new URL(embedUrl);
		url.searchParams.set("autoplay", autoplay ? "1" : "0");
		return url.toString();
	} catch {
		return embedUrl;
	}
}

export function getRelationTypeBadgeStyle(type: string): string {
	switch (type.toLowerCase()) {
		case "anime":
			return "bg-sky-500/20 text-sky-200 border-sky-400/30";
		case "manga":
			return "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";
		default:
			return "bg-card text-muted border-card-inner-border";
	}
}
