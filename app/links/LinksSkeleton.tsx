"use client";

import { Skeleton } from "boneyard-js/react";
import Links from "@/app/links/Links";
import { linksFixture } from "@/app/skeleton-fixtures";

export default function LinksSkeleton() {
	return (
		<Skeleton name="links-page" loading fixture={<Links data={linksFixture} />}>
			<Links data={linksFixture} />
		</Skeleton>
	);
}
