import {PrivacyPage} from "@/types/interfaces";
import Markdown from "@/components/Markdown";
import * as React from "react";
import {formatDate} from "@/lib/utils";

export default function Privacy({ data } : {data : PrivacyPage}) {

	return(
		<div className="flex justify-center m-auto w-full max-w-[80vw] p-6 py-16">
			<div className="flex flex-col bg-card p-5 gap-5">
				<div className="flex flex-col gap-10">
					<h1 className="text-center text-3xl font-bold">{data.title}</h1>
					<div>
						<p className="font-semibold text-lg">Effective Date: <span className="font-normal">{formatDate(data.effective)}</span></p>
						<p className="font-semibold text-lg">Last Updated: <span className="font-normal">{formatDate(data.updated)}</span></p>
					</div>
				</div>
				<Markdown content={data.privacy}/>
			</div>
		</div>
	)

}
