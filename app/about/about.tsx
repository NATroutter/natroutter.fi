'use client'

import {AboutData} from "@/types/interfaces";
import Image from "next/image";
import {getImage} from "@/config/shared";
import * as React from "react";

export default function About({ data }: { data: AboutData }) {

	console.log(data)

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

	function replaceTags(input: string): React.ReactNode {
		input = input.replace("{age}", calculateAge(data.birthday).toString());
		input = input.replace(/\[b](.*?)\[\/b]/g, '<span class="font-bold">$1</span>');
		return <span dangerouslySetInnerHTML={{ __html: input }} />;
	}

	return (
		<div className="flex flex-col justify-center text-center gap-5 m-auto max-w-[95vw] py-28">
			<h1 className="font-bold text-5xl underline underline-offset-8">ABOUT ME</h1>
			<div className="flex flex-col xl:flex-row m-auto justify-center">

				<div className="flex xl:hidden w-full min-w-lg max-w-lg m-auto p-5">
					<Image
						className="h-full w-full aspect-square m-auto rounded-full shadow-2xl"
						src={getImage("about", data.id, data.image)}
						alt="Profile Picture"
						sizes="100vw"
						width={0}
						height={0}
					/>
				</div>

				<div className="flex flex-col lg:flex-row">
					<div className="text-left w-full max-w-lg p-5">
						<h2 className="font-semibold text-5xl">NATroutter</h2>

						<p className="mt-4 text-lg">{replaceTags(data.about)}</p>
						<p className="mt-4 text-lg font-semibold">
							Languages I Speak: <span className="font-normal">{data.languages}</span>
						</p>
						<p className="mt-1 text-lg font-semibold">
							Favorite Shows: <span className="font-normal">{data.favourite_shows}</span>
						</p>
						<p className="mt-1 text-lg font-semibold">
							Favorite Games: <span className="font-normal">{data.favourite_games}</span>
						</p>
					</div>

					<div className="hidden xl:flex w-full min-w-lg max-w-lg my-auto p-5">
						<Image
							className="h-full w-full aspect-square m-auto rounded-full shadow-2xl"
							src={getImage("about", data.id, data.image)}
							alt="Profile Picture"
							sizes="100vw"
							width={0}
							height={0}
						/>
					</div>

					<div className="text-left w-full max-w-lg mt-5 lg:mt-0 p-5">
						<h2 className="font-semibold text-5xl">My Skills</h2>
						<p className="mt-4 text-lg">{data.skills}</p>
						<p className="mt-4 text-lg font-semibold">
							Languages: <span className="font-normal">{data.programing_langs}</span>
						</p>
						<p className="mt-1 text-lg font-semibold">
							Frameworks: <span className="font-normal">{data.frameworks}</span>
						</p>
						<p className="mt-1 text-lg font-semibold">
							Databases: <span className="font-normal">{data.databases}</span>
						</p>
					</div>
				</div>

			</div>
		</div>
	);
}