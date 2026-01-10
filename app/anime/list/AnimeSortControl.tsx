import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SearchTypes } from "./animeListTypes";

interface AnimeSortControlProps {
	searchTypes: SearchTypes[];
	sortColumn: string;
	sortDirection: "asc" | "desc";
	onSortColumnChange: (column: string) => void;
	onSortDirectionToggle: () => void;
}

export function AnimeSortControl({
	searchTypes,
	sortColumn,
	sortDirection,
	onSortColumnChange,
	onSortDirectionToggle,
}: AnimeSortControlProps) {
	return (
		<div className="flex flex-col w-full md:w-fit">
			<p className="text-sm font-medium">Sort By</p>
			<div className="flex w-full md:w-fit shadow-sm">
				{/* Sorting Type */}
				<Select value={sortColumn} onValueChange={onSortColumnChange}>
					<SelectTrigger className="w-full md:w-fit md:max-w-48 rounded-r-none border-r-0 shadow-none">
						<SelectValue placeholder="Select sort" />
					</SelectTrigger>
					<SelectContent>
						{searchTypes.map((e) => (
							<SelectItem key={e.type} value={e.type}>
								{e.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Sorting Direction */}
				<Button
					size="icon"
					className="h-10 w-10 rounded-l-none border-l-0 shadow-none"
					onClick={onSortDirectionToggle}
				>
					<span className="sr-only">Toggle sort direction</span>
					{sortDirection === "asc" ? <FaArrowUp className="w-3! h-3!" /> : <FaArrowDown className="w-3! h-3!" />}
				</Button>
			</div>
		</div>
	);
}