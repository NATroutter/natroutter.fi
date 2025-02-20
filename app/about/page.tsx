import About from "@/app/about/about";
import {getAboutPage} from "@/lib/database";


export default async function AboutPage() {
	const data = await getAboutPage();
	return (
		<About data={data} />
	);
}
