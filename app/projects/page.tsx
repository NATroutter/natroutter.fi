import {getFileURL, getProjectsPage} from "@/lib/database";
import Projects from "@/app/projects/projects";
import ContentError from "@/components/errors/ContentError";

export const metadata = {
	title: 'Projects',
	description: 'Explore my top projects! Discover a showcase of my best work with detailed info, links, and insights into the creative and technical processes behind each project.',
	openGraph: {
		description: 'Explore my top projects! Discover a showcase of my best work with detailed info, links, and insights into the creative and technical processes behind each project.'
	}
};

export default async function ProjectsPage() {
	const data = await getProjectsPage()
	if (!data) return (<ContentError/>);

	data.map(entry => {
		entry.image = getFileURL("page_projects", entry.id, entry.image)
	})

	return (
		<Projects data={data} />
	);
}
