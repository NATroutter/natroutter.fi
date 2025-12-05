cronAdd("Update Anime History", "0 0 * * *", () => {
    $app.logger().info("[AnimeHistroy] Checking for new anime history data...")

	const res = $http.send({
		url:     "https://api.jikan.moe/v4/users/NATroutter/history",
		method:  "GET",
		headers: {"content-type": "application/json"},
		timeout: 120, // in seconds
	})

	if (res.statusCode != 200) {
		$app.logger().error("[AnimeHistory] API request failed with status code: " + res.statusCode)
		return;
	}

	if (res == undefined || res.json == undefined) {
		$app.logger().error("[AnimeHistroy] API request failed - no data received from Jikan API endpoint")
		return;
	}

	const apiData = res.json;

	//Find the latest created record
	let record = $app.findRecordsByFilter(
		"anime_history",                              // collection
		"", 										  // filter
		"-created",                                   // sort
		1,                                            // limit
		0,                                            // offset
	)[0]

	if (record !== undefined) {
		const data = record.getString("data");
		const dbDataObj = JSON.parse(data);

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

		const normalizedDbData = JSON.stringify(sortKeys(dbDataObj));
		const normalizedApiData = JSON.stringify(sortKeys(apiData));


		//Check if data in databse is same that api returned!
		if (normalizedDbData !== normalizedApiData) {
			$app.logger().info("[AnimeHistroy] New anime history detected - saving to database...")

			let collection = $app.findCollectionByNameOrId("anime_history")
			let record = new Record(collection)
			record.set("data", res.json)
			$app.save(record);

			$app.logger().info("[AnimeHistroy] New anime history saved successfully!")
		} else {
			$app.logger().info("[AnimeHistroy] No new anime history found - database is up to date")
		}
	} else {

		$app.logger().info("[AnimeHistroy] New anime history detected - saving to database...")

		let collection = $app.findCollectionByNameOrId("anime_history")
		let record = new Record(collection)
		record.set("data", res.json)
		$app.save(record);

		$app.logger().info("[AnimeHistroy] New anime history saved successfully!")

	}
})