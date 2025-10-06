"use client";

import MarkdownIt from "markdown-it";
import * as React from "react";

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
		<div
			className={`markdown-body${className ? " " + className : ""}`}
			dangerouslySetInnerHTML={{ __html: md.render(content) }}
		></div>
	);
}
