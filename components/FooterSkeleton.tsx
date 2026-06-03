"use client";

import { Skeleton } from "boneyard-js/react";
import { footerFixture } from "@/app/skeleton-fixtures";
import FooterContent from "@/components/FooterContent";

export default function FooterSkeleton() {
	return (
		<Skeleton name="site-footer" loading fixture={<FooterContent data={footerFixture} />}>
			<FooterContent data={footerFixture} />
		</Skeleton>
	);
}
