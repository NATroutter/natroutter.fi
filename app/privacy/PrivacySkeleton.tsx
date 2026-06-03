"use client";

import { Skeleton } from "boneyard-js/react";
import Privacy from "@/app/privacy/Privacy";
import { privacyFixture } from "@/app/skeleton-fixtures";

export default function PrivacySkeleton() {
	return (
		<Skeleton name="privacy-page" loading fixture={<Privacy data={privacyFixture} />}>
			<Privacy data={privacyFixture} />
		</Skeleton>
	);
}
