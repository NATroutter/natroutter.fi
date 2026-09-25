import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { FaArrowDown, FaArrowUp, FaCheck, FaTimes } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type AnimeSortRule, DEFAULT_ANIME_SORT_RULES, type SearchTypes } from "./animeListTypes";

interface AnimeSortControlProps {
	searchTypes: SearchTypes[];
	sortRules: AnimeSortRule[];
	onSortRulesChange: Dispatch<SetStateAction<AnimeSortRule[]>>;
}

export function AnimeSortControl({ searchTypes, sortRules, onSortRulesChange }: AnimeSortControlProps) {
	const activeSortRules = sortRules.length > 0 ? sortRules : DEFAULT_ANIME_SORT_RULES;
	const activeSortColumns = useMemo(
		() => new Set(activeSortRules.map((sortRule) => sortRule.column)),
		[activeSortRules],
	);
	const [selectKey, setSelectKey] = useState(0);
	const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
	const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

	const getSortLabel = (column: string): string => {
		return searchTypes.find((searchType) => searchType.type === column)?.label ?? column;
	};

	const toggleSortRule = (column: string) => {
		onSortRulesChange((currentRules) => {
			if (currentRules.some((sortRule) => sortRule.column === column)) {
				const nextRules = currentRules.filter((sortRule) => sortRule.column !== column);
				return nextRules.length > 0 ? nextRules : DEFAULT_ANIME_SORT_RULES;
			}

			if (
				currentRules.length === DEFAULT_ANIME_SORT_RULES.length &&
				currentRules.every((sortRule, index) => sortRule.column === DEFAULT_ANIME_SORT_RULES[index].column) &&
				!DEFAULT_ANIME_SORT_RULES.some((sortRule) => sortRule.column === column)
			) {
				return [{ column, direction: "desc" }];
			}

			return [...currentRules, { column, direction: "desc" }];
		});

		setSelectKey((currentKey) => currentKey + 1);
	};

	const toggleSortDirection = (column: string) => {
		onSortRulesChange((currentRules) =>
			currentRules.map((sortRule) =>
				sortRule.column === column
					? { ...sortRule, direction: sortRule.direction === "asc" ? "desc" : "asc" }
					: sortRule,
			),
		);
	};

	const removeSortRule = (column: string) => {
		onSortRulesChange((currentRules) => {
			const nextRules = currentRules.filter((sortRule) => sortRule.column !== column);
			return nextRules.length > 0 ? nextRules : DEFAULT_ANIME_SORT_RULES;
		});

		setSelectKey((currentKey) => currentKey + 1);
	};

	const moveSortRule = (targetColumn: string) => {
		if (!draggedColumn || draggedColumn === targetColumn) {
			return;
		}

		onSortRulesChange((currentRules) => {
			const fromIndex = currentRules.findIndex((sortRule) => sortRule.column === draggedColumn);
			const toIndex = currentRules.findIndex((sortRule) => sortRule.column === targetColumn);

			if (fromIndex === -1 || toIndex === -1) {
				return currentRules;
			}

			const nextRules = [...currentRules];
			const [movedRule] = nextRules.splice(fromIndex, 1);
			nextRules.splice(toIndex, 0, movedRule);
			return nextRules;
		});

		setDraggedColumn(null);
		setDragOverColumn(null);
	};

	return (
		<div className="flex flex-col w-full gap-2">
			<p className="text-sm font-medium">Sort By</p>

			<div className="flex w-full shadow-sm">
				<Select key={selectKey} onValueChange={toggleSortRule}>
					<SelectTrigger className="w-full shadow-none">
						<SelectValue placeholder="Select sorts" />
					</SelectTrigger>
					<SelectContent>
						{searchTypes.map((sortType) => (
							<SelectItem key={sortType.type} value={sortType.type} checkMark={false}>
								<span className="inline-flex w-full items-center gap-2">
									<span className="flex w-4 items-center justify-center">
										{activeSortColumns.has(sortType.type) && <FaCheck className="h-3 w-3" />}
									</span>
									<span>{sortType.label}</span>
								</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<ul className="flex flex-wrap gap-1" aria-label="Active sort priority">
				{activeSortRules.map((sortRule) => (
					<li
						key={sortRule.column}
						className={cn(
							"inline-flex h-6 cursor-grab items-center overflow-hidden rounded-full bg-card-inner text-[11px] font-medium text-muted-foreground transition-colors active:cursor-grabbing",
							draggedColumn === sortRule.column && "opacity-50",
							dragOverColumn === sortRule.column &&
								draggedColumn !== sortRule.column &&
								"bg-card text-foreground ring-1 ring-card-border",
						)}
						draggable
						onDragStart={(event) => {
							setDraggedColumn(sortRule.column);
							setDragOverColumn(null);
							event.dataTransfer.effectAllowed = "move";
							event.dataTransfer.setData("text/plain", sortRule.column);
						}}
						onDragEnter={() => setDragOverColumn(sortRule.column)}
						onDragOver={(event) => {
							event.preventDefault();
							event.dataTransfer.dropEffect = "move";
						}}
						onDragLeave={() => {
							if (dragOverColumn === sortRule.column) {
								setDragOverColumn(null);
							}
						}}
						onDrop={(event) => {
							event.preventDefault();
							moveSortRule(sortRule.column);
						}}
						onDragEnd={() => {
							setDraggedColumn(null);
							setDragOverColumn(null);
						}}
					>
						<span className="pl-2 pr-1.5">{getSortLabel(sortRule.column)}</span>
						<button
							type="button"
							className="flex h-full w-6 items-center justify-center hover:bg-card"
							onClick={() => toggleSortDirection(sortRule.column)}
						>
							<span className="sr-only">Toggle {getSortLabel(sortRule.column)} sort direction</span>
							{sortRule.direction === "asc" ? (
								<FaArrowUp className="w-2.5! h-2.5!" />
							) : (
								<FaArrowDown className="w-2.5! h-2.5!" />
							)}
						</button>
						<button
							type="button"
							className="flex h-full w-6 items-center justify-center rounded-r-full hover:bg-card"
							onClick={() => removeSortRule(sortRule.column)}
						>
							<span className="sr-only">Remove {getSortLabel(sortRule.column)} sort rule</span>
							<FaTimes className="w-2.5! h-2.5!" />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
