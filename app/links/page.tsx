import Links from "@/app/links/links";
import {getLinkPage} from "@/lib/database";

export default async function LinksPage() {
	const data = await getLinkPage()
	return (
		<Links data={data} />
	);
}
