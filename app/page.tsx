import { Suspense } from "react";
import Home from "@/app/Home";
import HomeSkeleton from "@/app/HomeSkeleton";
import { ContentError } from "@/components/error";
import { getHomePage } from "@/lib/database";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

async function HomeContent() {
	const data = await getHomePage();
	if (!data) return <ContentError location="Home" />;
	return <Home data={data} />;
}

export default function HomePage() {
	return (
		<Suspense fallback={<HomeSkeleton />}>
			<HomeContent />
		</Suspense>
	);
}
