'use client'

import * as React from "react"
import {ReactNode} from "react"
import Image from "next/image";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import Link from "next/link";
import {ProjectData, ProjectPage} from "@/types/interfaces";
import Markdown from "@/components/Markdown";

interface ProjectDialogProps {
	data: ProjectData;
	children?: ReactNode;
}

export function ProjectDialog({ data, children }: ProjectDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild data-umami-event={`[PROJECTS] Expand (${data.name})`}>
				{children ?? data.name}
			</DialogTrigger>
			<DialogContent className="border-none outline-hidden bg-background min-w-[70%] max-h-[90vh] w-full overflow-y-auto">
				<DialogHeader className="outline-hidden w-full">
					<DialogTitle className="hidden"/>
					<DialogDescription className="hidden"/>
					<div className="flex flex-col-reverse lg:flex-row gap-4 text-left">
						<div className="flex flex-col min-w-full max-w-full w-full lg:min-w-[20rem] lg:max-w-[20rem] lg:w-[20rem]">
							<div className="hidden lg:flex my-0 m-auto w-[20rem] py-0 pl-0 pr-6">
								{(data.image ) ? (
									<Image
										className="w-full rounded-lg"
										src={data.image}
										alt="Project_picture"
										sizes="100vw"
										width={0}
										height={0}
									/>
								) : (
									<div className="w-full rounded-lg h-[415px] bg-card-inner flex">
										<p className="text-muted font-semibold m-auto text-center">IMAGE NOT FOUND!</p>
									</div>
								)}
							</div>


							{/*Project Links*/}
							<div className="pt-5">
								<h3 className="text-xl font-bold">Links</h3>

								<ul className="pl-5 list-disc">
									<li className="font-semibold">
										<span>Github: </span>
										<span>
											<Link href={data.github} target="_blank"
												  data-umami-event={`[PROJECTS] Link (${data.name} > github)`}
												  data-umami-event-url={data.github}
												  className="text-primary hover:text-secondary font-normal">
												GitHub
											</Link>
										</span>
									</li>
									{data.expand.links && data.expand.links.map((link, index)=> (
										<li key={index} className="font-semibold">
											<span>{link.name}: </span>
											<span>
											<Link href={data.github} target="_blank"
												  data-umami-event={`[PROJECTS] Link (${data.name} > ${link.name})`}
												  data-umami-event-url={link.url}
												  className="text-primary hover:text-secondary font-normal">
												{link.display_name}
											</Link>
										</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/*Right side*/}
						<div className="flex flex-col gap-4 w-fit">
							<div className="flex flex-col">
								<h1 className="text-2xl font-bold">{data.title}</h1>
							</div>

							{data.content && (
								<div>
									<Markdown content={data.content}/>
								</div>
							)}

						</div>

						{/*Image For mobile layout*/}
						<div className="flex lg:hidden my-0 m-auto w-[20rem] py-3 pl-0">
							{(data.image) ? (
								<Image
									className="w-full rounded-lg"
									src={data.image}
									alt="Project_picture"
									sizes="100vw"
									width={0}
									height={0}
								/>
							) : (
								<div className="w-full rounded-lg h-[415px] bg-card-inner flex">
									<p className="text-muted font-semibold m-auto text-center">IMAGE NOT FOUND!</p>
								</div>
							)}
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
