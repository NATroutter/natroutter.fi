'use client'

import Image from "next/image";
import * as React from "react";
import Link from "next/link";
import {LinkPage} from "@/types/interfaces";
import {getFileURL} from "@/lib/database";

export default function Links({ data }: { data: LinkPage[] }) {
	if (!data) {
		return (<p>Failed to load data!</p>);
	}

	if (!data.length) {
		return
	}

	return(
		<div className="flex flex-col justify-center gap-10 m-auto w-full p-6 py-10">
			<div className="p-4 gap-10 w-full max-w-[90vw] 3xl:w-[160rem] grid self-center place-items-center grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg+:grid-cols-2 xl:grid-cols-2 xl+:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 4xl:3xl:grid-cols-5">

				{data.map((entry, entryIndex) => (
					<div key={entryIndex} className="flex flex-col w-full h-full bg-card m-5 p-2 rounded-sm shadow-nav">
						<h1 className="text-center text-2xl font-bold p-2">{entry.title}</h1>
						{entry.expand.links.map((link,linkIndex) => (
							<Link key={linkIndex} href={link.url} target="_blank"
								  data-umami-event={`[LINKS] Link (${link.display_name})`}
								  data-umami-event-url={link.url}
								  className="flex p-1.5 m-3">
								<div className="flex w-full h-full bg-card2 rounded-lg hover:scale-105 md:hover:scale-[1.02] lg+:hover:scale-105 transition-transform duration-300 ease-in-out">
									<div className="w-20 h-20 aspect-square my-auto">
										<Image
											className="h-full aspect-square w-full m-auto"
											src={getFileURL("links", link.id, link.image)}
											alt="Anime"
											sizes="100vw"
											width={0}
											height={0}
										/>
									</div>
									<div className="flex flex-col justify-between px-2 py-1 w-full">
										<div className="flex flex-col justify-between">
											<h2 className="text-xl font-semibold line-clamp-1">{link.display_name}</h2>
											{link.description && (<p className="line-clamp-2">{link.description}</p>)}
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				))}

			</div>
		</div>
	)
}


