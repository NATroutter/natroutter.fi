"use client";

import { Skeleton } from "boneyard-js/react";
import About from "@/app/about/About";
import { aboutFixture } from "@/app/skeleton-fixtures";

export default function AboutSkeleton() {
	return (
		<Skeleton name="about-page" loading fixture={<About data={aboutFixture} />}>
			<About data={aboutFixture} />
		</Skeleton>
	);
}
