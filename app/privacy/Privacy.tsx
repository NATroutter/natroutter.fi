import {PrivacyPage} from "@/types/interfaces";
import Markdown from "@/components/Markdown";
import * as React from "react";
import {formatDate} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function Privacy({ data } : {data : PrivacyPage}) {

	return(
		<div className="flex flex-col justify-center m-auto w-full p-6">
			<div className="gap-5 md:my-20 w-full max-w-[90vw] 2xl:w-640 grid self-center place-items-center">

				<Card className="w-full h-full py-0">
					<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
						<div className="flex flex-1 flex-col gap-0.5 px-6 py-2 my-auto">
							<CardTitle className="text-center text-3xl font-bold">{data.title}</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col p-2 gap-5">
						<div className="flex flex-col gap-10">
							<div>
								<p className="font-semibold text-lg">Effective Date: <span className="font-normal">{formatDate(data.effective)}</span></p>
								<p className="font-semibold text-lg">Last Updated: <span className="font-normal">{formatDate(data.updated)}</span></p>
							</div>
						</div>
						<Markdown content={data.privacy}/>
					</CardContent>
				</Card>
			</div>
		</div>
	)

}
