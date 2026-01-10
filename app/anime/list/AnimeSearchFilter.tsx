import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SearchTypes } from "./animeListTypes";

interface AnimeSearchFilterProps {
	searchTypes: SearchTypes[];
	fieldSearchType: string;
	searchValue: string;
	onFieldTypeChange: (type: string) => void;
	onSearchValueChange: (value: string) => void;
}

export function AnimeSearchFilter({
	searchTypes,
	fieldSearchType,
	searchValue,
	onFieldTypeChange,
	onSearchValueChange,
}: AnimeSearchFilterProps) {
	return (
		<div className="flex flex-col flex-auto">
			<Label className="text-sm font-medium">Search anime by</Label>
			<div className="flex flex-row shadow-sm">
				{/* Filter type */}
				<div className="flex flex-col">
					<Select value={fieldSearchType} onValueChange={onFieldTypeChange}>
						<SelectTrigger className="w-fit max-w-48 rounded-r-none border-r-0 shadow-none">
							<SelectValue placeholder="Search field" />
						</SelectTrigger>
						<SelectContent>
							{searchTypes.map((e) => (
								<SelectItem key={e.type} value={e.type}>
									{e.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Input Field */}
				<div className="flex flex-col flex-1">
					<Input
						className="w-full rounded-l-none border-l-0 shadow-none"
						placeholder="Filter..."
						value={searchValue}
						useRing={false}
						onChange={(event) => onSearchValueChange(event.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}