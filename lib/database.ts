import PocketBase from "pocketbase";
import {AboutPage, FooterData, HomePage, LinkPage, NavData, ProjectPage} from "@/types/interfaces";
import {config} from "@/config/shared";

export function getFileURL(collection: string, id:string, file:string) : string {
	return `${config.apiAddress}/api/files/${collection}/${id}/${file}`
}

export async function getHomePage() : Promise<HomePage> {
	const pb = new PocketBase(config.apiAddress);
	return await pb.collection("page_home").getFirstListItem<HomePage>("",{
		expand: "links"
	});
}

export async function getAboutPage() : Promise<AboutPage> {
	const pb = new PocketBase(config.apiAddress);
	return await pb.collection("page_about").getFirstListItem<AboutPage>("",{});
}

export async function getLinkPage() : Promise<LinkPage[]> {
	const pb = new PocketBase(config.apiAddress);
	return await pb.collection("page_links").getFullList<LinkPage>({
		expand: "links",
		sort: "-priority"
	});
}
export async function getProjectsPage() : Promise<ProjectPage[]> {
	const pb = new PocketBase(config.apiAddress);
	return await pb.collection("page_projects").getFullList<ProjectPage>({
		expand: "links",
		sort: "-priority"
	});
}

export async function getNavigatorData() : Promise<NavData[]> {
	const pb = new PocketBase(config.apiAddress);
	return await pb.collection("navigator").getFullList<NavData>({
		sort: "-priority"
	});
}

export async function getFooterData() : Promise<FooterData> {
	const pb = new PocketBase(config.apiAddress);
	return await pb.collection("footer").getOne<FooterData>(config.database.footerCollection, {
		expand: "links",
	});
}