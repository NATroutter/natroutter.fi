cronAdd("Update Anime Favorites", "0 * * * *", () => {
	$app.logger().info("[AnimeFavorites] Checking for anime favorites changes...")

	let res
	try {
		res = $http.send({
			url:     "https://api.jikan.moe/v4/users/NATroutter/favorites",
			method:  "GET",
			headers: {"content-type": "application/json"},
			timeout: 120, // in seconds
		})
	} catch (err) {
		$app.logger().error("[AnimeFavorites] API request failed - keeping cached data: " + err)
		return
	}

	if (res.statusCode != 200) {
		$app.logger().error("[AnimeFavorites] API request failed with status code: " + res.statusCode + " - keeping cached data")
		return
	}

	const apiData = res.json
	if (apiData == undefined || apiData.data == undefined || !Array.isArray(apiData.data.anime) || !Array.isArray(apiData.data.characters)) {
		$app.logger().error("[AnimeFavorites] API request failed - invalid data received from Jikan API endpoint")
		return
	}

	// Jikan sometimes returns empty lists when scraping MAL fails, don't wipe the cache with that
	if (apiData.data.anime.length === 0 && apiData.data.characters.length === 0) {
		$app.logger().warn("[AnimeFavorites] API returned empty favorites - keeping cached data")
		return
	}

	// Only one record is kept, it is updated in place when the data changes
	let record = $app.findRecordsByFilter(
		"anime_favorites",                            // collection
		"",                                           // filter
		"-updated",                                   // sort
		1,                                            // limit
		0,                                            // offset
	)[0]

	if (record !== undefined) {
		// Normalize both objects with sorted keys (recursively)
		const sortKeys = (obj) => {
			if (Array.isArray(obj)) {
				return obj.map(sortKeys);
			}
			if (obj !== null && typeof obj === 'object') {
				return Object.keys(obj).sort().reduce((result, key) => {
					result[key] = sortKeys(obj[key]);
					return result;
				}, {});
			}
			return obj;
		};

		const normalizedDbData = JSON.stringify(sortKeys(JSON.parse(record.getString("data"))));
		const normalizedApiData = JSON.stringify(sortKeys(apiData));

		if (normalizedDbData === normalizedApiData) {
			$app.logger().info("[AnimeFavorites] No changes found - database is up to date")
			return
		}
	} else {
		record = new Record($app.findCollectionByNameOrId("anime_favorites"))
	}

	$app.logger().info("[AnimeFavorites] Anime favorites changed - saving to database...")
	record.set("data", apiData)
	$app.save(record)
	$app.logger().info("[AnimeFavorites] Anime favorites saved successfully!")
})
