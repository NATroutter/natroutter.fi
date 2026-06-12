"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { AnimeCharacterData } from "@/types/animeData";
import { CharacterDialog } from "./CharacterDialog";

interface AnimeCharacterCarouselProps {
	characterData: AnimeCharacterData;
}

export function AnimeCharacterCarouselLoading() {
	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-2xl font-bold">Characters</h1>
			<div className="rounded-xl bg-card-inner p-4 text-sm text-muted-foreground">Loading characters...</div>
		</div>
	);
}

export function AnimeCharacterCarousel({ characterData }: AnimeCharacterCarouselProps) {
	if (characterData.data.length === 0) {
		return (
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold">Characters</h1>
				<div className="rounded-xl bg-card-inner p-4 text-sm text-muted-foreground">
					No cached character data is available for this anime yet.
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-2xl font-bold">Characters</h1>
			<div className="grid min-w-0 w-full grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-2 overflow-hidden rounded-xl bg-card-inner px-2">
				<Carousel
					opts={{
						align: "start",
						containScroll: "trimSnaps",
					}}
					className="contents"
				>
					<CarouselPrevious variant="ghost" className="static translate-y-0 bg-btn hover:bg-btn-hover" />
					<div className="min-w-0 overflow-hidden">
						<CarouselContent className="py-3 pr-1">
							{characterData.data.map((data) => (
								<CarouselItem
									key={data.character.mal_id}
									className="basis-[8.75rem] sm:basis-[9.75rem] md:basis-[10.75rem]"
								>
									<div className="w-full p-1">
										<div className="w-full hover:scale-103 transition-transform duration-300 ease-in-out">
											<CharacterDialog character={data}>
												<button
													type="button"
													className="block w-full cursor-pointer overflow-hidden rounded-xl bg-transparent p-0 text-left"
												>
													<div className="relative h-48 w-full sm:h-52 md:h-56">
														<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none" />
														<Image
															className="h-full w-full object-cover m-auto rounded-xl pointer-events-none"
															src={data.character.images.jpg.image_url}
															alt={data.character.name}
															sizes="9rem"
															fill
														/>

														<div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-semibold z-20 text-xs text-center">
															{data.character.name}
														</div>
													</div>
												</button>
											</CharacterDialog>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</div>
					<CarouselNext variant="ghost" className="static translate-y-0 bg-btn hover:bg-btn-hover" />
				</Carousel>
			</div>
		</div>
	);
}
