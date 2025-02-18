'use client'

import {AnimeCard} from "@/components/animeCard";
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
		<div className="flex flex-col justify-center mb-5 p-6">
			<div className="flex flex-col 2xl:flex-row justify-center">
				<AnimeList name="Currently watching" showScore={false} data={currentlyWatching} page={page} showingCount={showItemCount}/>
				<AnimeList name="Latest Completed" showScore={true} data={latestCompleted} page={page} showingCount={showItemCount}/>
				<AnimeList name="Latest plan to watch" showScore={false} data={latestPlanToWatch} page={page} showingCount={showItemCount}/>
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

	if (showingData.length > 0) {
		return (
			<div className="bg-card m-5 p-2 rounded-sm shadow-md shadow-nav-top max-h-fit min-h-fit h-fit w-full flex flex-col mx-auto 2xl:mx-4 lg:max-w-[60rem] 2xl:max-w-[30rem]">
				<h1 className="text-center text-2xl font-semibold p-2">{name}</h1>
				{showingData.map((item,index) => (
					<AnimeCard key={index} data={item} showScore={showScore}/>
				))}
			</div>
		);
	}
}
