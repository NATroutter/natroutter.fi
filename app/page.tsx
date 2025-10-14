import Home from "@/app/Home";
import { ContentError } from "@/components/error";
import { getHomePage } from "@/lib/database";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
	const data = await getHomePage();
	if (!data) return <ContentError location="Home" />;

	return <Home data={data}></Home>;
}
