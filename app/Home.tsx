"use client";

import Link from "next/link";
import AnimatedText from "@/components/AnimatedText";
import DynamicIcon from "@/components/DynamicIcon";
import { Button } from "@/components/ui/button";
import type { HomePage } from "@/types/interfaces";

export default function Home({ data }: { data: HomePage }) {
	return (
		<div className="flex flex-col justify-center m-auto w-full p-6 min-h-[calc(100vh-var(--header-height))]">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5">
					<div className="flex flex-col border-primary rounded-[20px] p-6 border-solid border-l-[3px] border-0 gap-1 max-w-4xl">
						<div className="">
							<h2 className="text-xl text-center xxs:text-left font-semibold">Hello, it's me.</h2>

							<h1 className="text-3xl md:text-5xl font-semibold ml-2">{data.username}</h1>

							<div className="flex flex-col md:flex-row ml-2 gap-1">
								<h3 className="text-xl font-semibold">And i&#39;m a</h3>
								<AnimatedText
									words={data.what_am_i.split(",")}
									writeSpeed={150}
									earseSpeed={100}
									pauseTime={1500}
									whenEmpty={"‎"}
									className="my-auto text-xl font-semibold"
								/>
							</div>
						</div>
						<div className="flex flex-col ml-2 gap-6">
							<div>
								<p>{data.intro}</p>
							</div>

							<div className="flex gap-2">
								{data.expand.links.map((item) => (
									<Link
										key={item.id}
										href={item.url}
										target={"_blank"}
										data-umami-event={`[HOME] Link (${item.name})`}
										data-umami-event-url={item.url}
										className="hover:scale-110 transition-transform duration-300 ease-in-out"
									>
										<DynamicIcon
											iconName={item.icon}
											size={40}
											className="border-2 p-1.5 rounded-full border-primary text-primary"
										/>
									</Link>
								))}
							</div>

							<div className="">
								<Link href="/projects">
									<Button data-umami-event={`[HOME] (Explore My Work)`} variant="glow">
										Explore My Work
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
