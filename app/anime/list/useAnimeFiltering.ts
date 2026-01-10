import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AnimeEntry, AnimeWatchStatus } from "@/types/animeData";
import { searchTypes } from "./animeListTypes";

export function useAnimeFiltering(animeData: AnimeEntry[]) {
	const [selectedList, setSelectedList] = useState<AnimeWatchStatus | "all">("all");
	const [searchValue, setSearchValue] = useState("");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const [sortColumn, setSortColumn] = useState<string>(searchTypes[1].type);
	const [itemsPerLoad] = useState(30);
	const [visibleCount, setVisibleCount] = useState(30);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [fieldSearchType, setFieldSearchType] = useState<string>(searchTypes[0].type);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	// Defer initial processing to prevent page freeze
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsInitialLoad(false);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	// Manual filtering, sorting, and pagination
	const processedData = useMemo(() => {
		if (isInitialLoad) {
			return [];
		}

		// Step 1: Filter by list type
		let data: AnimeEntry[];
		if (selectedList === "all") {
			data = animeData;
		} else {
			switch (selectedList) {
				case "plan_to_watch":
					data = animeData.filter((anime) => anime.list_status.status === "plan_to_watch");
					break;
				case "watching":
					data = animeData.filter((anime) => anime.list_status.status === "watching");
					break;
				case "completed":
					data = animeData.filter((anime) => anime.list_status.status === "completed");
					break;
				case "on_hold":
					data = animeData.filter((anime) => anime.list_status.status === "on_hold");
					break;
				case "dropped":
					data = animeData.filter((anime) => anime.list_status.status === "dropped");
					break;
				default:
					data = animeData;
			}
		}

		// Step 2: Filter by search
		if (searchValue.trim()) {
			const search = searchValue.toLowerCase();
			const searchNum = Number(searchValue);
			const isNumericSearch = !Number.isNaN(searchNum) && searchValue.trim() !== "";

			const searchTypeConfig = searchTypes.find((st) => st.type === fieldSearchType) || searchTypes[0];
			const getFieldValue = searchTypeConfig.getValue;

			data = data.filter((entry) => {
				const fieldValue = getFieldValue(entry);

				if (fieldValue == null) return false;

				if (typeof fieldValue === "string") {
					return fieldValue.toLowerCase().includes(search);
				}

				if (isNumericSearch) {
					return true;
				} else {
					return fieldValue.toString().includes(search);
				}
			});

			// Sort by proximity for numeric searches
			if (isNumericSearch && searchTypeConfig.isNumeric) {
				data = [...data].sort((a, b) => {
					const aVal = getFieldValue(a);
					const bVal = getFieldValue(b);

					if (aVal == null) return 1;
					if (bVal == null) return -1;

					const aDist = Math.abs(Number(aVal) - searchNum);
					const bDist = Math.abs(Number(bVal) - searchNum);

					return aDist - bDist;
				});
			}
		}

		// Step 3: Sort
		const searchTypeConfigForSkip = searchTypes.find((st) => st.type === fieldSearchType) || searchTypes[0];
		const skipRegularSort =
			searchValue.trim() &&
			!Number.isNaN(Number(searchValue)) &&
			searchTypeConfigForSkip.isNumeric &&
			fieldSearchType === sortColumn;

		if (!skipRegularSort) {
			const sortTypeConfig = searchTypes.find((st) => st.type === sortColumn) || searchTypes[0];

			// Apply reversed logic: if reversed is true, flip the sort direction
			const effectiveDirection = sortTypeConfig.reversed
				? sortDirection === "asc"
					? "desc"
					: "asc"
				: sortDirection;

			data = [...data].sort((a, b) => {
				const aVal = sortTypeConfig.getValue(a);
				const bVal = sortTypeConfig.getValue(b);

				if (aVal == null && bVal == null) return 0;
				if (aVal == null) return 1;
				if (bVal == null) return -1;

				if (typeof aVal === "string" && typeof bVal === "string") {
					return effectiveDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
				}

				if (Number.isNaN(aVal) && Number.isNaN(bVal)) return 0;
				if (Number.isNaN(aVal)) return 1;
				if (Number.isNaN(bVal)) return -1;

				return effectiveDirection === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
			});
		}

		return data;
	}, [animeData, selectedList, searchValue, sortColumn, sortDirection, isInitialLoad, fieldSearchType]);

	// Visible data for infinite scroll
	const visibleData = useMemo(() => {
		return processedData.slice(0, visibleCount);
	}, [processedData, visibleCount]);

	const hasMore = visibleCount < processedData.length;

	// Reset visible count when filters change
	useEffect(() => {
		setVisibleCount(itemsPerLoad);
	}, [searchValue, selectedList, fieldSearchType, itemsPerLoad]);

	// Load more items callback
	const loadMore = useCallback(() => {
		if (isLoadingMore || !hasMore) return;

		setIsLoadingMore(true);
		setTimeout(() => {
			setVisibleCount((prev) => prev + itemsPerLoad);
			setIsLoadingMore(false);
		}, 300);
	}, [isLoadingMore, hasMore, itemsPerLoad]);

	// Infinite scroll with IntersectionObserver
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
					loadMore();
				}
			},
			{ threshold: 0.1 }
		);

		const currentRef = loadMoreRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [hasMore, isLoadingMore, loadMore]);

	return {
		selectedList,
		setSelectedList,
		searchValue,
		setSearchValue,
		sortDirection,
		setSortDirection,
		sortColumn,
		setSortColumn,
		fieldSearchType,
		setFieldSearchType,
		processedData,
		visibleData,
		isInitialLoad,
		hasMore,
		isLoadingMore,
		loadMoreRef,
	};
}