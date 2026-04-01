import { getHistory } from "@/lib/database";
import type { NextRequest } from "next/server";

// ---- date utilities (mirrors heatmap-calendar.tsx) ----

function startOfDay(d: Date) {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
}

function addDays(d: Date, days: number) {
	const x = new Date(d);
	x.setDate(x.getDate() + days);
	return x;
}

function toKey(d: Date) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date) {
	const x = startOfDay(d);
	const diff = (x.getDay() - 1 + 7) % 7; // Monday start
	x.setDate(x.getDate() - diff);
	return x;
}

function getLevel(value: number): number {
	if (value <= 0) return 0;
	if (value <= 2) return 1;
	if (value <= 5) return 2;
	if (value <= 10) return 3;
	return 4;
}

function isLeapYear(year: number) {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// ---- palettes ----
// Dark: site background + primary hsl(355,70%,50%) ramp
const DARK = {
	bg: "hsl(210,14%,15%)",
	text: "hsl(200,0%,55%)",
	cells: [
		"hsl(210,13%,20%)",  // 0 – empty
		"hsl(355,45%,25%)",  // 1
		"hsl(355,55%,35%)",  // 2
		"hsl(355,65%,43%)",  // 3
		"hsl(355,70%,50%)",  // 4
	],
};

// Light: white background + same primary ramp
const LIGHT = {
	bg: "hsl(210,13%,96%)",
	text: "hsl(210,13%,35%)",
	cells: [
		"hsl(210,13%,88%)",  // 0 – empty
		"hsl(355,60%,85%)",  // 1
		"hsl(355,65%,70%)",  // 2
		"hsl(355,68%,58%)",  // 3
		"hsl(355,70%,45%)",  // 4
	],
};

// ---- route ----

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const yearParam = searchParams.get("year");
	const theme = searchParams.get("theme") === "light" ? LIGHT : DARK;

	const year = yearParam ? Number(yearParam) : new Date().getFullYear();
	const endDate = new Date(year, 11, 31);
	const rangeDays = isLeapYear(year) ? 366 : 365;

	const history = await getHistory();

	// build value map
	const valueMap = new Map<string, number>();
	for (const item of history) {
		if (new Date(item.date).getFullYear() !== year) continue;
		const total = item.updates.reduce((sum, e) => sum + e.episodes, 0);
		const key = toKey(new Date(item.date));
		valueMap.set(key, (valueMap.get(key) ?? 0) + total);
	}

	const end = startOfDay(endDate);
	const start = addDays(end, -(rangeDays - 1));
	const firstWeek = startOfWeek(start);
	const totalDays = Math.ceil((end.getTime() - firstWeek.getTime()) / 86400000) + 1;
	const weeks = Math.ceil(totalDays / 7);

	// layout constants
	const C = 11;   // cell size
	const G = 2;    // gap
	const P = 10;   // padding
	const WL = 28;  // weekday label width
	const ML = 14;  // month label height

	const gridX = P + WL + G;
	const gridY = P + ML + G;
	const svgW = gridX + weeks * (C + G) - G + P;
	const svgH = gridY + 7 * (C + G) - G + P;

	// cells
	const rects: string[] = [];
	for (let w = 0; w < weeks; w++) {
		for (let d = 0; d < 7; d++) {
			const date = addDays(firstWeek, w * 7 + d);
			const inRange = date >= start && date <= end;
			const value = inRange ? (valueMap.get(toKey(date)) ?? 0) : 0;
			const level = inRange ? getLevel(value) : 0;
			const fill = theme.cells[level];
			const x = gridX + w * (C + G);
			const y = gridY + d * (C + G);
			rects.push(`<rect x="${x}" y="${y}" width="${C}" height="${C}" rx="2" fill="${fill}"/>`);
		}
	}

	// month labels
	const monthLabels: string[] = [];
	let lastLabeledWeek = -999;
	let prevMonth = -1;
	for (let w = 0; w < weeks; w++) {
		const weekStart = addDays(firstWeek, w * 7);
		const month = weekStart.getMonth();
		if (month !== prevMonth && w - lastLabeledWeek >= 3) {
			const label = weekStart.toLocaleDateString("en-US", { month: "short" });
			const x = gridX + w * (C + G);
			monthLabels.push(
				`<text x="${x}" y="${P + ML - 2}" font-size="9" fill="${theme.text}" font-family="sans-serif">${label}</text>`,
			);
			lastLabeledWeek = w;
			prevMonth = month;
		}
	}

	// weekday labels – Mon / Wed / Fri / Sun (rows 0,2,4,6 with Monday start)
	const weekdayLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"]
		.map((name, i) => {
			if (!name) return "";
			const y = gridY + i * (C + G) + C / 2 + 3;
			return `<text x="${P + WL}" y="${y}" font-size="9" fill="${theme.text}" font-family="sans-serif" text-anchor="end">${name}</text>`;
		})
		.join("");

	const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <rect width="${svgW}" height="${svgH}" rx="8" fill="${theme.bg}"/>
  ${weekdayLabels}
  ${monthLabels.join("")}
  ${rects.join("")}
</svg>`;

	return new Response(svg, {
		headers: {
			"Content-Type": "image/svg+xml",
			"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
