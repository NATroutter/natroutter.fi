'use client'

import {LinkData} from "@/types/interfaces";
import Image from "next/image";
import * as React from "react";
import {getImage} from "@/config/shared";
import Link from "next/link";

export default function Links({ links }: { links: LinkData[] }) {
	const devLinks : LinkData[] = links.filter(l=>l.active && l.type==="dev").sort((a, b) => a.priority - b.priority);
	const socialLinks : LinkData[] = links.filter(l=>l.active && l.type==="social").sort((a, b) => a.priority - b.priority);
	const gamesLinks : LinkData[] = links.filter(l=>l.active && l.type==="games").sort((a, b) => a.priority - b.priority);
	const projectsLinks : LinkData[] = links.filter(l=>l.active && l.type==="projects").sort((a, b) => a.priority - b.priority);
	const otherLinks : LinkData[] = links.filter(l=>l.active && l.type==="other").sort((a, b) => a.priority - b.priority);

	return(
		<div>
			<div className="flex flex-col justify-center mb-5 p-6">
				<div className="px-0 md:px-28 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg+:grid-cols-2 xl:grid-cols-2 xl+:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-5">
					<LinkGroup name="Developement" data={devLinks}/>
					<LinkGroup name="Social Media" data={socialLinks}/>
					<LinkGroup name="Gaming" data={gamesLinks}/>
					<LinkGroup name="My Projects" data={projectsLinks}/>
					<LinkGroup name="Other Links" data={otherLinks}/>
				</div>
			</div>
		</div>
	)
}

function LinkGroup({name, data} : {name:string, data: LinkData[]|undefined}) {

	if (!data) {
		return (<p>Failed to load data!</p>);
	}

	if (!data.length) {
		return
	}

	return (
		<div className="bg-card m-5 p-2 rounded-sm shadow-nav">
			<h1 className="text-center text-2xl font-bold p-2">{name}</h1>
			{data.map((data,index) => (
				<Link href={data.url} target="_blank" key={index} className="flex p-1.5 m-3">
					<div className="flex w-full h-full bg-card2 rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out">
						<div className="w-20 h-20 aspect-square my-auto">
							<Image
								className="h-full aspect-square w-full m-auto"
								src={getImage("links", data.id, data.image)}
								alt="Anime"
								sizes="100vw"
								width={0}
								height={0}
							/>
						</div>
						<div className="flex flex-col justify-between p-1 pt-0.5 w-full">
							<div className="flex flex-col justify-between">
								<h2 className="text-xl font-semibold line-clamp-1">{data.name}</h2>
								{data.description && (<p className="line-clamp-2">{data.description}</p>)}
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}



