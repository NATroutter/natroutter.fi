'use client'

import {ProjectPage} from "@/types/interfaces";
import Image from "next/image";
import * as React from "react";
import {ProjectDialog} from "@/components/ProjectDialog";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Projects({data} : {data : ProjectPage[]}) {

	if (!data) {
		return (<p>Failed to load data!</p>);
	}

	if (!data.length) {
		return
	}

	return(
		<div className="flex flex-col justify-center m-auto w-full p-6">
			<div className="gap-5 w-full max-w-[90vw] 2xl:w-640 grid self-center place-items-center grid-cols-1 lg:grid-cols-2 xxl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6">
				{data.map((entry, index) => (
					<ProjectDialog key={index} data={entry}>
						<Card key={index} className="w-full h-full py-0">
							<CardHeader className="flex flex-col items-stretch border-b bg-card-header border-card-inner-border p-0 sm:flex-row h-24">
								<div className="flex flex-1 flex-col gap-0.5 px-6 py-2">
									<CardTitle className="text-xl">{entry.name}</CardTitle>
									{entry.description && (
										<CardDescription className="line-clamp-2 text-ellipsis text-md">
											{entry.description}
										</CardDescription>
									)}
								</div>
							</CardHeader>
							<CardContent className="p-2">
								<div className="flex w-full h-full p-2 bg-card-inner rounded-lg hover:scale-103 transition-transform duration-300 ease-in-out">
									<div className="w-20 h-20 aspect-square my-auto">
										<Image
											className="h-full aspect-square w-full m-auto rounded-lg"
											src={entry.image}
											alt={entry.name}
											sizes="100vw"
											width={0}
											height={0}
										/>
									</div>
									<div className="flex flex-col justify-between px-2 py-1 w-full">
										<div className="flex flex-col justify-between">
											<h2 className="text-xl font-semibold line-clamp-1">{entry.name}</h2>
											{entry.description && (<p className="line-clamp-2 text-muted">{entry.description}</p>)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/*<div className="flex w-full h-full">*/}
						{/*	<div className="hover:scale-105 transition-transform duration-300 ease-in-out">*/}
						{/*		<div className="bg-card m-5 mb-5 rounded-sm shadow-nav">*/}
						{/*			<Image*/}
						{/*				className="aspect-square w-full min-w-100 max-w-100 m-auto bg-card-inner"*/}
						{/*				src={entry.image}*/}
						{/*				alt={entry.name}*/}
						{/*				sizes="100vw"*/}
						{/*				width={0}*/}
						{/*				height={0}*/}
						{/*			/>*/}

						{/*			<h1 className="text-center text-2xl font-bold p-2">{entry.name}</h1>*/}

						{/*		</div>*/}
						{/*	</div>*/}
						{/*</div>*/}
					</ProjectDialog>
					// <Dialog key={index}>
					// 	<DialogTrigger data-umami-event={`[PROJECTS] Expand (${entry.name})`}>
					// 		<div className="flex w-full h-full">
					// 			<div className="hover:scale-105 transition-transform duration-300 ease-in-out">
					// 				<div className="bg-card m-5 mb-5 rounded-sm shadow-nav">
					// 					<Image
					// 						className="aspect-square w-full min-w-100 max-w-100 m-auto bg-card-inner"
					// 						src={entry.image}
					// 						alt={entry.name}
					// 						sizes="100vw"
					// 						width={0}
					// 						height={0}
					// 					/>
					//
					// 					<h1 className="text-center text-2xl font-bold p-2">{entry.name}</h1>
					//
					// 				</div>
					// 			</div>
					// 		</div>
					// 	</DialogTrigger>
					// 	<DialogContent className="border-none outline-hidden bg-background min-w-[70%] max-h-[90vh] w-full overflow-y-auto">
					// 		<DialogHeader className="outline-hidden w-full">
					// 			<DialogTitle className="hidden"/>
					// 			<DialogDescription className="hidden"/>
					// 			<div className="flex flex-col-reverse lg:flex-row gap-4 text-left">
					// 				<div className="flex flex-col min-w-full max-w-full w-full lg:min-w-[20rem] lg:max-w-[20rem] lg:w-[20rem]">
					// 					<Image
					// 						className="hidden lg:flex mx-auto w-[20rem] bg-card-inner"
					// 						src={entry.image}
					// 						alt={entry.name}
					// 						sizes="100vw"
					// 						width={0}
					// 						height={0}
					// 					/>
					// 					<div className="pt-5">
					// 						<h3 className="text-xl font-bold">Links:</h3>
					// 						<Link href={entry.github} target={"_blank"}
					// 							  data-umami-event={`[PROJECTS] Link (${entry.name} > github)`}
					// 							  data-umami-event-url={entry.github}
					// 							  className="w-fit flex text-lg font-semibold flex-row gap-2 ml-2 group text-primary hover:text-secondary hover:underline underline-offset-2">
					// 							<FaGithub size={20} className="my-auto"/>
					// 							<p>GitHub</p>
					// 						</Link>
					// 						{entry.expand.links && entry.expand.links.map((extra, extra_index)=> (
					// 							<Link key={extra_index} href={extra.url} target={"_blank"}
					// 								  data-umami-event={`[PROJECTS] Link (${entry.name} > ${extra.display_name})`}
					// 								  data-umami-event-url={extra.url}
					// 								  className="w-fit flex flex-row text-lg font-semibold gap-2 ml-2 group text-primary hover:text-secondary hover:underline underline-offset-2">
					// 								<DynamicIcon size={20} className="my-auto" iconName={extra.icon}/>
					// 								<p>{extra.display_name}</p>
					// 							</Link>
					// 						))}
					// 					</div>
					// 				</div>
					// 				<div className="flex flex-col w-fit gap-5 grow">
					// 					<div className="flex flex-col">
					// 						<h1 className="text-3xl font-bold">{entry.name}</h1>
					// 					</div>
					// 					<div className="flex flex-col gap-5">
					// 						<Markdown content={entry.description}/>
					// 					</div>
					// 				</div>
					// 				<Image
					// 					className="flex lg:hidden mx-auto w-[20rem] bg-card-inner"
					// 					src={entry.image}
					// 					alt={entry.name}
					// 					sizes="100vw"
					// 					width={0}
					// 					height={0}
					// 				/>
					// 			</div>
					// 		</DialogHeader>
					// 	</DialogContent>
					// </Dialog>
				))}
			</div>
		</div>
	)
}