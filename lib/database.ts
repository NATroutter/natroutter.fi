import PocketBase from "pocketbase";
import {AboutPage, FooterData, HomePage, LinkPage, NavData, PrivacyPage, ProjectPage} from "@/types/interfaces";
import logger from "@/lib/logger";
import {withCache} from "@/lib/cache";


//***************************************
//*            DATABASE UTILS           *
//***************************************
export function getFileURL(collection: string, id:string, file:string) : string {
	return `${getPocketBase().baseURL}/api/files/${collection}/${id}/${file}`
}

//***************************************
//*          DATABASE GETTERS           *
//***************************************
export function getPocketBase() : PocketBase {
	return new PocketBase(process.env.POCKETBASE_ADDRESS);
}

export async function getHomePage(): Promise<HomePage | undefined> {
	return withCache(async ()=>{
		try {
			const pb = getPocketBase();
			return await pb.collection("page_home").getFirstListItem<HomePage | undefined>("", {
				expand: "links",
				cache: 'no-store',
			});
		} catch (err) {
			printError(err, "Failed to fetch data for HomePage");
			return undefined;
		}
	}, "home_page_data")
}

export async function getAboutPage() : Promise<AboutPage|undefined> {
	return withCache(async ()=>{
		try {
			const pb = getPocketBase();
			return await pb.collection("page_about").getFirstListItem<AboutPage|undefined>("",{
				cache: 'no-store',
			});
		} catch (err) {
			printError(err, "Failed to fetch data for AboutPage");
			return undefined;
		}
	}, "about_page_data")
}

export async function getLinkPage() : Promise<LinkPage[]|undefined> {
	return withCache(async ()=>{
		try {
			const pb = getPocketBase();
			return await pb.collection("page_links").getFullList<LinkPage>({
				expand: "links",
				sort: "-priority",
				cache: 'no-store',
			});
		} catch (err) {
			printError(err, "Failed to fetch data for LinkPage");
			return undefined;
		}
	}, "link_page_data")
}

export async function getProjectsPage() : Promise<ProjectPage[] | undefined> {
	return withCache(async ()=>{
		try {
			const pb = getPocketBase();
			return await pb.collection("page_projects").getFullList<ProjectPage>({
				expand: "links",
				sort: "-priority",
				cache: 'no-store',
			});
		} catch (err) {
			printError(err, "Failed to fetch data for ProjectPage");
			return undefined;
		}
	}, "project_page_data")
}

export async function getPrivacyPage() : Promise<PrivacyPage|undefined> {
	return withCache(async ()=>{
		try {
			const pb = getPocketBase();
			return await pb.collection("page_privacy").getFirstListItem<PrivacyPage>("",{
				cache: 'no-store',
			});
		} catch (err) {
			printError(err, "Failed to fetch data for PrivacyPage");
			return undefined;
		}
	}, "privacy_page_data")
}

export async function getNavigatorData() : Promise<NavData[]|undefined> {
	return withCache(async ()=>{
		try	{
			const pb = getPocketBase();
			return await pb.collection("navigator").getFullList<NavData>({
				sort: "-priority",
				cache: 'no-store',
			});
		} catch (err) {
			printError(err, "Failed to fetch data for Navigator");
			return undefined;
		}
	}, "navigator_data")
}

export async function getFooterData() : Promise<FooterData|undefined> {
	return withCache(async ()=> {
		try {
			const pb = getPocketBase();
			return await pb.collection("footer").getFirstListItem<FooterData>("", {
				expand: "contact,quick,social",
				cache: 'no-store',
			});
		} catch (err) {
			printError(err, "Failed to fetch data for Footer");
			return undefined;
		}
	}, "footer_data")
}

//***************************************
//*           ERROR HANDLING            *
//***************************************
interface PocketBaseError {
	code: number;
	message: string;
}
function isPocketBaseError(err: unknown): err is { response: PocketBaseError } {
	return typeof err === "object" && err !== null && "response" in err;
}
function printError(err: unknown, message: string) {
	if (err && isPocketBaseError(err)) {
		const code = err.response.code ? (" ("+err.response.code+")") : "";
		const resp = err.response.message ? (": "+err.response.message) : "";
		logger.error(message+code+resp, "PocketBase");
	} else {
		logger.error(message, "PocketBase");
	}
}