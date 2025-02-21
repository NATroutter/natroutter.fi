'use client'

import {AnimeCard} from "@/components/AnimeCard";
import {AnimeData} from "@/types/animeData";
import {useEffect, useState} from "react";
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/components/ui/pagination";
import useWindowDimensions from "@/hooks/useWindowDimensions";

export default function Anime({ currentlyWatching,latestCompleted,latestPlanToWatch }: { currentlyWatching: AnimeData[]|undefined, latestCompleted: AnimeData[]|undefined, latestPlanToWatch: AnimeData[]|undefined }) {
	const [page, setPage] = useState<number>(1);
	const [showItemCount, setShowItemCount] = useState<number>(3);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const {width, height} = useWindowDimensions();

	
	useEffect(()=>{
		const divider : number = height / 310;
		const count = divider > 3 ? divider : 3;
		// console.log(divider,count, Math.round(count))
		setShowItemCount(Math.round(count));
	}, [height])
	
	const renderPaginationButtons = () => {
		const items = [];
		const pageRange = 5;

		const totalPages = Math.ceil(100 / showItemCount);

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
		<div className="flex flex-col justify-center gap-10 m-auto w-full p-6 py-10">
			<div className="p-4 gap-10 w-full max-w-[90vw] 3xl:w-[140rem] grid self-center place-items-center grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg+:grid-cols-2 xl:grid-cols-2 xl+:grid-cols-2 2xl:grid-cols-3">
				<AnimeList name="Currently Watching" showScore={false} data={currentlyWatching} page={page} showingCount={showItemCount}/>
				<AnimeList name="Latest Completed" showScore={true} data={latestCompleted} page={page} showingCount={showItemCount}/>
				<AnimeList name="Plan to Watch" showScore={false} data={latestPlanToWatch} page={page} showingCount={showItemCount}/>
			</div>
			<div className="flex justify-center">
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
								if ((page*showItemCount) < 100) {
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

function AnimeList({name, showScore, data, page, showingCount} : {name:string,showScore:boolean, data: AnimeData[]|undefined, page: number, showingCount: number}) {

	if (!data) {
		return (<p>Failed to load data!</p>);
	}

	const shown = page * showingCount;
	const offset = shown - showingCount;
	const showingData = data.slice(offset, shown);

	return (
		<div className={`${showingData.length > 0 ? "flex flex-col" : "hidden 3xl:block"} bg-card shadow-nav w-full h-full p-2`}>
			<h1 className="text-center text-2xl font-bold p-2">{name}</h1>
			{showingData.map((item,index) => (
				<AnimeCard key={index} data={item} showScore={showScore}/>
			))}
		</div>
	);
}
