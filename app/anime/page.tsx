import Anime from "@/app/anime/anime";
import ContentError from "@/components/errors/ContentError";
import {getCompleted, getPlanToWatch, getWatching} from "@/lib/mal";

export const metadata = {
	title: 'Anime',
	description: 'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!',
	openGraph: {
		description: 'Dive into my anime journey! Check out my watching progress, including "Currently Watching," "Latest Completed," and "Plan to Watch" lists. Explore my anime history and discover what I’m enjoying next!'
	}
};

export default async function AnimePage() {
	const currentlyWatching = await getWatching()
	const latestCompleted = await getCompleted();
	const latestPlanToWatch = await getPlanToWatch();

	if (currentlyWatching && latestCompleted && latestPlanToWatch) {
		return (<Anime currentlyWatching={currentlyWatching} latestCompleted={latestCompleted} latestPlanToWatch={latestPlanToWatch}/>);
	} else {
		return (<ContentError/>)
	}

}
