import Home from "@/app/Home";
import ServerError from "@/components/ServerError";
import { getHomePage } from "@/lib/database";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
	const data = await getHomePage();
	if (!data) return <ServerError type="content" />;
	return <Home data={data}></Home>;
}
