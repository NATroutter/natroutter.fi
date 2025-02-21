import About from "@/app/about/about";
import {getAboutPage} from "@/lib/database";
import ContentError from "@/components/errors/ContentError";

export const metadata = {
	title: 'About Me',
	description: 'Discover NATroutter, a 26-year-old programmer from Finland, passionate about backend development and exploring new technologies.',
	openGraph: {
		description: 'Discover NATroutter, a 26-year-old programmer from Finland, passionate about backend development and exploring new technologies.'
	}
};

export default async function AboutPage() {
	const data = await getAboutPage();
	if (!data) return (<ContentError/>);

	return (
		<About data={data} />
	);
}
