'use client'

import * as React from "react";
import {config} from "@/config/shared";
import {FooterData} from "@/types/interfaces";
import Link from "next/link";
import DynamicIcon from "@/utilities/dynamicIcon";

export default function Footer({data}:{data:FooterData}) {

	return (
		<footer className="bg-header flex flex-row">
			<ul className="ml-auto mr-2.5 my-auto p-6 list-none">
				{data.expand.links.map((item, index) => (
					<li key={index}>
						<Link className="text-lg tracking-[3px] flex flex-row" target="_blank" href={""}>
							<div className="flex flex-row">
								<DynamicIcon dynamicName={item.icon} className="m-auto mr-2"/>
								<p>{item.name}</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
			<p className="ml-2.5 mr-auto my-auto">{data.copyright.replace("{year}", (new Date().getFullYear()).toString())}</p>
		</footer>
	)
}