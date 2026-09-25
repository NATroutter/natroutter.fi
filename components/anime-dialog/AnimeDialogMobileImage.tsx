"use client";

import Image from "next/image";
import { memo } from "react";
import type { AnimeInfo } from "@/types/animeData";

interface AnimeDialogMobileImageProps {
	anime: AnimeInfo;
}

export const AnimeDialogMobileImage = memo(function AnimeDialogMobileImage({ anime }: AnimeDialogMobileImageProps) {
	return (
		<div className="flex lg:hidden my-0 m-auto w-full max-w-[20rem] py-3 pl-0">
			{anime.main_picture.large || anime.main_picture.medium ? (
				<Image
					className="w-full rounded-lg"
					src={anime.main_picture.large || anime.main_picture.medium}
					alt="Anime_picture"
					sizes="100vw"
					loading="lazy"
					width={0}
					height={0}
				/>
			) : (
				<div className="w-full rounded-lg h-[415px] bg-card-inner flex">
					<p className="text-muted font-semibold m-auto text-center">IMAGE NOT FOUND!</p>
				</div>
			)}
		</div>
	);
});
