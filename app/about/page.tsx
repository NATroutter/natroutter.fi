import type { Metadata } from "next";
import About from "@/app/about/About";
import ServerError from "@/components/ServerError";
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
	if (!data) return <ServerError type="content" />;
	return <About data={data} />;
}
