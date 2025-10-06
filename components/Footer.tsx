"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import Markdown from "@/components/Markdown";
import DynamicIcon from "@/lib/dynamicIcon";
import type { FooterData } from "@/types/interfaces";

export default function Footer({ data }: { data: FooterData }) {
	return (
		<footer className="bg-footer border-t border-footer-border">
			<div className="flex flex-col justify-center m-auto my-5">
				<div className="grid place-self-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-[90vw] 2xl:w-640 place-items-center">
					<FooterBox name="Contact Me">
						<ul className="flex flex-col gap-2">
							{data.expand.contact.map((item) => (
								<li key={item.id} className="flex">
									<Link
										className="flex my-auto hover:text-secondary group"
										href={item.url}
										target="_blank"
										data-umami-event={`[FOOTER] Link (Contact > ${item.display_name})`}
										data-umami-event-url={item.url}
									>
										<div>
											<DynamicIcon
												className="p-1.5 text-muted group-hover:text-secondary"
												iconName={item.icon}
												size={30}
											/>
										</div>
										<p className="my-auto ml-2 font-semibold">{item.display_name}</p>
									</Link>
								</li>
							))}
						</ul>
					</FooterBox>
					<FooterBox name="Quick Links">
						<ul className="flex flex-col gap-2">
							{data.expand.quick.map((item) => (
								<li key={item.id} className="flex">
									<Link
										className="flex my-auto hover:text-secondary group"
										href={item.url}
										target={item.url.startsWith("http://") || item.url.startsWith("https://") ? "_blank" : "_self"}
										data-umami-event={`[FOOTER] Open (Quick > ${item.name})`}
										data-umami-event-url={item.url}
									>
										<div>
											<DynamicIcon
												className="p-1.5 text-muted group-hover:text-secondary"
												iconName={item.icon}
												size={30}
											/>
										</div>
										<p className="my-auto ml-2 font-semibold">{item.name}</p>
									</Link>
								</li>
							))}
						</ul>
					</FooterBox>
					<FooterBox name="About Me">
						<Markdown content={data.about_me} className="text-muted" />
						<ul className="flex flex-row gap-2">
							{data.expand.social.map((item) => (
								<li key={item.id} className="flex">
									<Link
										className="flex my-auto hover:text-secondary group"
										href={item.url}
										target="_blank"
										data-umami-event={`[FOOTER] Link (About > ${item.display_name})`}
										data-umami-event-url={item.url}
									>
										<div>
											<DynamicIcon
												className="p-1.5 text-muted group-hover:text-secondary"
												iconName={item.icon}
												size={30}
											/>
										</div>
									</Link>
								</li>
							))}
						</ul>
					</FooterBox>
				</div>
				<div className="flex flex-col justify-center text-center p-5">
					<Link
						className="text-sm text-muted hover:text-foreground w-fit text-center m-auto"
						href="/privacy"
						data-umami-event={`[FOOTER] Open (Privacy)`}
					>
						Privacy Policy
					</Link>
					<p className="text-sm text-muted">{data.copyright.replace("{year}", new Date().getFullYear().toString())}</p>
				</div>
			</div>
		</footer>
	);
}

function FooterBox({ name, children }: { name: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-2 max-w-80 px-5 py-3 w-full h-full">
			<h1 className="flex text-2xl font-bold">{name}</h1>
			<div className="flex flex-col ml-2 gap-4 text-muted">{children}</div>
		</div>
	);
}
