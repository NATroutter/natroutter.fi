'use client'

import {AnimeCard} from "@/components/animeCard";
import {AnimeData} from "@/types/animeData";
import {useState} from "react";
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/components/ui/pagination";

export default function Anime({ currentlyWatching,latestCompleted,latestPlanToWatch }: { currentlyWatching: AnimeData[]|undefined, latestCompleted: AnimeData[]|undefined, latestPlanToWatch: AnimeData[]|undefined }) {
	const [page, setPage] = useState<number>(1);

	const defaultCount = 3;

	const renderPaginationButtons = () => {
		const items = [];
		const pageRange = 5;

		const totalPages = Math.ceil(100 / defaultCount);

		let startPage = Math.max(page - Math.floor(pageRange / 2), 1);
		const endPage = Math.min(startPage + pageRange - 1, totalPages);

		if (endPage - startPage < pageRange - 1) {
			startPage = Math.max(endPage - pageRange + 1, 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			items.push(
				<PaginationItem key={i}>
					<PaginationLink
						isActive={page === i}
						onClick={() => setPage(i)}
					>
						{i}
					</PaginationLink>
				</PaginationItem>
			);
		}
		return items;
	};

	return (
		<div className="flex flex-col">
			<div className="flex">
				<AnimeList name="Currently watching" showScore={false} data={currentlyWatching} page={page} defaultCount={defaultCount}/>
				<AnimeList name="Latest Completed" showScore={true} data={latestCompleted} page={page} defaultCount={defaultCount}/>
				<AnimeList name="Latest plan to watch" showScore={false} data={latestPlanToWatch} page={page} defaultCount={defaultCount}/>
			</div>
			<div className="flex justify-center mb-5 p-6">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious onClick={()=>{
								if (page > 1 ) {
									setPage(page -1)
								}
							}}/>
						</PaginationItem>

						{renderPaginationButtons()}

						<PaginationItem>
							<PaginationNext onClick={()=>{
								if ((page*defaultCount) < 100) {
									setPage(page +1)
								}
							}}/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>

			</div>
		</div>
	);
}

function AnimeList({name, showScore, data, page, defaultCount} : {name:string,showScore:boolean, data: AnimeData[]|undefined, page: number, defaultCount: number}) {

	if (!data) {
		return (<p>Failed to load data!</p>);
	}
	const shown = page * defaultCount;
	const offset = shown - defaultCount;

	return (
		<div className="bg-nav-top m-5 p-2 w-1/3 rounded-sm shadow-md shadow-nav-top max-h-fit min-h-fit h-fit">
			<h1 className="text-center text-2xl font-semibold p-2">{name}</h1>
			{data.slice(offset, shown).map((item,index) => (
				<AnimeCard key={index} data={item} showScore={showScore}/>
			))}
		</div>
	);
}
