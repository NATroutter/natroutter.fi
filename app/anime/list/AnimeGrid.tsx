import { AnimeCard } from "@/components/AnimeCard";
import type { AnimeEntry } from "@/types/animeData";

interface AnimeGridProps {
	visibleData: AnimeEntry[];
	isInitialLoad: boolean;
	hasMore: boolean;
	isLoadingMore: boolean;
	loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export function AnimeGrid({ visibleData, isInitialLoad, hasMore, isLoadingMore, loadMoreRef }: AnimeGridProps) {
	if (isInitialLoad) {
		return (
			<div className="h-24 flex items-center justify-center text-center text-muted-foreground">
				Loading...
			</div>
		);
	}

	if (visibleData.length === 0) {
		return (
			<div className="h-24 flex items-center justify-center text-center text-muted-foreground">
				No results.
			</div>
		);
	}

	return (
		<>
			<div className="grid gap-4 place-items-center grid-cols-1 xl:grid-cols-2 xxl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6">
				{visibleData.map((entry) => (
					<AnimeCard key={entry.node.id} data={entry} />
				))}
			</div>

			{/* Infinite scroll trigger */}
			{hasMore && (
				<div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-4">
					{isLoadingMore && <div className="text-sm text-muted-foreground">Loading more...</div>}
				</div>
			)}
		</>
	);
}