"use client";

import MarkdownIt from "markdown-it";
import { cn } from "@/lib/utils";

export interface MarkdownProps {
	content: string;
	className?: string;
}

export default function Markdown({ content, className }: MarkdownProps) {
	const md = MarkdownIt({
		html: true,
		linkify: true,
		typographer: true,
	});
	return (
		<div className={cn("markdown-body", className)} dangerouslySetInnerHTML={{ __html: md.render(content) }}></div>
	);
}
