"use client";

import useSWR from "swr";
import { ContentError } from "@/components/error";
import FooterContent from "@/components/FooterContent";
import FooterSkeleton from "@/components/FooterSkeleton";
import type { FooterData } from "@/types/interfaces";

const fetcher = (url: string) =>
	fetch(url).then((res) => {
		if (!res.ok) throw new Error("Failed to fetch footer");
		return res.json();
	});

export default function Footer() {
	const { data, error, isLoading } = useSWR<FooterData>("/api/footer", fetcher);

	if (isLoading) return <FooterSkeleton />;
	if (error || !data) return <ContentError location="Footer" />;

	return <FooterContent data={data} />;
}
