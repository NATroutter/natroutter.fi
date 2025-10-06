"use client"

import * as React from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {AnimeEntry} from "@/types/animeData"

export default function AnimeFavs({ animeData }: { animeData: AnimeEntry[]}) {

	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="gap-5 w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">

			</div>
		</div>
	)
}
