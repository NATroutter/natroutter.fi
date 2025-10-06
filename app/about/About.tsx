'use client'

import {AboutPage} from "@/types/interfaces";
import Image from "next/image";
import * as React from "react";
import Markdown from "@/components/Markdown";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ProjectDialog} from "@/components/ProjectDialog";

export default function About({ data }: { data: AboutPage }) {

	function calculateAge(dateOfBirth: Date): number {
		const currentDate = new Date();
		const birthDate = new Date(dateOfBirth);

		let age = currentDate.getFullYear() - birthDate.getFullYear();

		const isBeforeBirthday =
			currentDate.getMonth() < birthDate.getMonth() ||
			(currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate());

		if (isBeforeBirthday) {
			age--;
		}

		return age;
	}

	function replaceTags(input: string): string {
		return input.replace("{age}", calculateAge(data.birthday).toString());
	}

	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5 md:my-20">

					<div className="flex 2xl:hidden w-full  m-auto p-5">
						<Image
							className="h-full w-full aspect-square m-auto rounded-full shadow-2xl max-w-lg"
							src={data.image}
							alt="Profile Picture"
							sizes="100vw"
							width={0}
							height={0}
						/>
					</div>

					<div className="flex flex-col lg:flex-row">
						<div className="text-left w-full max-w-lg p-5 border-primary rounded-[20px] border-solid border-l-[3px] border-0">
							<h2 className="font-semibold text-3xl 2xl:text-5xl mb-4">{data.about_title}</h2>
							<Markdown content={replaceTags(data.about)}/>
						</div>

						<div className="hidden 2xl:flex w-full min-w-lg max-w-lg my-auto p-5">
							<Image
								className="h-full w-full aspect-square m-auto rounded-full shadow-2xl"
								src={data.image}
								alt="Profile Picture"
								sizes="100vw"
								width={0}
								height={0}
							/>
						</div>

						<div className="text-left w-full max-w-lg mt-5 lg:mt-0 p-5 border-primary rounded-[20px] border-solid border-r-[3px] border-0">
							<h2 className="font-semibold text-3xl 2xl:text-5xl mb-4">{data.skills_title}</h2>
							<Markdown content={data.skills}/>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}