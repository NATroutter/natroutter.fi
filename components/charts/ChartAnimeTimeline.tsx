import type { ChartSettings } from "@/components/ChartSettingsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Timeline,
	TimelineContent,
	TimelineDate,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
	TimelineSeparator,
} from "@/components/ui/timeline";
import type { AnimeHistoryUpdate } from "@/types/animeData";

interface ChartAnimeTimelineProps {
	settings: ChartSettings;
	animeHistory: AnimeHistoryUpdate[];
}

export default function ChartAnimeTimeline({ settings, animeHistory }: ChartAnimeTimelineProps) {
	// Find the first occurrence of each month in the dataset (when sorted newest first)
	const isFirstOfMonth = (currentItem: AnimeHistoryUpdate, index: number) => {
		const currentDate = new Date(currentItem.date);
		const currentMonth = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();

		// Check if any previous items are in the same month
		const hasPreviousItemInSameMonth = animeHistory.slice(0, index).some((item) => {
			const itemDate = new Date(item.date);
			return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
		});

		return !hasPreviousItemInSameMonth;
	};

	function getMonth(time: string): string {
		const date = new Date(time);
		return date.toLocaleString("en-US", { month: "long" });
	}

	function getDateStrng(time: string): string {
		const date = new Date(time);
		return date.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
	}

	return (
		<Card className="py-0 w-full shadow-xl">
			<CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Anime Watch History</CardTitle>
					<CardDescription>
						{settings.viewingYear === "all"
							? "Timeline of all anime episodes watched."
							: `Timeline of anime episodes watched in ${settings.viewingYear}.`}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="px-2 p-6">
				<Timeline className="pl-6">
					{animeHistory.map((item, index) =>
						isFirstOfMonth(item, index) ? (
							<TimelineItem
								key={item.id}
								step={animeHistory.length}
								className="ms-24 pb-16! -translate-x-20 sm:translate-x-0 w-full"
							>
								<TimelineHeader>
									<TimelineSeparator className="-left-7 h-full" />
									<TimelineIndicator className="-left-7 -translate-x-7 sm:-translate-x-1/2 -translate-y-2 bg-primary border border-secondary text-foreground flex w-fit h-fit px-3 py-1.5 rounded-sm items-center justify-center">
										{getMonth(item.date)}
									</TimelineIndicator>
								</TimelineHeader>
							</TimelineItem>
						) : (
							<TimelineItem
								key={item.id}
								step={animeHistory.length}
								className="ms-24 -translate-x-20 sm:translate-x-0 w-full"
							>
								<TimelineHeader className="my-auto">
									<TimelineSeparator className="-left-7 h-full" />
									<TimelineDate className="font-mono font-semibold text-sm sm:text-base">
										{getDateStrng(item.date)}
									</TimelineDate>
									<TimelineIndicator className="bg-neutral-500 translate-y-2 text-primary-muted flex size-3 items-center justify-center border-none -left-7"></TimelineIndicator>
								</TimelineHeader>
								<TimelineContent>
									{/*{item.updates.map((edit) => (*/}
									{/*	<p key={edit.id} className="text-base">*/}
									{/*		<FaTv className="inline-block align-middle mr-1" size={19} />*/}
									{/*		{edit.anime ? (*/}
									{/*			<AnimeDialog data={edit.anime}>*/}
									{/*				<span className="link align-middle">{edit.title}</span>*/}
									{/*			</AnimeDialog>*/}
									{/*		) : (*/}
									{/*			<span className="link align-middle">{edit.title}</span>*/}
									{/*		)}*/}
									{/*		<span> • {edit.episodes} episodes</span>*/}
									{/*	</p>*/}
									{/*))}*/}
								</TimelineContent>
							</TimelineItem>
						),
					)}
				</Timeline>
			</CardContent>
		</Card>
	);
}
