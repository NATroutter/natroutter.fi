import type { Metadata } from "next";
import Projects from "@/app/projects/Projects";
import { ContentError } from "@/components/error";
import { getProjectsPage } from "@/lib/database";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"Explore my top projects! Discover a showcase of my best work with detailed info, links, and insights into the creative and technical processes behind each project.",
	openGraph: {
		description:
			"Explore my top projects! Discover a showcase of my best work with detailed info, links, and insights into the creative and technical processes behind each project.",
	},
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function ProjectsPage() {
	const data = await getProjectsPage();
	if (!data) return <ContentError location="Projects" />;

	return <Projects data={data} />;
}
