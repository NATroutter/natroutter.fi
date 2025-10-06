import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getHostname(rawURI: string | undefined): string {
	const uri = new URL(rawURI as string);
	return uri.hostname as string;
}
export function getProtocol(
	rawURI: string | undefined,
): "http" | "https" | undefined {
	const uri = new URL(rawURI as string);
	return uri.protocol.slice(0, -1) as "http" | "https" | undefined;
}
export function toCapitalizedCase(input: string): string {
	return input
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

export function formatDate(rawDate: string | Date): string {
	const date = new Date(rawDate);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
