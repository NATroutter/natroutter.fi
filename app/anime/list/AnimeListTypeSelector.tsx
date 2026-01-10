import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatAnimeWatchStatus, getWatchStatues } from "@/lib/anime-format";
import type { AnimeWatchStatus } from "@/types/animeData";

interface AnimeListTypeSelectorProps {
	selectedList: AnimeWatchStatus | "all";
	onListChange: (list: AnimeWatchStatus | "all") => void;
}

export function AnimeListTypeSelector({ selectedList, onListChange }: AnimeListTypeSelectorProps) {
	return (
		<div className="flex flex-col w-full">
			<p className="text-sm font-medium">List Type</p>
			<Select value={selectedList} onValueChange={(e) => onListChange(e as AnimeWatchStatus | "all")}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select a list" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					{getWatchStatues().map((status) => (
						<SelectItem key={status} value={status}>
							{formatAnimeWatchStatus(status)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}