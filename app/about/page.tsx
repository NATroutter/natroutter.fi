import type { Metadata } from "next";
import About from "@/app/about/About";
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

export default async function AboutPage() {
	const data = await getAboutPage();
	if (!data) return <ContentError location="About" />;
	return <About data={data} />;
}
