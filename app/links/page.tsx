import Links from "@/app/links/links";
import {getFileURL, getLinkPage} from "@/lib/database";
import ContentError from "@/components/errors/ContentError";
import * as React from "react";

export const metadata = {
	title: 'Links',
	description: 'Find all my important links in one place! Explore my social media, gaming profiles, and other resources to stay connected and discover more about what I do.',
	openGraph: {
		description: 'Find all my important links in one place! Explore my social media, gaming profiles, and other resources to stay connected and discover more about what I do.'
	}
};

export default async function LinksPage() {
	const data = await getLinkPage()
	if (!data) return (<ContentError/>);

	data.map((entry)=> {
		entry.expand.links.map((link)=>{
			link.image = getFileURL("links", link.id, link.image)
		})
	})

	return (
		<Links data={data} />
	);
}
