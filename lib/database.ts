import PocketBase from "pocketbase";
import {AboutPage, FooterData, HomePage, LinkPage, NavData, PrivacyPage, ProjectPage} from "@/types/interfaces";
import {config} from "@/config/config";

//***************************************
//*          DATABASE UTILITIES         *
//***************************************
export function getFileURL(collection: string, id:string, file:string) : string {
	return `${config.API_ADDRESS}/api/files/${collection}/${id}/${file}`
}

//***************************************
//*          DATABASE GETTERS           *
//***************************************
export function getPocketBase() : PocketBase {
	return new PocketBase(config.API_ADDRESS);
}

export async function getHomePage() : Promise<HomePage|undefined> {
	try {
		const pb = getPocketBase();
		return await pb.collection("page_home").getFirstListItem<HomePage|undefined>("",{
			expand: "links",
			cache: "force-cache",
			next: { revalidate: 3600 }
		});
	} catch (err) {
		printError(err, "Failed to fetch data for HomePage");
		return undefined;
	}
}

export async function getAboutPage() : Promise<AboutPage|undefined> {
	try {
		const pb = getPocketBase();
		return await pb.collection("page_about").getFirstListItem<AboutPage|undefined>("",{
			cache: "force-cache",
			next: { revalidate: 3600 }
		});
	} catch (err) {
		printError(err, "Failed to fetch data for AboutPage");
		return undefined;
	}
}

export async function getLinkPage() : Promise<LinkPage[]|undefined> {
	try {
		const pb = getPocketBase();
		return await pb.collection("page_links").getFullList<LinkPage>({
			expand: "links",
			sort: "-priority",
			cache: "force-cache",
			next: { revalidate: 3600 }
		});
	} catch (err) {
		printError(err, "Failed to fetch data for LinkPage");
		return undefined;
	}
}

export async function getProjectsPage() : Promise<ProjectPage[] | undefined> {
	try {
		const pb = getPocketBase();
		return await pb.collection("page_projects").getFullList<ProjectPage>({
			expand: "links",
			sort: "-priority",
			cache: "force-cache",
			next: { revalidate: 3600 }
		});
	} catch (err) {
		printError(err, "Failed to fetch data for ProjectPage");
		return undefined;
	}
}

export async function getPrivacyPage() : Promise<PrivacyPage|undefined> {
	try {
		const pb = getPocketBase();
		return await pb.collection("page_privacy").getFirstListItem<PrivacyPage>("",{
			cache: "force-cache",
			next: { revalidate: 3600 }
		});
	} catch (err) {
		printError(err, "Failed to fetch data for PrivacyPage");
		return undefined;
	}
}

export async function getNavigatorData() : Promise<NavData[]|undefined> {
	try	{
		const pb = getPocketBase();
		return await pb.collection("navigator").getFullList<NavData>({
			sort: "-priority",
			cache: "force-cache",
			next: { revalidate: 3600 }
		});
	} catch (err) {
		printError(err, "Failed to fetch data for Navigator");
		return undefined;
	}
}

export async function getFooterData() : Promise<FooterData|undefined> {
	try {
		const pb = getPocketBase();
		return await pb.collection("footer").getFirstListItem<FooterData>("", {
			expand: "contact,quick,social",
			cache: "force-cache",
			next: { revalidate: 3600 }
		});
	} catch (err) {
		printError(err, "Failed to fetch data for Footer");
		return undefined;
	}
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
		console.error("[PocketBase] "+message+code+": "+err.response.message);
	} else {
		console.error("[PocketBase] "+message);
	}
}