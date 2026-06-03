cronAdd("Sync Anime Characters", "* * * * *", () => {
	const ANIME_USERNAME = "NATroutter";
	const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
	const MAL_BASE_URL = "https://api.myanimelist.net/v2";
	const SERIES_COLLECTION_NAME = "anime_series";
	const CHARACTER_COLLECTION_NAME = "anime_characters";
	const ANIME_SERIES_BATCH_SIZE = 1;
	const FULL_CHARACTER_BATCH_SIZE = 2;
	const JIKAN_REQUEST_DELAY_MS = 1250;
	const JIKAN_TRANSIENT_RETRY_DELAY_MS = 5000;
	const JIKAN_RATE_LIMIT_BACKOFF_MS = 15000;
	const CHARACTER_RETRY_BASE_MINUTES = 15;
	const CHARACTER_RETRY_MAX_MINUTES = 24 * 60;
	const STALE_AFTER_DAYS = 30;

	const runId = new Date().toISOString();
	$app.logger().info(`[AnimeCharacters] Sync started (${runId})`);

	let seriesCollection;
	let characterCollection;
	try {
		seriesCollection = $app.findCollectionByNameOrId(SERIES_COLLECTION_NAME);
		characterCollection = $app.findCollectionByNameOrId(CHARACTER_COLLECTION_NAME);
	} catch (err) {
		$app.logger().error(
			`[AnimeCharacters] Missing collections. Expected "${SERIES_COLLECTION_NAME}" and "${CHARACTER_COLLECTION_NAME}"`,
		);
		return;
	}

	const clientId = $os.getenv("MAL_CLIENT_ID");
	if (!clientId) {
		$app.logger().error("[AnimeCharacters] Sync stopped because MAL_CLIENT_ID is not available to PocketBase");
		return;
	}

	const findSeriesRecord = (animeId) => {
		const records = $app.findRecordsByFilter(SERIES_COLLECTION_NAME, `anime_id = ${animeId}`, "", 1, 0);
		return records.length > 0 ? records[0] : undefined;
	};

	const findCharacterRecord = (characterId) => {
		const records = $app.findRecordsByFilter(CHARACTER_COLLECTION_NAME, `character_id = ${characterId}`, "", 1, 0);
		return records.length > 0 ? records[0] : undefined;
	};

	let hitJikanRateLimit = false;

	const sendJikanRequest = (url) => {
		if (hitJikanRateLimit) {
			return undefined;
		}

		sleep(JIKAN_REQUEST_DELAY_MS);

		const res = $http.send({
			url,
			method: "GET",
			headers: { "content-type": "application/json" },
			timeout: 120,
		});

		if (res.statusCode === 429) {
			hitJikanRateLimit = true;
			$app.logger().error(`[AnimeCharacters] Jikan rate limit hit for ${url}. Stopping this run and backing off.`);
			sleep(JIKAN_RATE_LIMIT_BACKOFF_MS);
		}

		return res;
	};

	const stringifyJson = (value) => {
		try {
			if (isByteArray(value)) {
				return decodeByteArray(value);
			}

			return JSON.stringify(value);
		} catch (err) {
			return String(value);
		}
	};

	function isByteArray(value) {
		return (
			Array.isArray(value) &&
			value.length > 0 &&
			value.every((entry) => typeof entry === "number" && entry >= 0 && entry <= 255)
		);
	}

	function decodeByteArray(value) {
		let text = "";
		for (const entry of value) {
			text += String.fromCharCode(entry);
		}
		return text;
	}

	const logJikanResponse = (level, message, characterId, res) => {
		const logger = $app.logger();
		const log = level === "error" ? logger.error.bind(logger) : logger.info.bind(logger);

		log(
			message,
			"characterId",
			characterId,
			"statusCode",
			res ? res.statusCode : undefined,
			"statusText",
			res ? res.statusText : undefined,
			"responseType",
			res && res.json ? res.json.type : undefined,
			"responseMessage",
			res && res.json ? res.json.message : undefined,
			"responseError",
			res && res.json ? res.json.error : undefined,
			"responseJson",
			res && res.json ? stringifyJson(res.json) : undefined,
		);
	};

	const logJikanAnimeResponse = (level, message, animeId, res) => {
		const logger = $app.logger();
		const log = level === "error" ? logger.error.bind(logger) : logger.info.bind(logger);

		log(
			message,
			"animeId",
			animeId,
			"statusCode",
			res ? res.statusCode : undefined,
			"statusText",
			res ? res.statusText : undefined,
			"responseType",
			res && res.json ? res.json.type : undefined,
			"responseMessage",
			res && res.json ? res.json.message : undefined,
			"responseError",
			res && res.json ? res.json.error : undefined,
			"responseJson",
			res && res.json ? stringifyJson(res.json) : undefined,
		);
	};

	const isJikanUpstreamException = (res) => {
		return res && res.json && res.json.type === "UpstreamException";
	};

	const getRecordJson = (record, field) => {
		const value = record.get(field);
		if (!value) {
			return {};
		}

		if (isByteArray(value)) {
			try {
				return JSON.parse(decodeByteArray(value));
			} catch (err) {
				return {};
			}
		}

		if (typeof value === "string") {
			try {
				return JSON.parse(value);
			} catch (err) {
				return {};
			}
		}

		try {
			return JSON.parse(JSON.stringify(value));
		} catch (err) {
			return value;
		}
	};

	const getRecordArray = (record, field) => {
		const value = record.get(field);
		if (!value) {
			return [];
		}

		if (Array.isArray(value)) {
			return value;
		}

		if (typeof value === "string") {
			try {
				const parsed = JSON.parse(value);
				return Array.isArray(parsed) ? parsed : [value];
			} catch (err) {
				return [value];
			}
		}

		if (typeof value.length === "number") {
			const items = [];
			for (let index = 0; index < value.length; index++) {
				items.push(value[index]);
			}
			return items;
		}

		return [];
	};

	const isRecordStale = (record) => {
		if (record === undefined) {
			return true;
		}

		const fetchedAt = record.get("fetched_at") || record.getString("fetched_at");
		if (!fetchedAt) {
			return true;
		}

		const staleAt = new Date(fetchedAt);
		if (Number.isNaN(staleAt.getTime())) {
			return true;
		}

		staleAt.setDate(staleAt.getDate() + STALE_AFTER_DAYS);

		return staleAt <= new Date();
	};

	const isCharacterCoolingDown = (meta) => {
		if (!meta || !meta.retry_after) {
			return false;
		}

		return new Date(meta.retry_after) > new Date();
	};

	const markCharacterRetryLater = (characterMeta, characterId) => {
		const meta = characterMeta[characterId] || {};
		const failureCount = (meta.failure_count || 0) + 1;
		const retryMinutes = Math.min(
			CHARACTER_RETRY_BASE_MINUTES * 2 ** Math.min(failureCount - 1, 6),
			CHARACTER_RETRY_MAX_MINUTES,
		);
		const retryAfter = new Date();
		retryAfter.setMinutes(retryAfter.getMinutes() + retryMinutes);

		meta.failure_count = failureCount;
		meta.last_failed_at = new Date().toISOString();
		meta.retry_after = retryAfter.toISOString();
		characterMeta[characterId] = meta;

		$app.logger().info(
			`[AnimeCharacters] Character ${characterId} will be retried after ${meta.retry_after} (failed attempts: ${failureCount})`,
		);
	};

	const clearCharacterRetry = (characterMeta, characterId) => {
		const meta = characterMeta[characterId];
		if (!meta) {
			return;
		}

		delete meta.failure_count;
		delete meta.last_failed_at;
		delete meta.retry_after;
	};

	const hasMissingCharacterReadyToSync = (record) => {
		if (record === undefined) {
			return true;
		}

		const meta = getRecordJson(record, "character_meta");
		const characters = getRecordArray(record, "characters");
		const expectedCount = Object.keys(meta).length;

		if (expectedCount === 0 || characters.length >= expectedCount) {
			return false;
		}

		for (const characterId of Object.keys(meta)) {
			const characterRecord = findCharacterRecord(characterId);
			if (isRecordStale(characterRecord) && !isCharacterCoolingDown(meta[characterId])) {
				return true;
			}
		}

		return false;
	};

	const shouldBackfillSeries = (record) => {
		if (record === undefined) {
			return true;
		}

		const meta = getRecordJson(record, "character_meta");
		const characters = getRecordArray(record, "characters");
		const expectedCount = Object.keys(meta).length;
		const isIncomplete = expectedCount > 0 && characters.length < expectedCount;

		if (isIncomplete) {
			return hasMissingCharacterReadyToSync(record);
		}

		return false;
	};

	const shouldRefreshSeries = (record) => {
		if (record === undefined) {
			return false;
		}

		return isRecordStale(record);
	};

	const getSeriesStats = (record) => {
		if (record === undefined) {
			return {
				characterMetaCount: 0,
				characterRelationCount: 0,
				fetchedAt: "",
				rawCharacterMeta: "",
				rawCharacters: "",
			};
		}

		const rawCharacterMeta = record.get("character_meta");
		const rawCharacters = record.get("characters");

		return {
			characterMetaCount: Object.keys(getRecordJson(record, "character_meta")).length,
			characterRelationCount: getRecordArray(record, "characters").length,
			fetchedAt: record.get("fetched_at") || record.getString("fetched_at") || "",
			rawCharacterMeta: stringifyJson(rawCharacterMeta),
			rawCharacters: stringifyJson(rawCharacters),
		};
	};


	const getCharacterFullById = (characterId) => {
		const url = `${JIKAN_BASE_URL}/characters/${characterId}/full`;
		let res = sendJikanRequest(url);

		if (!res || res.statusCode === 429) {
			return undefined;
		}

		if (isJikanUpstreamException(res)) {
			logJikanResponse(
				"info",
				`[AnimeCharacters] Jikan upstream failed for character ${characterId}. MyAnimeList may be unavailable for this page; it will be retried by a later cron run.`,
				characterId,
				res,
			);
			return undefined;
		}

		if (res.json && res.json.status && res.json.status !== 200) {
			logJikanResponse(
				"info",
				`[AnimeCharacters] Jikan returned an API error body for character ${characterId}. It will be retried by a later cron run.`,
				characterId,
				res,
			);
			return undefined;
		}

		if (res.statusCode !== 200) {
			logJikanResponse(
				"error",
				`[AnimeCharacters] Failed to fetch full character data for character ${characterId}: (${res.statusCode}) ${res.statusText}`,
				characterId,
				res,
			);
			return undefined;
		}

		if (!res.json || !res.json.data) {
			logJikanResponse(
				"info",
				`[AnimeCharacters] Full character response for character ${characterId} was empty or malformed. Retrying once after a short delay.`,
				characterId,
				res,
			);
			sleep(JIKAN_TRANSIENT_RETRY_DELAY_MS);
			res = sendJikanRequest(url);

			if (!res || res.statusCode === 429) {
				return undefined;
			}

			if (isJikanUpstreamException(res)) {
				logJikanResponse(
					"info",
					`[AnimeCharacters] Jikan upstream failed for character ${characterId} on retry. It will be retried by a later cron run.`,
					characterId,
					res,
				);
				return undefined;
			}

			if (res.json && res.json.status && res.json.status !== 200) {
				logJikanResponse(
					"info",
					`[AnimeCharacters] Jikan returned an API error body for character ${characterId} on retry. It will be retried by a later cron run.`,
					characterId,
					res,
				);
				return undefined;
			}

			if (res.statusCode !== 200) {
				logJikanResponse(
					"error",
					`[AnimeCharacters] Failed to fetch full character data for character ${characterId} on retry: (${res.statusCode}) ${res.statusText}`,
					characterId,
					res,
				);
				return undefined;
			}
		}

		if (!res.json || !res.json.data) {
			logJikanResponse(
				"info",
				`[AnimeCharacters] Full character data for character ${characterId} is not available from Jikan yet. It will be retried by a later cron run.`,
				characterId,
				res,
			);
			return undefined;
		}

		return res.json.data;
	};

	const fields =
		"list_status,rank,rating,status,nsfw,average_episode_duration,popularity,num_episodes,num_scoring_users,media_type,start_date,end_date,mean,source,main_picture,genres,alternative_titles,synopsis,studios";

	let nextUrl = `${MAL_BASE_URL}/users/${ANIME_USERNAME}/animelist?fields=${fields}&limit=1000&sort=list_updated_at&nsfw=1`;
	const animeList = [];

	while (nextUrl) {
		const res = $http.send({
			url: nextUrl,
			method: "GET",
			headers: {
				"X-MAL-CLIENT-ID": clientId,
				"content-type": "application/json",
			},
			timeout: 120,
		});

		if (res.statusCode !== 200) {
			$app.logger().error(`[AnimeCharacters] Failed to fetch MAL anime list: (${res.statusCode}) ${res.statusText}`);
			return;
		}

		if (!res.json || !Array.isArray(res.json.data)) {
			$app.logger().error("[AnimeCharacters] MAL anime list response was empty or malformed");
			return;
		}

		animeList.push(...res.json.data);
		nextUrl = res.json.paging && res.json.paging.next ? res.json.paging.next : "";
	}

	const animeToSync = [];

	for (const anime of animeList) {
		if (!anime.node || !anime.node.id) {
			continue;
		}

		const record = findSeriesRecord(anime.node.id);
		if (shouldBackfillSeries(record)) {
			anime.syncReason = "backfill";
			anime.syncStats = getSeriesStats(record);
			animeToSync.push(anime);
		}

		if (animeToSync.length >= ANIME_SERIES_BATCH_SIZE) {
			break;
		}
	}

	if (animeToSync.length === 0) {
		for (const anime of animeList) {
			if (!anime.node || !anime.node.id) {
				continue;
			}

			const record = findSeriesRecord(anime.node.id);
			if (shouldRefreshSeries(record)) {
				anime.syncReason = "refresh";
				anime.syncStats = getSeriesStats(record);
				animeToSync.push(anime);
			}

			if (animeToSync.length >= ANIME_SERIES_BATCH_SIZE) {
				break;
			}
		}
	}

	if (animeToSync.length === 0) {
		$app.logger().info("[AnimeCharacters] Character cache is up to date");
		return;
	}

	let seriesSaved = 0;
	let seriesFailed = 0;
	let seriesSkipped = 0;
	let charactersSaved = 0;
	let charactersFailed = 0;

	for (const anime of animeToSync) {
		const animeId = anime.node.id;
		const animeTitle = anime.node.title || "";
		$app.logger().info(
			`[AnimeCharacters] Selected anime series ${animeId} for ${anime.syncReason || "sync"}`,
			"animeId",
			animeId,
			"syncReason",
			anime.syncReason || "sync",
			"characterMetaCount",
			anime.syncStats ? anime.syncStats.characterMetaCount : undefined,
			"characterRelationCount",
			anime.syncStats ? anime.syncStats.characterRelationCount : undefined,
			"fetchedAt",
			anime.syncStats ? anime.syncStats.fetchedAt : undefined,
			"rawCharacterMeta",
			anime.syncStats ? anime.syncStats.rawCharacterMeta : undefined,
			"rawCharacters",
			anime.syncStats ? anime.syncStats.rawCharacters : undefined,
		);
		const res = sendJikanRequest(`${JIKAN_BASE_URL}/anime/${animeId}/characters`);

		if (!res || res.statusCode === 429) {
			seriesFailed++;
			break;
		}

		if (res.statusCode !== 200) {
			logJikanAnimeResponse(
				"error",
				`[AnimeCharacters] Failed to fetch character list for anime ${animeId}: (${res.statusCode}) ${res.statusText}`,
				animeId,
				res,
			);
			seriesFailed++;
			continue;
		}

		if (!res.json || !Array.isArray(res.json.data)) {
			logJikanAnimeResponse(
				"error",
				`[AnimeCharacters] Character list response for anime ${animeId} was empty or malformed`,
				animeId,
				res,
			);
			seriesFailed++;
			continue;
		}

		const characterMeta = {};
		const characterIds = [];
		const existingSeriesRecord = findSeriesRecord(animeId);
		const existingCharacterMeta = existingSeriesRecord ? getRecordJson(existingSeriesRecord, "character_meta") : {};
		const seriesRecord = existingSeriesRecord || new Record(seriesCollection);

		for (const entry of res.json.data) {
			if (!entry.character || !entry.character.mal_id) {
				continue;
			}

			const characterId = entry.character.mal_id;
			if (!(characterId in characterMeta)) {
				characterIds.push(characterId);
			}
			const previousMeta = existingCharacterMeta[characterId] || {};
			characterMeta[characterId] = {
				role: entry.role || "Unknown",
				favorites: entry.favorites || 0,
			};

			if (previousMeta.failure_count) {
				characterMeta[characterId].failure_count = previousMeta.failure_count;
			}
			if (previousMeta.last_failed_at) {
				characterMeta[characterId].last_failed_at = previousMeta.last_failed_at;
			}
			if (previousMeta.retry_after) {
				characterMeta[characterId].retry_after = previousMeta.retry_after;
			}
		}

		const saveSeriesRecord = () => {
			const characterRecordIds = [];
			for (const characterId of characterIds) {
				const characterRecord = findCharacterRecord(characterId);
				if (characterRecord) {
					characterRecordIds.push(characterRecord.id);
				}
			}

			seriesRecord.set("anime_id", animeId);
			seriesRecord.set("title", animeTitle);
			seriesRecord.set("characters", characterRecordIds);
			seriesRecord.set("character_meta", characterMeta);
			seriesRecord.set("fetched_at", new Date().toISOString());

			try {
				$app.save(seriesRecord);
			} catch (err) {
				$app.logger().error(
					`[AnimeCharacters] Failed to save anime series ${animeId}. If the error mentions "characters: Select no more than 10", increase the anime_series.characters relation max select in PocketBase. Error: ${err}`,
				);
				return false;
			}

			$app.logger().info(
				`[AnimeCharacters] Saved anime series ${animeId} with ${characterRecordIds.length}/${characterIds.length} character relation(s)`,
			);
			return true;
		};

		const missingOrStaleCharacterIds = characterIds.filter((characterId) => {
			if (!isRecordStale(findCharacterRecord(characterId))) {
				return false;
			}

			return !isCharacterCoolingDown(characterMeta[characterId]);
		});
		const characterIdsToSync = missingOrStaleCharacterIds.slice(0, FULL_CHARACTER_BATCH_SIZE);

		if (anime.syncReason === "backfill" && characterIdsToSync.length === 0) {
			saveSeriesRecord();
			$app.logger().info(
				`[AnimeCharacters] Anime series ${animeId} was selected for backfill but has no ready missing characters`,
				"animeId",
				animeId,
				"characterCount",
				characterIds.length,
			);
			seriesSkipped++;
			continue;
		}

		for (const characterId of characterIdsToSync) {
			const characterFull = getCharacterFullById(characterId);
			if (hitJikanRateLimit) {
				break;
			}

			if (!characterFull) {
				markCharacterRetryLater(characterMeta, characterId);
				saveSeriesRecord();
				charactersFailed++;
				continue;
			}

			const existingCharacterRecord = findCharacterRecord(characterId);
			const characterRecord = existingCharacterRecord || new Record(characterCollection);

			characterRecord.set("character_id", characterId);
			characterRecord.set("data", characterFull);
			characterRecord.set("fetched_at", new Date().toISOString());

			$app.save(characterRecord);
			clearCharacterRetry(characterMeta, characterId);
			$app.logger().info(`[AnimeCharacters] Saved full character data for character ${characterId}`);
			charactersSaved++;
		}

		if (!saveSeriesRecord()) {
			seriesFailed++;
			continue;
		}

		seriesSaved++;
	}

	$app.logger().info(
		`[AnimeCharacters] Sync finished (${runId}) - series saved: ${seriesSaved}, series skipped: ${seriesSkipped}, series failed: ${seriesFailed}, characters saved: ${charactersSaved}, characters failed: ${charactersFailed}`,
	);
});
