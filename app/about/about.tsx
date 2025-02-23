'use client'

import {AboutPage} from "@/types/interfaces";
import Image from "next/image";
import * as React from "react";
import {getFileURL} from "@/lib/database";
import Markdown from "@/components/Markdown";

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
		<div className="flex flex-col justify-center text-center gap-5 m-auto max-w-[95vw] py-28">
			<h1 className="font-bold text-5xl underline underline-offset-8">ABOUT ME</h1>
			<div className="flex flex-col xl:flex-row m-auto justify-center">

				<div className="flex xl:hidden w-full min-w-lg max-w-lg m-auto p-5">
					<Image
						className="h-full w-full aspect-square m-auto rounded-full shadow-2xl"
						src={getFileURL("page_about", data.id, data.image)}
						alt="Profile Picture"
						sizes="100vw"
						width={0}
						height={0}
					/>
				</div>

				<div className="flex flex-col lg:flex-row">
					<div className="text-left w-full max-w-lg p-5">
						<h2 className="font-semibold text-5xl mb-4">{data.about_title}</h2>
						<Markdown content={replaceTags(data.about)}/>
					</div>

					<div className="hidden xl:flex w-full min-w-lg max-w-lg my-auto p-5">
						<Image
							className="h-full w-full aspect-square m-auto rounded-full shadow-2xl"
							src={getFileURL("page_about", data.id, data.image)}
							alt="Profile Picture"
							sizes="100vw"
							width={0}
							height={0}
						/>
					</div>

					<div className="text-left w-full max-w-lg mt-5 lg:mt-0 p-5">
						<h2 className="font-semibold text-5xl mb-4">{data.skills_title}</h2>
						<Markdown content={data.skills}/>
					</div>
				</div>

			</div>
		</div>
	);
}