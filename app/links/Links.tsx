'use client'

import Image from "next/image";
import * as React from "react";
import Link from "next/link";
import {LinkPage} from "@/types/interfaces";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Links({ data }: { data: LinkPage[] }) {
	if (!data) {
		return (<p>Failed to load data!</p>);
	}

	if (!data.length) {
		return
	}

	return(
		<div className="flex flex-col justify-center m-auto w-full p-6">
			<div className="gap-5 md:my-20 w-full max-w-[90vw] 2xl:w-640 grid self-center place-items-center grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 2lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 4xl:3xl:grid-cols-5">

				{data.map((entry, index) => (
					<Card key={index} className="w-full h-full py-0">
						<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
							<div className="flex flex-1 flex-col gap-0.5 px-6 py-2">
								<CardTitle className="text-xl">{entry.title}</CardTitle>
								{entry.description && (
									<CardDescription className="line-clamp-2 text-ellipsis text-md">
										{entry.description}
									</CardDescription>
								)}
							</div>
						</CardHeader>
						<CardContent className="p-2">
							{entry.expand.links.map((link,linkIndex) => (
								<Link key={linkIndex} href={link.url} target="_blank"
									  data-umami-event={`[LINKS] Link (${link.name})`}
									  data-umami-event-url={link.url}
									  className="flex p-1.5 m-3">
									<div className="flex w-full h-full p-2 bg-card-inner rounded-lg hover:scale-103 transition-transform duration-300 ease-in-out">
										<div className="w-20 h-20 aspect-square my-auto">
											<Image
												className="h-full aspect-square w-full m-auto rounded-lg"
												src={link.image}
												alt={link.display_name}
												sizes="100vw"
												width={0}
												height={0}
											/>
										</div>
										<div className="flex flex-col justify-between px-2 py-1 w-full">
											<div className="flex flex-col justify-between">
												<h2 className="text-xl font-semibold line-clamp-1">{link.display_name}</h2>
												{link.description && (<p className="line-clamp-2 text-muted">{link.description}</p>)}
											</div>
										</div>
									</div>
								</Link>
							))}
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}


