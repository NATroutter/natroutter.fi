import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { AnimeEntry, AnimeWatchStatus } from "@/types/animeData";
import { type AnimeSortRule, DEFAULT_ANIME_SORT_RULES, type SearchTypes } from "./animeListTypes";

const ANIME_WATCH_STATUSES: (AnimeWatchStatus | "all")[] = [
	"all",
	"plan_to_watch",
	"watching",
	"completed",
	"on_hold",
	"dropped",
];
const URL_SYNC_DEBOUNCE_MS = 200;

interface AnimeFilterUrlState {
	selectedList: AnimeWatchStatus | "all";
	searchValue: string;
	fieldSearchType: string;
	sortRules: AnimeSortRule[];
}

function areSortRulesEqual(left: AnimeSortRule[], right: AnimeSortRule[]): boolean {
	if (left.length !== right.length) {
		return false;
	}

	return left.every((rule, index) => rule.column === right[index].column && rule.direction === right[index].direction);
}

function serializeSortRules(sortRules: AnimeSortRule[]): string {
	return sortRules.map((rule) => `${rule.column}:${rule.direction}`).join(",");
}

function parseSortRules(sortParam: string | null, sortTypes: SearchTypes[]): AnimeSortRule[] {
	if (!sortParam) {
		return DEFAULT_ANIME_SORT_RULES;
	}

	const sortTypeSet = new Set(sortTypes.map((sortType) => sortType.type));
	const seenColumns = new Set<string>();
	const parsedRules = sortParam
		.split(",")
		.map((rule) => {
			const [column, direction] = rule.split(":");
			if (!column || !sortTypeSet.has(column) || seenColumns.has(column)) {
				return undefined;
			}

			if (direction !== "asc" && direction !== "desc") {
				return undefined;
			}

			seenColumns.add(column);
			return { column, direction };
		})
		.filter((rule): rule is AnimeSortRule => rule !== undefined);

	return parsedRules.length > 0 ? parsedRules : DEFAULT_ANIME_SORT_RULES;
}

function parseAnimeFilterUrlState(
	searchParams: URLSearchParams,
	searchTypes: SearchTypes[],
	sortTypes: SearchTypes[],
): AnimeFilterUrlState {
	const listParam = searchParams.get("list");
	const selectedList = ANIME_WATCH_STATUSES.includes(listParam as AnimeWatchStatus | "all")
		? (listParam as AnimeWatchStatus | "all")
		: "all";

	const fieldParam = searchParams.get("field");
	const fieldSearchType =
		fieldParam && searchTypes.some((searchType) => searchType.type === fieldParam) ? fieldParam : searchTypes[0].type;

	return {
		selectedList,
		searchValue: searchParams.get("q") ?? "",
		fieldSearchType,
		sortRules: parseSortRules(searchParams.get("sort"), sortTypes),
	};
}

function isDefaultSort(sortRules: AnimeSortRule[]): boolean {
	return areSortRulesEqual(sortRules, DEFAULT_ANIME_SORT_RULES);
}

function applyAnimeFilterUrlStateToParams(
	params: URLSearchParams,
	selectedList: AnimeWatchStatus | "all",
	fieldSearchType: string,
	searchValue: string,
	sortRules: AnimeSortRule[],
	defaultSearchType: string,
): void {
	if (selectedList === "all") {
		params.delete("list");
	} else {
		params.set("list", selectedList);
	}

	if (fieldSearchType === defaultSearchType) {
		params.delete("field");
	} else {
		params.set("field", fieldSearchType);
	}

	const trimmedSearchValue = searchValue.trim();
	if (trimmedSearchValue) {
		params.set("q", searchValue);
	} else {
		params.delete("q");
	}

	if (isDefaultSort(sortRules)) {
		params.delete("sort");
	} else {
		params.set("sort", serializeSortRules(sortRules));
	}
}

function compareSortValues(
	aVal: string | number,
	bVal: string | number,
	direction: AnimeSortRule["direction"],
): number {
	if (aVal == null && bVal == null) return 0;
	if (aVal == null) return 1;
	if (bVal == null) return -1;

	if (typeof aVal === "string" && typeof bVal === "string") {
		return direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
	}

	if (Number.isNaN(aVal) && Number.isNaN(bVal)) return 0;
	if (Number.isNaN(aVal)) return 1;
	if (Number.isNaN(bVal)) return -1;

	return direction === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
}

export function useAnimeFiltering(animeData: AnimeEntry[], searchTypes: SearchTypes[], sortTypes: SearchTypes[]) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const initialUrlState = useMemo(
		() => parseAnimeFilterUrlState(searchParams, searchTypes, sortTypes),
		[searchParams, searchTypes, sortTypes],
	);
	const [selectedList, setSelectedList] = useState<AnimeWatchStatus | "all">(initialUrlState.selectedList);
	const [searchValue, setSearchValue] = useState(initialUrlState.searchValue);
	const [sortRules, setSortRules] = useState<AnimeSortRule[]>(initialUrlState.sortRules);
	const deferredSearchValue = useDeferredValue(searchValue);
	const [itemsPerLoad] = useState(30);
	const [visibleCount, setVisibleCount] = useState(30);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [fieldSearchType, setFieldSearchType] = useState<string>(initialUrlState.fieldSearchType);
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const lastSyncedQueryRef = useRef(searchParams.toString());
	const skipNextUrlWriteRef = useRef(false);

	useEffect(() => {
		const currentQuery = searchParams.toString();
		if (currentQuery === lastSyncedQueryRef.current) {
			return;
		}

		lastSyncedQueryRef.current = currentQuery;
		skipNextUrlWriteRef.current = true;

		const urlState = parseAnimeFilterUrlState(searchParams, searchTypes, sortTypes);

		if (selectedList !== urlState.selectedList) {
			setSelectedList(urlState.selectedList);
		}

		if (searchValue !== urlState.searchValue) {
			setSearchValue(urlState.searchValue);
		}

		if (fieldSearchType !== urlState.fieldSearchType) {
			setFieldSearchType(urlState.fieldSearchType);
		}

		if (!areSortRulesEqual(sortRules, urlState.sortRules)) {
			setSortRules(urlState.sortRules);
		}
	}, [fieldSearchType, searchParams, searchTypes, searchValue, selectedList, sortRules, sortTypes]);

	useEffect(() => {
		if (skipNextUrlWriteRef.current) {
			skipNextUrlWriteRef.current = false;
			return;
		}

		const timeoutId = window.setTimeout(() => {
			const currentParams = new URLSearchParams(window.location.search);
			const params = new URLSearchParams(currentParams);

			applyAnimeFilterUrlStateToParams(
				params,
				selectedList,
				fieldSearchType,
				searchValue,
				sortRules,
				searchTypes[0].type,
			);

			const nextQuery = params.toString();
			const currentQuery = currentParams.toString();

			if (nextQuery !== currentQuery) {
				lastSyncedQueryRef.current = nextQuery;
				window.history.replaceState(null, "", nextQuery ? `${pathname}?${nextQuery}` : pathname);
			}
		}, URL_SYNC_DEBOUNCE_MS);

		return () => window.clearTimeout(timeoutId);
	}, [fieldSearchType, pathname, searchTypes, searchValue, selectedList, sortRules]);

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
		if (deferredSearchValue.trim()) {
			const search = deferredSearchValue.toLowerCase();
			const searchNum = Number(deferredSearchValue);
			const isNumericSearch = !Number.isNaN(searchNum) && deferredSearchValue.trim() !== "";

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
			deferredSearchValue.trim() &&
			!Number.isNaN(Number(deferredSearchValue)) &&
			searchTypeConfigForSkip.isNumeric &&
			fieldSearchType === sortRules[0]?.column;

		if (!skipRegularSort) {
			const activeSortRules = sortRules.length > 0 ? sortRules : DEFAULT_ANIME_SORT_RULES;

			data = [...data].sort((a, b) => {
				for (const sortRule of activeSortRules) {
					const sortTypeConfig = sortTypes.find((st) => st.type === sortRule.column);

					if (!sortTypeConfig) {
						continue;
					}

					const effectiveDirection = sortTypeConfig.reversed
						? sortRule.direction === "asc"
							? "desc"
							: "asc"
						: sortRule.direction;
					const result = compareSortValues(sortTypeConfig.getValue(a), sortTypeConfig.getValue(b), effectiveDirection);

					if (result !== 0) {
						return result;
					}
				}

				return 0;
			});
		}

		return data;
	}, [animeData, selectedList, deferredSearchValue, sortRules, isInitialLoad, fieldSearchType, searchTypes, sortTypes]);

	// Visible data for infinite scroll
	const visibleData = useMemo(() => {
		return processedData.slice(0, visibleCount);
	}, [processedData, visibleCount]);

	const hasMore = visibleCount < processedData.length;

	// Reset visible count when filters change
	useEffect(() => {
		setVisibleCount(itemsPerLoad);
	}, [deferredSearchValue, selectedList, fieldSearchType, sortRules, itemsPerLoad]);

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
			{ threshold: 0.1 },
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
		sortRules,
		setSortRules,
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
