import type { Metadata } from "next";
import Links from "@/app/links/Links";
import { ContentError } from "@/components/error";
import { getLinkPage } from "@/lib/database";

export const metadata: Metadata = {
	title: "Links",
	description:
		"Find all my important links in one place! Explore my social media, gaming profiles, and other resources to stay connected and discover more about what I do.",
	openGraph: {
		description:
			"Find all my important links in one place! Explore my social media, gaming profiles, and other resources to stay connected and discover more about what I do.",
	},
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function LinksPage() {
	const data = await getLinkPage();
	if (!data) return <ContentError location="Links" />;
	return <Links data={data} />;
}
