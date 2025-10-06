import type { Metadata } from "next";
import Privacy from "@/app/privacy/Privacy";
import ServerError from "@/components/ServerError";
import { getPrivacyPage } from "@/lib/database";

export const metadata: Metadata = {
	title: "Privacy",
	description:
		"Explore my top projects! Discover a showcase of my best work with detailed info, links, and insights into the creative and technical processes behind each project.",
	openGraph: {
		description:
			"Explore my top projects! Discover a showcase of my best work with detailed info, links, and insights into the creative and technical processes behind each project.",
	},
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function PrivacyPage() {
	const data = await getPrivacyPage();
	if (!data) return <ServerError type="content" />;

	return <Privacy data={data} />;
}
