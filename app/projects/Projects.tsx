'use client'

import {ProjectPage} from "@/types/interfaces";
import Image from "next/image";
import * as React from "react";
import {ProjectDialog} from "@/components/ProjectDialog";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Projects({data} : {data : ProjectPage}) {

	if (!data) {
		return (<p>Failed to load data!</p>);
	}


	return(
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5 md:my-20">

					<Card className="w-full h-full py-0">
						<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
							<div className="flex flex-1 flex-col gap-0.5 px-6 py-2">
								<CardTitle className="text-xl">{data.title}</CardTitle>
								<CardDescription className="line-clamp-2 text-ellipsis text-md">
									{data.description}
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="p-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
							{data.expand.projects.map((project,index) => (
								<ProjectDialog key={index} data={project}>
									<div className="flex p-1.5 m-1 sm:m-2 md:m-3">
										<div className="flex w-full h-full p-2 bg-card-inner rounded-lg hover:scale-103 transition-transform duration-300 ease-in-out cursor-pointer">
											<div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square my-auto flex-shrink-0">
												<Image
													className="h-full aspect-square w-full m-auto rounded-lg"
													src={project.image}
													alt={project.name}
													sizes="100vw"
													width={0}
													height={0}
												/>
											</div>
											<div className="flex flex-col justify-between px-2 py-1 w-full overflow-hidden">
												<div className="flex flex-col justify-between">
													<h2 className="text-lg sm:text-xl font-semibold line-clamp-1">{project.name}</h2>
													{project.description && (<p className="text-sm line-clamp-2 text-muted">{project.description}</p>)}
												</div>
											</div>
										</div>
									</div>
								</ProjectDialog>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>

	)
}