import PocketBase from "pocketbase";
import {AboutData} from "@/types/interfaces";
import About from "@/app/about/about";
import {config} from "@/config/shared";


export default async function AboutPage() {
	const pb = new PocketBase('https://api.natroutter.fi');
	const data = await pb.collection<AboutData>('about').getOne(config.database.aboutCollection);
	return (
		<About data={data} />
	);
}
