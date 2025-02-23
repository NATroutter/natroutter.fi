'use client'

import {HomePage} from "@/types/interfaces";
import Link from "next/link";
import * as React from "react";
import DynamicIcon from "@/lib/dynamicIcon";
import AnimatedText from "@/components/AnimatedText";

export default function Home({data} : {data:HomePage}) {

	return (
		<div className="flex flex-col m-auto w-[80vw] max-w-[60rem] p-6 py-10">
			<div className="flex flex-col border-theme p-7 rounded-[20px] border-solid border-l-[3px] border-0 gap-6">
				<div className="">
					<h2 className="text-3xl font-semibold">Hello it&#39;s Me</h2>
					<h1 className="text-5xl font-semibold ml-2">{data.username}</h1>
					<h3 className="text-3xl font-semibold ml-2">And i&#39;m a <AnimatedText words={data.what_am_i.split(",")} writeSpeed={150} earseSpeed={100} pauseTime={1500}/>
					</h3>
				</div>
				<div className="flex flex-col ml-2 gap-6">
					<div>
						<p>{data.intro}</p>
					</div>
					<div className="flex gap-2">
						{data.expand.links.map((item, index) =>
							<Link key={index} href={item.url} target={"_blank"}
								  data-umami-event={`[HOME] Link (${item.display_name})`}
								  data-umami-event-url={item.url}
								  className="hover:scale-110 transition-transform duration-300 ease-in-out">
								<DynamicIcon iconName={item.icon} size={40} className="border-2 p-1.5 rounded-full border-theme text-theme"/>
							</Link>
						)}
					</div>
					<div>
						<Link href="/projects">
							<button data-umami-event={`[HOME] (Explore My Work)`} className="bg-theme px-5 py-3 rounded-full shadow-themeGlow font-semibold hover:scale-105 transition-transform duration-300 ease-in-out">Explore My Work</button>
						</Link>
					</div>
				</div>
			</div>

			<div className="flex">
				<div>
					<span className="border-theme w-[10px] h-[calc(50%_-_10px)] inline-block mt-[10px] [border-right:2px_solid_grey] rounded-br-[10px] -mr-[2px]"></span>
					<span className="border-theme w-[10px] h-[calc(50%_-_10px)] inline-block mb-[10px] [border-left:2px_solid_grey] rounded-tl-[10px]"></span><br/>
					<span className="border-theme w-[10px] h-[calc(50%_-_10px)] inline-block -mt-[6px] [border-right:2px_solid_grey] rounded-tr-[10px] -mr-[2px]"></span>
					<span className="border-theme w-[10px] h-[calc(50%_-_10px)] inline-block -mb-[8px] [border-left:2px_solid_grey] rounded-bl-[10px]"></span>
				</div>
				<div className="w-[100px] h-[100px]">penis</div>
				<div className="flex"> </div>
			</div>
		</div>
	)

}