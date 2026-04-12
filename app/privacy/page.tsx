import type { Metadata } from "next";
import { Suspense } from "react";
import Privacy from "@/app/privacy/Privacy";
import PrivacySkeleton from "@/app/privacy/PrivacySkeleton";
import { ContentError } from "@/components/error";
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

async function PrivacyContent() {
	const data = await getPrivacyPage();
	if (!data) return <ContentError location="Privacy" />;
	return <Privacy data={data} />;
}

export default function PrivacyPage() {
	return (
		<Suspense fallback={<PrivacySkeleton />}>
			<PrivacyContent />
		</Suspense>
	);
}
