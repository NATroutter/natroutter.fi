import PocketBase from "pocketbase";
import type { AboutPage, FooterData, HomePage, LinkPage, PrivacyPage, ProjectPage } from "@/types/interfaces";

//***************************************
//*            DATABASE UTILS           *
//***************************************
export function getFileURL(collection: string, id: string, file: string): string {
	return `${getPocketBase().baseURL}/api/files/${collection}/${id}/${file}`;
}

//***************************************
//*          DATABASE GETTERS           *
//***************************************
export function getPocketBase(): PocketBase {
	return new PocketBase(process.env.POCKETBASE_ADDRESS);
}

export async function getHomePage(): Promise<HomePage> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("page_home").getFirstListItem<HomePage>("", {
			expand: "links",
		});
		data.expand.links.map((link) => {
			link.image = getFileURL("links", link.id, link.image);
			return link;
		});
		return data;
	} catch (err) {
		throwPocketBaseError(err, "Failed to fetch data for HomePage");
	}
}

export async function getAboutPage(): Promise<AboutPage | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("page_about").getFirstListItem<AboutPage>("");
		data.image = getFileURL("page_about", data.id, data.image);
		return data;
	} catch (err) {
		throwPocketBaseError(err, "Failed to fetch data for AboutPage");
	}
}

export async function getLinkPage(): Promise<LinkPage[] | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("page_links").getFullList<LinkPage>({
			expand: "links",
			sort: "-priority",
		});
		data.map((entry) =>
			entry.expand.links.map((link) => {
				link.image = getFileURL("links", link.id, link.image);
				return link;
			}),
		);
		return data;
	} catch (err) {
		throwPocketBaseError(err, "Failed to fetch data for LinkPage");
	}
}

export async function getProjectsPage(): Promise<ProjectPage | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("page_projects").getFirstListItem<ProjectPage>("", {
			expand: "projects.links",
		});
		data.expand.projects.map((entry) => {
			entry.image = getFileURL("projects", entry.id, entry.image);
			entry.expand.links.map((link) => {
				link.image = getFileURL("links", link.id, link.image);
				return link;
			});
			return entry;
		});
		return data;
	} catch (err: unknown) {
		throwPocketBaseError(err, "Failed to fetch data for ProjectPage");
	}
}

export async function getPrivacyPage(): Promise<PrivacyPage | undefined> {
	try {
		const pb = getPocketBase();
		return await pb.collection("page_privacy").getFirstListItem<PrivacyPage>("");
	} catch (err) {
		throwPocketBaseError(err, "Failed to fetch data for PrivacyPage");
	}
}

export async function getFooterData(): Promise<FooterData | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("footer").getFirstListItem<FooterData>("", {
			expand: "contact,quick,social",
		});
		data.expand.contact.map((link) => {
			link.image = getFileURL("links", link.id, link.image);
			return link;
		});
		data.expand.quick.map((link) => {
			link.image = getFileURL("links", link.id, link.image);
			return link;
		});
		data.expand.social.map((link) => {
			link.image = getFileURL("links", link.id, link.image);
			return link;
		});
		return data;
	} catch (err) {
		throwPocketBaseError(err, "Failed to fetch data for Footer");
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
function throwPocketBaseError(err: unknown, message: string): never {
	if (err && isPocketBaseError(err)) {
		const data = err.response;
		const code = data.code ? ` (${data.code})` : "";
		const resp = data.message ? `: ${data.message}` : "";
		throw Error(`[PocketBase] ${message}${code}${resp}`);
	} else {
		throw Error(`[PocketBase] Unknown Error : ${err}`);
	}
}
