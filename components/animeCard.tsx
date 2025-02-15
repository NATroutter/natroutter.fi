'use client'

import * as React from "react"
import {AnimeData} from "@/types/animeData";
import Image from "next/image";

export function AnimeCard({ data, showScore }: { data: AnimeData, showScore:boolean }) {

	const updated = new Date(data.list_status.updated_at);

	const title_en = data.node.alternative_titles.en;

	return (
		<a href={`https://myanimelist.net/anime/${data.node.id}`} className="flex p-1.5 m-3 h-[8.5rem]">
			<div className="flex w-full h-full bg-nav-bottom rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out">
				<div className="mr-3 min-w-24 h-full m-auto">
					<Image
						className="h-full w-full m-auto"
						src={data.node.main_picture.large}
						alt="Anime"
						sizes="100vw"
						width={0}
						height={0}
					/>
				</div>
				<div className="flex flex-col justify-between w-full pr-2 p-0.5 overflow-hidden">
					<div>
						<h2 className="text-sm">{title_en.length > 0 ? title_en : data.node.title}</h2>
						<h3 className="text-xs text-neutral-500">{data.node.alternative_titles.ja}</h3>
					</div>
					<div className="flex flex-row justify-between">
						<div>
							<p className="text-xs text-neutral-400 font-semibold italic text-nowrap">Rating: {data.node.mean} {showScore && (" | Score: "+data.list_status.score)}</p>
						</div>
						<div className="flex flex-col justify-end">
							<p className="text-xs text-neutral-500 font-semibold italic text-nowrap">{updated.getDay()}.{updated.getMonth()}.{updated.getFullYear()} {updated.getHours()}:{updated.getMinutes()}</p>
						</div>
					</div>
				</div>
			</div>
		</a>

	)
}
