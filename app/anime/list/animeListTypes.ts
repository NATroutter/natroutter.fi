import type { AnimeEntry } from "@/types/animeData";

export interface SearchTypes {
	type: string;
	label: string;
	getValue: (entry: AnimeEntry) => string | number;
	isNumeric: boolean;
	reversed?: boolean;
}

export const searchTypes: SearchTypes[] = [
	{
		type: "title",
		label: "Title",
		getValue: (entry) =>
			entry.node.alternative_titles.en.length > 0 ? entry.node.alternative_titles.en : entry.node.title,
		isNumeric: false,
	},
	{
		type: "updated",
		label: "Updated",
		getValue: (entry) => entry.list_status.updated_at,
		isNumeric: false,
	},
	{
		type: "score",
		label: "My Score",
		getValue: (entry) => entry.list_status.score,
		isNumeric: true,
	},
	{
		type: "mean",
		label: "MAL Rating",
		getValue: (entry) => entry.node.mean,
		isNumeric: true,
	},
	{
		type: "difference",
		label: "Score Difference",
		getValue: (entry) => Math.abs(entry.node.mean - entry.list_status.score),
		isNumeric: true,
	},
	{
		type: "type",
		label: "Type",
		getValue: (entry) => entry.node.media_type,
		isNumeric: false,
	},
	{
		type: "progress",
		label: "Progress",
		getValue: (entry) =>
			entry.node.num_episodes > 0
				? (entry.list_status.num_episodes_watched / entry.node.num_episodes) * 100
				: entry.list_status.num_episodes_watched,
		isNumeric: true,
	},
	{
		type: "source",
		label: "Source",
		getValue: (entry) => entry.node.source,
		isNumeric: false,
	},
	{
		type: "popularity",
		label: "Popularity",
		getValue: (entry) => entry.node.popularity,
		isNumeric: true,
	},
	{
		type: "start_date",
		label: "Start Date",
		getValue: (entry) => entry.node.start_date,
		isNumeric: false,
	},
	{
		type: "end_date",
		label: "End Date",
		getValue: (entry) => entry.node.end_date,
		isNumeric: false,
	},
	{
		type: "rank",
		label: "Rank",
		getValue: (entry) => entry.node.rank,
		isNumeric: true,
	},
	{
		type: "rating",
		label: "Age Rating",
		getValue: (entry) => entry.node.rating,
		isNumeric: false,
	},
	{
		type: "average_episode_duration",
		label: "Episode Duration",
		getValue: (entry) => entry.node.average_episode_duration,
		isNumeric: true,
	},
	{
		type: "num_episodes",
		label: "Episodes",
		getValue: (entry) => entry.node.num_episodes,
		isNumeric: true,
	},
	{
		type: "num_scoring_users",
		label: "Scoring Users",
		getValue: (entry) => entry.node.num_scoring_users,
		isNumeric: true,
	},
];