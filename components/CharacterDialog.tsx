"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { AnimeCharacterEntry } from "@/types/animeData";

interface CharacterDialogProps {
	character: AnimeCharacterEntry;
	children?: ReactNode;
}

export function CharacterDialog({ character, children }: CharacterDialogProps) {
	const data = character.character;

	return (
		<Dialog>
			<DialogTrigger asChild data-umami-event={`[ANIME] Character Expand (${data.mal_id})`}>
				{children ?? <button type="button">{data.name}</button>}
			</DialogTrigger>
			<DialogContent className="border-none outline-hidden bg-background min-w-[70%] max-h-[90vh] w-full overflow-y-auto">
				<DialogHeader className="outline-hidden w-full">
					<DialogTitle className="hidden" />
					<DialogDescription className="hidden" />
					<div className="flex flex-col gap-6 text-left lg:flex-row">
						<div className="flex w-full max-w-xs flex-col gap-4 self-center lg:self-start">
							<Image
								className="w-full rounded-lg"
								src={data.images.jpg.image_url}
								alt={data.name}
								sizes="20rem"
								loading="eager"
								width={0}
								height={0}
							/>
							<Link
								href={data.url}
								target="_blank"
								data-umami-event={`[ANIME] Show Character (${data.mal_id})`}
								data-umami-event-url={data.url}
								className="flex w-full"
							>
								<Button variant="mal">MyAnimeList.net</Button>
							</Link>
						</div>

						<div className="flex min-w-0 flex-1 flex-col gap-5">
							<div>
								<h1 className="text-2xl font-bold">{data.name}</h1>
								{data.name_kanji && <h2 className="text-base font-semibold">{data.name_kanji}</h2>}
								{data.nicknames.length > 0 && <p className="text-sm text-muted">{data.nicknames.join(", ")}</p>}
							</div>

							<ul className="list-disc pl-5">
								<li className="font-semibold">
									Role: <span className="font-normal text-muted">{character.role}</span>
								</li>
								<li className="font-semibold">
									Favorites: <span className="font-normal text-muted">{character.favorites}</span>
								</li>
							</ul>

							{data.about && <p className="whitespace-pre-line">{data.about}</p>}

							{data.voices.length > 0 && (
								<div className="flex flex-col gap-2">
									<h2 className="text-xl font-bold">Voice Actors</h2>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										{data.voices.map((actor) => (
											<Link
												key={`${actor.person.mal_id}-${actor.language}`}
												href={actor.person.url}
												target="_blank"
												className="flex gap-3 rounded-lg bg-card-inner p-2 hover:scale-103 transition-transform duration-300 ease-in-out"
											>
												<Image
													className="h-12 w-12 rounded object-cover"
													src={actor.person.images.jpg.image_url}
													alt={actor.person.name}
													sizes="3rem"
													loading="eager"
													width={48}
													height={48}
												/>
												<div className="min-w-0">
													<p className="truncate font-semibold">{actor.person.name}</p>
													<p className="text-sm text-muted">{actor.language}</p>
												</div>
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
