'use client'

import {AnimeCard} from "@/components/animeCard";
import {AnimeData} from "@/types/animeData";
import {useState} from "react";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/components/ui/pagination";

export default function Anime({ currentlyWatching,latestCompleted,latestPlanToWatch }: { currentlyWatching: AnimeData[]|undefined, latestCompleted: AnimeData[]|undefined, latestPlanToWatch: AnimeData[]|undefined }) {
	const defaultCount = 3;

	const [page, setPage] = useState<number>(1);
	const []

	const pages: number[] = [];
	for (let i = 0; i < (100/defaultCount); i++) {
		pages.push(i)
	}

	return (
		<div className="flex flex-col">
			<div className="flex">
				<AnimeList name="Currently watching" data={currentlyWatching} page={page} defaultCount={defaultCount}/>
				<AnimeList name="Latest Completed" data={latestCompleted} page={page} defaultCount={defaultCount}/>
				<AnimeList name="Latest plan to watch" data={latestPlanToWatch} page={page} defaultCount={defaultCount}/>
			</div>
			<div className="flex justify-center mb-5 p-6">
				<Pagination>
					<PaginationContent>
						{page > 1 ? (
							<PaginationItem>
								<PaginationPrevious onClick={()=>{setPage(page -1)}}/>
							</PaginationItem>
						) : ""}
						{pages.map((i,index) => (
							<PaginationItem key={index}>
								<PaginationLink onClick={()=>{setPage(i+1)}}>{i+1}</PaginationLink>
							</PaginationItem>
						))}
						{(page*defaultCount) < 100 ? (
							<PaginationItem>
								<PaginationNext onClick={()=>{setPage(page +1)}}/>
							</PaginationItem>
						) : ""}
					</PaginationContent>
				</Pagination>

			</div>
		</div>
	);
}

function AnimeList({name, data, page, defaultCount} : {name:string, data: AnimeData[]|undefined, page: number, defaultCount: number}) {

	if (!data) {
		return (<p>Failed to load data!</p>);
	}
	const shown = page * defaultCount;
	const offset = shown - defaultCount;

	return (
		<div className="bg-nav-top m-5 p-2 w-1/3 rounded-sm shadow-md shadow-nav-top max-h-fit">
			<h1 className="text-center text-2xl font-semibold p-2">{name}</h1>
			{data.slice(offset, shown).map((item,index) => (
				<AnimeCard key={index} data={item}/>
			))}
		</div>
	);
}
