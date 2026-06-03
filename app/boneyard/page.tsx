import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeSkeleton from "@/app/HomeSkeleton";
import AboutSkeleton from "@/app/about/AboutSkeleton";
import AnimeSkeleton from "@/app/anime/AnimeSkeleton";
import AnimeFavoritesSkeleton from "@/app/anime/favorites/AnimeFavoritesSkeleton";
import AnimeListSkeleton from "@/app/anime/list/AnimeListSkeleton";
import LinksSkeleton from "@/app/links/LinksSkeleton";
import PrivacySkeleton from "@/app/privacy/PrivacySkeleton";
import ProjectsSkeleton from "@/app/projects/ProjectsSkeleton";
import FooterSkeleton from "@/components/FooterSkeleton";

export const metadata: Metadata = {
	title: "Boneyard Capture",
	robots: {
		index: false,
		follow: false,
	},
};

export default function BoneyardCapturePage() {
	if (process.env.NODE_ENV === "production") {
		notFound();
	}

	return (
		<div className="flex flex-col gap-16">
			<HomeSkeleton />
			<AboutSkeleton />
			<ProjectsSkeleton />
			<LinksSkeleton />
			<PrivacySkeleton />
			<AnimeSkeleton />
			<AnimeListSkeleton />
			<AnimeFavoritesSkeleton />
			<FooterSkeleton />
		</div>
	);
}
