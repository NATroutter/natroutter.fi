import {getProjectsPage} from "@/lib/database";
import Projects from "@/app/projects/projects";

export default async function ProjectsPage() {
	const data = await getProjectsPage()
	return (
		<Projects data={data} />
	);
}
