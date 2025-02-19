import PocketBase from 'pocketbase';
import {LinkData} from "@/types/interfaces";
import Links from "@/app/links/links";

export default async function LinksPage() {

	const pb = new PocketBase('https://api.natroutter.fi');

	const links = await pb.collection<LinkData>('links').getFullList();

	return (
		<Links links={links} />
	);
}
