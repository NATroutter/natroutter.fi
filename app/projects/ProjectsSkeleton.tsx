"use client";

import { Skeleton } from "boneyard-js/react";
import Projects from "@/app/projects/Projects";
import { projectFixture } from "@/app/skeleton-fixtures";

export default function ProjectsSkeleton() {
	return (
		<Skeleton name="projects-page" loading fixture={<Projects data={projectFixture} />}>
			<Projects data={projectFixture} />
		</Skeleton>
	);
}
