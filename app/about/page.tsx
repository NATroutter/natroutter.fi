import About from "@/app/about/About";
import {getAboutPage, getFileURL} from "@/lib/database";
import ContentError from "@/components/errors/ContentError";

export const metadata = {
	title: 'About Me',
	description: 'Discover NATroutter, a programmer from Finland, passionate about backend development and exploring new technologies.',
	openGraph: {
		description: 'Discover NATroutter, a programmer from Finland, passionate about backend development and exploring new technologies.'
	}
};

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function AboutPage() {
	const data = await getAboutPage();
	if (!data) return (<ContentError/>);

	data.image = getFileURL("page_about", data.id, data.image)

	return (
		<About data={data} />
	);
}
