import Anime from "@/app/anime/anime";
import ContentError from "@/components/errors/ContentError";
import {readFile} from 'fs/promises';
import {AnimeEntry} from "@/types/animeData";

export const metadata = {
	title: 'Anime',
	description: 'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!',
	openGraph: {
		description: 'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!'
	}
};

export default async function AnimePage() {

	//const animeData = await getAnimeData();

	const fileContent = await readFile('debug-output.json', 'utf-8');
	const animeData = JSON.parse(fileContent) as AnimeEntry[];

	// console.log("debug:",animeData)

	if (!animeData) return (<ContentError/>)

	//await writeFile('debug-output.json', JSON.stringify(animeData, null, 2), 'utf-8');

	return (<Anime animeData={animeData}/>);

}
