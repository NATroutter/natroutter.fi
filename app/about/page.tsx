import type { Metadata } from "next";
import { Suspense } from "react";
import About from "@/app/about/About";
import AboutSkeleton from "@/app/about/AboutSkeleton";
import { ContentError } from "@/components/error";
import { getAboutPage } from "@/lib/database";

export const metadata: Metadata = {
	title: "About Me",
	description:
		"Discover NATroutter, a programmer from Finland, passionate about backend development and exploring new technologies.",
	openGraph: {
		description:
			"Discover NATroutter, a programmer from Finland, passionate about backend development and exploring new technologies.",
	},
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

async function AboutContent() {
	const data = await getAboutPage();
	if (!data) return <ContentError location="About" />;
	return <About data={data} />;
}

export default function AboutPage() {
	return (
		<Suspense fallback={<AboutSkeleton />}>
			<AboutContent />
		</Suspense>
	);
}
