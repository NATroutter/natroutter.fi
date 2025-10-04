"use client"

import * as React from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {AnimeEntry} from "@/types/animeData"

export default function AnimeFavourites({ animeData }: { animeData: AnimeEntry[]}) {

	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="gap-5 w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<Card className="w-full h-full py-0">
					<CardHeader className="flex flex-col items-stretch border-b bg-card-header border-card-inner-border p-0 sm:flex-row">
						<div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 pt-4">
							<CardTitle>asd</CardTitle>
							<CardDescription>
								sad {animeData.length}
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="p-6 ce">

					</CardContent>
				</Card>
			</div>
		</div>
	)
}
