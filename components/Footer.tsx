'use client'

import * as React from "react";
import {FooterData} from "@/types/interfaces";
import Link from "next/link";
import DynamicIcon from "@/lib/dynamicIcon";
import Markdown from "@/components/Markdown";

export default function Footer({data}:{data:FooterData}) {

	return (
		<footer className="bg-header">
			<div className="flex flex-col justify-center m-auto my-5">
				<div className="grid place-self-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-[90vw] 3xl:w-[160rem] place-items-center">
					<FooterBox name="Contact Me">
						<ul className="flex flex-col gap-2">
							{data.expand.contact.map((item,index)=>(
								<li key={index} className="flex">
									<Link
										className="flex my-auto hover:text-themeHover"
										href={item.url}
										target="_blank"
										data-umami-event={`[FOOTER] Link (Contact > ${item.display_name})`}
										data-umami-event-url={item.url}
									>
										<div className="rounded-full bg-card2">
											<DynamicIcon className="p-1.5" iconName={item.icon} size={34}/>
										</div>
										<p className="my-auto ml-2 font-semibold">{item.display_name}</p>
									</Link>
								</li>
							))}
						</ul>
					</FooterBox>
					<FooterBox name="Quick Links">
						<ul className="flex flex-col gap-2">
							{data.expand.quick.map((item,index)=>(
								<li key={index} className="flex">
									<Link
										className="flex my-auto hover:text-themeHover"
										href={item.url}
										target={(item.url.startsWith("http://") || item.url.startsWith("https://")) ? "_blank" : "_self"}
										data-umami-event={`[FOOTER] Open (Quick > ${item.name})`}
										data-umami-event-url={item.url}
									>
										<div className="rounded-full bg-card2">
											<DynamicIcon className="p-1.5" iconName={item.icon} size={34}/>
										</div>
										<p className="my-auto ml-2 font-semibold">{item.name}</p>
									</Link>
								</li>
							))}
						</ul>
					</FooterBox>
					<FooterBox name="About Me">
						<Markdown content={data.about_me}/>
						<ul className="flex flex-row gap-2">
							{data.expand.social.map((item,index)=>(
								<li key={index} className="flex">
									<Link
										className="flex my-auto hover:text-themeHover"
										href={item.url}
										target="_blank"
										data-umami-event={`[FOOTER] Link (About > ${item.display_name})`}
										data-umami-event-url={item.url}
									>
										<div className="rounded-full bg-card2">
											<DynamicIcon className="p-1.5" iconName={item.icon} size={34}/>
										</div>
									</Link>
								</li>
							))}
						</ul>
					</FooterBox>
				</div>
				<div className="flex flex-col justify-center text-center p-5">
					<Link
						className="text-sm text-neutral-500 hover:text-neutral-400 hover:underline"
						href="/privacy"
						data-umami-event={`[FOOTER] Open (Privacy)`}
					>Privacy Policy</Link>
					<p className="text-sm text-neutral-500">{data.copyright.replace("{year}", (new Date().getFullYear()).toString())}</p>
				</div>
			</div>
		</footer>
	)
}

function FooterBox({name, children}: { name: string, children: React.ReactNode; }) {
	return (
		<div className="flex flex-col gap-2 max-w-80 px-5 py-3 w-full h-full">
			<h1 className="flex text-2xl font-bold">{name}</h1>
			<div className="flex flex-col ml-2 gap-4">
				{children}
			</div>
		</div>
	);
}