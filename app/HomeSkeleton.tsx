"use client";

import { Skeleton } from "boneyard-js/react";
import Home from "@/app/Home";
import { homeFixture } from "@/app/skeleton-fixtures";

export default function HomeSkeleton() {
	return (
		<Skeleton name="home-page" loading fixture={<Home data={homeFixture} />}>
			<Home data={homeFixture} />
		</Skeleton>
	);
}
